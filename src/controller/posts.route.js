const express = require('express');
const router = express.Router();
const upload = require('../core/upload'); // si upload.js est dans /core
const path = require('path');
const fs = require('fs');

const {createPostWithImages, deletePostAndImages, getPostsByUserId, getAllPosts, getPostById, getUserByPost,
    getPostsReportedByUserId, getMyPostById
} = require("../model/posts_repository");
const {verifyToken} = require("../security/auth");

// ✅ Route complète : création d'un post avec 1 à 4 images
router.post('/crea', upload.array('images', 4), async (req, res) => {
    try {
        const { description, type, categorie, etat, userId } = req.body;
        const files = req.files;

        let hashtags = req.body.hashtags;

        if (typeof hashtags === 'string') {
            try {
                hashtags = JSON.parse(hashtags);
            } catch (err) {
                hashtags = hashtags.split(','); // fallback si juste "#a,#b,#c"
            }
        }

        const images = {};
        for (let i = 0; i < 4; i++) {
            images[`image_${i + 1}`] = files[i] ? files[i].filename : null;
        }

        const post = await createPostWithImages({
            description,
            type,
            categorie,
            etat,
            userId,
            images,
            hashtags,
        });

        res.status(201).json({
            message: 'Post créé avec succès',
            post
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// 🗑️ DELETE /posts/:id → Supprime un post et ses images
router.delete('/:id', async (req, res) => {
    try {
        const result = await deletePostAndImages(req.params.id);
        const status = result.success ? 200 : 404;
        res.status(status).json({ message: result.message });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// POST /posts/upload → pour uploader UNE image
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        message: 'Fichier bien reçu !',
        file: req.file,
        imageUrl
    });
});

//  GET /posts/user/:userId → tous les posts d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await getPostsByUserId(req.params.userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/:userId/reported', verifyToken, async (req, res) => {
    try {
        const posts = await getPostsReportedByUserId(req.params.userId);
        res.status(200).json({success : posts});
    } catch (error) {
        console.error("Erreur dans GET /user/:userId/reported :", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /posts/user-from-post/:postId → récupérer l'utilisateur d'un post
router.get('/user-from-post/:postId', async (req, res) => {
    try {
        const user = await getUserByPost(req.params.postId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// ✅ GET /posts → tous les posts
router.get('/', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ✅ GET /posts/:id → un post par ID
router.get('/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé.' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


router.get("/getOnePost/:postId", verifyToken, async (req, res) => {
    console.log(req.params.postId);

    const [status, response] = await getMyPostById(req.params.postId);

    if (status === true) {
        res.status(200).json({ success: response });
    } else {
        res.status(400).json({ error: response });
    }
});


exports.initializeRoutesPosts = () => router;
