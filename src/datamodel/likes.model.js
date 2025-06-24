const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const LikesModel = sequelize.define(
    'likes',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
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
    { tableName: 'likes' },
);
module.exports = LikesModel;