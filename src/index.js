const WebServer = require('./core/web-server');
const {sequelize} = require("./datamodel/db");

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

const webServer = new WebServer();
webServer.start();


// pour lancer mon serv :
//      - aller dans package.json et ajouter :
//             "start": "node src/index.js",
//             "start:dev": "nodemon src/index.js"
// il faut ensuite lancer la commande npm run start