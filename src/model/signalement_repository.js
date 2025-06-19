const SignalementCom = require("../datamodel/signalements_com");
const SignalementPost = require("../datamodel/signalements_post");
const Commentaire = require("../datamodel/commentaires.model");
const Post = require("../datamodel/posts.model");

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



exports.reportPost = async ( userId, postId, raisonId, description) => {
    async function signalCom(userId, postId, raisonId, description) {
        try {

            const report = await SignalementPost.create({
                userId : userId,
                comId : postId,
                raisonId: raisonId,
                description : description,
                statut : "OUVERT"
            });

        } catch (error) {
            console.error("Erreur dans le signalement du commentaire.", error);
            return [false, "Erreur dans le signalement du commentaire."];
        }
    }
    signalCom(userId, postId, raisonId, description);
    return [true, "Commentaire signalé."];


};
