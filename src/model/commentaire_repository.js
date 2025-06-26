const Commentaire = require('../datamodel/commentaires.model');
const User = require('../datamodel/users.model');
const Posts = require('../datamodel/posts.model');

exports.CreateCommentaire = async (userId, postId, contenu) => {
    try {
        if (!contenu || contenu.trim() === "") {
            return [false, "Le contenu du commentaire est vide"];
        }

        const nouveauCommentaire = await Commentaire.create({
            contenu,
            etat: 'VISIBLE', // ou tout autre valeur par défaut pour l'état
            userId,
            postId
        });

        // Incrémenter nb_like
        await Posts.increment('nb_com', { where: { id: postId } });

        return [true, nouveauCommentaire];
    } catch (error) {
        console.error("Erreur lors de la création du commentaire :", error);
        return [false, "Erreur serveur lors de la création du commentaire"];
    }
};


exports.SupprimerCommentaire = async (commentaireId, userId) => {
    try {
        const commentaire = await Commentaire.findByPk(commentaireId);

        if (!commentaire) {
            return [false, "Commentaire introuvable"];
        }

        if (commentaire.userId !== userId) {
            return [false, "Vous n'êtes pas l'auteur de ce commentaire"];
        }

        const postId = commentaire.postId; // ✅ récupération du postId

        await commentaire.destroy();

        // Décrémenter nb_com du post concerné
        await Posts.decrement('nb_com', { where: { id: postId } });

        return [true, "Commentaire supprimé avec succès"];
    } catch (error) {
        console.error("Erreur suppression commentaire :", error);
        return [false, "Erreur serveur lors de la suppression"];
    }
};


exports.getCommentaires = async (postId) => {
    try {
        const commentaires = await Commentaire.findAll({
            where: {
                postId,
                etat: 'VISIBLE'
            },
            include: [{
                model: User,
                attributes: ['id', 'pseudo', 'icone']
            }],
            order: [['createdAt', 'DESC']] // tri du plus récent au plus ancien
        });

        const commentairesFormates = commentaires.map(com => ({
            id: com.id,
            contenu: com.contenu,
            etat: com.etat,
            createdAt: com.createdAt,
            user: {
                id: com.user.id,
                pseudo: com.user.pseudo,
                icone: com.user.icone
            }
        }));

        return [true, commentairesFormates];

    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
        return [false, "Erreur serveur lors de la récupération des commentaires"];
    }
};