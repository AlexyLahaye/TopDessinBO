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

// Mets a jour l'utilisateur. (PATCH permet une modicifation partielle ou complete.
router.patch('/:id', verifyToken, async (req, res) => {
    const idToUpdate = parseInt(req.params.id);

    // Autorisation ?
    const isSelf = req.user.id === idToUpdate;
    const isAdmin = req.user.droit === 'admin';

    if (!isSelf && !isAdmin) {
        return res.status(403).json({ error: "Action non autorisée" });
    }

    try {
        const result= await usersRepository.updateUser(idToUpdate, req.body);

        if (!result) {
            return res.status(404).json({ error: "Utilisateur non trouvé ou aucune donnée à mettre à jour" });
        }

        res.status(200).json({ modifications: result });

    } catch (err) {
        res.status(500).json({ error: "Erreur serveur : " + err.message });
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

router.get("/info/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const infoUser = await usersRepository.getInfoUserNS(id);

        if (!infoUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json({ success: infoUser });
    } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


router.post("/modifMail",
    body("id"),
    body("mail"),
    verifyToken, async(req,res) => {

        const modifMail =  await usersRepository.updateMailUser( req.body.mail , req.body.id);

        if(modifMail === true){
            res.status(200).json({ success: "Mise à jour de l'adresse  mail." });
        }
        else{
            res.status(400).json({ error: "Un utilisateur utilise déjà cette adresse mail." });
        }

    });

router.get("/mail/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const infoUser = await usersRepository.getMailUser(id);

        if (!infoUser) {
            return res.status(404).json({ error: "Mail non trouvé" });
        }

        res.status(200).json({ success: infoUser });
    } catch (error) {
        console.error("Erreur lors de la récupération du mail utilisateur:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});



exports.initializeRoutesUsers = () => router;