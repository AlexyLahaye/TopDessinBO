const Commentaire = require('../datamodel/commentaires.model');

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

        await commentaire.destroy();

        return [true, "Commentaire supprimé avec succès"];
    } catch (error) {
        console.error("Erreur suppression commentaire :", error);
        return [false, "Erreur serveur lors de la suppression"];
    }
};