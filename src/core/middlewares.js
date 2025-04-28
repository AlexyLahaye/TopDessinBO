const express = require('express');
const cors = require('cors');
const { DateTime } = require('luxon');
const {expressjwt: jwt} = require("express-jwt");

const initpublicRepertory = (app) => app.use(express.static( 'public'));

const initJsonHandlerMiddlware = (app )=> {
    app.use(express.json());
    app.use(express.urlencoded({extended : false}))
}
const initcors = (app) => app.use( cors());

// calcule du temps de la requete
const initLoggerMiddlware = (app) => {
    app.use((req, res, next) => {
        const begin = new DateTime(new Date());

        res.on('finish', () => {
            const requestDate = begin.toString();
            const remoteIP = `IP: ${req.connection.remoteAddress}`;
            const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

            const end = new DateTime(new Date());
            const requestDurationMs = end.diff(begin).toMillis();
            const requestDuration = `Duration: ${requestDurationMs}ms`;

            console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
        })
        next();
    });
};


exports.initializeConfigMiddlewares = (app) => {
    initJsonHandlerMiddlware(app);
    initLoggerMiddlware(app);
    //initLogInMiddleware(app);
    //initpublicRepertory(app);
    initcors(app);
}

exports.initializeErrorMiddlwares = (app) => {
    app.use((err, req, res, next) => {
        res.status(500).send(err.message);
    });
}

