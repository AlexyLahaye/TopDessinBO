const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const CommentaireModel = sequelize.define(
    'commentaires',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        contenu: { type: DataTypes.TEXT, allowNull: true },
        etat: { type: DataTypes.STRING, allowNull: true },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE', // facultatif, mais utile pour gérer les suppressions
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'posts',
                key: 'id',
            },
            onDelete: 'CASCADE', // facultatif, mais utile pour gérer les suppressions
            allowNull: false,
        },

    },
    { tableName: 'commentaires' },
);
module.exports = CommentaireModel;