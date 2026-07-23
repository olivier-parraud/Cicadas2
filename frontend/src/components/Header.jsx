// components/Header.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
];

function Header() {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation(); // Actualise le Header as une nouvelle route
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    // On vérifie si l'utilisateur est connecté (présence du token)
    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('user_role') === 'ADMIN';

    useEffect(() => {
        if (!isAuthenticated) {
            setUserProfile(null);
            setUnreadMessagesCount(0);
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5050/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserProfile(data.user);
                }
            } catch (err) {
                console.error("Erreur Header profil fetch :", err);
            }
        };

        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5050/api/messages/unread-count', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUnreadMessagesCount(data.unreadCount || 0);
                }
            } catch (err) {
                console.error("Erreur unread messages count :", err);
            }
        };

        fetchProfile();
        fetchUnreadCount();

        const handleStorageChange = () => {
            fetchProfile();
            fetchUnreadCount();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('messages_updated', fetchUnreadCount);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('messages_updated', fetchUnreadCount);
        };
    }, [isAuthenticated, location.pathname]);

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
                    <Link to="/about" className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-300 ${isActive('/about') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 shadow-sm shadow-[#F4AF23]/20 font-extrabold' : 'text-slate-200 border border-transparent hover:text-[#F4AF23] hover:bg-[#563D82]/25 hover:border-[#F4AF23]/30 font-medium'}`}>{t('nav.about')}</Link>
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
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/profile" 
                                className="relative w-10 h-10 rounded-full border border-white/10 hover:border-[#F4AF23]/50 hover:scale-105 transition-all flex items-center justify-center bg-[#0c0919]/60 shrink-0"
                                title={t('nav.profile')}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                                    {userProfile?.avatar_url ? (
                                        <img 
                                            src={userProfile.avatar_url} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-300" />
                                    )}
                                </div>

                                {unreadMessagesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-black shadow-md animate-bounce z-10">
                                        {unreadMessagesCount}
                                    </span>
                                )}
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="text-sm font-medium bg-red-650 hover:bg-red-500 text-white px-4 py-2 rounded-full transition shadow-md cursor-pointer"
                            >
                                {t('nav.logout')}
                            </button>
                        </div>
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
                    <Link to="/about" className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isActive('/about') ? 'text-[#F4AF23] bg-[#563D82]/40 border border-[#F4AF23]/40 font-extrabold' : 'text-slate-200 hover:text-[#F4AF23] hover:bg-[#563D82]/25 font-medium'}`} onClick={closeMenu}>{t('nav.about')}</Link>
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
                            <div className="flex items-center gap-3 pt-4">
                                <Link 
                                    to="/profile" 
                                    className="relative w-11 h-11 rounded-full border border-white/10 hover:border-[#F4AF23]/50 transition flex items-center justify-center bg-[#0c0919]/60 shrink-0"
                                    onClick={closeMenu}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                                        {userProfile?.avatar_url ? (
                                            <img 
                                                src={userProfile.avatar_url} 
                                                alt="Avatar" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-300" />
                                        )}
                                    </div>
                                    {unreadMessagesCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-black shadow-md animate-bounce z-10">
                                            {unreadMessagesCount}
                                        </span>
                                    )}
                                </Link>
                                <button 
                                    onClick={() => { handleLogout(); closeMenu(); }}
                                    className="flex-1 text-center text-sm font-medium bg-red-650 hover:bg-red-500 text-white py-3 rounded-xl transition shadow-md cursor-pointer"
                                >
                                    {t('nav.logout')}
                                </button>
                            </div>
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