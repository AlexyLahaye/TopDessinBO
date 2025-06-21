const SignalementCom = require("../datamodel/signalements_com");
const SignalementPost = require("../datamodel/signalements_post");
const Commentaire = require("../datamodel/commentaires.model");
const Post = require("../datamodel/posts.model");
const users = require('../datamodel/users.model');
const Raison = require('../datamodel/raisons.model');
const Reclamation = require('../datamodel/reclamations.model');

const { Op, Sequelize } = require('sequelize');

exports.reportCom = async (userId, comId, raisonId, description) => {
    try {
        // Vérifie si l'utilisateur a déjà signalé ce commentaire
        const dejaSignale = await SignalementCom.findOne({
            where: { userId, comId }
        });

        if (dejaSignale) {
            return [false, "Vous avez déjà signalé ce commentaire."];
        }

        // Récupère le commentaire et son post
        const commentaire = await Commentaire.findByPk(comId);
        if (!commentaire) {
            return [false, "Commentaire introuvable."];
        }

        const post = await Post.findByPk(commentaire.postId);
        if (!post) {
            return [false, "Post associé introuvable."];
        }

        // Crée le signalement
        await SignalementCom.create({
            userId,
            comId,
            raisonId,
            description,
            statut: "OUVERT"
        });

        // Cas 1 : si le user est l'auteur du post → passe direct en REPORTED
        if (post.userId === userId) {
            await Commentaire.update(
                { etat: "REPORTED" },
                { where: { id: comId } }
            );
            return [true, "Commentaire signalé et signal validé par l’auteur du post."];
        }

        // Cas 2 : sinon, compter les signalements
        const nbSignalements = await SignalementCom.count({
            where: { comId }
        });

        if (nbSignalements > 5) {
            await Commentaire.update(
                { etat: "REPORTED" },
                { where: { id: comId } }
            );
        }

        return [true, "Commentaire signalé."];

    } catch (error) {
        console.error("Erreur dans le signalement :", error);
        return [false, "Une erreur est survenue lors du signalement."];
    }
};



exports.reportPost = async (userId, postId, raisonId, description) => {
    try {
        // Vérifie si l'utilisateur a déjà signalé ce post
        const dejaSignale = await SignalementPost.findOne({
            where: { userId, postId }
        });

        if (dejaSignale) {
            return [false, "Vous avez déjà signalé ce post."];
        }

        // Vérifie que le post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return [false, "Post introuvable."];
        }

        // Crée le signalement
        await SignalementPost.create({
            userId,
            postId,
            raisonId,
            description,
            statut: "OUVERT"
        });


        // Cas 2 : sinon, compter les signalements
        const nbSignalements = await SignalementPost.count({
            where: { postId }
        });

        if (nbSignalements > 1) {
            await Post.update(
                { etat: "REPORTED" },
                { where: { id: postId } }
            );
        }

        return [true, "Post signalé."];

    } catch (error) {
        console.error("Erreur dans le signalement du post :", error);
        return [false, "Une erreur est survenue lors du signalement."];
    }
};

exports.GetSignalementPost = async (postId) => {
    try {
        // Récupère le post avec son auteur
        const post = await Post.findByPk(postId, {
            include: [{
                model: users,
                attributes: ['id', 'pseudo']
            }]
        });

        if (!post) {
            return [false, "Post introuvable."];
        }

        // Récupère les signalements liés au post
        const signalements = await SignalementPost.findAll({
            where: { postId },
            include: [
                {
                    model: users,
                    attributes: ['pseudo', 'id']
                },
                {
                    model: Raison,
                    attributes: ['libelle']
                }
            ],
            attributes: ['description']
        });

        const total = signalements.length;

        return [
            true,
            {
                postId: post.id,           // <---- ici tu ajoutes l'id du post
                total,
                signalements,
                auteurDuPost: {
                    id: post.user.id,
                    pseudo: post.user.pseudo
                }
            }
        ];

    } catch (error) {
        console.error("Erreur lors de la récupération des signalements :", error);
        return [false, "Erreur lors de la récupération des signalements"];
    }
};

exports.GetReclamationsOuvertes = async (excludedUserId) => {
    try {
        // Étape 1 : Récupérer les postId à exclure
        const excludedPostIdsSubquery = Sequelize.literal(`(
            SELECT "postId" FROM "reclamations" 
            WHERE "userId" = ${excludedUserId} AND "type" = 0
        )`);

        // Étape 2 : Récupérer UNE réclamation par post ouvert non exclu (la plus récente ici)
        const allReclamations = await Reclamation.findAll({
            where: {
                statut: 'OUVERT',
                postId: { [Op.notIn]: excludedPostIdsSubquery }
            },
            include: [
                { model: users, attributes: ['id', 'pseudo'] },
                { model: Post, attributes: ['id'] }
            ],
            order: [['createdAt', 'DESC']] // pour prendre la plus récente si on filtre ensuite
        });

        // Étape 3 : filtrer pour ne garder qu'une seule réclamation par postId
        const seenPosts = new Set();
        const uniqueReclamations = [];

        for (const rec of allReclamations) {
            if (!seenPosts.has(rec.postId)) {
                seenPosts.add(rec.postId);
                uniqueReclamations.push(rec);
            }
        }

        // Étape 4 : calculer combien de réclamations existent par postId
        const countByPostId = {};
        allReclamations.forEach(rec => {
            countByPostId[rec.postId] = (countByPostId[rec.postId] || 0) + 1;
        });

        // Étape 5 : ajouter le champ "etat"
        const reclamationsAvecEtat = uniqueReclamations.map(r => ({
            ...r.toJSON(),
            etat: countByPostId[r.postId] > 1 ? "retour" : "Réclamation"
        }));

        return [true, reclamationsAvecEtat];

    } catch (error) {
        console.error('Erreur lors de la récupération des réclamations ouvertes :', error);
        return [false, "Erreur lors de la récupération des réclamations ouvertes"];
    }
};


//type = 0 demande utilisateur , 1 reponse admin
exports.createReclamation = async (userId, postId, commentaire, type) => {
    try {
        // Récupère l'utilisateur
        const user = await users.findByPk(userId);
        if (!user) {
            return [false, "Utilisateur introuvable."];
        }

        // Si l'utilisateur tente de faire une réponse (type 1), il doit être admin
        if (type === 1 && user.role !== 'ADMIN') {
            return [false, "Seuls les modérateurs peuvent répondre à une réclamation."];
        }

        // Vérifie si le post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return [false, "Post introuvable."];
        }

        // Si c'est une demande utilisateur (type 0), il doit être l'auteur du post
        if (type === 0 && post.userId !== userId) {
            return [false, "Vous n'êtes pas autorisé à faire une réclamation sur ce post."];
        }

        // Crée la réclamation
        const newReclamation = await Reclamation.create({
            userId,
            postId,
            commentaire,
            type: type ?? 0,
            statut: "OUVERT"
        });

        return [true, "Réclamation créée avec succès."];

    } catch (error) {
        console.error("Erreur lors de la création de la réclamation :", error);
        return [false, "Erreur serveur lors de la création de la réclamation."];
    }
};

exports.getReclamationsByPostId = async (postId) => {
    try {
        // Récupère toutes les réclamations liées au post avec l'utilisateur qui les a envoyées
        const reclamations = await Reclamation.findAll({
            where: { postId },
            include: [
                {
                    model: users,
                    attributes: ['id', 'pseudo', 'icone']
                }
            ],
            attributes: ['id', 'commentaire', 'type', 'statut', 'createdAt'],
            order: [['createdAt', 'ASC']] // optionnel : ordre chronologique
        });

        if (!reclamations.length) {
            return [false, "Aucune réclamation trouvée pour ce post."];
        }

        // Reformate la liste des réclamations pour retourner uniquement les champs souhaités
        const result = reclamations.map(rec => ({
            id: rec.id,
            commentaire: rec.commentaire,
            type: rec.type,
            statut: rec.statut,
            date: rec.createdAt,
            utilisateur: {
                id: rec.user.id,
                pseudo: rec.user.pseudo,
                icone: rec.user.icone
            }
        }));

        return [true, result];

    } catch (error) {
        console.error("Erreur lors de la récupération des réclamations :", error);
        return [false, "Erreur lors de la récupération des réclamations."];
    }
};


exports.approuvePost = async (postId) => {
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return [false, "Post introuvable."];
        }

        // Mise à jour de l'état du post
        post.etat = "CLEAN"; // ou post.status = 'CLEAN' si c'est ce champ que tu utilises
        await post.save();

        // Suppression des réclamations liées au post
        await Reclamation.destroy({
            where: { postId }
        });

        // Suppression des signalements liés au post
        await SignalementPost.destroy({
            where: { postId }
        });

        return [true, "Post approuvé avec succès."];

    } catch (error) {
        console.error("Erreur lors de l'approuvation du post :", error);
        return [false, "Erreur serveur lors de l'approuvation du post."];
    }
};

exports.deletePost = async (postId) => {
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return [false, "Post introuvable."];
        }

        // Mise à jour de l'état du post
        post.etat = "DELETED"; // ou post.status = 'CLEAN' si c'est ce champ que tu utilises
        await post.save();

        // Suppression des réclamations liées au post
        await Reclamation.destroy({
            where: { postId }
        });

        // Suppression des signalements liés au post
        await SignalementPost.destroy({
            where: { postId }
        });

        return [true, "Post supprimé avec succès."];

    } catch (error) {
        console.error("Erreur lors du nettoyage du post :", error);
        return [false, "Erreur serveur lors du nettoyage du post."];
    }
};

exports.GetToutesMesReclamations = async (userId) => {
    try {
        // Étape 1 : récupérer toutes les réclamations de l'utilisateur avec type 0
        const allReclamations = await Reclamation.findAll({
            where: {
                userId,
                type: 0 // uniquement les réclamations dont l'utilisateur est auteur avec type 0
            },
            include: [
                { model: users, attributes: ['id', 'pseudo'] },
                { model: Post, attributes: ['id'] }
            ],
            order: [['createdAt', 'DESC']] // la plus récente en premier
        });

        // Étape 2 : filtrer pour ne garder qu'une seule réclamation par postId
        const seenPosts = new Set();
        const uniqueReclamations = [];

        for (const rec of allReclamations) {
            if (!seenPosts.has(rec.postId)) {
                seenPosts.add(rec.postId);
                uniqueReclamations.push(rec);
            }
        }

        // Étape 3 : compter le nombre de réclamations par postId
        const countByPostId = {};
        allReclamations.forEach(rec => {
            countByPostId[rec.postId] = (countByPostId[rec.postId] || 0) + 1;
        });

        // Étape 4 : ajouter le champ "etat"
        const reclamationsAvecEtat = uniqueReclamations.map(r => ({
            ...r.toJSON(),
            etat: countByPostId[r.postId] > 1 ? "retour" : "Réclamation"
        }));

        return [true, reclamationsAvecEtat];

    } catch (error) {
        console.error('Erreur lors de la récupération des réclamations :', error);
        return [false, "Erreur lors de la récupération des réclamations"];
    }
};
