const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const participationModel = sequelize.define(
    'participations',
    {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },

        tournoisId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tournois',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false, // role u participant, Juge, joueur, admin ?
        },

        image: {
            type: DataTypes.STRING,
            allowNull: false, // image postée par l'utilisateur pour ce tournoi
        }
    },
    {
        tableName: 'participations',
        uniqueKeys: {
            unique_user_tournoi: {
                fields: ['userId', 'tournoisId'], // un user ne peut participer qu'une fois par tournoi
            },
        },
    }
);

module.exports = participationModel;
