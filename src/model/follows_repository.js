const UsersRepository = require('../datamodel/users.model');
const {sequelize} = require("../datamodel/db")
const {generateHashedPassword} = require("../security/crypto")
const md5 = require('md5');


const Follows = require('../datamodel/follows.model');
const Users = require("../datamodel/users.model");


exports.followFriends = async ( userId, idAmi) => {

    async function addFriend(userId, idAmi) {
        try {

            const newFriend = await Follows.create({
                idAmis : idAmi,
                userId : userId
            });


        } catch (error) {
            console.error("Erreur dans l'ajout d'un ami :", error);
        }
    }
    addFriend(userId, idAmi);
    return true;

}

exports.isFriend = async ( userId, idAmi) => {

    return await Follows.findOne({
                where : {
                    userId : userId,
                    idAmis : idAmi
                }
            });
}

exports.DeleteFriends = async ( userId, idAmi) => {

    async function deleteFriend(userId, idAmi) {
        try {

            await Follows.destroy({
                where: {
                    idAmis: idAmi,
                    userId: userId
                }
            });


        } catch (error) {
            console.error("Erreur dans l'ajout d'un ami :", error);
        }
    }
    deleteFriend(userId, idAmi);
    return true;

}
