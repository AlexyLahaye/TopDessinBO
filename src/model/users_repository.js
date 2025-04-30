const UsersRepository = require('../datamodel/users.model');
const {sequelize} = require("../datamodel/db")
const {generateHashedPassword} = require("../security/crypto")
const md5 = require('md5');

const Users = require('../datamodel/users.model');
const Uti = require('../model/utilitaire');

exports.getUsers = async () => {
    return await Users.findAll();
}

exports.getUserByNom = async (pseudo) => { // TODO findOne a revoir plutot en findAll where like ...
    return await Users.findOne({where : {pseudo}});
}

exports.getUserByEmail = async (email) => {
    return await Users.findOne({
        where : {
            email : email
        }
    });
}

exports.createUser = async (email, mdp, pseudo) =>{

    //génération du mdp crypté
    const mdphash = generateHashedPassword(mdp);

    // vérification que mon utilisateur n'existe pas déjà
    const user = await Uti.isUser(email);
    if ( user === undefined){

        async function createUser(email, mdp, pseudo) {
            try {

                const newUser = await UsersRepository.create({ email : email, mdp: mdp ,pseudo: pseudo});
                console.log('Nouveau utilisateur crée', newUser);

            } catch (error) {
                console.error('Erreur dans la création du nouvel utilisateur:', error);
            }
        }
        createUser(email, mdphash, pseudo);
        return true;
    }
    else{
        return false;
    }
}

