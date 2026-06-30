const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Accès refusé. Réservé aux administrateurs." });
    }
    next();
};

export default adminMiddleware;
