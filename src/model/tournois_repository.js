const Users = require('../datamodel/users.model');
const Tournois = require('../datamodel/tournois.model');
const Participations = require('../datamodel/participations.model');
const Hashtags = require('../datamodel/hashtag.model');

exports.getTournoiDetail = async (tournoiId) => {
    try {
        const tournoi = await Tournois.findByPk(tournoiId, {
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'pseudo', 'icone']
                },
                {
                    model: Hashtags,
                    as: 'hashtags',
                    through: { attributes: [] },
                    attributes: ['libelle']
                }
            ]
        });

        if (!tournoi) {
            return [false, "Tournoi introuvable"];
        }

        const tournoiFormate = {
            banner: tournoi.banner,
            paralaxe: tournoi.paralaxe,
            user: {
                id: tournoi.user?.id,
                pseudo: tournoi.user?.pseudo,
                icone: tournoi.user?.icone
            },
            titre: tournoi.titre,
            npParticipant: 78, // valeur fictive ici, à remplacer si besoin
            cagnotte: 3670,     // idem
            description: tournoi.description,
            date_création: tournoi.createdAt.toLocaleDateString('fr-FR'),
            date_fin: new Date(tournoi.dateFin).toLocaleDateString('fr-FR'),
            htag: tournoi.hashtags.map(ht => ({ libelle: ht.libelle })),
            theme: tournoi.theme,
            style: tournoi.style,
            attente: tournoi.attente
        };

        return [true, tournoiFormate];

    } catch (error) {
        console.error("Erreur lors de la récupération du tournoi :", error);
        return [false, "Erreur serveur lors de la récupération du tournoi"];
    }
};