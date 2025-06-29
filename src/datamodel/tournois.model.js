const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const tournoisModel = sequelize.define(
    'tournois',
    {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        titre: { type: DataTypes.STRING, allowNull: false },
        theme: { type: DataTypes.STRING, allowNull: true },
        dateFin: { type: DataTypes.DATEONLY, allowNull: false },
        estOfficiel: { type: DataTypes.BOOLEAN, defaultValue: false },
        recompense: { type: DataTypes.INTEGER, allowNull: true },
        couleur: { type: DataTypes.STRING, allowNull: true }, // ex: #d44545
        banner: { type: DataTypes.STRING, allowNull: true },
        paralaxe: { type: DataTypes.STRING, allowNull: true },
        prixEntre: { type: DataTypes.INTEGER, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        style: { type: DataTypes.STRING, allowNull: true },
        attente: { type: DataTypes.STRING, allowNull: true },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: false,
        }

    },
    {
        tableName: 'tournois',
    }
);

module.exports = tournoisModel;
