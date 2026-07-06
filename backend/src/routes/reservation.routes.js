import { Router } from 'express';
import { 
    createReservation, 
    getReservationsByDate, 
    getUserReservations, 
    cancelReservation, 
    updateReservation 
} from '../controllers/reservation.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Route publique pour voir la disponibilité des créneaux
router.get('/', getReservationsByDate);

// Récupérer les réservations de l'utilisateur connecté
router.get('/user', authMiddleware, getUserReservations);

// Route protégée: on a besoin du authMiddleware pour savoir `Qui` réserve
router.post('/', authMiddleware, createReservation);

// Modifier une réservation
router.put('/:id', authMiddleware, updateReservation);

// Annuler une réservation
router.delete('/:id', authMiddleware, cancelReservation);

export default router;