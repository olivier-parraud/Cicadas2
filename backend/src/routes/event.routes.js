import { Router } from 'express';
import { 
    getEvents, 
    registerForEvent, 
    unregisterFromEvent, 
    getMyRegistrations,
    getUserEvents
} from '../controllers/event.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.get('/', getEvents);

// Routes privées (requièrent connexion)
router.get('/my-registrations', authMiddleware, getMyRegistrations);
router.get('/user', authMiddleware, getUserEvents);
router.post('/:id/register', authMiddleware, registerForEvent);
router.delete('/:id/register', authMiddleware, unregisterFromEvent);

export default router;
