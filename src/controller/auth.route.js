const express = require('express');
const usersRepository = require('../model/users_repository');
const reseauxRepository = require('../model/reseaux_repository')

const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');

const { body } = require('express-validator');
const router = express.Router();

router.post('/login', body('email').notEmpty(), body('mdp').notEmpty(), async (req, res) => {
    const { email, mdp } = req.body;
    const user = await usersRepository.getUserByEmail(email);

    if (!user || !passwordsAreEqual(mdp, user.mdp)) {
        res.status(400).json({error:"L'utilisateur n'existe pas ou le mot de passe ne correspond pas à celui inscrit lors de l'inscription. "});
    } else {


        //création des lignes à la premiere connexion de l'utilisateur :
        await reseauxRepository.createReseauxIfNotExists(user.id);


        const token = generateAuthToken(user.id, user.pseudo, user.role);
        res.status(200).json({ token });
    }


});

exports.initializeRouteAuth = () => router;