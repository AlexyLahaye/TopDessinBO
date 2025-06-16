const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');


const followsModel = sequelize.define(
    'follows',
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        idAmis: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users', // même table
                key: 'id',
            },
            onDelete: 'CASCADE',
        }
    },
    {
        tableName: 'follows',
        timestamps: false, // désactive createdAt/updatedAt si inutile
    }
);
module.exports = followsModel;