const { sign, jwt  } = require('jsonwebtoken');

exports.generateAuthToken = (id, pseudo, droit) => {
    return sign({ id, pseudo, droit}, "zazouestleplusbeau", { expiresIn: 15000 });
};

exports.verifyToken = (req, res, next) => {
    const SECRET_KEY = process.env.JWT_SECRET;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format : "Bearer token"

    if (!token) {
        res.status(401).json({ error: "Token manquant" });
    } else {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                res.status(403).json({ error: "Token invalide ou expiré" });
            } else {
                req.user = user; // Ajoute les infos du token à la requête (id, droit, etc.)
                next();
            }
        });
    }
};