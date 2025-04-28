const UsersRepository = require('../datamodel/users.model');
const {sequelize} = require("../datamodel/db")
const bcrypt = require('bcryptjs');
const md5 = require('md5');

const Users = require('../datamodel/users.model');
const Uti = require('../model/utilitaire');

exports.createUser = async (email, mdp, pseudo) =>{

    //génération du mdp crypté
    const  sel = bcrypt.genSaltSync(12);
    const mdphash = bcrypt.hashSync(mdp , sel);

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
        createUser(email, mdp, pseudo);
        return true;

    }
    else{
        return false;
    }

}

