import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import TranslatedText from '../components/TranslatedText';

function Tournaments() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [tournaments, setTournaments] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Track which tournament's participants dropdown is open
    const [openParticipantsId, setOpenParticipantsId] = useState(null);

    const toggleParticipants = (id) => {
        setOpenParticipantsId(openParticipantsId === id ? null : id);
    };

    // Fetch user profile if logged in
    const fetchUserProfile = async () => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5050/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentUser(data.user);
                }
            } catch (error) {
                console.error("Erreur de récupération du profil :", error);
            }
        }
    };

    const getDisplayName = (user) => {
        if (!user) return '';
        if (user.pseudo) return user.pseudo;
        const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
        return fullName || user.email.split('@')[0];
    };

    // Fetch tournaments & user registrations
    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Load tournaments list
            const resTourneys = await fetch('http://localhost:5050/api/tournaments');
            if (resTourneys.ok) {
                const data = await resTourneys.json();
                setTournaments(data);
            }

            // Load logged in user's registrations
            if (isAuthenticated) {
                const token = localStorage.getItem('token');
                const resRegs = await fetch('http://localhost:5050/api/tournaments/my-registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resRegs.ok) {
                    const regIds = await resRegs.json();
                    setMyRegistrations(regIds);
                }
            }
        } catch (error) {
            console.error("Erreur de chargement des tournois :", error);
            toast.error(t('tournaments_page.err_conn'));
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchUserProfile();
    }, [isAuthenticated]);

    // Handle register / unregister click
    const handleAction = async (tourneyId, isRegistered) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setActionLoadingId(tourneyId);

        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5050/api/tournaments/${tourneyId}/register`;
            const method = isRegistered ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                const userDisplayName = getDisplayName(currentUser);

                // Update myRegistrations locally
                setMyRegistrations(prev => 
                    isRegistered 
                        ? prev.filter(id => id !== tourneyId) 
                        : [...prev, tourneyId]
                );

                // Update tournaments list locally to update count and participant list
                setTournaments(prevTournaments => 
                    prevTournaments.map(t => {
                        if (t.id === tourneyId) {
                            let updatedParticipants = t.participants ? [...t.participants] : [];
                            if (isRegistered) {
                                updatedParticipants = updatedParticipants.filter(p => p !== userDisplayName);
                            } else {
                                if (userDisplayName && !updatedParticipants.includes(userDisplayName)) {
                                    updatedParticipants.push(userDisplayName);
                                }
                            }
                            return {
                                ...t,
                                registeredCount: isRegistered 
                                    ? Math.max(0, t.registeredCount - 1) 
                                    : t.registeredCount + 1,
                                participants: updatedParticipants
                            };
                        }
                        return t;
                    })
                );

                toast.success(isRegistered ? t('tournaments_page.success_unregister') : t('tournaments_page.success_register'));
            } else {
                toast.error(data.error || t('my_reservations_page.load_tables_error'));
            }
        } catch (error) {
            toast.error(t('tournaments_page.err_conn'));
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter tournaments list
    const filteredTournaments = tournaments.filter(tourney => {
        if (filter === 'all') return true;
        const gameLower = tourney.game.toLowerCase();
        if (filter === 'mtg') return gameLower.includes('magic');
        if (filter === 'pokemon') return gameLower.includes('pokémon') || gameLower.includes('pokemon');
        if (filter === 'one_piece') return gameLower.includes('one piece');
        if (filter === 'yugioh') return gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh');
        if (filter === 'star_wars') return gameLower.includes('star wars');
        if (filter === 'lorcana') return gameLower.includes('lorcana');
        if (filter === 'final_ff') return gameLower.includes('final fantasy');
        if (filter === 'altered') return gameLower.includes('altered');
        if (filter === 'dbs') return gameLower.includes('dragon ball');
        return false;
    });

    const getGameColorClass = (game) => {
        const gameLower = game.toLowerCase();
        if (gameLower.includes('magic')) return 'bg-orange-50 text-orange-700 border-orange-200/50';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return 'bg-amber-50 text-amber-700 border-amber-200/50';
        if (gameLower.includes('one piece')) return 'bg-cyan-50 text-cyan-700 border-cyan-200/50';
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) return 'bg-rose-50 text-rose-700 border-rose-200/50';
        if (gameLower.includes('star wars')) return 'bg-blue-50 text-blue-700 border-blue-200/50';
        if (gameLower.includes('lorcana')) return 'bg-purple-50 text-purple-700 border-purple-200/50';
        if (gameLower.includes('final fantasy')) return 'bg-teal-50 text-teal-700 border-teal-200/50';
        if (gameLower.includes('altered')) return 'bg-indigo-50 text-indigo-700 border-indigo-200/50';
        if (gameLower.includes('dragon ball')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
        return 'bg-slate-50 text-slate-700 border-slate-200/50';
    };

    const getGameEmoji = (game) => {
        const gameLower = game.toLowerCase();
        if (gameLower.includes('magic')) return '🃏';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return '⚡';
        if (gameLower.includes('one piece')) return '🏴‍☠️';
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) return '🐉';
        if (gameLower.includes('star wars')) return '🚀';
        if (gameLower.includes('lorcana')) return '🏰';
        if (gameLower.includes('final fantasy')) return '💎';
        if (gameLower.includes('altered')) return '🔮';
        if (gameLower.includes('dragon ball')) return '💥';
        return '🎲';
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-600 selection:text-white pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white py-20 px-4 border-b border-indigo-900/50 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        🏆 {t('tournaments_page.badge')}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
                        {t('tournaments_page.title')}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        {t('tournaments_page.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-8">
                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${
                            filter === 'all' 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {t('tournaments_page.all_tournaments')}
                    </button>
                    {[
                        { id: 'pokemon', name: 'Pokémon' },
                        { id: 'mtg', name: 'Magic: The Gathering' },
                        { id: 'one_piece', name: 'One Piece' },
                        { id: 'yugioh', name: 'Yu-Gi-Oh!' },
                        { id: 'star_wars', name: 'Star Wars' },
                        { id: 'lorcana', name: 'Lorcana' },
                        { id: 'final_ff', name: 'Final Fantasy' },
                        { id: 'altered', name: 'Altered' },
                        { id: 'dbs', name: 'Dragon Ball' }
                    ].map(tcg => (
                        <button
                            key={tcg.id}
                            onClick={() => setFilter(tcg.id)}
                            className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${
                                filter === tcg.id 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tcg.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 text-sm">{t('tournaments_page.loading')}</p>
                    </div>
                ) : filteredTournaments.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200/60 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                        <span className="text-4xl">🏆</span>
                        <h3 className="text-lg font-bold text-slate-900">{t('tournaments_page.no_tourneys')}</h3>
                        <p className="text-slate-500 font-light text-sm">
                            {t('tournaments_page.no_tourneys_desc')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {filteredTournaments.map((tourney) => {
                            const isRegistered = myRegistrations.includes(tourney.id);
                            const isFull = tourney.registeredCount >= tourney.capacity;
                            const tourneyDate = new Date(tourney.date);

                            const formattedDate = tourneyDate.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            });
                            const formattedTime = tourneyDate.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                hour: '2-digit', 
                                minute: '2-digit'
                            });

                            return (
                                <div 
                                    key={tourney.id}
                                    className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative group"
                                >
                                    <div className="space-y-4">
                                        {/* Game badge & price */}
                                        <div className="flex justify-between items-center gap-4">
                                            <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold border ${getGameColorClass(tourney.game)}`}>
                                                {getGameEmoji(tourney.game)} {tourney.game}
                                            </span>
                                            <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 py-1.5 px-3.5 rounded-xl font-mono">
                                                {tourney.price === 0 || tourney.price === "0.00" ? t('tournaments_page.free') : `${Number(tourney.price).toFixed(2)}€`}
                                            </span>
                                        </div>

                                        {/* Tournament title */}
                                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {tourney.name}
                                        </h3>

                                        {/* Date and details */}
                                        <div className="space-y-2 text-sm text-slate-600 font-light">
                                            <div className="flex items-center gap-2.5">
                                                <span>📅</span>
                                                <span className="capitalize">{formattedDate} à {formattedTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span>👥</span>
                                                <span>
                                                    {t('tournaments_page.capacity', { registered: tourney.registeredCount, capacity: tourney.capacity })}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed font-light pt-2">
                                            <TranslatedText text={tourney.description} toLang={i18n.resolvedLanguage || i18n.language || 'fr'} />
                                        </p>

                                        {/* Collapsible Registered Players List */}
                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                            <button 
                                                type="button"
                                                onClick={() => toggleParticipants(tourney.id)}
                                                className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                                            >
                                                <span>{t('tournaments_page.registered_list', { count: tourney.participants?.length || 0 })}</span>
                                                <span className={`transition-transform duration-200 transform ${openParticipantsId === tourney.id ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            
                                            {openParticipantsId === tourney.id && (
                                                <div className="mt-2 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/50 max-h-36 overflow-y-auto">
                                                    {tourney.participants && tourney.participants.length > 0 ? (
                                                        tourney.participants.map((pName, index) => (
                                                            <div key={index} className="text-xs text-slate-700 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                                <span>{pName}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-xs text-slate-400 italic">{t('tournaments_page.no_registered')}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                                        {!isAuthenticated ? (
                                            <Link 
                                                to="/login"
                                                className="w-full text-center py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition duration-300"
                                            >
                                                {t('tournaments_page.login_required')}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(tourney.id, isRegistered)}
                                                disabled={actionLoadingId === tourney.id || (!isRegistered && isFull)}
                                                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                                                    isRegistered 
                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100/80 border border-red-200' 
                                                        : isFull 
                                                            ? 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed' 
                                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                                                }`}
                                            >
                                                {actionLoadingId === tourney.id ? (
                                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                ) : isRegistered ? (
                                                    t('tournaments_page.unregister')
                                                ) : isFull ? (
                                                    t('tournaments_page.full')
                                                ) : (
                                                    t('tournaments_page.register')
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tournaments;
