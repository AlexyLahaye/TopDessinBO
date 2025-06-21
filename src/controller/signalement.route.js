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

router.post("/signalPost",
    body("userId"),
    body("postId"),
    body("raisonId"),
    body("description"),
    verifyToken, async(req,res) => {


        const [status, response] =  await signalementRepository.reportPost( req.body.userId, req.body.postId, req.body.raisonId, req.body.description)

        if(status === true){
            res.status(200).json({ success: response });
        }
        else{
            res.status(400).json({ error: response});
        }

    });


router.get("/getSignalPost/:postId",
    verifyToken, async(req,res) => {

    console.log(req.params.postId)
        const [status, response] =  await signalementRepository.GetSignalementPost( req.params.postId)

        if(status === true){
            res.status(200).json({ success: response });
        }
        else{
            res.status(400).json({ error: response});
        }

    });

router.get("/getReclamation/:userId",
    verifyToken, async(req,res) => {

        console.log(req.params.postId)
        const [status, response] =  await signalementRepository.GetReclamationsOuvertes(req.params.userId)

        if(status === true){
            res.status(200).json({ success: response });
        }
        else{
            res.status(400).json({ error: response});
        }

    });

router.post("/creaReclamation",
    body("userId").isInt(),
    body("postId").isInt(),
    body("commentaire").isString().optional({ nullable: true }),
    body("type").isInt().optional({ nullable: true }),
    verifyToken,
    async (req, res) => {
        const { userId, postId, commentaire, type } = req.body;

        const [status, response] = await signalementRepository.createReclamation(
            userId,
            postId,
            commentaire,
            type
        );

        if (status === true) {
            res.status(200).json({ success: response });
        } else {
            res.status(400).json({ error: response });
        }
    }
);


router.get("/getReclamationPost/:postId", verifyToken, async (req, res) => {
    const postId = req.params.postId;

    const [status, response] = await signalementRepository.getReclamationsByPostId(postId);

    if (status === true) {
        res.status(200).json({ success: response });
    } else {
        res.status(404).json({ error: response });
    }
});


exports.initializeRoutesSignalement = () => router;