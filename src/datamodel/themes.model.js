const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const themesModel = sequelize.define(
    'themes',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        libelle: { type: DataTypes.STRING, allowNull: true },
        cpt: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: 'themes' },
);
module.exports = themesModel;