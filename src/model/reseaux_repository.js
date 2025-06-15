const UsersRepository = require('../datamodel/users.model');
const {sequelize} = require("../datamodel/db")
const {generateHashedPassword} = require("../security/crypto")
const md5 = require('md5');

const Users = require('../datamodel/users.model');
const Reseaux = require('../datamodel/reseaux.model');
const Auth = require('../security/auth');
const Uti = require("./utilitaire");

exports.getReseauxByUser = async ( userId) => {

    return await Reseaux.findOne({
        where : {userId},
        attributes: ['instagram', 'twitter', 'discord', 'twitch', 'tiktok', 'etsy' ],
    });
}

exports.updateReseauxByUser = async (userId, instagram, twitter, discord, twitch, tiktok, etsy) => {
    try {
        const [nbUpdated] = await Reseaux.update(
            {
                instagram: instagram,
                twitter: twitter,
                discord: discord,
                twitch: twitch,
                tiktok: tiktok,
                etsy: etsy,
            },
            {
                where: { userId }
            }
        );

        if (nbUpdated === 0) {
            Console.log("MAJ reseaux sociaux echoué ! Aucune ligne mise à jour (utilisateur non trouvé ?)")
            return false;
        }
        return true;

    } catch (error) {
        console.error("Erreur lors de la mise à jour des réseaux :", error);
        return false;
    }
};

exports.createReseauxIfNotExists = async (userId) => {
    try {
        const existing = await Reseaux.findOne({ where: { userId } });
        if (!existing) {
            await Reseaux.create({ userId });
            console.log(`Nouvel enregistrement reseaux créé pour l'utilisateur ${userId}`);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification/création de reseaux :', error);
    }
};



