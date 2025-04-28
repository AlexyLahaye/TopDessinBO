const { sign } = require('jsonwebtoken');

exports.generateAuthToken = (id_user, login, trigramme, droit) => {
    return sign({ id_user, login, droit, trigramme }, "zazouestleplusbeau", { expiresIn: 15000 });
};