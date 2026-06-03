// components/Header.jsx
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
    
    // On vérifie si l'utilisateur est connecté (présence du token)
    const isAuthenticated = !!localStorage.getItem('token');

    const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'fr').slice(0, 2);
    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="bg-indigo-900 text-white shadow-lg border-b border-indigo-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-wider hover:text-indigo-200 transition">
                    Cicados
                </Link>

                <nav className="hidden md:flex gap-8 items-center font-medium">
                    <Link to="/" className="hover:text-indigo-300 transition">Accueil</Link>
                    <Link to="/reservations" className="hover:text-indigo-300 transition">Réserver une table</Link>
                    
                    {/* Menu déroulant pour les jeux TCG */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-indigo-300 transition py-2">
                            Jeux de Cartes (TCG)
                            <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-xl py-2 hidden group-hover:block border border-gray-100 z-50 transition">
                            <Link to="/games/mtg" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Magic: The Gathering</Link>
                            <Link to="/games/yugioh" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Yu-Gi-Oh!</Link>
                            <Link to="/games/pokemon" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Pokémon TCG</Link>
                            <Link to="/games/lorcana" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Disney Lorcana</Link>
                            <Link to="/games/fab" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Flesh and Blood</Link>
                            <Link to="/games/starwars" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Star Wars: Unlimited</Link>
                        </div>
                    </div>
                </nav>

                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium bg-red-500 hover:bg-red-400 px-4 py-2 rounded-full transition shadow-md"
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
            </div>
        </header>
    );
}
export default Header;