const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const postsModel = sequelize.define(
    'posts',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        image_1: { type: DataTypes.STRING, allowNull: true },
        image_2: { type: DataTypes.STRING, allowNull: true },
        image_3: { type: DataTypes.STRING, allowNull: true },
        image_4: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
        categorie: { type: DataTypes.STRING, allowNull: true },
        nb_like: { type: DataTypes.INTEGER, allowNull: true },
        nb_com: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0},
        etat: { type: DataTypes.STRING, allowNull: true },
        hashtags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
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
    { tableName: 'posts' },
);
module.exports = postsModel;