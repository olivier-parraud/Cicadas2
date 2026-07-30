import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Calendar } from 'lucide-react';
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
        if (filter === 'lorcana') return gameLower.includes('lorcana');
        if (filter === 'riftbound') return gameLower.includes('riftbound');
        return false;
    });

    // Sort and group tournaments by month
    const groupedTournaments = (() => {
        const sorted = [...filteredTournaments].sort((a, b) => new Date(a.date) - new Date(b.date));
        const groups = {};
        sorted.forEach(tourney => {
            const d = new Date(tourney.date);
            const locale = i18n.resolvedLanguage || i18n.language || 'fr';
            const monthYear = d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
            const monthLabel = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            if (!groups[monthLabel]) {
                groups[monthLabel] = [];
            }
            groups[monthLabel].push(tourney);
        });
        return groups;
    })();

    return (
        <div className="min-h-screen text-white selection:bg-[#F4AF23] selection:text-[#05040a] pb-20">
            {/* Header Section delimited in a card with About page background */}
            <div className="max-w-7xl mx-auto pt-10 px-4 md:px-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#181232] via-[#130f25] to-[#0c0919] border border-[#F4AF23]/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-4 text-center">
                    {/* Ambient background glows like About page */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#563D82]/25 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#F4AF23]/15 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-[#F4AF23] leading-tight">
                            {t('tournaments_page.title')}
                        </h1>
                        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                            {t('tournaments_page.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${filter === 'all'
                            ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                            : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                            }`}
                    >
                        {t('tournaments_page.all_tournaments')}
                    </button>
                    {[
                        { id: 'pokemon', name: 'Pokémon' },
                        { id: 'mtg', name: 'Magic: The Gathering' },
                        { id: 'one_piece', name: 'One Piece' },
                        { id: 'yugioh', name: 'Yu-Gi-Oh!' },
                        { id: 'lorcana', name: 'Lorcana' },
                        { id: 'riftbound', name: 'Riftbound' }
                    ].map(tcg => (
                        <button
                            key={tcg.id}
                            onClick={() => setFilter(tcg.id)}
                            className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${filter === tcg.id
                                ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                                : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                                }`}
                        >
                            {tcg.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-400 text-sm">{t('tournaments_page.loading')}</p>
                    </div>
                ) : filteredTournaments.length === 0 ? (
                    <div className="bg-[#151425]/35 rounded-3xl border border-white/5 text-center max-w-xl mx-auto p-8 shadow-inner space-y-4">
                        <Trophy className="w-12 h-12 text-slate-500 mx-auto" />
                        <h3 className="text-lg font-bold text-white">{t('tournaments_page.no_tourneys')}</h3>
                        <p className="text-slate-400 font-light text-sm">
                            {t('tournaments_page.no_tourneys_desc')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(groupedTournaments).map(([monthLabel, tourneysInMonth]) => (
                            <div key={monthLabel} className="space-y-6">
                                {/* Month Header */}
                                <div className="flex items-center gap-3 border-b border-[#F4AF23]/30 pb-3">
                                    <div className="w-3 h-3 rounded-full bg-[#F4AF23] shadow-md shadow-[#F4AF23]/50"></div>
                                    <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#F4AF23]" />
                                        <span>{monthLabel}</span>
                                    </h2>
                                    <span className="text-xs px-3 py-1 rounded-full bg-[#563D82]/40 text-[#FFE082] border border-[#F4AF23]/30 font-bold ml-auto">
                                        {tourneysInMonth.length} {tourneysInMonth.length > 1 ? 'tournois' : 'tournoi'}
                                    </span>
                                </div>

                                {/* Cards Grid for this month */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                                    {tourneysInMonth.map((tourney) => (
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
                                            theme="dark"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tournaments;
