// server.js - reload triggered 3
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import emailRoutes from './src/routes/email.routes.js';
import reservationRoutes from './src/routes/reservation.routes.js';
import tournamentRoutes from './src/routes/tournament.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import boardgameRoutes from './src/routes/boardgame.routes.js';
import bggRoutes from './src/routes/bgg.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import messageRoutes from './src/routes/message.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;
// Connexion BDD
testConnection();
// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use('/public', express.static('public'));
// Logger (dev)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
        next();
    });
}
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Cicados API', status: 'online' });
});
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/boardgames', boardgameRoutes);
app.use('/api/bgg', bggRoutes);
app.use('/api/messages', messageRoutes);
// 404
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});