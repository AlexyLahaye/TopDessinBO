
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const HashtagModel = sequelize.define('hashtags', {
    id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
    libelle: { type: DataTypes.STRING, allowNull: false }
});

module.exports = HashtagModel;
