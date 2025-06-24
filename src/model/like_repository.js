const Like = require('../datamodel/likes.model');
const Posts = require('../datamodel/posts.model');

exports.CreateLike = async (userId, postId) => {
    try {
        const nouveauLike = await Like.create({ userId, postId });

        // Incrémenter nb_like
        await Posts.increment('nb_like', { where: { id: postId } });

        return [true, nouveauLike];
    } catch (error) {
        console.error("Erreur lors de la création du like :", error);
        return [false, "Erreur serveur lors de la création du like"];
    }
};

exports.DeleteLike = async (userId, postId) => {
    try {
        const like = await Like.findOne({
            where: {
                userId,
                postId
            }
        });

        if (!like) {
            return [false, "Like introuvable"];
        }

        await like.destroy();

        // Décrémenter nb_like
        await Posts.decrement('nb_like', { where: { id: postId } });

        return [true, "Like supprimé avec succès"];
    } catch (error) {
        console.error("Erreur suppression like :", error);
        return [false, "Erreur serveur lors de la suppression"];
    }
};



exports.HasUserLikedPost = async (userId, postId) => {
    try {
        const like = await Like.findOne({ where: { userId, postId } });
        return [true, !!like]; // true ou false
    } catch (error) {
        console.error("Erreur lors de la vérification du like :", error);
        return [false, "Erreur serveur lors de la vérification du like"];
    }
};

exports.GetAllPostsLikedByUser = async (userId) => {
    try {
        const likes = await Like.findAll({
            where: { userId },
            attributes: ['postId']
        });
        const postIds = likes.map(like => like.postId);
        return [true, postIds];
    } catch (error) {
        console.error("Erreur lors de la récupération des posts likés :", error);
        return [false, "Erreur serveur lors de la récupération des posts likés"];
    }
};
