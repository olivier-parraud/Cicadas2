import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import TournamentCard from '../components/TournamentCard';
import EventCard from '../components/EventCard';

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

    // Helper color/emoji functions moved to TournamentCard component

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
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${filter === 'all'
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
                            className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${filter === tcg.id
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
                        {filteredTournaments.map((tourney) => (
                            <TournamentCard
                                key={tourney.id}
                                activity={tourney}
                                isAuthenticated={isAuthenticated}
                                isRegistered={myRegistrations.includes(tourney.id)}
                                actionLoading={actionLoadingId === tourney.id}
                                isOpenParticipants={openParticipantsId === tourney.id}
                                onToggleParticipants={() => toggleParticipants(tourney.id)}
                                onAction={() => handleAction(tourney.id, myRegistrations.includes(tourney.id))}
                                onLoginRedirect={() => navigate('/login')}
                                t={t}
                                i18n={i18n}
                                theme="light"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tournaments;
