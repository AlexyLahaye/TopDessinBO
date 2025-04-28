const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const user = sequelize.define(
    'users',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        email: { type: DataTypes.STRING, allowNull: true },
        mdp: { type: DataTypes.STRING, allowNull: false },
        pseudo: { type: DataTypes.STRING(14), allowNull: false },
        description: { type: DataTypes.STRING(110), allowNull: true },

        art_coin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },

        points_global: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        point_blits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        point_participatif: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

        acces_tournois: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        acces_tutoriel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        banni: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    },
    { tableName: 'users' },
);
module.exports = user;