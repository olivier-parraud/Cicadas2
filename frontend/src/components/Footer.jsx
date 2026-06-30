// components/Footer.jsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-slate-950 text-slate-300 border-t-2 border-indigo-600 shadow-[0_-4px_20px_rgba(255,0,127,0.15)] py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm leading-relaxed">
                
                {/* Column 1: Brand Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-wider text-white">
                        Cicados
                    </h3>
                    <p className="font-light text-slate-400">
                        Votre café-boutique de jeux de société et TCG favori au cœur de Paris. Venez jouer, boire un verre et partager votre passion !
                    </p>
                    <div className="space-y-2 text-xs font-light text-slate-400">
                        <p>📍 42 Rue du Cyber-Jeu, 75011 Paris</p>
                        <p>✉️ contact@cicados.fr</p>
                        <p>📞 +33 1 42 42 42 42</p>
                    </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold uppercase tracking-wider text-indigo-300">
                        Navigation
                    </h3>
                    <nav className="flex flex-col gap-2.5 font-light">
                        <Link to="/" className="hover:text-indigo-300 transition-colors w-fit">Accueil</Link>
                        <Link to="/boardgames" className="hover:text-indigo-300 transition-colors w-fit">Jeux de société</Link>
                        <Link to="/reservations" className="hover:text-indigo-300 transition-colors w-fit">Réserver une table</Link>
                        <Link to="/tournaments" className="hover:text-indigo-300 transition-colors w-fit">Tournois</Link>
                    </nav>
                </div>

                {/* Column 3: Hours & Socials */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold uppercase tracking-wider text-indigo-300">
                        Horaires & Communauté
                    </h3>
                    <div className="text-xs space-y-2 font-light text-slate-400">
                        <p><span className="font-bold text-slate-300">Lundi - Vendredi :</span> 14:00 - 23:00</p>
                        <p><span className="font-bold text-slate-300">Samedi - Dimanche :</span> 10:00 - 00:00</p>
                    </div>
                    <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Rejoignez-nous</h4>
                        <div className="flex gap-4 items-center">
                            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 py-1.5 px-3.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 shadow-none">
                                💬 Discord
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 py-1.5 px-3.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 shadow-none">
                                📷 Instagram
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-900 mt-10 pt-6 text-center text-xs text-slate-500 font-light">
                <p>
                    {t('footer.copyright', { year: new Date().getFullYear() })} - Conçu pour les passionnés de jeux.
                </p>
            </div>
        </footer>
    );
}

export default Footer;