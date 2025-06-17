const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const SignalementsModel = sequelize.define(
    'signalements_com',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        description: { type: DataTypes.TEXT, allowNull: true },
        statut: { type: DataTypes.STRING, allowNull: true },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE', // facultatif, mais utile pour gérer les suppressions
            allowNull: false,
        },
        comId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'commentaires',
                key: 'id',
            },
            onDelete: 'CASCADE', // facultatif, mais utile pour gérer les suppressions
            allowNull: false,
        },
        raisonId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'raisons',
                key: 'id',
            },
            allowNull: false,
        },

    },
    { tableName: 'signalements_com' },
);
module.exports = SignalementsModel;