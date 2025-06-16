const express = require('express');
const router = express.Router();

const {body} = require("express-validator");
const {verifyToken} = require("../security/auth");

const followsRepository = require("../model/follows_repository");

router.post("/ajoutAmi", body("id"), body("idAmi"), verifyToken, async(req,res) => {

        const addFriend =  await followsRepository.followFriends(req.body.id, req.body.idAmi);

        if(addFriend === true){
            res.status(200).json({ success: "Ami ajouté." });
        }
        else{
            res.status(400).json({ error: "Un problème a empéché l'ajout de l'ami.'" });
        }

});

router.get("/isFriend/:id/:idAmi", verifyToken, async(req,res) => {

        const isFriend =  await followsRepository.isFriend(req.params.id, req.params.idAmi);
        console.log(isFriend)

        if(isFriend ){
            res.status(200).json({ success: true });
        }
        else{
            res.status(200).json({ success: false });
        }

});

router.post("/suppAmi", body("id"), body("idAmi"), verifyToken, async(req,res) => {

    const deleteFriend =  await followsRepository.DeleteFriends(req.body.id, req.body.idAmi);

    if(deleteFriend === true){
        res.status(200).json({ success: "Ami supprimé." });
    }
    else{
        res.status(400).json({ error: "Un problème a empéché la supression de l'ami.'" });
    }

});

exports.initializeRouteFollows = () => router;

