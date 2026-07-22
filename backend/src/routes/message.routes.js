import { Router } from 'express';
import { 
    sendMessage, 
    getMyMessages, 
    getUnreadCount, 
    markUserRead, 
    userReplyMessage,
    getMessages, 
    markRead, 
    deleteMessage,
    replyMessage 
} from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = Router();

// Routes utilisateur (il faut être connecté)
router.post('/', authMiddleware, sendMessage);
router.get('/my-messages', authMiddleware, getMyMessages);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/:id/user-read', authMiddleware, markUserRead);
router.post('/:id/user-reply', authMiddleware, userReplyMessage);

// Routes admin : gérer et répondre aux messages (il faut être connecté ET admin)
router.get('/admin', authMiddleware, adminMiddleware, getMessages);
router.put('/admin/:id/read', authMiddleware, adminMiddleware, markRead);
router.post('/admin/:id/reply', authMiddleware, adminMiddleware, replyMessage);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteMessage);

export default router;
