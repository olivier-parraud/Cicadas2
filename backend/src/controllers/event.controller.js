import Event from '../models/event.model.js';

// Récupérer la liste des événements avec le nombre d'inscrits actuels et leurs noms
export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAllUpcoming();
        const participants = await Event.findParticipants();

        // Associer les participants à chaque événement
        const eventsWithParticipants = events.map(e => {
            const list = participants
                .filter(p => p.event_id === e.id)
                .map(p => {
                    if (p.pseudo) {
                        return p.pseudo;
                    }
                    const fullName = `${p.firstname || ''} ${p.lastname || ''}`.trim();
                    return fullName || p.email.split('@')[0];
                });
            return {
                ...e,
                participants: list
            };
        });

        res.json(eventsWithParticipants);
    } catch (error) {
        console.error("Erreur récupération événements :", error);
        res.status(500).json({ error: "Impossible de charger les événements." });
    }
};

// S'inscrire à un événement
export const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id; // Injecté par authMiddleware

        // 1. Vérifier si l'événement existe et sa capacité
        const eventInfo = await Event.getCapacityAndCount(eventId);
        if (!eventInfo) {
            return res.status(404).json({ error: "Événement non trouvé." });
        }

        const { capacity, registeredCount } = eventInfo;

        if (registeredCount >= capacity) {
            return res.status(400).json({ error: "Cet événement est complet." });
        }

        // 2. Inscrire l'utilisateur
        await Event.register(eventId, userId);

        res.status(201).json({ message: "Inscription à l'événement réussie !" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Vous êtes déjà inscrit à cet événement." });
        }
        console.error("Erreur inscription événement :", error);
        res.status(500).json({ error: "Erreur lors de l'inscription à l'événement." });
    }
};

// Se désinscrire d'un événement
export const unregisterFromEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const result = await Event.unregister(eventId, userId);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Vous n'étiez pas inscrit à cet événement." });
        }

        res.json({ message: "Désinscription réussie." });
    } catch (error) {
        console.error("Erreur désinscription événement :", error);
        res.status(500).json({ error: "Erreur lors de la désinscription." });
    }
};

// Récupérer les inscriptions de l'utilisateur connecté (IDs)
export const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        const ids = await Event.findRegisteredIdsByUserId(userId);
        res.json(ids);
    } catch (error) {
        console.error("Erreur récupération inscriptions événements utilisateur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// Récupérer la liste des événements auxquels l'utilisateur est inscrit
export const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const events = await Event.findByUserId(userId);
        res.json(events);
    } catch (error) {
        console.error("Erreur récup événements utilisateur:", error);
        res.status(500).json({ error: "Impossible de récupérer vos inscriptions aux événements." });
    }
};

// Créer un événement (Admin)
export const createEvent = async (req, res) => {
    try {
        const { name, type, game, date, capacity, price, description } = req.body;

        if (!name || !type || !game || !date || !capacity) {
            return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
        }

        if (!['avant_premiere', 'draft', 'initiation'].includes(type)) {
            return res.status(400).json({ error: "Type d'événement invalide." });
        }

        const newEvent = await Event.create({
            name,
            type,
            game,
            date,
            capacity: parseInt(capacity, 10),
            price: parseFloat(price || 0),
            description
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Erreur création événement :", error);
        res.status(500).json({ error: "Impossible de créer l'événement." });
    }
};

// Supprimer un événement (Admin)
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Event.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Événement non trouvé." });
        }

        res.json({ message: "Événement supprimé avec succès." });
    } catch (error) {
        console.error("Erreur suppression événement :", error);
        res.status(500).json({ error: "Impossible de supprimer l'événement." });
    }
};

// Modifier un événement (Admin)
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, game, date, capacity, price, description } = req.body;

        if (!name || !type || !game || !date || !capacity) {
            return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
        }

        if (!['avant_premiere', 'draft', 'initiation'].includes(type)) {
            return res.status(400).json({ error: "Type d'événement invalide." });
        }

        await Event.update(id, {
            name,
            type,
            game,
            date,
            capacity: parseInt(capacity, 10),
            price: parseFloat(price || 0),
            description
        });

        res.json({ message: "Événement mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur modification événement :", error);
        res.status(500).json({ error: "Impossible de modifier l'événement." });
    }
};
