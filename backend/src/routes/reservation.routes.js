import { Router } from 'express';
import { createReservation } from '../controllers/reservation.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Route protégée: on a besoin du authMiddleware pour savoir `Qui` réserve
router.post('/', authMiddleware, createReservation);

export default router;