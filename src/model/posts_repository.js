const fs = require('fs');
const path = require('path');
const Posts = require('../datamodel/posts.model');

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

        console.log('✅ Nouveau post créé :', newPost.id);
        return newPost;
    } catch (error) {
        console.error('❌ Erreur lors de la création du post :', error);
        throw error;
    }
};

// 🗑️ Suppression du post et des images physiques associées
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
        console.error('❌ Erreur lors de la suppression du post :', error);
        throw error;
    }
};

// ✅ Récupérer tous les posts d'un utilisateur par son ID
exports.getPostsByUserId = async (userId) => {
    try {
        const posts = await Posts.findAll({ where: { userId } });
        return posts;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des posts utilisateur :', error);
        throw error;
    }
};

// ✅ Récupérer tous les posts (GET ALL)
exports.getAllPosts = async () => {
    try {
        const posts = await Posts.findAll();
        return posts;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de tous les posts :', error);
        throw error;
    }
};

// ✅ Récupérer un post par son ID (GET ONE)
exports.getPostById = async (postId) => {
    try {
        const post = await Posts.findByPk(postId);
        if (!post) return null;
        return post;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération du post :', error);
        throw error;
    }
};
