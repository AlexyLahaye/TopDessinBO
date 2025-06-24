const { body } = require("express-validator");
const { verifyToken } = require("../security/auth");

const likeRepository = require("../model/like_repository");

const express = require('express');
const router = express.Router();

router.post('/creaLike', body('userID'), body('postId'), verifyToken, async (req, res) => {
    try {
        if (!req.body.userId || !req.body.postId) {
            return res.status(400).json({ error: 'Champs manquants.' });
        }

        const [success, result] = await likeRepository.CreateLike(req.body.userId, req.body.postId);

        if (success) {
            res.status(200).json({ success: "Like envoyé" });
        } else {
            res.status(400).json({ error: result });
        }
    } catch (error) {
        console.error('Erreur route création like :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.post('/suppLike', body('userId'), body('postId'), verifyToken, async (req, res) => {
    const { userId, postId } = req.body;

    const [success, message] = await likeRepository.DeleteLike(userId, postId);

    if (success) {
        res.status(200).json({ success: message });
    } else {
        res.status(400).json({ error: message });
    }
});


// ✅ Nouvelle route : vérifier si un utilisateur a liké un post
router.get('/hasLiked', verifyToken, async (req, res) => {
    const { userId, postId } = req.query;

    if (!userId || !postId) {
        return res.status(400).json({ error: 'userId et postId sont requis.' });
    }

    const [success, result] = await likeRepository.HasUserLikedPost(userId, postId);

    if (success) {
        res.status(200).json({ liked: result }); // result = true ou false
    } else {
        res.status(500).json({ error: result });
    }
});

// ✅ Nouvelle route : récupérer tous les posts likés par un utilisateur
router.get('/user/:id', verifyToken, async (req, res) => {
    const userId = req.params.id;

    const [success, result] = await likeRepository.GetAllPostsLikedByUser(userId);

    if (success) {
        res.status(200).json({ likedPosts: result }); // tableau de postId
    } else {
        res.status(500).json({ error: result });
    }
});

exports.initializeRoutesLike = () => router;
