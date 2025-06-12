const UsersRepository = require('../datamodel/users.model');
const {sequelize} = require("../datamodel/db")
const {generateHashedPassword} = require("../security/crypto")
const md5 = require('md5');

const Users = require('../datamodel/users.model');
const Reseaux = require('../datamodel/reseaux.model');
const Auth = require('../security/auth');

exports.getReseauxByUser = async ( userId) => {


    return await Reseaux.findOne({
        where : {userId},
        attributes: ['instagram', 'twitter', 'discord', 'twitch', 'etsy' ],
    });
}


