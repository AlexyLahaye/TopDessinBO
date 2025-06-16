const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const {sequelize} = require("../datamodel/db")

const Users = require('../datamodel/users.model');
const Reseaux = require('../datamodel/reseaux.model');
const Follows = require('../datamodel/follows.model');


const routesUsers = require('../controller/users.route');
const routeAuth = require('../controller/auth.route');
const uploadRoute = require('../controller/posts.route');
const routeFollows = require('../controller/follows.route');


class WebServer {
    app = undefined;
    port = process.env.PORT;
    server = undefined;


    constructor() {
        this.app = express();
        sequelize.sync({alter: true});


        // Lien Réseaux/utilisateur
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

        // Lien follows/utilisateur
            Users.belongsToMany(Users, {
                through: Follows,
                as: 'amis', // alias : les personnes suivies
                foreignKey: 'userId',
                otherKey: 'idAmis',
                onDelete: 'CASCADE',
            });

            // Un utilisateur est suivi par plusieurs autres (idAmis → les gens qui le suivent)
            Users.belongsToMany(Users, {
                through: Follows,
                as: 'followers', // alias : les personnes qui le suivent
                foreignKey: 'idAmis',
                otherKey: 'userId',
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
        this.server = this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

    stop() {
        this.server.close();
    }

    _initializeRoutes() {
        this.app.use('/users', routesUsers.initializeRoutesUsers());
        this.app.use('/auth', routeAuth.initializeRouteAuth());
        this.app.use('/follow', routeFollows.initializeRouteFollows());
        this.app.use('/upload', uploadRoute.initializeRoutesPosts()); // Route d'upload test
    }
}

module.exports = WebServer;



