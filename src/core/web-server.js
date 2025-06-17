const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const {sequelize} = require("../datamodel/db")

const Users = require('../datamodel/users.model');
const Reseaux = require('../datamodel/reseaux.model');


const routesUsers = require('../controller/users.route');
const routeAuth = require('../controller/auth.route');
const uploadRoute = require('../controller/posts.route');


class WebServer {
    app = undefined;
    port = process.env.PORT;
    server = undefined;


    constructor() {
        this.app = express();
        sequelize.sync({alter: true});


        // Reseaux.belongsTo(Users, { foreignKey: 'id' });
        // Users.hasOne(Reseaux, { foreignKey: 'id' });

        // Dans le modèle Reseaux
        Reseaux.belongsTo(Users, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });

        // Dans le modèle Users
        Users.hasOne(Reseaux, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });


        // ⚠️ Supprime toutes les tables existantes puis les recrée
        // sequelize.sync({ force: true }); // ou { alter: true } pour mise à jour

        require('dotenv').config();
        initializeConfigMiddlewares(this.app);
        this._initializeRoutes();
        initializeErrorMiddlwares(this.app);
    }

    start() {
        this.server = this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Example app listening on port ${this.port} (accessible par ngrok)`);
        });
    }

    stop() {
        this.server.close();
    }

    _initializeRoutes() {
        this.app.use('/users', routesUsers.initializeRoutesUsers());
        this.app.use('/auth', routeAuth.initializeRouteAuth());
        this.app.use('/upload', uploadRoute.initializeRoutesPosts()); // Route d'upload test
    }
}

module.exports = WebServer;



