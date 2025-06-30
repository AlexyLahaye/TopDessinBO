const fs = require('fs');
const path = require('path');
const Posts = require('../datamodel/posts.model');
const Users = require('../datamodel/users.model');
const Follows = require('../datamodel/follows.model');

exports.createPostWithImages = async (data) => {
    const { description, type, categorie, etat, userId, images, hashtags } = data;

    try {
        const newPost = await Posts.create({
            ...images,
            description,
            type,
            categorie,
            etat,
            nb_like: 0,
            userId,
            hashtags,
        });

        console.log('Nouveau post créé :', newPost.id);
        return newPost;
    } catch (error) {
        console.error('Erreur lors de la création du post :', error);
        throw error;
    }
};

//  Suppression du post et des images physiques associées
exports.deletePostAndImages = async (postId) => {
    try {
        const post = await Posts.findByPk(postId);
        if (!post) {
            return { success: false, message: 'Post non trouvé.' };
        }

        // Supprimer les images physiques
        for (let i = 1; i <= 4; i++) {
            const img = post[`image_${i}`];
            if (img) {
                const imgPath = path.join(__dirname, '../..', 'uploads', img);
                fs.unlink(imgPath, (err) => {
                    if (err) {
                        console.warn(`⚠️ Image non supprimée : ${img}`);
                    } else {
                        console.log(`🧹 Image supprimée : ${img}`);
                    }
                });
            }
        }

        await post.destroy();
        return { success: true, message: 'Post supprimé avec succès.' };

    } catch (error) {
        console.error('Erreur lors de la suppression du post :', error);
        throw error;
    }
};

exports.getPostsFromFollows = async (userId) => {
    try {
        // Récupère tous les idAmis que l'utilisateur suit
        const follows = await Follows.findAll({
            where: { userId },
            attributes: ['idAmis']
        });

        // Extraire les IDs suivis + ajouter le sien
        const followedUserIds = follows.map(f => f.idAmis);
        followedUserIds.push(userId); // Inclure aussi les propres posts

        // Supprimer les doublons au cas où
        const uniqueUserIds = [...new Set(followedUserIds)];

        // Récupère les posts de ces utilisateurs
        const posts = await Posts.findAll({
            where: {
                userId: uniqueUserIds
            },
            order: [['createdAt', 'DESC']]
        });

        return posts;
    } catch (error) {
        console.error("Erreur dans getPostsFromFollows :", error);
        throw error;
    }
};


// Récupérer tous les posts d'un utilisateur par son ID
exports.getPostsByUserId = async (userId) => {
    try {
        const posts = await Posts.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
        return posts;
    } catch (error) {
        console.error(' Erreur lors de la récupération des posts utilisateur :', error);
        throw error;
    }
};

// Récupérer tous les posts qui ont été signalé d'un utilisateur par son ID
exports.getPostsReportedByUserId = async (userId) => {
    try {
        const posts = await Posts.findAll({
            where: {
                userId: userId,
                etat: 'REPORTED'
            },
            order: [['updatedAt', 'DESC']]
        });
        return posts;
    } catch (error) {
        console.error('Erreur lors de la récupération des posts utilisateur :', error);
        throw error;
    }
};


// Récupérer l'utilisateur à partir de l'ID d'un post
exports.getUserByPost = async (postId) => {
    try {
        console.log("🔎 postId reçu pour récupération de l'utilisateur :", postId);

        const post = await Posts.findOne({
            where: { id: postId },
            include: [{
                model: Users, // modèle Users correctement lié dans associations
                as: 'user'    // 👈 ajoute cet alias pour une meilleure cohérence
            }]
        });

        if (!post || !post.user) {
            throw new Error("Utilisateur non trouvé pour ce post.");
        }

        return post.user; // 👈 correspond à l'alias défini ci-dessus
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur du post :", error);
        throw error;
    }
};


//  Récupérer tous les posts (GET ALL)
exports.getAllPosts = async () => {
    try {
        const posts = await Posts.findAll({
            order: [['createdAt', 'DESC']] // Trie du plus récent au plus ancien
        });
        return posts;
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les posts :', error);
        throw error;
    }
};


// Récupérer un post par son ID (GET ONE)
exports.getPostById = async (postId) => {
    try {
        const post = await Posts.findByPk(postId);
        if (!post) return null;
        return post;
    } catch (error) {
        console.error('Erreur lors de la récupération du post :', error);
        throw error;
    }
};


exports.getMyPostById = async (id) => {
    try {
        const post = await Posts.findOne({
            where: { id },
        });

        if (!post) return [false, "Aucun post trouvé avec cet ID"];

        return [true, post];
    } catch (err) {
        console.error("Erreur dans getPostById :", err);
        return [false, "Erreur serveur lors de la récupération du post"];
    }
};