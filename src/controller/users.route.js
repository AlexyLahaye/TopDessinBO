const express = require('express');
const router = express.Router();
const {verifyToken} = require('../security/auth')
const bcrypt = require("bcryptjs");

const { body, validationResult } = require('express-validator');

const usersRepository = require('../model/users_repository');
const reseauxRepository = require('../model/reseaux_repository');
const Auth = require("../security/auth");

router.post("/crea", body("email"), body("mdp"), body("pseudo"), async(req,res) => {

    if(req.body.email === "" ||  req.body.mdp === "" || req.body.pseudo === "" ){
        res.status(400).json({ error: "Vous devez remplir tous les champs." });

    }
    else{
        const createUser =  await usersRepository.createUser(req.body.email, req.body.mdp, req.body.pseudo);

        if(createUser === true){
            res.status(200).json({ success: "Utilisateur créé. Veuillez-vous connecter." });
        }
        else{
            res.status(400).json({ error: "Email déjà utilisé." });
        }
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const userIdFromToken = req.user.id;
    const userRole = req.user.droit;
    const idToUpdate = parseInt(req.params.id);

    // Autoriser si c’est l’utilisateur lui-même ou un admin
    if (userIdFromToken !== idToUpdate || userRole !== 'admin') {
        res.status(403).json({ error: "Action non autorisée" });
    } else {
        try {
            await userRepository.updateUser(idToUpdate, req.body);
            res.status(200).json({ success: "Utilisateur modifié avec succès" });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});


router.get("/getReseaux/:id",  verifyToken, async(req,res) => {

    const reseaux =  await reseauxRepository.getReseauxByUser(req.params.id);

    res.status(200).json({ success:  reseaux});

});

router.post("/modifReseaux",
    body("userId"),
    body("instagram"), body("twitter"),
    body("discord"), body("twitch"),
    body("tiktok"), body("etsy"),
    verifyToken, async(req,res) => {

    const modifReseaux =  await reseauxRepository.updateReseauxByUser(req.body.userId, req.body.instagram, req.body.twitter, req.body.discord, req.body.twitch, req.body.tiktok, req.body.etsy);

    if(modifReseaux === true){
        res.status(200).json({ success: "Mise à jour des informations." });
    }
    else{
        res.status(400).json({ error: "Un problème a empéché la mise à jour des informations veuillez réessayer." });
    }

});





exports.initializeRoutesUsers = () => router;