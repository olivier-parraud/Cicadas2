// components/Header.jsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
];

function Header() {
    const { i18n } = useTranslation();
    const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'fr').slice(0, 2);
    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
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
                    <Link to="/games" className="hover:text-indigo-300 transition">Nos Jeux</Link>
                </nav>

                <div className="flex gap-4 items-center">
                    <Link to="/login" className="text-sm font-medium hover:text-indigo-200 transition">Connexion</Link>
                    <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full transition shadow-md">Inscription</Link>
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