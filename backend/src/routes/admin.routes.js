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
    updateTournament,
    createBoardGame,
    updateBoardGame,
    updateBoardGameStock,
    deleteBoardGame,
    importBggHotGames
} from '../controllers/admin.controller.js';
import { createEvent, deleteEvent, updateEvent } from '../controllers/event.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuration du stockage de Multer pour les images téléversées
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/boardgames';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5 Mo
});

// Toutes les routes admin nécessitent d'être connecté ET d'avoir le rôle ADMIN
router.use(authMiddleware, adminMiddleware);

// Route de téléversement d'image
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/boardgames/${req.file.filename}`;
    res.json({ imageUrl: fileUrl });
});

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
router.put('/tournaments/:id', updateTournament);
router.delete('/tournaments/:id', deleteTournament);

// Événements (avant-premières, drafts, initiations)
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Jeux de société
router.post('/boardgames', createBoardGame);
router.put('/boardgames/:id', updateBoardGame);
router.patch('/boardgames/:id/stock', updateBoardGameStock);
router.delete('/boardgames/:id', deleteBoardGame);
router.post('/boardgames/import-hot', importBggHotGames);

export default router;
