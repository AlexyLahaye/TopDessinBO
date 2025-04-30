const { sign } = require('jsonwebtoken');

exports.generateAuthToken = (id, pseudo, droit) => {
    return sign({ id, pseudo, droit}, "zazouestleplusbeau", { expiresIn: 15000 });
};