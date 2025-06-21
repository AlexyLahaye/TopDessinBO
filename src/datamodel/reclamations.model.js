const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const reclamationModel = sequelize.define(
    'reclamations',
    {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        type: { type: DataTypes.INTEGER, allowNull: true },
        statut: { type: DataTypes.STRING, allowNull: true },
        commentaire: { type: DataTypes.TEXT, allowNull: true },

        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'posts',
                key: 'id',
            },
            onDelete: 'CASCADE',
            allowNull: false,
        },

        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            allowNull: false,
        }
    },
    { tableName: 'reclamations' },
);



module.exports = reclamationModel;