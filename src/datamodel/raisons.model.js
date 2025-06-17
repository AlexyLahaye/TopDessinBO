const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const raisonsModel = sequelize.define(
    'raisons',
    {
        id: { primaryKey: true, autoIncrement: true , type: DataTypes.INTEGER},
        libelle: { type: DataTypes.STRING, allowNull: true },

    },
    { tableName: 'raisons' },
);
module.exports = raisonsModel;