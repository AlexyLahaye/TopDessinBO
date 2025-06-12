const { sign, verify } = require('jsonwebtoken');

exports.generateAuthToken = (id, pseudo, droit) => {

    const SECRET_KEY = process.env.JWT_SECRET;

    return sign({ id, pseudo, droit}, SECRET_KEY, { expiresIn: 15000 });
};

exports.verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log("❌ Aucun header d'autorisation trouvé");
        return res.status(401).json({ error: "Header d'autorisation manquant" });
    }

    const token = authHeader.split(' ')[1]; // "Bearer mon_token"

    if (!token) {
        console.log("❌ Token manquant dans l'en-tête");
        return res.status(401).json({ error: "Token manquant" });
    }

    const SECRET_KEY = process.env.JWT_SECRET;

    if (!SECRET_KEY) {
        console.log("❌ Clé secrète JWT absente dans les variables d'environnement");
        return res.status(500).json({ error: "Configuration serveur manquante (SECRET_KEY)" });
    }

    verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("❌ Erreur de vérification JWT :", err.message);
            return res.status(403).json({ error: "Token invalide ou expiré" });
        }

        console.log("✅ Token vérifié, utilisateur :", user);
        req.user = user;
        next();
    });

};
