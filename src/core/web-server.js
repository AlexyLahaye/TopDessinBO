const express = require('express');
const path = require('path');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const {sequelize} = require("../datamodel/db")

const Users = require('../datamodel/users.model');
const Reseaux = require('../datamodel/reseaux.model');
const Follows = require('../datamodel/follows.model');
const Themes = require('../datamodel/themes.model');
const Posts = require('../datamodel/posts.model');
const Commentaires = require('../datamodel/commentaires.model');
const Raisons = require('../datamodel/raisons.model');
const Signalement_post = require('../datamodel/signalements_post');
const Signalement_com = require('../datamodel/signalements_com');
const Reclamations = require('../datamodel/reclamations.model');


const routesUsers = require('../controller/users.route');
const routeAuth = require('../controller/auth.route');
const routePosts = require('../controller/posts.route');
const routeFollows = require('../controller/follows.route');


class WebServer {
    app = undefined;
    port = process.env.PORT;
    server = undefined;


    constructor() {
        this.app = express();

        //Reseaux
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


        // Posts
            Users.hasMany(Posts, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });

            Posts.belongsTo(Users, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });

        // Signalement_Post
            Posts.hasMany(Signalement_post, {
                foreignKey: 'postId',
                onDelete: 'CASCADE',
            });
            Users.hasMany(Signalement_post, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Raisons.hasMany(Signalement_post, {
                foreignKey: 'raisonId',
                onDelete: 'CASCADE',
            });

            Signalement_post.belongsTo(Posts, {
                foreignKey: 'postId',
                onDelete: 'CASCADE',
            });
            Signalement_post.belongsTo(Users, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Signalement_post.belongsTo(Raisons, {
                foreignKey: 'raisonId',
                onDelete: 'CASCADE',
            });


        //Réclamation
            Signalement_post.hasMany(Reclamations, {
                foreignKey: 'signalementId',
                onDelete: 'CASCADE',
            });
            Users.hasMany(Reclamations, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });

            Reclamations.belongsTo(Signalement_post, {
                foreignKey: 'signalementId',
                onDelete: 'CASCADE',
            });
            Reclamations.belongsTo(Users, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });

        // Signalement_Com
            Commentaires.hasMany(Signalement_com, {
                foreignKey: 'comId',
                onDelete: 'CASCADE',
            });
            Users.hasMany(Signalement_com, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Raisons.hasMany(Signalement_post, {
                foreignKey: 'raisonId',
                onDelete: 'CASCADE',
            });

            Signalement_com.belongsTo(Commentaires, {
                foreignKey: 'comId',
                onDelete: 'CASCADE',
            });
            Signalement_com.belongsTo(Users, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Signalement_com.belongsTo(Raisons, {
                foreignKey: 'raisonId',
                onDelete: 'CASCADE',
            });



        // Commentaires
            Users.hasMany(Commentaires, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Posts.hasMany(Commentaires, {
                foreignKey: 'postId',
                onDelete: 'CASCADE',
            });

            Commentaires.belongsTo(Users, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
            Commentaires.belongsTo(Posts, {
                foreignKey: 'postId',
                onDelete: 'CASCADE',
            });


        // Follows
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


        // THEMESxPOSTS
            Posts.belongsToMany(Themes, {
                through: 'post_themes',
                foreignKey: 'postId',
                otherKey: 'themeId',
            });
            Themes.belongsToMany(Posts, {
                through: 'post_themes',
                foreignKey: 'themeId',
                otherKey: 'postId',
            });


        // ⚠️ Supprime toutes les tables existantes puis les recrée
         sequelize.sync({ alter: true }); // pour mise à jour

        require('dotenv').config();
        initializeConfigMiddlewares(this.app);
        this._configureStaticAssets();
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

    _configureStaticAssets() {
        // ✅ Sert les images statiques du dossier uploads
        this.app.use('/uploads', express.static(path.join(__dirname, '../..', 'uploads')));
    }

    _initializeRoutes() {
        this.app.use('/users', routesUsers.initializeRoutesUsers());
        this.app.use('/auth', routeAuth.initializeRouteAuth());
        this.app.use('/follow', routeFollows.initializeRouteFollows());
        this.app.use('/posts', routePosts.initializeRoutesPosts());
    }
}

module.exports = WebServer;



