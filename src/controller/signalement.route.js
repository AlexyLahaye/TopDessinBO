const {body} = require("express-validator");
const {verifyToken} = require("../security/auth");

const signalementRepository = require("../model/signalement_repository");

const express = require('express');
const router = express.Router();


router.post("/signalCom",
    body("userId"),
    body("comId"),
    body("raisonId"),
    body("description"),
    verifyToken, async(req,res) => {


        const [status, response] =  await signalementRepository.reportCom( req.body.userId, req.body.comId, req.body.raisonId, req.body.description)

        if(status === true){
            res.status(200).json({ success: response });
        }
        else{
            res.status(400).json({ error: response});
        }

});


exports.initializeRoutesSignalement = () => router;