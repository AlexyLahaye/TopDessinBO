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

exports.getUserById = async (id) => {
    return await Users.findByPk(id);
}

exports.getUserByEmail = async (email) => {
    return await Users.findOne({
        where : {
            email : email
        }
    });
}

exports.getInfoUserNS = async (id) => {
    return await Users.findByPk(id, {
        attributes: ['pseudo', 'description', 'icone', 'banner']
    });
};

exports.createUser = async (email, mdp, pseudo) =>{

    //génération du mdp crypté
    const mdphash = generateHashedPassword(mdp);

    // vérification que mon utilisateur n'existe pas déjà
    const user = await Uti.isUser(email);
    if ( user === undefined){

        async function createUser(email, mdphash, pseudo) {
            try {

                const newUser = await Users.create({ email : email, mdp: mdphash ,pseudo: pseudo});
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

exports.updateUser = async (id, updateData) => {
    try {
        const existingUser = await Users.findByPk(id); // ou getUserById si tu préfères

        if (!existingUser) {
            console.log("Utilisateur non trouvé");
            return false;
        }

        const updatedFields = {};

        // Champs modifiables
        if (updateData.email) updatedFields.email = updateData.email;
        if (updateData.mdp) updatedFields.mdp = generateHashedPassword(updateData.mdp);
        if (updateData.pseudo) updatedFields.pseudo = updateData.pseudo;
        if (updateData.description) updatedFields.description = updateData.description;
        if (updateData.icone) updatedFields.icone = updateData.icone;

        if (Object.keys(updatedFields).length === 0) {
            console.log("Aucune donnée à mettre à jour.");
            return false;
        }

        await Users.update(updatedFields, {
            where: { id: id }
        });

        console.log("Champs modifiés :", updatedFields);
        return updatedFields; // Renvoie uniquement ce qui a été modifié

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        return false;
    }
};

exports.updateMailUser = async (email, idUser) =>{


    // vérification que un utilisateur n'est pas déjà mon mail
    const user = await Uti.isUser(email);

    if ( user === undefined || user.id === idUser){
        async function modifUser(email, idUser) {
            try {

                const modifUser = await Users.update(
                    { email: email },
                    { where: { id: idUser } }
                );


            } catch (error) {
                console.error('Erreur dans la modification du mail', error);
            }
        }
        modifUser(email, idUser);
        return true;
    }
    else{
        return false;
    }
}

exports.getMailUser = async (id) =>{
    return await Users.findByPk(id, {
        attributes: ['email']
    });
}

exports.updateMdpUser = async (mdp, idUser) =>{

    //génération du mdp crypté
    const mdphash = generateHashedPassword(mdp);

    if(mdphash.trim().length < 8){

        return [false, "Le mot de passe doit contenir au minimum 8 caractères."];
    }
    else{
        async function modifUser(mdp, idUser) {
            try {

                const modifUser = await Users.update(
                    { mdp: mdp },
                    { where: { id: idUser } }
                );


            } catch (error) {
                console.error('Erreur dans la modification du mail', error);
            }
        }
        modifUser(mdphash, idUser);
        return [true, "Modification du mot de passe enregistrée."];
    }

}

exports.deleteUser = async (idUser) =>{

        async function suppUser( idUser) {
            try {

                await Users.destroy({
                    where: { id: idUser }
                });
            } catch (error) {
                return [false, "Erreur dans la suppression du compte."];
            }
        }

        suppUser( idUser);
        return [true, "Supression utilisateur réussite."];


}







