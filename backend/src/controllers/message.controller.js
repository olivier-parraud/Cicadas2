import Message from '../models/message.model.js';

// POST /api/messages
export const sendMessage = async (req, res) => {
    try {
        const { subject, content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Le contenu du message est requis." });
        }
        
        await Message.create({
            userId: req.user.id,
            subject: subject || "Sans objet",
            content
        });

        res.status(201).json({ message: "Votre message a bien été envoyé aux administrateurs." });
    } catch (error) {
        console.error("Erreur envoi message :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'envoi du message." });
    }
};

// GET /api/messages/my-messages
export const getMyMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.findByUserId(userId);
        const unreadCount = await Message.getUnreadUserCount(userId);
        res.json({ messages, unreadCount });
    } catch (error) {
        console.error("Erreur mes messages :", error);
        res.status(500).json({ error: "Impossible de récupérer vos messages." });
    }
};

// GET /api/messages/unread-count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await Message.getUnreadUserCount(userId);
        res.json({ unreadCount: count });
    } catch (error) {
        console.error("Erreur nombre messages non lus :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du nombre de messages non lus." });
    }
};

// PUT /api/messages/:id/user-read
export const markUserRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await Message.markUserRead(id, userId);
        res.json({ message: "Réponse marquée comme lue." });
    } catch (error) {
        console.error("Erreur marquage lu par utilisateur :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la lecture." });
    }
};

// POST /api/messages/:id/user-reply
export const userReplyMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        const userId = req.user.id;

        if (!reply || !reply.trim()) {
            return res.status(400).json({ error: "Le contenu de la réponse est requis." });
        }

        const msg = await Message.findById(id);
        if (!msg) {
            return res.status(404).json({ error: "Message non trouvé." });
        }

        if (msg.user_id !== userId) {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation de répondre à ce message." });
        }

        const oldReplyDate = msg.replied_at ? new Date(msg.replied_at).toLocaleString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : '';
        const nowStr = new Date().toLocaleString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        let updatedContent = msg.content;
        if (msg.admin_reply) {
            updatedContent += `\n\n--- Réponse de l'Administrateur (${oldReplyDate}) ---\n${msg.admin_reply}`;
        }
        updatedContent += `\n\n--- Message du membre (${nowStr}) ---\n${reply.trim()}`;

        await Message.userReply(id, userId, updatedContent);

        res.json({ message: "Votre réponse a bien été transmise aux administrateurs." });
    } catch (error) {
        console.error("Erreur relance utilisateur :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'envoi de votre réponse." });
    }
};

// POST /api/messages/admin/:id/reply
export const replyMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        if (!reply || !reply.trim()) {
            return res.status(400).json({ error: "Le texte de la réponse est requis." });
        }
        
        await Message.reply(id, reply.trim());
        res.json({ message: "Réponse envoyée avec succès." });
    } catch (error) {
        console.error("Erreur réponse admin :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'envoi de la réponse." });
    }
};

// GET /api/admin/messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll();
        res.json(messages);
    } catch (error) {
        console.error("Erreur récupération messages :", error);
        res.status(500).json({ error: "Impossible de récupérer les messages." });
    }
};

// PUT /api/admin/messages/:id/read
export const markRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.markAsRead(id);
        res.json({ message: "Message marqué comme lu." });
    } catch (error) {
        console.error("Erreur message lu :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
    }
};

// DELETE /api/admin/messages/:id
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.delete(id);
        res.json({ message: "Message supprimé avec succès." });
    } catch (error) {
        console.error("Erreur suppression message :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du message." });
    }
};
