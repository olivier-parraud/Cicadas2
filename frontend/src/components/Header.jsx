// components/Header.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
];

function Header() {
    const { i18n, t } = useTranslation();
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

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header className="bg-black/90 backdrop-blur-md text-white shadow-lg border-b border-white/5 relative z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-brand transition" onClick={closeMenu}>
                    Cicados
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex gap-2 items-center font-medium">
                    <Link to="/" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.home')}</Link>
                    <Link to="/reservations" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/reservations') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.book_table')}</Link>
                    {isAuthenticated && (
                        <Link to="/my-reservations" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/my-reservations') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.my_reservations')}</Link>
                    )}
                    <Link to="/boardgames" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/boardgames') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.boardgames')}</Link>
                    <Link to="/tournaments" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/tournaments') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.tournaments')}</Link>
                    <Link to="/events" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/events') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.events')}</Link>
                    {isAuthenticated && isAdmin && (
                        <Link to="/admin" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/admin') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.admin')}</Link>
                    )}
                </nav>

                {/* Actions Desktop */}
                <div className="hidden md:flex gap-4 items-center">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium bg-red-650 hover:bg-red-500 text-white px-4 py-2 rounded-full transition shadow-md cursor-pointer"
                        >
                            {t('nav.logout')}
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium hover:text-[#F4AF23] transition">{t('nav.login')}</Link>
                            <Link to="/register" className="text-sm font-extrabold bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] px-5 py-2.5 rounded-full transition shadow-md shadow-amber-500/10">{t('nav.register')}</Link>
                        </>
                    )}
                    <select
                        value={currentLanguage}
                        onChange={handleLanguageChange}
                        className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition font-mono text-white border border-white/10 outline-none focus:ring-2 focus:ring-[#F4AF23]"
                        title={t('nav.language')}
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
                    {isMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Menu Déroulant Mobile */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 shadow-2xl backdrop-blur-lg flex flex-col p-6 space-y-3 animate-in slide-in-from-top duration-200">
                    <Link to="/" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.home')}</Link>
                    <Link to="/reservations" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/reservations') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.book_table')}</Link>
                    {isAuthenticated && (
                        <Link to="/my-reservations" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/my-reservations') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.my_reservations')}</Link>
                    )}
                    <Link to="/boardgames" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/boardgames') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.boardgames')}</Link>
                    <Link to="/tournaments" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/tournaments') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.tournaments')}</Link>
                    <Link to="/events" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/events') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.events')}</Link>
                    {isAuthenticated && isAdmin && (
                        <Link to="/admin" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/admin') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.admin')}</Link>
                    )}

                    <div className="flex flex-col gap-4 pt-4">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => { handleLogout(); closeMenu(); }}
                                className="w-full text-center text-sm font-medium bg-red-650 hover:bg-red-500 text-white px-4 py-3 rounded-xl transition shadow-md cursor-pointer"
                            >
                                {t('nav.logout')}
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="flex-1 text-center py-3 text-sm font-medium border border-white/10 hover:bg-white/5 rounded-xl transition" onClick={closeMenu}>
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register" className="flex-1 text-center py-3 text-sm font-extrabold bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] rounded-xl transition shadow-md shadow-amber-500/10" onClick={closeMenu}>
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t('nav.language')}</span>
                            <select
                                value={currentLanguage}
                                onChange={handleLanguageChange}
                                className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition font-mono text-white border border-white/10 outline-none"
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