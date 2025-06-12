const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const reseaux = sequelize.define(
    'reseaux',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        instagram: { type: DataTypes.STRING, allowNull: true },
        twitter: { type: DataTypes.STRING, allowNull: true },
        discord: { type: DataTypes.STRING, allowNull: true },
        twitch: { type: DataTypes.STRING, allowNull: true },
        etsy: { type: DataTypes.STRING, allowNull: true },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE', // facultatif, mais utile pour gérer les suppressions
            allowNull: false,
        }

    },
    { tableName: 'reseaux' },
);
module.exports = reseaux;