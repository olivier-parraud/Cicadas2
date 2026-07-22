// routes/auth.routes.js
import { Router } from 'express'; // Import nommé ⬅️
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

// Configuration de Multer pour les Avatars
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/avatars';
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
    limits: { fileSize: 2 * 1024 * 1024 } // Limite à 2 Mo
});

const router = Router();
// Routes publiques
router.post('/register', register);
router.post('/login', login);
// Routes protégées
router.get('/me', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Route de téléversement d'avatar
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/avatars/${req.file.filename}`;
    res.json({ imageUrl: fileUrl });
});

export default router;