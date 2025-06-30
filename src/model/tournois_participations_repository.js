const Tournois = require('../datamodel/tournois.model');
const Participations = require('../datamodel/participations.model');
const Users = require('../datamodel/users.model');
const { Op } = require('sequelize');

/* =============================
   TOURNOIS CRUD
============================= */

exports.createTournoiWithImages = async (data) => {
    const {
        titre, theme, dateFin, recompense, couleur,
        banner, paralaxe, prixEntre, style, attente, userId
    } = data;

    try {
        const tournoi = await Tournois.create({
            titre,
            theme,
            dateFin,
            recompense,
            couleur,
            banner,
            paralaxe,
            prixEntre,
            style,
            attente,
            userId
        });

        console.log('Nouveau tournoi créé :', tournoi.id);
        return tournoi;
    } catch (error) {
        console.error('Erreur lors de la création du tournoi :', error);
        throw error;
    }
};


exports.getAllTournois = async () => {
    try {
        return await Tournois.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
        console.error('Erreur récupération tous les tournois :', error);
        throw error;
    }
};

exports.getTournoiById = async (id) => {
    try {
        return await Tournois.findByPk(id);
    } catch (error) {
        console.error('Erreur récupération tournoi par ID :', error);
        throw error;
    }
};

exports.updateTournoi = async (id, updates) => {
    try {
        const tournoi = await Tournois.findByPk(id);
        if (!tournoi) return null;

        await tournoi.update(updates);
        return tournoi;
    } catch (error) {
        console.error('Erreur mise à jour tournoi :', error);
        throw error;
    }
};

exports.deleteTournoi = async (id) => {
    try {
        const tournoi = await Tournois.findByPk(id);
        if (!tournoi) return false;

        await tournoi.destroy();
        return true;
    } catch (error) {
        console.error('Erreur suppression tournoi :', error);
        throw error;
    }
};


/* =============================
   PARTICIPATIONS CRUD
============================= */

exports.createParticipation = async (userId, tournoisId, image) => {
    try {
        const participation = await Participations.create({ userId, tournoisId, image });
        return participation;
    } catch (error) {
        console.error('Erreur création participation :', error);
        throw error;
    }
};

exports.getAllParticipations = async () => {
    try {
        return await Participations.findAll({ order: [['createdAt', 'DESC']] });
    } catch (error) {
        console.error('Erreur récupération participations :', error);
        throw error;
    }
};

exports.getParticipationById = async (id) => {
    try {
        return await Participations.findByPk(id);
    } catch (error) {
        console.error('Erreur récupération participation par ID :', error);
        throw error;
    }
};

exports.getParticipationsByUserId = async (userId) => {
    try {
        return await Participations.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    } catch (error) {
        console.error('Erreur récupération participations utilisateur :', error);
        throw error;
    }
};

exports.getParticipantsByTournoiId = async (tournoisId) => {
    try {
        return await Participations.findAll({
            where: { tournoisId },
            include: [{ model: Users, as: 'user' }],
            order: [['createdAt', 'DESC']]
        });
    } catch (error) {
        console.error('Erreur récupération participants du tournoi :', error);
        throw error;
    }
};

exports.deleteParticipation = async (id) => {
    try {
        const participation = await Participations.findByPk(id);
        if (!participation) return false;

        await participation.destroy();
        return true;
    } catch (error) {
        console.error('Erreur suppression participation :', error);
        throw error;
    }
};
