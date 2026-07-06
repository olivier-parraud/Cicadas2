import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardAdmin() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [activeTab, setActiveTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [boardGames, setBoardGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Tournament Form state
    const [tourneyForm, setTourneyForm] = useState({
        name: '',
        game: 'Magic: The Gathering',
        date: '',
        time: '19:30',
        capacity: 16,
        price: 5.00,
        description: ''
    });

    // Board Game Form state
    const [bgForm, setBgForm] = useState({
        name: '',
        category: 'Stratégie',
        min_players: 2,
        max_players: 4,
        play_time: 45,
        description: '',
        image_url: '',
        rules_url: ''
    });

    // Check if user is Admin on mount
    useEffect(() => {
        const verifyAdmin = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await fetch('http://localhost:5050/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user.role !== 'ADMIN') {
                        navigate('/'); // Non-admin redirected to home
                    } else {
                        // User is admin, fetch data
                        fetchAdminData();
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Erreur de vérification admin :", error);
                navigate('/login');
            }
        };

        verifyAdmin();
    }, [token]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // Fetch reservations
            const resRes = await fetch('http://localhost:5050/api/admin/reservations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resRes.ok) {
                const data = await resRes.json();
                setReservations(data);
            }

            // Fetch users
            const resUsers = await fetch('http://localhost:5050/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resUsers.ok) {
                const data = await resUsers.json();
                setUsers(data);
            }

            // Fetch tournaments
            const resTourneys = await fetch('http://localhost:5050/api/tournaments');
            if (resTourneys.ok) {
                const data = await resTourneys.json();
                setTournaments(data);
            }

            // Fetch board games
            const resBgs = await fetch('http://localhost:5050/api/boardgames');
            if (resBgs.ok) {
                const data = await resBgs.json();
                setBoardGames(data);
            }
        } catch (error) {
            console.error("Erreur chargement données admin :", error);
            setMessage({ type: 'error', text: 'Erreur lors du chargement des données.' });
        } finally {
            setLoading(false);
        }
    };

    // --- RESERVATION ACTIONS ---

    const handleUpdateResStatus = async (id, newStatus) => {
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/reservations/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Statut de réservation mis à jour !' });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la modification.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteRes = async (id) => {
        if (!window.confirm("Supprimer définitivement cette réservation ?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/reservations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Réservation supprimée.' });
                fetchAdminData();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    // --- USER ACTIONS ---

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Rôle de l\'utilisateur mis à jour !' });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Supprimer définitivement cet utilisateur ? Ses réservations associées seront effacées.")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Utilisateur supprimé.' });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    // --- TOURNAMENT ACTIONS ---

    const handleCreateTourney = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formattedDate = `${tourneyForm.date} ${tourneyForm.time}:00`;
            const res = await fetch('http://localhost:5050/api/admin/tournaments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: tourneyForm.name,
                    game: tourneyForm.game,
                    date: formattedDate,
                    capacity: Number(tourneyForm.capacity),
                    price: Number(tourneyForm.price),
                    description: tourneyForm.description
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Tournoi créé avec succès !' });
                setTourneyForm({
                    name: '',
                    game: 'Magic: The Gathering',
                    date: '',
                    time: '19:30',
                    capacity: 16,
                    price: 5.00,
                    description: ''
                });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur de création.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTourney = async (id) => {
        if (!window.confirm("Supprimer ce tournoi et toutes les inscriptions liées ?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/tournaments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Tournoi supprimé.' });
                fetchAdminData();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateBoardGame = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('http://localhost:5050/api/admin/boardgames', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(bgForm)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Jeu de société ajouté avec succès !' });
                setBgForm({
                    name: '',
                    category: 'Stratégie',
                    min_players: 2,
                    max_players: 4,
                    play_time: 45,
                    description: '',
                    image_url: '',
                    rules_url: ''
                });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || "Erreur lors de l'ajout." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteBoardGame = async (id) => {
        if (!window.confirm("Supprimer définitivement ce jeu de société de la boutique ?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/boardgames/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Jeu de société supprimé.' });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleImportBggHot = async () => {
        if (!window.confirm("Importer les 50 jeux populaires depuis BoardGameGeek ? Cela remplacera la liste actuelle de la boutique.")) return;
        setActionLoading(true);
        setMessage({ type: 'info', text: "Importation des 50 jeux les plus populaires depuis BGG... Cela peut prendre quelques secondes." });
        try {
            const res = await fetch('http://localhost:5050/api/admin/boardgames/import-hot', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: data.message || 'Importation BGG réussie !' });
                fetchAdminData();
            } else {
                setMessage({ type: 'error', text: data.error || "Erreur lors de l'importation BGG." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
            {/* Dark Premium Admin Header */}
            <div className="bg-slate-950 text-white py-12 px-4 md:px-8 border-b border-indigo-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Console d'administration</span>
                        <h1 className="text-3xl font-extrabold tracking-tight mt-1">Dashboard Admin</h1>
                    </div>
                    {/* Navigation tabs */}
                    <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                        <button
                            onClick={() => { setActiveTab('reservations'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'reservations' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            📅 Réservations
                        </button>
                        <button
                            onClick={() => { setActiveTab('tournaments'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'tournaments' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            🏆 Tournois
                        </button>
                        <button
                            onClick={() => { setActiveTab('boardgames'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'boardgames' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            🎲 Jeux de société
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            👥 Utilisateurs
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-6">
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-semibold max-w-2xl border transition-all ${
                        message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-400 text-xs">Chargement de la console...</p>
                    </div>
                ) : (
                    <>
                        {/* TAB 1: RESERVATIONS */}
                        {activeTab === 'reservations' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-900">Toutes les réservations de tables</h2>
                                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold py-1 px-3 rounded-full">
                                        Total : {reservations.length}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                                                <th className="p-4">Utilisateur</th>
                                                <th className="p-4">Table</th>
                                                <th className="p-4">Début</th>
                                                <th className="p-4">Fin</th>
                                                <th className="p-4">Jeu</th>
                                                <th className="p-4">Statut</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {reservations.map((res) => {
                                                const startStr = new Date(res.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
                                                const endStr = new Date(res.end_time).toLocaleString('fr-FR', { timeStyle: 'short' });

                                                return (
                                                    <tr key={res.id} className="hover:bg-slate-50/50 transition">
                                                        <td className="p-4">
                                                            <div className="font-bold text-slate-900">
                                                                {res.firstname || res.lastname ? `${res.firstname || ''} ${res.lastname || ''}`.trim() : '—'}
                                                            </div>
                                                            <div className="text-xs text-slate-400">{res.email}</div>
                                                        </td>
                                                        <td className="p-4 font-semibold text-slate-700">{res.tableName}</td>
                                                        <td className="p-4 text-slate-600">{startStr}</td>
                                                        <td className="p-4 text-slate-600">{endStr}</td>
                                                        <td className="p-4">
                                                            {res.game_type === 'BOARD_GAME' ? (
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full inline-block w-fit uppercase">
                                                                        🎲 Jeu de société
                                                                    </span>
                                                                    {res.specific_game && (
                                                                        <span className="text-xs font-bold text-slate-900 ml-1">
                                                                            {res.specific_game}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : res.game_type === 'MTG' ? (
                                                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full inline-block w-fit uppercase">
                                                                    🃏 TCG (Magic)
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full inline-block w-fit uppercase">
                                                                    🃏 Autre / TCG
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                                res.status === 'CONFIRMED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                                res.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                                'bg-slate-100 border-slate-200 text-slate-600'
                                                            }`}>
                                                                {res.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right space-x-1.5">
                                                            {res.status !== 'CONFIRMED' && (
                                                                <button
                                                                    onClick={() => handleUpdateResStatus(res.id, 'CONFIRMED')}
                                                                    disabled={actionLoading}
                                                                    className="py-1 px-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                                                                >
                                                                    Confirmer
                                                                </button>
                                                            )}
                                                            {res.status !== 'CANCELLED' && (
                                                                <button
                                                                    onClick={() => handleUpdateResStatus(res.id, 'CANCELLED')}
                                                                    disabled={actionLoading}
                                                                    className="py-1 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white transition disabled:opacity-50"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteRes(res.id)}
                                                                disabled={actionLoading}
                                                                className="py-1 px-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                                title="Supprimer la fiche"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {reservations.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="p-8 text-center text-slate-400 italic font-light">
                                                        Aucune réservation enregistrée.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: TOURNAMENTS */}
                        {activeTab === 'tournaments' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Create Tournament Form */}
                                <form onSubmit={handleCreateTourney} className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                                    <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                        <span>➕</span> Créer un tournoi
                                    </h2>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'événement</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ex: Friday Night Magic - Draft"
                                            value={tourneyForm.name}
                                            onChange={(e) => setTourneyForm({ ...tourneyForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Jeu / Licence</label>
                                        <select
                                            value={tourneyForm.game}
                                            onChange={(e) => setTourneyForm({ ...tourneyForm, game: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-white"
                                        >
                                            <option>Magic: The Gathering</option>
                                            <option>Pokémon TCG</option>
                                            <option>Disney Lorcana</option>
                                            <option>Autre jeu de société / rôle</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={tourneyForm.date}
                                                onChange={(e) => setTourneyForm({ ...tourneyForm, date: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                            <input
                                                type="time"
                                                required
                                                value={tourneyForm.time}
                                                onChange={(e) => setTourneyForm({ ...tourneyForm, time: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Places max</label>
                                            <input
                                                type="number"
                                                required
                                                min="4"
                                                max="128"
                                                value={tourneyForm.capacity}
                                                onChange={(e) => setTourneyForm({ ...tourneyForm, capacity: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Tarif (€)</label>
                                            <input
                                                type="number"
                                                step="0.50"
                                                min="0"
                                                value={tourneyForm.price}
                                                onChange={(e) => setTourneyForm({ ...tourneyForm, price: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Description / Dotations</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Indiquez le format, les lots..."
                                            value={tourneyForm.description}
                                            onChange={(e) => setTourneyForm({ ...tourneyForm, description: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition duration-300 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                                    >
                                        Créer le tournoi
                                    </button>
                                </form>

                                {/* Tournaments List */}
                                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-100">
                                        <h2 className="text-lg font-bold text-slate-900">Tournois existants</h2>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {tournaments.map((t) => (
                                            <div key={t.id} className="p-5 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                        {t.game}
                                                    </span>
                                                    <h3 className="font-extrabold text-slate-950 mt-1">{t.name}</h3>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">
                                                        📅 {new Date(t.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} | 👥 {t.registeredCount} / {t.capacity} joueurs
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTourney(t.id)}
                                                    disabled={actionLoading}
                                                    className="py-1.5 px-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        ))}
                                        {tournaments.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 italic font-light">
                                                Aucun tournoi enregistré.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: USERS */}
                        {activeTab === 'users' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-900">Utilisateurs inscrits</h2>
                                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold py-1 px-3 rounded-full">
                                        Total : {users.length}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                                                <th className="p-4">Prénom & Nom</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Date d'inscription</th>
                                                <th className="p-4">Rôle</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {users.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                                                    <td className="p-4 font-bold text-slate-900">
                                                        {u.firstname || u.lastname ? `${u.firstname || ''} ${u.lastname || ''}`.trim() : '—'}
                                                    </td>
                                                    <td className="p-4 text-slate-600 font-mono text-xs">{u.email}</td>
                                                    <td className="p-4 text-slate-500">
                                                        {new Date(u.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                            u.role === 'ADMIN' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleToggleRole(u.id, u.role)}
                                                            disabled={actionLoading}
                                                            className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition disabled:opacity-50"
                                                        >
                                                            {u.role === 'ADMIN' ? 'Retirer admin' : 'Rendre admin'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={actionLoading}
                                                            className="py-1 px-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: BOARD GAMES */}
                        {activeTab === 'boardgames' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Create Board Game Form */}
                                <form onSubmit={handleCreateBoardGame} className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                                    <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                        <span>🎲</span> Ajouter un jeu de société
                                    </h2>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nom du jeu</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ex: Carcassonne"
                                            value={bgForm.name}
                                            onChange={(e) => setBgForm({ ...bgForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Catégorie</label>
                                        <select
                                            value={bgForm.category}
                                            onChange={(e) => setBgForm({ ...bgForm, category: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-white"
                                        >
                                            <option>Stratégie</option>
                                            <option>Pose de tuiles</option>
                                            <option>Famille</option>
                                            <option>Abstrait</option>
                                            <option>Ambiance</option>
                                            <option>Ambiance / Réflexion</option>
                                            <option>Autre</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Joueurs Min</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={bgForm.min_players}
                                                onChange={(e) => setBgForm({ ...bgForm, min_players: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Joueurs Max</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={bgForm.max_players}
                                                onChange={(e) => setBgForm({ ...bgForm, max_players: Number(e.target.value) })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Durée de partie (mins)</label>
                                        <input
                                            type="number"
                                            required
                                            min="5"
                                            value={bgForm.play_time}
                                            onChange={(e) => setBgForm({ ...bgForm, play_time: Number(e.target.value) })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Description du jeu, mécanique..."
                                            value={bgForm.description}
                                            onChange={(e) => setBgForm({ ...bgForm, description: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        ></textarea>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL de l'image (optionnel)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: /images/boardgames/catan.png"
                                            value={bgForm.image_url}
                                            onChange={(e) => setBgForm({ ...bgForm, image_url: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Lien officiel / Règles (optionnel)</label>
                                        <input
                                            type="url"
                                            placeholder="Ex: https://..."
                                            value={bgForm.rules_url}
                                            onChange={(e) => setBgForm({ ...bgForm, rules_url: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition duration-300 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                                    >
                                        Ajouter le jeu
                                    </button>
                                </form>

                                {/* Board Games List */}
                                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-900">Jeux en boutique ({boardGames.length})</h2>
                                        <button
                                            type="button"
                                            onClick={handleImportBggHot}
                                            disabled={actionLoading}
                                            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition disabled:opacity-50"
                                        >
                                            {actionLoading && message.text?.includes("BGG") ? 'Importation...' : '⚡ Importer 50 Populaires BGG'}
                                        </button>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {boardGames.map((game) => (
                                            <div key={game.id} className="p-5 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={game.image_url} 
                                                        alt={game.name} 
                                                        className="w-12 h-12 rounded-lg object-contain p-0.5 bg-white border border-slate-100"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=100';
                                                        }}
                                                    />
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                            {game.category}
                                                        </span>
                                                        <h3 className="font-extrabold text-slate-950 mt-1">{game.name}</h3>
                                                        <p className="text-xs text-slate-500 font-light mt-0.5">
                                                            👥 {game.min_players}-{game.max_players} joueurs | ⏱ {game.play_time} mins
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteBoardGame(game.id)}
                                                    disabled={actionLoading}
                                                    className="py-1.5 px-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        ))}
                                        {boardGames.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 italic font-light">
                                                Aucun jeu de société enregistré.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DashboardAdmin;
