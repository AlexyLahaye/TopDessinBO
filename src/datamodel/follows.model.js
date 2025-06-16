const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const followsModel = sequelize.define(
    'follows',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        idAmis: { type: DataTypes.INTEGER, allowNull: false },
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
    { tableName: 'follows' },
);
module.exports = followsModel;