// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
// Génère un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};
// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { email, password, firstname, lastname, pseudo } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 1 caractère spécial.' });
        }
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        const user = await User.create({ email, password, firstname, lastname, pseudo });
        const token = generateToken(user);
        res.status(201).json({ message: 'Inscription réussie', user, token });
    } catch (error) {
        console.error("Erreur serveur (inscription):", error);
        res.status(500).json({ error: 'Erreur serveur - Vérifiez le terminal' });
    }
};
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await User.verifyPassword(password, user.password))) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }
        const token = generateToken(user);
        res.json({
            user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, pseudo: user.pseudo, role: user.role, avatar_url: user.avatar_url },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// GET /api/auth/me
export const getProfile = async (req, res) => {
    res.json({ user: req.user });
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
    try {
        const { email, firstname, lastname, pseudo, password, avatar_url } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email requis' });
        }
        
        // Si l'email change, vérifier s'il est déjà pris par un autre utilisateur
        if (email.toLowerCase() !== req.user.email.toLowerCase()) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email déjà utilisé par un autre utilisateur' });
            }
        }
        
        await User.updateProfile(req.user.id, { email, firstname, lastname, pseudo, password, avatar_url });
        
        // Récupérer l'utilisateur mis à jour
        const updatedUser = await User.findById(req.user.id);
        const token = generateToken(updatedUser);
        
        res.json({ 
            message: 'Profil mis à jour avec succès', 
            user: { 
                id: updatedUser.id, 
                email: updatedUser.email, 
                firstname: updatedUser.firstname, 
                lastname: updatedUser.lastname, 
                pseudo: updatedUser.pseudo, 
                role: updatedUser.role,
                avatar_url: updatedUser.avatar_url
            }, 
            token 
        });
    } catch (error) {
        console.error("Erreur mise à jour profil :", error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
    }
};