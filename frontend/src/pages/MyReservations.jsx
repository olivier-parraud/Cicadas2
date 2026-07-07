import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TranslatedText from '../components/TranslatedText';
import Button from '../components/Button';

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
            case 'STAR_WARS': return 'Star Wars: Unlimited';
            case 'LORCANA': return 'Disney Lorcana';
            case 'FINAL_FF': return 'Final Fantasy TCG';
            case 'ALTERED': return 'Altered';
            case 'DBS': return 'Dragon Ball Super Card Game';
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
            case 'STAR_WARS':
                return '/images/TCG/Star-Wars.jpeg';
            case 'LORCANA':
                return '/images/TCG/Lorcana.webp';
            case 'FINAL_FF':
                return '/images/TCG/FF-logo.png';
            case 'ALTERED':
                return '/images/TCG/altered-logo.webp';
            case 'DBS':
                return '/images/TCG/Dragon-ball.jpeg';
            case 'BYOG':
                return '/images/TCG/Magic.jpg';
            default:
                return '/images/TCG/Magic.jpg';
        }
    };

    const formatRoomName = (roomName, gameType) => {
        if (!roomName) return 'Table Standard';

        const match = roomName.match(/Table\s+\d+/i);
        const prefix = match ? match[0] : roomName;

        const isTcg = ['MTG', 'YUGIOH', 'POKEMON', 'LORCANA'].includes(gameType);
        if (isTcg) {
            return `${prefix} (TCG)`;
        } else if (gameType === 'BOARD_GAME') {
            return `${prefix} (Jeux de société)`;
        }
        return roomName;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
                    <div className="text-5xl">🔒</div>
                    <h2 className="text-2xl font-bold text-slate-900">{t('my_reservations_page.need_auth')}</h2>
                    <p className="text-slate-500 font-light text-sm">
                        {t('my_reservations_page.need_auth_desc')}
                    </p>
                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-md w-full block text-xs">
                        {t('my_reservations_page.login_btn')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-600 selection:text-white">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {t('my_reservations_page.badge')}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">{t('my_reservations_page.title')}</h1>
                    <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto font-light">
                        {t('my_reservations_page.subtitle')}
                    </p>
                </div>

                {/* Section Réservations de table */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>🪑</span> {t('my_reservations_page.tables_title')}
                    </h2>

                    {reservationsError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-800 text-sm font-semibold text-center">
                            {reservationsError}
                        </div>
                    )}

                    {loadingReservations ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400">{t('my_reservations_page.loading_tables')}</p>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-md mx-auto p-6 space-y-4">
                            <span className="text-4xl">🗓️</span>
                            <h3 className="text-sm font-bold text-slate-900">{t('my_reservations_page.no_tables')}</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                {t('my_reservations_page.no_tables_desc')}
                            </p>
                            <Link to="/reservations" className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs">
                                {t('my_reservations_page.book_table_btn')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reservations.map((res) => {
                                const startTimeLocal = new Date(res.start_time);
                                const formattedDate = startTimeLocal.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const formattedTime = startTimeLocal.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div key={res.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between">
                                        <div>
                                            <div className="h-32 w-full overflow-hidden relative">
                                                <img
                                                    src={res.boardgame_image_url || getGameImage(res.game_type, res.specific_game)}
                                                    alt={res.specific_game || res.game_type}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                            {getGameTypeName(res.game_type)}
                                                        </span>
                                                        {res.specific_game && (
                                                            <h3 className="text-base font-extrabold text-slate-950 mt-1">
                                                                {res.specific_game}
                                                            </h3>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold bg-slate-50 border border-slate-150 py-1.5 px-3 rounded-xl flex items-center gap-1.5 text-slate-700">
                                                        🪑 {formatRoomName(res.room_name, res.game_type)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-medium text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <span>📆</span>
                                                        <span className="capitalize">{formattedDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span>⏱️</span>
                                                        <span>
                                                            {t('my_reservations_page.duration_hours', {
                                                                time: formattedTime,
                                                                duration: res.end_time ? Math.round((new Date(res.end_time) - new Date(res.start_time)) / (1000 * 60 * 60)) : 2
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span>👥</span>
                                                        <span>{t('reservations_page.players', { count: res.players_count })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-50 flex gap-3">
                                            <Button
                                                variant="secondary"
                                                onClick={() => openEditModal(res)}
                                                className="flex-1 py-2.5"
                                            >
                                                {t('my_reservations_page.edit_btn')}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleCancel(res.id)}
                                                className="flex-1 py-2.5"
                                            >
                                                {t('my_reservations_page.cancel_btn')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section Inscriptions aux tournois */}
                <div className="space-y-6 pt-6 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>🏆</span> {t('my_reservations_page.tournaments_title')}
                    </h2>

                    {tournamentsError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-800 text-sm font-semibold text-center">
                            {tournamentsError}
                        </div>
                    )}

                    {loadingTournaments ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400">{t('my_reservations_page.loading_tourneys')}</p>
                        </div>
                    ) : tournaments.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-md mx-auto p-6 space-y-4">
                            <span className="text-4xl">⚔️</span>
                            <h3 className="text-sm font-bold text-slate-900">{t('my_reservations_page.no_tourneys')}</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                {t('my_reservations_page.no_tourneys_desc')}
                            </p>
                            <Link to="/tournaments" className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs">
                                {t('my_reservations_page.view_tourneys_btn')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tournaments.map((tItem) => {
                                const tournamentDate = new Date(tItem.date);
                                const formattedDate = tournamentDate.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const formattedTime = tournamentDate.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div key={tItem.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between">
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                        {tItem.game}
                                                    </span>
                                                    <h3 className="text-base font-extrabold text-slate-950 mt-1">
                                                        {tItem.name}
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-xl border border-indigo-100">
                                                    {parseFloat(tItem.price) === 0 ? t('my_reservations_page.free_price') : `${tItem.price} €`}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                                                <TranslatedText text={tItem.description} toLang={i18n.resolvedLanguage || i18n.language || 'fr'} />
                                            </p>

                                            <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-medium text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <span>📆</span>
                                                    <span className="capitalize">{formattedDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>⏱️</span>
                                                    <span>Début à <strong>{formattedTime}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>👥</span>
                                                    <span>{t('tournaments_page.capacity', { registered: tItem.registeredCount, capacity: tItem.capacity })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-50 flex">
                                            <Button
                                                variant="danger"
                                                onClick={() => handleUnregisterTournament(tItem.id)}
                                                className="w-full py-2.5"
                                            >
                                                {t('my_reservations_page.unregister_tourney_btn')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section Inscriptions aux événements */}
                <div className="space-y-6 pt-6 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>📅</span> {t('my_reservations_page.events_title', 'Mes Événements')}
                    </h2>

                    {eventsError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-800 text-sm font-semibold text-center">
                            {eventsError}
                        </div>
                    )}

                    {loadingEvents ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400">{t('my_reservations_page.loading_events', 'Chargement de vos événements...')}</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-md mx-auto p-6 space-y-4">
                            <span className="text-4xl">📆</span>
                            <h3 className="text-sm font-bold text-slate-900">{t('my_reservations_page.no_events', 'Aucun événement rejoint')}</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                {t('my_reservations_page.no_events_desc', 'Vous n\'êtes inscrit à aucun événement pour le moment.')}
                            </p>
                            <Link to="/events" className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs">
                                {t('my_reservations_page.view_events_btn', 'Voir l\'agenda des événements')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((eItem) => {
                                const eventDate = new Date(eItem.date);
                                const formattedDate = eventDate.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const formattedTime = eventDate.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                const typeNames = {
                                    avant_premiere: t('events_page.prerelease', 'Avant-première'),
                                    draft: t('events_page.draft', 'Draft'),
                                    initiation: t('events_page.initiation', 'Initiation')
                                };

                                return (
                                    <div key={eItem.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between">
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                            {eItem.game}
                                                        </span>
                                                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                            {typeNames[eItem.type] || eItem.type}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-extrabold text-slate-950 mt-2.5">
                                                        {eItem.name}
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-xl border border-indigo-100">
                                                    {parseFloat(eItem.price) === 0 ? t('my_reservations_page.free_price', 'Gratuit') : `${eItem.price} €`}
                                                </span>
                                            </div>

                                            {eItem.description && (
                                                <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                                                    {eItem.description}
                                                </p>
                                            )}

                                            <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-medium text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <span>📆</span>
                                                    <span className="capitalize">{formattedDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>⏱️</span>
                                                    <span>Début à <strong>{formattedTime}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>👥</span>
                                                    <span>{t('tournaments_page.capacity', { registered: eItem.registeredCount, capacity: eItem.capacity })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-50 flex">
                                            <Button
                                                variant="danger"
                                                onClick={() => handleUnregisterEvent(eItem.id)}
                                                className="w-full py-2.5"
                                            >
                                                {t('my_reservations_page.unregister_event_btn', 'Se désinscrire')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Modal d'édition */}
            {editingReservation && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 space-y-6 p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>✏️</span> {t('my_reservations_page.modal_edit_title')}
                            </h2>
                            <button
                                onClick={() => setEditingReservation(null)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {editError && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                                    {editError}
                                </div>
                            )}

                            {editSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold">
                                    {editSuccess}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.game_type_label')}</label>
                                <select
                                    name="gameType"
                                    value={editFormData.gameType}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                >
                                    <option value="POKEMON">Pokémon</option>
                                    <option value="MTG">Magic: The Gathering</option>
                                    <option value="ONE_PIECE">One Piece Card Game</option>
                                    <option value="YUGIOH">Yu-Gi-Oh!</option>
                                    <option value="STAR_WARS">Star Wars: Unlimited</option>
                                    <option value="LORCANA">Disney Lorcana</option>
                                    <option value="FINAL_FF">Final Fantasy TCG</option>
                                    <option value="ALTERED">Altered</option>
                                    <option value="DBS">Dragon Ball Super Card Game</option>
                                    <option value="BOARD_GAME">{t('my_reservations_page.board_game_type')}</option>
                                    <option value="BYOG">{t('reservations_page.byog_label')}</option>
                                    <option value="OTHER">{t('reservations_page.other_label')}</option>
                                </select>
                            </div>

                            {editFormData.gameType === 'BOARD_GAME' && (
                                <div className="space-y-1 relative">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.specific_game_label')}</label>
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
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light"
                                    />
                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                            <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 divide-y divide-slate-900">
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
                                                            className="w-full text-left px-4 py-2.5 text-xs text-slate-350 hover:bg-indigo-900/40 hover:text-white transition flex items-center gap-3 cursor-pointer"
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
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.players_count_label')}</label>
                                <select
                                    name="playersCount"
                                    value={editFormData.playersCount}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
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
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.date_label')}</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={today}
                                        value={editFormData.date}
                                        onChange={handleEditChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light bg-white"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.time_label')}</label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        min="09:00"
                                        max="23:00"
                                        value={editFormData.time}
                                        onChange={handleEditChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.duration_label')}</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    min="1"
                                    max="10"
                                    value={editFormData.duration}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light"
                                />
                            </div>

                            <div className="flex gap-3 pt-3">
                                <Button
                                    variant="secondary"
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
