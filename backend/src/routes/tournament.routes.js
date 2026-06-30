import { Router } from 'express';
import { 
    getTournaments, 
    registerForTournament, 
    unregisterFromTournament, 
    getMyRegistrations 
} from '../controllers/tournament.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.get('/', getTournaments);

// Routes privées (requièrent connexion)
router.get('/my-registrations', authMiddleware, getMyRegistrations);
router.post('/:id/register', authMiddleware, registerForTournament);
router.delete('/:id/register', authMiddleware, unregisterFromTournament);

export default router;
