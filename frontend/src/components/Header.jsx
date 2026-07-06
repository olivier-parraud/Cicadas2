// components/Header.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
];

function Header() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation(); // Actualise le Header as une nouvelle route
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // On vérifie si l'utilisateur est connecté (présence du token)
    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('user_role') === 'ADMIN';

    const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'fr').slice(0, 2);
    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        navigate('/');
        window.location.reload();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-indigo-900 text-white shadow-lg border-b border-indigo-800 relative z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-wider hover:text-indigo-200 transition" onClick={closeMenu}>
                    Cicados
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex gap-8 items-center font-medium">
                    <Link to="/" className="hover:text-indigo-300 transition">Accueil</Link>
                    <Link to="/reservations" className="hover:text-indigo-300 transition">Réserver une table</Link>
                    {isAuthenticated && (
                        <Link to="/my-reservations" className="hover:text-indigo-300 transition">Mes réservations</Link>
                    )}
                    <Link to="/boardgames" className="hover:text-indigo-300 transition">Jeux de société</Link>
                    <Link to="/tournaments" className="hover:text-indigo-300 transition">Tournois</Link>
                    {isAuthenticated && isAdmin && (
                        <Link to="/admin" className="hover:text-indigo-300 text-indigo-200 font-bold transition">Admin</Link>
                    )}
                </nav>

                {/* Actions Desktop */}
                <div className="hidden md:flex gap-4 items-center">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium bg-red-500 hover:bg-red-400 px-4 py-2 rounded-full transition shadow-md cursor-pointer"
                        >
                            Déconnexion
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium hover:text-indigo-200 transition">Connexion</Link>
                            <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full transition shadow-md">Inscription</Link>
                        </>
                    )}
                    <select
                        value={currentLanguage}
                        onChange={handleLanguageChange}
                        className="text-sm bg-indigo-800 hover:bg-indigo-700 px-2 py-1 rounded transition font-mono text-white border border-indigo-600 outline-none focus:ring-2 focus:ring-indigo-400"
                        title="Changer de langue"
                    >
                        {languages.map((language) => (
                            <option key={language.code} value={language.code} className="text-black">
                                {language.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bouton Hamburger Mobile */}
                <button 
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Menu Déroulant Mobile */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-indigo-950 border-b border-indigo-800 shadow-2xl backdrop-blur-lg flex flex-col p-6 space-y-4 animate-in slide-in-from-top duration-200">
                    <Link to="/" className="hover:text-indigo-300 transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Accueil</Link>
                    <Link to="/reservations" className="hover:text-indigo-300 transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Réserver une table</Link>
                    {isAuthenticated && (
                        <Link to="/my-reservations" className="hover:text-indigo-300 transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Mes réservations</Link>
                    )}
                    <Link to="/boardgames" className="hover:text-indigo-300 transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Jeux de société</Link>
                    <Link to="/tournaments" className="hover:text-indigo-300 transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Tournois</Link>
                    {isAuthenticated && isAdmin && (
                        <Link to="/admin" className="hover:text-indigo-300 text-indigo-200 font-bold transition py-2 border-b border-indigo-900/50" onClick={closeMenu}>Admin</Link>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => { handleLogout(); closeMenu(); }}
                                className="w-full text-center text-sm font-medium bg-red-500 hover:bg-red-400 px-4 py-3 rounded-xl transition shadow-md cursor-pointer"
                            >
                                Déconnexion
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="flex-1 text-center py-3 text-sm font-medium border border-indigo-650 hover:bg-indigo-900/40 rounded-xl transition" onClick={closeMenu}>
                                    Connexion
                                </Link>
                                <Link to="/register" className="flex-1 text-center py-3 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md" onClick={closeMenu}>
                                    Inscription
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Langue</span>
                            <select
                                value={currentLanguage}
                                onChange={handleLanguageChange}
                                className="text-sm bg-indigo-850 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition font-mono text-white border border-indigo-600 outline-none"
                            >
                                {languages.map((language) => (
                                    <option key={language.code} value={language.code} className="text-black">
                                        {language.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
export default Header;