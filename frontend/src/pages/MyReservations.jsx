import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyReservations() {
    const isAuthenticated = !!localStorage.getItem('token');

    // Reservations state
    const [reservations, setReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [reservationsError, setReservationsError] = useState('');

    // Tournaments state
    const [tournaments, setTournaments] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [tournamentsError, setTournamentsError] = useState('');

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
                setReservationsError('Impossible de charger vos réservations.');
            }
        } catch (err) {
            console.error(err);
            setReservationsError('Erreur de connexion pour les réservations.');
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
                setTournamentsError('Impossible de charger vos inscriptions aux tournois.');
            }
        } catch (err) {
            console.error(err);
            setTournamentsError('Erreur de connexion pour les tournois.');
        } finally {
            setLoadingTournaments(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserReservations();
            fetchUserTournaments();
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
        if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

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
                alert("Une erreur s'est produite lors de l'annulation.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion avec le serveur.");
        }
    };

    const handleUnregisterTournament = async (tournamentId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir vous désinscrire de ce tournoi ?')) return;

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
                alert("Une erreur s'est produite lors de la désinscription.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion avec le serveur.");
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
                setEditSuccess('Réservation modifiée avec succès !');
                setTimeout(() => {
                    setEditingReservation(null);
                    fetchUserReservations();
                }, 1000);
            } else {
                setEditError(data.error || 'Erreur lors de la modification.');
            }
        } catch (err) {
            console.error(err);
            setEditError('Impossible de contacter le serveur.');
        }
    };

    const getGameTypeName = (type) => {
        switch (type) {
            case 'MTG': return 'Magic: The Gathering';
            case 'YUGIOH': return 'Yu-Gi-Oh!';
            case 'POKEMON': return 'Pokémon TCG';
            case 'LORCANA': return 'Disney Lorcana';
            case 'BOARD_GAME': return 'Jeux de plateau';
            case 'BYOG': return "J'apporte mon jeu";
            default: return 'Autre';
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
                return 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=600';
            case 'YUGIOH':
                return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600';
            case 'POKEMON':
                return 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=600';
            case 'LORCANA':
                return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600';
            case 'BYOG':
                return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600';
            default:
                return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600';
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
                    <h2 className="text-2xl font-bold text-slate-900">Connexion requise</h2>
                    <p className="text-slate-500 font-light text-sm">
                        Vous devez être connecté à votre compte Cicados pour consulter vos réservations et inscriptions.
                    </p>
                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-md w-full block text-xs">
                        Se connecter
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
                        📋 Votre agenda Cicados
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">Mes Activités</h1>
                    <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto font-light">
                        Retrouvez ici vos tables réservées et vos tournois à venir. Modifiez vos créneaux ou désinscrivez-vous en un clic.
                    </p>
                </div>

                {/* Section Réservations de table */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>🪑</span> Mes réservations de tables
                    </h2>

                    {reservationsError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-800 text-sm font-semibold text-center">
                            {reservationsError}
                        </div>
                    )}

                    {loadingReservations ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400">Chargement de vos tables...</p>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-md mx-auto p-6 space-y-4">
                            <span className="text-4xl">🗓️</span>
                            <h3 className="text-sm font-bold text-slate-900">Aucune table réservée</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Vous n'avez pas de table réservée pour le moment.
                            </p>
                            <Link to="/reservations" className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs">
                                Réserver une table
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reservations.map((res) => {
                                const startTimeLocal = new Date(res.start_time);
                                const formattedDate = startTimeLocal.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const formattedTime = startTimeLocal.toLocaleTimeString('fr-FR', {
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
                                                    <span>Arrivée à <strong>{formattedTime}</strong> ({res.end_time ? 'durée ' + Math.round((new Date(res.end_time) - new Date(res.start_time)) / (1000 * 60 * 60)) + 'h' : ''})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>👥</span>
                                                    <span>{res.players_count} joueurs</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-50 flex gap-3">
                                            <button
                                                onClick={() => openEditModal(res)}
                                                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-xl text-xs transition cursor-pointer"
                                            >
                                                ✏️ Modifier
                                            </button>
                                            <button
                                                onClick={() => handleCancel(res.id)}
                                                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-150 rounded-xl text-xs transition cursor-pointer"
                                            >
                                                ❌ Annuler
                                            </button>
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
                        <span>🏆</span> Mes inscriptions aux tournois
                    </h2>

                    {tournamentsError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-250 text-rose-800 text-sm font-semibold text-center">
                            {tournamentsError}
                        </div>
                    )}

                    {loadingTournaments ? (
                        <div className="py-10 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400">Chargement de vos tournois...</p>
                        </div>
                    ) : tournaments.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-md max-w-md mx-auto p-6 space-y-4">
                            <span className="text-4xl">⚔️</span>
                            <h3 className="text-sm font-bold text-slate-900">Aucun tournoi planifié</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Vous n'êtes inscrit à aucun tournoi de cartes ou de jeux pour le moment.
                            </p>
                            <Link to="/tournaments" className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md w-full block text-xs">
                                Voir les tournois
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tournaments.map((t) => {
                                const tournamentDate = new Date(t.date);
                                const formattedDate = tournamentDate.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                const formattedTime = tournamentDate.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div key={t.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between">
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                        {t.game}
                                                    </span>
                                                    <h3 className="text-base font-extrabold text-slate-950 mt-1">
                                                        {t.name}
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-xl border border-indigo-100">
                                                    {parseFloat(t.price) === 0 ? 'Gratuit' : `${t.price} €`}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                                                {t.description}
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
                                                    <span>{t.registeredCount} / {t.capacity} joueurs inscrits</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-50 flex">
                                            <button
                                                onClick={() => handleUnregisterTournament(t.id)}
                                                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-150 rounded-xl text-xs transition cursor-pointer"
                                            >
                                                ❌ Se désinscrire du tournoi
                                            </button>
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
                                <span>✏️</span> Modifier la réservation
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
                                <label className="text-xs font-bold text-slate-500 uppercase">Jeu / TCG</label>
                                <select
                                    name="gameType"
                                    value={editFormData.gameType}
                                    onChange={handleEditChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                >
                                    <option value="MTG">Magic: The Gathering</option>
                                    <option value="YUGIOH">Yu-Gi-Oh!</option>
                                    <option value="POKEMON">Pokémon TCG</option>
                                    <option value="LORCANA">Disney Lorcana</option>
                                    <option value="BOARD_GAME">Jeu de société</option>
                                    <option value="BYOG">J'apporte mon jeu</option>
                                    <option value="OTHER">Autre</option>
                                </select>
                            </div>

                            {editFormData.gameType === 'BOARD_GAME' && (
                                <div className="space-y-1 relative">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Jeu de société</label>
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
                                                        Aucun jeu trouvé (vous pouvez écrire le nom manuellement)
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                             <div className="space-y-1">
                                 <label className="text-xs font-bold text-slate-500 uppercase">Nombre de joueurs</label>
                                 <select
                                     name="playersCount"
                                     value={editFormData.playersCount}
                                     onChange={handleEditChange}
                                     className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                 >
                                     <option value="1">1 joueur</option>
                                     <option value="2">2 joueurs</option>
                                     <option value="3">3 joueurs</option>
                                     <option value="4">4 joueurs</option>
                                     <option value="5">5 joueurs</option>
                                     <option value="6">6 joueurs</option>
                                     <option value="7">7 joueurs</option>
                                     <option value="8">8+ joueurs</option>
                                 </select>
                             </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
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
                                <label className="text-xs font-bold text-slate-500 uppercase">Durée (heures)</label>
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
                                <button
                                    type="button"
                                    onClick={() => setEditingReservation(null)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
                                >
                                    Fermer
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyReservations;
