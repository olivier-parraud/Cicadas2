import { Router } from 'express';
import { 
    getAllReservations, 
    updateReservationStatus, 
    deleteReservation,
    getAllUsers,
    updateUserRole,
    deleteUser,
    createTournament,
    deleteTournament,
    createBoardGame,
    deleteBoardGame,
    importBggHotGames
} from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = Router();

// Toutes les routes admin nécessitent d'être connecté ET d'avoir le rôle ADMIN
router.use(authMiddleware, adminMiddleware);

// Réservations
router.get('/reservations', getAllReservations);
router.patch('/reservations/:id', updateReservationStatus);
router.delete('/reservations/:id', deleteReservation);

// Utilisateurs
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

// Tournois
router.post('/tournaments', createTournament);
router.delete('/tournaments/:id', deleteTournament);

// Jeux de société
router.post('/boardgames', createBoardGame);
router.delete('/boardgames/:id', deleteBoardGame);
router.post('/boardgames/import-hot', importBggHotGames);

export default router;
