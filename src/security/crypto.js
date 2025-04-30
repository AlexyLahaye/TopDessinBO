const bcrypt = require('bcryptjs');

exports.generateHashedPassword = (mdp) => {
    return bcrypt.hashSync(mdp, bcrypt.genSaltSync(12));
};

exports.passwordsAreEqual = (rawMdp, hashedMdp) => {
    return bcrypt.compareSync(rawMdp, hashedMdp);
};
