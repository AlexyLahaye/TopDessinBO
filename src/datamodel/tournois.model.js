const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const tournoisModel = sequelize.define(
    'tournois',
    {
        id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
        titre: { type: DataTypes.STRING, allowNull: false },
        theme: { type: DataTypes.STRING, allowNull: true },
        dateFin: { type: DataTypes.DATEONLY, allowNull: false },
        hashtags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        estOfficiel: { type: DataTypes.BOOLEAN, defaultValue: false },
        recompense: { type: DataTypes.INTEGER, allowNull: true },
        couleur: { type: DataTypes.STRING, allowNull: true } // ex: #d44545
    },
    {
        tableName: 'tournois',
    }
);

module.exports = tournoisModel;
