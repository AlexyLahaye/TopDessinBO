require('dotenv').config();
const { Sequelize } = require('sequelize');

// Construction propre de l'instance Sequelize sans URL
const sequelize = new Sequelize(
    process.env.DB_NAME,     // topdessin
    process.env.DB_USER,     // admin
    process.env.DB_MDP,      // ton mot de passe
    {
        host: process.env.DB_HOST, // localhost
        port: process.env.DB_PORT, // 5432
        dialect: 'postgres',
        logging: true, // désactive les logs SQL (tu peux le mettre à true pour debug)
    }
);

// Export de l'instance pour l'utiliser ailleurs dans l'API
module.exports = { sequelize };
