const express = require('express');
const router = express.Router();
const upload = require('../model/upload');

// Route de test pour l'upload
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Fichier bien reçu !',
        file: req.file,
        imageUrl: req.file.location // URL publique sur S3
    });
});

exports.initializeRoutesUsers = () => router;
