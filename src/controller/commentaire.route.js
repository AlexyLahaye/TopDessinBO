const {body} = require("express-validator");
const {verifyToken} = require("../security/auth");

const commentaireRepository = require("../model/commentaire_repository");

const express = require('express');
const router = express.Router();


router.post('/creaCom', body('userID'), body('postId'), body('contenu'), verifyToken, async (req, res) => {
    try {

        if (!req.body.userId || !req.body.postId || !req.body.contenu) {
            return res.status(400).json({ error: 'Champs manquants.' });
        }

        const [success, result] = await commentaireRepository.CreateCommentaire(req.body.userId, req.body.postId, req.body.contenu);

        if (success) {
            res.status(201).json(result);
        } else {
            res.status(400).json({ error: result });
        }
    } catch (error) {
        console.error('Erreur route création commentaire :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.post('/suppCom',body('userId'), body('comId'), verifyToken, async (req, res) => {

    const [success, message] = await commentaireRepository.SupprimerCommentaire(req.body.comId, req.body.userId);

    if (success) {
        return res.status(200).json({ message });
    } else {
        return res.status(400).json({ error: message });
    }
});

exports.initializeRoutesCommentaire = () => router;