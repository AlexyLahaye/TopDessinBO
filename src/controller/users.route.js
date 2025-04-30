const express = require('express');
const router = express.Router();
const {generateAuthToken} = require('../security/auth')
const bcrypt = require("bcryptjs");

const { body, validationResult } = require('express-validator');

const usersRepository = require('../model/users_repository');

router.post("/crea", body("email"), body("mdp"), body("pseudo"), async(req,res) => {

    if(req.body.email === "" ||  req.body.mdp === "" || req.body.pseudo === "" ){
        res.status(400).json({ error: "Vous devez remplir tous les champs." });

    }
    else{
        const createUser =  await usersRepository.createUser(req.body.email, req.body.mdp, req.body.pseudo);
        console.log(createUser);

        if(createUser === true){
            res.status(200).json({ success: "Utilisateur créé. Veuillez-vous connecter." });
        }
        else{
            res.status(400).json({ error: "Email déjà utilisé." });
        }
    }
});

exports.initializeRoutesUsers = () => router;