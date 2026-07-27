import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Award, 
    Sparkles, 
    MapPin, 
    Clock, 
    ShoppingBag, 
    Dices, 
    Trophy, 
    Heart, 
    CheckCircle2, 
    ArrowRight,
    Coffee
} from 'lucide-react';

function About() {
    const { t } = useTranslation();

    const tcgPartners = [
        { name: 'Magic: The Gathering', publisher: 'Wizards of the Coast (WPN)', color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300' },
        { name: 'Pokémon TCG', publisher: 'The Pokémon Company (Play!)', color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/40 text-yellow-300' },
        { name: 'Disney Lorcana', publisher: 'Ravensburger Hobby Store', color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300' },
        { name: 'Yu-Gi-Oh!', publisher: 'Konami (Official Tournament Store)', color: 'from-red-500/20 to-rose-600/20 border-red-500/40 text-red-300' },
        { name: 'Riftbound TCG', publisher: 'Riot Games Official Store', color: 'from-violet-500/20 to-purple-600/20 border-purple-500/40 text-purple-300' },
    ];

    return (
        <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
            
            {/* HERO SECTION */}
            <section className="relative text-center space-y-6 pt-4 pb-8 overflow-hidden">
                {/* Ambient background glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#563D82]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#F4AF23]/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#563D82]/40 border border-[#F4AF23]/40 text-[#F4AF23] text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#563D82]/20">
                    <Sparkles className="w-3.5 h-3.5" /> À Propos de Cicados
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                    Le premier Café-Boutique de <span className="bg-gradient-to-r from-[#F4AF23] via-amber-300 to-amber-500 bg-clip-text text-transparent">Jeux de Société & TCG</span> à Paris
                </h1>

                <p className="text-slate-300 text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed">
                    Cicados est né d'une ambition passionnée : créer un espace de vie hybride, moderne et chaleureux au cœur de Paris, où passionnés de jeux de cartes à collectionner, amateurs de jeux de plateau et curieux se retrouvent pour jouer, échanger et partager des moments inoubliables.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                    <Link
                        to="/reservations"
                        className="py-3.5 px-7 rounded-2xl text-sm font-extrabold bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                    >
                        Réserver une table <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/tournaments"
                        className="py-3.5 px-7 rounded-2xl text-sm font-extrabold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                        <Trophy className="w-4 h-4 text-[#F4AF23]" /> Calendrier des tournois
                    </Link>
                </div>
            </section>

            {/* SECTIONS GRID: AMBITION & VALEURS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 space-y-4 backdrop-blur-md hover:border-[#F4AF23]/40 transition-all duration-300 shadow-xl group">
                    <div className="w-12 h-12 rounded-2xl bg-[#563D82]/40 border border-[#F4AF23]/30 flex items-center justify-center text-[#F4AF23] group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white">Un Lieu de Conviction & Passion</h3>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                        Conçu par des passionnés pour la communauté, Cicados offre des espaces confortables avec des tables modulables adaptées aussi bien aux duels TCG qu'aux jeux de plateau XXL.
                    </p>
                </div>

                <div className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 space-y-4 backdrop-blur-md hover:border-[#F4AF23]/40 transition-all duration-300 shadow-xl group">
                    <div className="w-12 h-12 rounded-2xl bg-[#563D82]/40 border border-[#F4AF23]/30 flex items-center justify-center text-[#F4AF23] group-hover:scale-110 transition-transform">
                        <Coffee className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white">Café & Convivialité</h3>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                        Accompagnez vos sessions de jeu d'une sélection de boissons artisanales fraîches ou chaudes, ainsi que de snacks gourmands préparés pour alimenter vos meilleures stratégies.
                    </p>
                </div>

                <div className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 space-y-4 backdrop-blur-md hover:border-[#F4AF23]/40 transition-all duration-300 shadow-xl group">
                    <div className="w-12 h-12 rounded-2xl bg-[#563D82]/40 border border-[#F4AF23]/30 flex items-center justify-center text-[#F4AF23] group-hover:scale-110 transition-transform">
                        <Dices className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-white">Ludothèque en Libre Accès</h3>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                        Une collection riche de centaines de jeux de société modernes récents ou incontournables (Stratégie, Ambiance, Famille, Pose de tuiles) disponible dès votre installation à table.
                    </p>
                </div>
            </section>

            {/* BOUTIQUE ASSERMENTÉE OFFICIELLE TCG */}
            <section className="bg-gradient-to-br from-[#181232] via-[#130f25] to-[#0c0919] border border-[#F4AF23]/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4AF23]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" /> Boutique Officiellement Assermentée & Agréée
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                            Organisateur Officiel de Tournois TCG Homologués
                        </h2>
                        <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">
                            Cicados bénéficie des accréditations officielles délivrées par les plus grands éditeurs mondiaux de cartes à collectionner. Nous organisons chaque semaine des compétitions homologuées, des avant-premières et des événements officiels.
                        </p>
                    </div>

                    <div className="shrink-0 bg-[#563D82]/40 border border-[#F4AF23]/40 p-4 rounded-2xl flex items-center gap-4 text-center">
                        <Award className="w-10 h-10 text-[#F4AF23] shrink-0" />
                        <div className="text-left">
                            <div className="text-xs font-bold text-slate-300">Dotations Officielles</div>
                            <div className="text-sm font-extrabold text-[#F4AF23]">Boosters Promos & OTS</div>
                        </div>
                    </div>
                </div>

                {/* Partners Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tcgPartners.map((partner, idx) => (
                        <div 
                            key={idx} 
                            className={`p-4 rounded-2xl bg-gradient-to-br ${partner.color} border backdrop-blur-sm space-y-1.5 flex flex-col justify-between hover:scale-105 transition-transform duration-300 shadow-lg`}
                        >
                            <div className="font-black text-sm text-white flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#F4AF23]" />
                                {partner.name}
                            </div>
                            <div className="text-[11px] font-medium text-slate-300">
                                {partner.publisher}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 font-light flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#F4AF23] shrink-0" />
                        <span>
                            Chaque participant aux tournois officiels reçoit les cartes promos officielles des éditeurs, accumule des points de classement de ligue et tente de décrocher les lots exclusifs réservés aux meilleurs duellistes.
                        </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#563D82]/30 border border-[#F4AF23]/30 text-xs text-slate-200 font-light flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-[#F4AF23] shrink-0" />
                        <span>
                            <strong className="text-white font-extrabold">Vente Officielle de Boosters & Displays :</strong> Retrouvez en boutique physique les boosters, decks de démarrage, coffrets et displays officiels de nos partenaires (Magic, Pokémon, Lorcana, Yu-Gi-Oh!, Riftbound) !
                        </span>
                    </div>
                </div>
            </section>

            {/* ACHAT DES JEUX TESTÉS EN BOUTIQUE */}
            <section className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 backdrop-blur-md relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 uppercase tracking-wider inline-flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" /> Service Boutique Physique
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                            Testez en session, repartez avec votre coup de cœur !
                        </h2>
                        <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">
                            Vous avez adoré un jeu de société découvert lors de votre session sur nos tables ? Bonne nouvelle : <strong className="text-white font-semibold">l'intégralité des jeux proposés à l'essai ainsi que les boosters officiels TCG</strong> sont disponibles à l'achat immédiat dans notre boutique physique à la fin de votre partie !
                        </p>
                        <p className="text-amber-400/90 text-xs italic font-medium flex items-center gap-1.5">
                            * Remarque : Les ventes de boîtes de jeux, de boosters et d'accessoires de protection s'effectuent exclusivement en boutique physique sur place.
                        </p>
                    </div>

                    <Link
                        to="/boardgames"
                        className="py-3.5 px-6 rounded-2xl text-xs font-extrabold bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 hover:bg-[#684b9c] transition-all duration-300 shadow-lg shadow-[#563D82]/40 shrink-0 text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Dices className="w-4 h-4" /> Explorer le catalogue de jeux
                    </Link>
                </div>
            </section>

            {/* LIEUX ET HORAIRES D'OUVERTURE */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Carte Horaires */}
                <div className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 space-y-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                            <Clock className="w-5 h-5 text-[#F4AF23]" /> Horaires d'Ouverture
                        </h3>

                        <div className="space-y-4 text-xs md:text-sm text-slate-300 font-light">
                            <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-white">Lundi au Vendredi</div>
                                    <div className="text-slate-400 text-xs font-light">Après-midi & Soirées</div>
                                </div>
                                <div className="text-[#F4AF23] font-mono font-extrabold text-sm md:text-base">
                                    14:00 – 23:00
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-white">Samedi et Dimanche</div>
                                    <div className="text-slate-400 text-xs font-light">Week-end non-stop</div>
                                </div>
                                <div className="text-[#F4AF23] font-mono font-extrabold text-sm md:text-base">
                                    10:00 – 00:00
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-light italic border-t border-white/5 pt-4">
                        Réservation conseillée le week-end pour garantir votre table de jeu.
                    </div>
                </div>

                {/* Carte Localisation & Adresse */}
                <div className="bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 space-y-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                            <MapPin className="w-5 h-5 text-[#F4AF23]" /> Nous Trouver à Paris
                        </h3>

                        <div className="space-y-3 text-xs md:text-sm text-slate-300 font-light">
                            <div className="font-extrabold text-white text-base">Cicados Café-Boutique</div>
                            <p className="flex items-center gap-2 text-slate-200 font-medium">
                                <MapPin className="w-4 h-4 text-[#F4AF23] shrink-0" />
                                42 Rue du Cyber-Jeu, 75011 Paris
                            </p>
                            <p className="text-slate-400 text-xs">
                                Situé au cœur du 11ème arrondissement de Paris, accessible facilement en transports (Métro Oberkampf / République / Bastille).
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/reservations"
                            className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] transition text-center shadow-md cursor-pointer"
                        >
                            Réserver ma visite
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
