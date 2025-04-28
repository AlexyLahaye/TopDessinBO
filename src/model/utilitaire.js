const {sequelize} = require("../datamodel/db");
const UsersRepository = require('../datamodel/users.model');


exports.isUser = async (email) => {

    const user = await sequelize.query(`SELECT id  from "users" where email =  :email`, { replacements: { email }})
        .then(([results, metadata]) => {
            return results[0];
        });

    return user;
}
