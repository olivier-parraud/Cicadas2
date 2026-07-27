import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Trophy, Swords, Edit, X } from 'lucide-react';
import TranslatedText from '../components/TranslatedText';
import Button from '../components/Button';
import EventCard from '../components/EventCard';
import TournamentCard from '../components/TournamentCard';

function MyReservations() {
    const { t, i18n } = useTranslation();
    const isAuthenticated = !!localStorage.getItem('token');

    // Reservations state
    const [reservations, setReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [reservationsError, setReservationsError] = useState('');

    // Tournaments state
    const [tournaments, setTournaments] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [tournamentsError, setTournamentsError] = useState('');

    // Events state
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [eventsError, setEventsError] = useState('');

    // Modal states for editing table reservations
    const [editingReservation, setEditingReservation] = useState(null);
    const [editFormData, setEditFormData] = useState({
        gameType: 'MTG',
        date: '',
        time: '14:00',
        duration: '2',
        specificGame: '',
        playersCount: '2'
    });
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [boardGames, setBoardGames] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [openParticipantsId, setOpenParticipantsId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const toggleParticipants = (id) => {
        setOpenParticipantsId(openParticipantsId === id ? null : id);
    };

    const today = new Date().toISOString().split('T')[0];

    const fetchUserReservations = async () => {
        setLoadingReservations(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5050/api/reservations/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                setReservationsError(t('my_reservations_page.load_tables_error'));
            }
        } catch (err) {
            console.error(err);
            setReservationsError(t('my_reservations_page.err_conn'));
        } finally {
            setLoadingReservations(false);
        }
    };

    const fetchUserTournaments = async () => {
        setLoadingTournaments(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5050/api/tournaments/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTournaments(data);
            } else {
                setTournamentsError(t('my_reservations_page.load_tourneys_error'));
            }
        } catch (err) {
            console.error(err);
            setTournamentsError(t('my_reservations_page.err_conn'));
        } finally {
            setLoadingTournaments(false);
        }
    };

    const fetchUserEvents = async () => {
        setLoadingEvents(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5050/api/events/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                setEventsError(t('my_reservations_page.load_events_error', 'Impossible de charger vos événements.'));
            }
        } catch (err) {
            console.error(err);
            setEventsError(t('my_reservations_page.err_conn'));
        } finally {
            setLoadingEvents(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserReservations();
            fetchUserTournaments();
            fetchUserEvents();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchBoardGames = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/boardgames');
                if (response.ok) {
                    const data = await response.json();
                    setBoardGames(data);
                }
            } catch (err) {
                console.error("Erreur chargement jeux de société:", err);
            }
        };
        fetchBoardGames();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm(t('my_reservations_page.confirm_cancel'))) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5050/api/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setReservations(prev => prev.filter(res => res.id !== id));
            } else {
                alert(t('my_reservations_page.load_tables_error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('my_reservations_page.err_conn'));
        }
    };

    const handleUnregisterTournament = async (tournamentId) => {
        if (!window.confirm(t('my_reservations_page.confirm_unregister'))) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5050/api/tournaments/${tournamentId}/register`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setTournaments(prev => prev.filter(t => t.id !== tournamentId));
            } else {
                alert(t('my_reservations_page.load_tourneys_error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('my_reservations_page.err_conn'));
        }
    };

    const handleUnregisterEvent = async (eventId) => {
        if (!window.confirm(t('my_reservations_page.confirm_unregister_event', 'Voulez-vous vraiment vous désinscrire de cet événement ?'))) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5050/api/events/${eventId}/register`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                alert(t('my_reservations_page.load_events_error', 'Impossible de se désinscrire.'));
            }
        } catch (err) {
            console.error(err);
            alert(t('my_reservations_page.err_conn'));
        }
    };

    const openEditModal = (res) => {
        setEditingReservation(res);

        const startDateTime = new Date(res.start_time);

        const year = startDateTime.getFullYear();
        const month = String(startDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(startDateTime.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const hour = String(startDateTime.getHours()).padStart(2, '0');
        const minutes = String(startDateTime.getMinutes()).padStart(2, '0');
        const timeStr = `${hour}:${minutes}`;

        const endDateTime = new Date(res.end_time);
        const diffMs = endDateTime - startDateTime;
        const durationHours = Math.round(diffMs / (1000 * 60 * 60));

        setEditFormData({
            gameType: res.game_type,
            date: dateStr,
            time: timeStr,
            duration: String(durationHours),
            specificGame: res.specific_game || '',
            playersCount: String(res.players_count || 2)
        });
        setEditError('');
        setEditSuccess('');
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        setEditSuccess('');

        const selectedDateTime = new Date(`${editFormData.date} ${editFormData.time}:00`);
        if (selectedDateTime.getTime() < Date.now()) {
            setEditError(t('reservations_page.err_past_time', 'Impossible de réserver pour une date ou heure passée.'));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5050/api/reservations/${editingReservation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            const data = await response.json();

            if (response.ok) {
                setEditSuccess(t('my_reservations_page.edit_success'));
                setTimeout(() => {
                    setEditingReservation(null);
                    fetchUserReservations();
                }, 1000);
            } else {
                setEditError(data.error || t('my_reservations_page.load_tables_error'));
            }
        } catch (err) {
            console.error(err);
            setEditError(t('my_reservations_page.err_conn'));
        }
    };

    const getGameTypeName = (type) => {
        switch (type) {
            case 'POKEMON': return 'Pokémon';
            case 'MTG': return 'Magic: The Gathering';
            case 'ONE_PIECE': return 'One Piece Card Game';
            case 'YUGIOH': return 'Yu-Gi-Oh!';
            case 'LORCANA': return 'Disney Lorcana';
            case 'RIFTBOUND': return 'Riftbound TCG';
            case 'BOARD_GAME': return t('my_reservations_page.board_game_type');
            case 'BYOG': return t('my_reservations_page.byog_type');
            default: return t('my_reservations_page.other_type');
        }
    };

    const getGameImage = (type, specificGame) => {
        const gameLower = (specificGame || '').toLowerCase();
        if (type === 'BOARD_GAME') {
            if (gameLower.includes('catan')) {
                return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
            }
            if (gameLower.includes('azul')) {
                return 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600';
            }
            return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
        }

        switch (type) {
            case 'MTG':
                return '/images/TCG/Magic.jpg';
            case 'POKEMON':
                return '/images/TCG/Pokemon';
            case 'ONE_PIECE':
                return '/images/TCG/ONE-PIECE-LOGO.jpg';
            case 'YUGIOH':
                return '/images/TCG/Yugioh.png';
            case 'LORCANA':
                return '/images/TCG/Lorcana.webp';
            case 'RIFTBOUND':
                return '/images/TCG/Riftbound 2.webp';
            case 'BYOG':
                return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
            default:
                return '/images/TCG/Magic.jpg';
        }
    };

    const formatRoomName = (roomName, gameType) => {
        if (!roomName) return 'Table Standard';
        const match = roomName.match(/Table\s+\d+/i);
        return match ? match[0] : roomName;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#05040a] flex flex-col items-center justify-center p-4 selection:bg-[#F4AF23] selection:text-[#05040a]">
                <div className="bg-[#130f25]/45 p-8 rounded-3xl shadow-2xl border border-white/5 max-w-md w-full text-center space-y-6 backdrop-blur-md">
                    <div className="text-5xl">🔒</div>
                    <h2 className="text-2xl font-black text-white">{t('my_reservations_page.need_auth')}</h2>
                    <p className="text-slate-400 font-light text-sm">
                        {t('my_reservations_page.need_auth_desc')}
                    </p>
                    <Link to="/login" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-3 px-6 rounded-xl transition shadow-lg w-full block text-xs">
                        {t('my_reservations_page.login_btn')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05040a] text-white selection:bg-[#F4AF23] selection:text-[#05040a] pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#130f25] to-black text-white py-20 px-4 border-b border-white/5 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#563D82]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#F4AF23]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-[#F4AF23] leading-tight">
                        {t('my_reservations_page.title')}
                    </h1>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                        {t('my_reservations_page.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-12">

                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                            activeFilter === 'all'
                                ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                                : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                        }`}
                    >
                        {t('my_reservations_page.filter_all', 'Tout afficher')}
                    </button>
                    <button
                        onClick={() => setActiveFilter('tables')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                            activeFilter === 'tables'
                                ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                                : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                        }`}
                    >
                        {t('my_reservations_page.filter_tables', 'Réservations de tables')}
                    </button>
                    <button
                        onClick={() => setActiveFilter('tournaments')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                            activeFilter === 'tournaments'
                                ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                                : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                        }`}
                    >
                        {t('my_reservations_page.filter_tournaments', 'Tournois')}
                    </button>
                    <button
                        onClick={() => setActiveFilter('events')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                            activeFilter === 'events'
                                ? 'bg-[#563D82] border-[#F4AF23] text-white shadow-md shadow-[#F4AF23]/25'
                                : 'bg-[#151425]/45 border-[#F4AF23]/30 text-slate-300 hover:text-white hover:bg-[#1a1930] hover:border-[#F4AF23]/60'
                        }`}
                    >
                        {t('my_reservations_page.filter_events', 'Événements')}
                    </button>
                </div>

                {/* Section Réservations de table */}
                {(activeFilter === 'all' || activeFilter === 'tables') && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-[#F4AF23] shrink-0" /> {t('my_reservations_page.tables_title')}
                        </h2>

                        {reservationsError && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold text-center">
                                {reservationsError}
                            </div>
                        )}

                        {loadingReservations ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="w-8 h-8 border-4 border-[#F4AF23] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-slate-400">{t('my_reservations_page.loading_tables')}</p>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="py-12 text-center bg-[#130f25]/45 rounded-3xl border border-white/5 max-w-md mx-auto p-6 space-y-4 shadow-inner">
                                <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
                                <h3 className="text-sm font-bold text-white">{t('my_reservations_page.no_tables')}</h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                    {t('my_reservations_page.no_tables_desc')}
                                </p>
                                <Link to="/reservations" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs text-center">
                                    {t('my_reservations_page.book_table_btn')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reservations.map((res) => (
                                    <EventCard
                                        key={res.id}
                                        isReservation={true}
                                        reservation={res}
                                        onEditReservation={() => openEditModal(res)}
                                        onCancelReservation={() => handleCancel(res.id)}
                                        t={t}
                                        i18n={i18n}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Section Inscriptions aux tournois */}
                {(activeFilter === 'all' || activeFilter === 'tournaments') && (
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-[#F4AF23] shrink-0" /> {t('my_reservations_page.tournaments_title')}
                        </h2>

                        {tournamentsError && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold text-center">
                                {tournamentsError}
                            </div>
                        )}

                        {loadingTournaments ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="w-8 h-8 border-4 border-[#F4AF23] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-slate-400">{t('my_reservations_page.loading_tourneys')}</p>
                            </div>
                        ) : tournaments.length === 0 ? (
                            <div className="py-12 text-center bg-[#130f25]/45 rounded-3xl border border-white/5 max-w-md mx-auto p-6 space-y-4 shadow-inner">
                                <Swords className="w-12 h-12 text-slate-500 mx-auto" />
                                <h3 className="text-sm font-bold text-white">{t('my_reservations_page.no_tourneys')}</h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                    {t('my_reservations_page.no_tourneys_desc')}
                                </p>
                                <Link to="/tournaments" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs text-center">
                                    {t('my_reservations_page.view_tourneys_btn')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tournaments.map((tItem) => (
                                    <TournamentCard
                                        key={tItem.id}
                                        activity={tItem}
                                        isAuthenticated={isAuthenticated}
                                        isRegistered={true}
                                        actionLoading={false}
                                        isOpenParticipants={openParticipantsId === tItem.id}
                                        onToggleParticipants={() => toggleParticipants(tItem.id)}
                                        onAction={() => handleUnregisterTournament(tItem.id)}
                                        onLoginRedirect={() => {}}
                                        t={t}
                                        i18n={i18n}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Section Inscriptions aux événements */}
                {(activeFilter === 'all' || activeFilter === 'events') && (
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-[#F4AF23] shrink-0" /> {t('my_reservations_page.events_title', 'Mes Événements')}
                        </h2>

                        {eventsError && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold text-center">
                                {eventsError}
                            </div>
                        )}

                        {loadingEvents ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="w-8 h-8 border-4 border-[#F4AF23] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-slate-400">{t('my_reservations_page.loading_events', 'Chargement de vos événements...')}</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="py-12 text-center bg-[#130f25]/45 rounded-3xl border border-white/5 max-w-md mx-auto p-6 space-y-4 shadow-inner">
                                <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
                                <h3 className="text-sm font-bold text-white">{t('my_reservations_page.no_events', 'Aucun événement rejoint')}</h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                    {t('my_reservations_page.no_events_desc', 'Vous n\'êtes inscrit à aucun événement pour le moment.')}
                                </p>
                                <Link to="/events" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs text-center">
                                    {t('my_reservations_page.view_events_btn', 'Voir l\'agenda des événements')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((eItem) => (
                                    <EventCard
                                        key={eItem.id}
                                        event={eItem}
                                        isAuthenticated={isAuthenticated}
                                        isRegistered={true}
                                        actionLoading={false}
                                        isOpenParticipants={openParticipantsId === eItem.id}
                                        onToggleParticipants={() => toggleParticipants(eItem.id)}
                                        onAction={() => handleUnregisterEvent(eItem.id)}
                                        onLoginRedirect={() => {}}
                                        t={t}
                                        i18n={i18n}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Modal d'édition */}
            {editingReservation && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#130f25]/95 backdrop-blur-md text-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/5 space-y-6 p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-[#F4AF23] shrink-0" /> {t('my_reservations_page.modal_edit_title')}
                            </h2>
                            <button
                                onClick={() => setEditingReservation(null)}
                                className="text-slate-400 hover:text-white focus:outline-none transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {editError && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                                    {editError}
                                </div>
                            )}

                            {editSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                                    {editSuccess}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.game_type_label')}</label>
                                <select
                                    name="gameType"
                                    value={editFormData.gameType}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white"
                                >
                                    <option value="POKEMON">Pokémon</option>
                                    <option value="MTG">Magic: The Gathering</option>
                                    <option value="ONE_PIECE">One Piece Card Game</option>
                                    <option value="YUGIOH">Yu-Gi-Oh!</option>
                                    <option value="LORCANA">Disney Lorcana</option>
                                    <option value="RIFTBOUND">Riftbound TCG</option>
                                    <option value="BOARD_GAME">{t('my_reservations_page.board_game_type')}</option>
                                    <option value="BYOG">{t('reservations_page.byog_label')}</option>
                                    <option value="OTHER">{t('reservations_page.other_label')}</option>
                                </select>
                            </div>

                            {editFormData.gameType === 'BOARD_GAME' && (
                                <div className="space-y-1 relative">
                                    <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.specific_game_label')}</label>
                                    <input
                                        type="text"
                                        name="specificGame"
                                        placeholder="Ex: Catan, Azul..."
                                        value={editFormData.specificGame}
                                        onChange={(e) => {
                                            setEditFormData(prev => ({ ...prev, specificGame: e.target.value }));
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white placeholder-slate-500 font-light"
                                    />
                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                            <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-slate-950 border border-white/5 rounded-xl shadow-2xl z-50 divide-y divide-slate-900">
                                                {boardGames
                                                    .filter(g => g.name.toLowerCase().includes((editFormData.specificGame || '').toLowerCase()))
                                                    .map(game => (
                                                        <button
                                                            key={game.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditFormData(prev => ({
                                                                    ...prev,
                                                                    specificGame: game.name,
                                                                    playersCount: Math.max(parseInt(prev.playersCount, 10), game.min_players || 1).toString()
                                                                }));
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-xs text-slate-350 hover:bg-[#563D82]/40 hover:text-white transition flex items-center gap-3 cursor-pointer"
                                                        >
                                                            {game.image_url && (
                                                                <img
                                                                    src={game.image_url}
                                                                    alt={game.name}
                                                                    className="w-8 h-8 object-contain bg-white/10 rounded-md"
                                                                />
                                                            )}
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-200 text-sm">{game.name}</span>
                                                                <span className="text-[10px] text-slate-400 font-light">{game.category} • {game.min_players}-{game.max_players} pl.</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                }
                                                {boardGames.filter(g => g.name.toLowerCase().includes((editFormData.specificGame || '').toLowerCase())).length === 0 && (
                                                    <div className="p-4 text-xs text-slate-500 font-light text-center">
                                                        {t('reservations_page.no_game_found')}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.players_count_label')}</label>
                                <select
                                    name="playersCount"
                                    value={editFormData.playersCount}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white"
                                >
                                    <option value="1">{t('reservations_page.player')}</option>
                                    <option value="2">{t('reservations_page.players', { count: 2 })}</option>
                                    <option value="3">{t('reservations_page.players', { count: 3 })}</option>
                                    <option value="4">{t('reservations_page.players', { count: 4 })}</option>
                                    <option value="5">{t('reservations_page.players', { count: 5 })}</option>
                                    <option value="6">{t('reservations_page.players', { count: 6 })}</option>
                                    <option value="7">{t('reservations_page.players', { count: 7 })}</option>
                                    <option value="8">{t('reservations_page.players_8')}</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.date_label')}</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={today}
                                        value={editFormData.date}
                                        onChange={handleEditChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white font-light"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.time_label')}</label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        min="09:00"
                                        max="23:00"
                                        value={editFormData.time}
                                        onChange={handleEditChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white font-light"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">{t('reservations_page.duration_label')}</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    min="1"
                                    max="10"
                                    value={editFormData.duration}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-white font-light"
                                />
                            </div>

                            <div className="flex gap-3 pt-3">
                                <Button
                                    variant="secondary-dark"
                                    onClick={() => setEditingReservation(null)}
                                    className="flex-1 py-3"
                                >
                                    {t('my_reservations_page.modal_close')}
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-3"
                                >
                                    {t('my_reservations_page.modal_save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyReservations;
