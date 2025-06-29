const express = require('express');
const router = express.Router();
const upload = require('../core/upload');

const {
    createTournoi,
    deleteTournoi,
    getAllTournois,
    getTournoiById,
    getTournoisByUserId,
    updateTournoi,
    createParticipation,
    deleteParticipation,
    getAllParticipations,
    getParticipationsByTournoiId,
    getParticipationsByUserId,
    getParticipationByUserAndTournoi
} = require("../model/tournois_participations_repository");

// ===== ROUTES TOURNOIS =====

// POST /tournois → Créer un tournoi
router.post('/', async (req, res) => {
    try {
        const tournoi = await createTournoi(req.body);
        res.status(201).json(tournoi);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du tournoi' });
    }
});

// GET /tournois → Liste de tous les tournois
router.get('/', async (req, res) => {
    try {
        const tournois = await getAllTournois();
        res.status(200).json(tournois);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /tournois/:id → Récupérer un tournoi par ID
router.get('/:id', async (req, res) => {
    try {
        const tournoi = await getTournoiById(req.params.id);
        if (!tournoi) return res.status(404).json({ message: 'Tournoi non trouvé' });
        res.status(200).json(tournoi);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT /tournois/:id → Modifier un tournoi
router.put('/:id', async (req, res) => {
    try {
        const tournoi = await updateTournoi(req.params.id, req.body);
        res.status(200).json(tournoi);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE /tournois/:id → Supprimer un tournoi
router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteTournoi(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /tournois/user/:userId → Récupérer les tournois d'un utilisateur (organisateur)
router.get('/user/:userId', async (req, res) => {
    try {
        const tournois = await getTournoisByUserId(req.params.userId);
        res.status(200).json(tournois);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// ===== ROUTES PARTICIPATIONS =====

// POST /participations → Créer une participation
router.post('/participations', upload.single('image'), async (req, res) => {
    try {
        const { userId, tournoiId } = req.body;
        const image = req.file ? req.file.filename : null;

        const participation = await createParticipation({ userId, tournoiId, image });
        res.status(201).json(participation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE /participations/:id → Supprimer une participation
router.delete('/participations/:id', async (req, res) => {
    try {
        const message = await deleteParticipation(req.params.id);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /participations → Toutes les participations
router.get('/participations', async (req, res) => {
    try {
        const participations = await getAllParticipations();
        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /participations/tournoi/:tournoiId → Participations par tournoi
router.get('/participations/tournoi/:tournoiId', async (req, res) => {
    try {
        const participations = await getParticipationsByTournoiId(req.params.tournoiId);
        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /participations/user/:userId → Participations par user
router.get('/participations/user/:userId', async (req, res) => {
    try {
        const participations = await getParticipationsByUserId(req.params.userId);
        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /participations/check/:userId/:tournoiId → Une participation précise user/tournoi
router.get('/participations/check/:userId/:tournoiId', async (req, res) => {
    try {
        const participation = await getParticipationByUserAndTournoi(
            req.params.userId,
            req.params.tournoiId
        );
        res.status(200).json(participation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

exports.initializeRoutesTournois = () => router;

