const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const {sequelize} = require("../datamodel/db")

const Users = require('../datamodel/users.model');
const routesUsers = require('../controller/users.route');


class WebServer {
    app = undefined;
    port = process.env.PORT;
    server = undefined;


    constructor() {
        this.app = express();
        sequelize.sync({alter: true});


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
    }
}

module.exports = WebServer;



