import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Trophy, Users, Download, Clock, AlertTriangle, Trash2, Dice6, ImageIcon, Zap, Plus } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import BoardGameCard from '../components/BoardGameCard';

function DashboardAdmin() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [activeTab, setActiveTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [boardGames, setBoardGames] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [deleteConfirmType, setDeleteConfirmType] = useState(null);
    const [openParticipantsId, setOpenParticipantsId] = useState(null);
    const [expandedPreviewBg, setExpandedPreviewBg] = useState(false);

    // Search states
    const [tourneySearch, setTourneySearch] = useState('');
    const [eventSearch, setEventSearch] = useState('');
    const [bgSearch, setBgSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    const toggleParticipants = (id) => {
        setOpenParticipantsId(openParticipantsId === id ? null : id);
    };

    // Event Form state
    const [eventForm, setEventForm] = useState({
        name: '',
        type: 'avant_premiere',
        game: 'Pokémon',
        date: '',
        time: '19:30',
        capacity: 16,
        price: 5.00,
        description: ''
    });

    // Tournament Form state
    const [tourneyForm, setTourneyForm] = useState({
        name: '',
        game: 'Pokémon',
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

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5050/api/admin/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                setBgForm(prev => ({ ...prev, image_url: data.imageUrl }));
                setMessage({ type: 'success', text: 'Image téléversée avec succès !' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors du téléversement.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erreur réseau lors de l'envoi." });
        } finally {
            setUploadingImage(false);
        }
    };

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

            // Fetch events
            const resEvents = await fetch('http://localhost:5050/api/events');
            if (resEvents.ok) {
                const data = await resEvents.json();
                setEvents(data);
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

    const handleDeleteRes = (id) => {
        setDeleteConfirmId(id);
        setDeleteConfirmType('reservation');
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId || !deleteConfirmType) return;
        const id = deleteConfirmId;
        const type = deleteConfirmType;
        
        setDeleteConfirmId(null);
        setDeleteConfirmType(null);
        setActionLoading(true);
        try {
            let url = '';
            let successMsg = '';
            
            if (type === 'reservation') {
                url = `http://localhost:5050/api/admin/reservations/${id}`;
                successMsg = 'Réservation supprimée.';
            } else if (type === 'user') {
                url = `http://localhost:5050/api/admin/users/${id}`;
                successMsg = 'Utilisateur supprimé.';
            } else if (type === 'tournament') {
                url = `http://localhost:5050/api/admin/tournaments/${id}`;
                successMsg = 'Tournoi supprimé.';
            } else if (type === 'boardgame') {
                url = `http://localhost:5050/api/admin/boardgames/${id}`;
                successMsg = 'Jeu de société supprimé.';
            } else if (type === 'event') {
                url = `http://localhost:5050/api/admin/events/${id}`;
                successMsg = 'Événement supprimé.';
            }
            
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ type: 'success', text: successMsg });
                fetchAdminData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur de suppression.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    const getDeleteModalInfo = () => {
        switch (deleteConfirmType) {
            case 'reservation':
                return {
                    title: 'Supprimer la réservation',
                    description: 'Voulez-vous vraiment supprimer définitivement cette réservation ? Cette action est irréversible.'
                };
            case 'user':
                return {
                    title: 'Supprimer l\'utilisateur',
                    description: 'Voulez-vous vraiment supprimer définitivement cet utilisateur ? Ses réservations associées seront effacées.'
                };
            case 'tournament':
                return {
                    title: 'Supprimer le tournoi',
                    description: 'Voulez-vous vraiment supprimer définitivement ce tournoi ? Toutes les inscriptions de joueurs liées seront perdues.'
                };
            case 'boardgame':
                return {
                    title: 'Supprimer le jeu',
                    description: 'Voulez-vous vraiment retirer définitivement ce jeu de société du catalogue ?'
                };
            case 'event':
                return {
                    title: 'Supprimer l\'événement',
                    description: 'Voulez-vous vraiment supprimer définitivement cet événement ? Toutes les inscriptions de joueurs liées seront perdues.'
                };
            default:
                return { title: 'Confirmer la suppression', description: 'Voulez-vous vraiment effectuer cette suppression ?' };
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

    const handleDeleteUser = (userId) => {
        setDeleteConfirmId(userId);
        setDeleteConfirmType('user');
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
                    game: 'Pokémon',
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

    const handleDeleteTourney = (id) => {
        setDeleteConfirmId(id);
        setDeleteConfirmType('tournament');
    };

    // --- EVENT ACTIONS ---

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formattedDate = `${eventForm.date} ${eventForm.time}:00`;
            const res = await fetch('http://localhost:5050/api/admin/events', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: eventForm.name,
                    type: eventForm.type,
                    game: eventForm.game,
                    date: formattedDate,
                    capacity: Number(eventForm.capacity),
                    price: Number(eventForm.price),
                    description: eventForm.description
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Événement créé avec succès !' });
                setEventForm({
                    name: '',
                    type: 'avant_premiere',
                    game: 'Pokémon',
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

    const handleDeleteEvent = (id) => {
        setDeleteConfirmId(id);
        setDeleteConfirmType('event');
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

    const handleDeleteBoardGame = (id) => {
        setDeleteConfirmId(id);
        setDeleteConfirmType('boardgame');
    };

    const handleImportBggHot = async () => {
        if (!window.confirm("Importer les 100 jeux populaires depuis BoardGameGeek ? Cela remplacera la liste actuelle de la boutique.")) return;
        setActionLoading(true);
        setMessage({ type: 'info', text: "Importation des 100 jeux les plus populaires depuis BGG... Cela peut prendre quelques secondes." });
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

    // Construction de l'objet activity pour l'aperçu de l'événement en temps réel
    const previewEvent = {
        id: 'preview',
        name: eventForm.name || "Aperçu de l'événement",
        type: eventForm.type,
        game: eventForm.game,
        date: eventForm.date ? `${eventForm.date}T${eventForm.time || '19:30'}` : new Date().toISOString(),
        capacity: eventForm.capacity || 16,
        registeredCount: 0,
        price: eventForm.price || 0,
        description: eventForm.description || "Description de l'événement...",
        participants: []
    };

    const previewTourney = {
        id: 'preview-tourney',
        name: tourneyForm.name || "Aperçu du tournoi",
        game: tourneyForm.game,
        date: tourneyForm.date ? `${tourneyForm.date}T${tourneyForm.time || '19:30'}` : new Date().toISOString(),
        capacity: tourneyForm.capacity || 16,
        registeredCount: 0,
        price: tourneyForm.price || 0,
        description: tourneyForm.description || "Description du tournoi...",
        participants: []
    };

    const previewBoardGame = {
        id: 'preview-boardgame',
        name: bgForm.name || "Aperçu du jeu",
        category: bgForm.category || "Stratégie",
        min_players: bgForm.min_players || 2,
        max_players: bgForm.max_players || 4,
        play_time: bgForm.play_time || 45,
        description: bgForm.description || "Description du jeu...",
        image_url: bgForm.image_url || '',
        rules_url: bgForm.rules_url || ''
    };
    const formatGameTypeName = (type) => {
        switch (type) {
            case 'POKEMON': return 'TCG (Pokémon)';
            case 'MTG': return 'TCG (Magic)';
            case 'ONE_PIECE': return 'TCG (One Piece)';
            case 'YUGIOH': return 'TCG (Yu-Gi-Oh!)';
            case 'STAR_WARS': return 'TCG (Star Wars)';
            case 'LORCANA': return 'TCG (Lorcana)';
            case 'FINAL_FF': return 'TCG (Final Fantasy)';
            case 'ALTERED': return 'TCG (Altered)';
            case 'DBS': return 'TCG (Dragon Ball)';
            case 'BOARD_GAME': return 'Jeu de société';
            case 'BYOG': return "J'apporte mon jeu";
            default: return 'Autre';
        }
    };

    const getGameBadgeStyles = (type) => {
        if (type === 'BOARD_GAME') {
            return 'text-purple-700 bg-purple-50 border-purple-200';
        } else if (type === 'BYOG') {
            return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        } else if (['MTG', 'POKEMON', 'ONE_PIECE', 'YUGIOH', 'STAR_WARS', 'LORCANA', 'FINAL_FF', 'ALTERED', 'DBS'].includes(type)) {
            return 'text-blue-700 bg-blue-50 border-blue-200';
        }
        return 'text-slate-600 bg-slate-100 border-slate-200';
    };

    const filteredTournaments = tournaments.filter(t => 
        (t.name || '').toLowerCase().includes(tourneySearch.toLowerCase()) || 
        (t.game || '').toLowerCase().includes(tourneySearch.toLowerCase())
    );

    const filteredEvents = events.filter(e => 
        (e.name || '').toLowerCase().includes(eventSearch.toLowerCase()) || 
        (e.game || '').toLowerCase().includes(eventSearch.toLowerCase()) || 
        (e.type || '').toLowerCase().includes(eventSearch.toLowerCase())
    );

    const filteredBoardGames = boardGames.filter(g => 
        (g.name || '').toLowerCase().includes(bgSearch.toLowerCase()) || 
        (g.category || '').toLowerCase().includes(bgSearch.toLowerCase())
    );

    const filteredUsers = users.filter(u => 
        (u.firstname || '').toLowerCase().includes(userSearch.toLowerCase()) || 
        (u.lastname || '').toLowerCase().includes(userSearch.toLowerCase()) || 
        (u.pseudo || '').toLowerCase().includes(userSearch.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
    );

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
                            Réservations
                        </button>
                        <button
                            onClick={() => { setActiveTab('tournaments'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'tournaments' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Tournois
                        </button>
                        <button
                            onClick={() => { setActiveTab('events'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Événements
                        </button>
                        <button
                            onClick={() => { setActiveTab('boardgames'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'boardgames' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Jeux de société
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setMessage({ type: '', text: '' }); }}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Utilisateurs
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
                                                        <td className="p-4 font-semibold text-slate-700">
                                                             {(() => {
                                                                 if (!res.tableName) return 'Table Standard';
                                                                 const match = res.tableName.match(/Table\s+\d+/i);
                                                                 const prefix = match ? match[0] : res.tableName;
                                                                 if (res.game_type === 'BYOG') {
                                                                     return prefix;
                                                                 }
                                                                 const isTcg = ['MTG', 'POKEMON', 'ONE_PIECE', 'YUGIOH', 'LORCANA', 'STAR_WARS', 'FINAL_FF', 'ALTERED', 'DBS'].includes(res.game_type);
                                                                 if (isTcg) {
                                                                     return `${prefix} (TCG)`;
                                                                 } else if (res.game_type === 'BOARD_GAME') {
                                                                     return `${prefix} (Jeux de plateau)`;
                                                                 }
                                                                 return res.tableName;
                                                             })()}
                                                        </td>
                                                        <td className="p-4 text-slate-600">{startStr}</td>
                                                        <td className="p-4 text-slate-600">{endStr}</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full inline-block w-fit uppercase ${getGameBadgeStyles(res.game_type)}`}>
                                                                    {formatGameTypeName(res.game_type)}
                                                                </span>
                                                                {res.specific_game && (
                                                                    <span className="text-xs font-bold text-slate-900 ml-1">
                                                                        {res.specific_game}
                                                                    </span>
                                                                )}
                                                            </div>
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
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Create Tournament Form */}
                                    <form onSubmit={handleCreateTourney} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                                        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                            <Plus className="w-5 h-5 text-indigo-650" /> Créer un tournoi
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
                                                <option>Pokémon</option>
                                                <option>Magic: The Gathering</option>
                                                <option>One Piece Card Game</option>
                                                <option>Yu-Gi-Oh!</option>
                                                <option>Star Wars: Unlimited</option>
                                                <option>Disney Lorcana</option>
                                                <option>Final Fantasy TCG</option>
                                                <option>Altered</option>
                                                <option>Dragon Ball Super Card Game</option>
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

                                    {/* Real-time Preview Box */}
                                    <div className="bg-[#080711] p-6 md:p-8 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4">
                                        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider pb-2 border-b border-indigo-950/40 flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Aperçu en temps réel
                                        </h3>
                                        <div className="max-w-md mx-auto">
                                            <TournamentCard
                                                activity={previewTourney}
                                                isAuthenticated={true}
                                                isRegistered={false}
                                                t={t}
                                                i18n={i18n}
                                                theme="dark"
                                                onAction={() => {}}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tournaments List */}
                                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4 text-white">
                                    <div className="pb-4 border-b border-indigo-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-200">Tournois existants ({filteredTournaments.length})</h2>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un tournoi..."
                                            value={tourneySearch}
                                            onChange={(e) => setTourneySearch(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl border border-[#1e1c3a] bg-[#191831] text-white text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-48 font-light"
                                        />
                                    </div>

                                    <div className="max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredTournaments.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 italic font-light">
                                                Aucun tournoi enregistré.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredTournaments.map((tourney) => (
                                                    <TournamentCard
                                                        key={tourney.id}
                                                        activity={tourney}
                                                        isAuthenticated={true}
                                                        isAdmin={true}
                                                        actionLoading={actionLoading}
                                                        isOpenParticipants={openParticipantsId === tourney.id}
                                                        onToggleParticipants={() => toggleParticipants(tourney.id)}
                                                        onAction={() => handleDeleteTourney(tourney.id)}
                                                        t={t}
                                                        i18n={i18n}
                                                        theme="dark"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: EVENTS */}
                        {activeTab === 'events' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Create Event Form & Live Preview */}
                                <div className="lg:col-span-5 space-y-6">
                                    <form onSubmit={handleCreateEvent} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                                        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                            <Plus className="w-5 h-5 text-indigo-600" /> Créer un événement
                                        </h2>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'événement</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ex: Avant-première Pokémon Écarlate et Violet"
                                                value={eventForm.name}
                                                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Type d'événement</label>
                                                <select
                                                    value={eventForm.type}
                                                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                >
                                                    <option value="avant_premiere">Avant-première</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="initiation">Initiation</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Jeu associé</label>
                                                <select
                                                    value={eventForm.game}
                                                    onChange={(e) => setEventForm({ ...eventForm, game: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                >
                                                    <option>Pokémon</option>
                                                    <option>Magic: The Gathering</option>
                                                    <option>One Piece Card Game</option>
                                                    <option>Yu-Gi-Oh!</option>
                                                    <option>Star Wars: Unlimited</option>
                                                    <option>Disney Lorcana</option>
                                                    <option>Final Fantasy TCG</option>
                                                    <option>Altered</option>
                                                    <option>Dragon Ball Super Card Game</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={eventForm.date}
                                                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={eventForm.time}
                                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de places</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="2"
                                                    value={eventForm.capacity}
                                                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Tarif (€)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    step="0.5"
                                                    value={eventForm.price}
                                                    onChange={(e) => setEventForm({ ...eventForm, price: Number(e.target.value) })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Infos pratiques, lots à gagner..."
                                                value={eventForm.description}
                                                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white font-light"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 mt-2"
                                        >
                                            {actionLoading ? 'Création...' : 'Créer l\'événement'}
                                        </button>
                                    </form>

                                    {/* Real-time Preview Box */}
                                    <div className="bg-[#080711] p-6 md:p-8 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4">
                                        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider pb-2 border-b border-indigo-950/40 flex items-center gap-2">
                                            <span>✨</span> Aperçu en temps réel
                                        </h3>
                                        <div className="max-w-md mx-auto">
                                            <TournamentCard
                                                activity={previewEvent}
                                                isAuthenticated={true}
                                                isRegistered={false}
                                                t={t}
                                                i18n={i18n}
                                                theme="dark"
                                                onAction={() => {}}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Events List */}
                                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4 text-white">
                                    <div className="pb-4 border-b border-indigo-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <h2 className="text-lg font-bold text-slate-200">Événements enregistrés ({filteredEvents.length})</h2>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un événement..."
                                            value={eventSearch}
                                            onChange={(e) => setEventSearch(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl border border-[#1e1c3a] bg-[#191831] text-white text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-48 font-light"
                                        />
                                    </div>

                                    <div className="max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredEvents.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 italic font-light">
                                                Aucun événement enregistré.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredEvents.map((e) => (
                                                    <TournamentCard
                                                        key={e.id}
                                                        activity={e}
                                                        isAuthenticated={true}
                                                        isAdmin={true}
                                                        actionLoading={actionLoading}
                                                        isOpenParticipants={openParticipantsId === e.id}
                                                        onToggleParticipants={() => toggleParticipants(e.id)}
                                                        onAction={() => handleDeleteEvent(e.id)}
                                                        t={t}
                                                        i18n={i18n}
                                                        theme="dark"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: USERS */}
                        {activeTab === 'users' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                                        <h2 className="text-lg font-bold text-slate-900">Utilisateurs inscrits</h2>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un utilisateur..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-indigo-600 w-full sm:w-64 font-light"
                                        />
                                    </div>
                                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold py-1 px-3 rounded-full shrink-0">
                                        Total : {filteredUsers.length} / {users.length}
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
                                            {filteredUsers.map((u) => (
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
                                                            <Trash2 className="w-3 h-3 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-slate-400 italic font-light">
                                                        Aucun utilisateur trouvé.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: BOARD GAMES */}
                        {activeTab === 'boardgames' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Create Board Game Form */}
                                    <form onSubmit={handleCreateBoardGame} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-4">
                                        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                            <Dice6 className="w-5 h-5 text-indigo-600" /> Ajouter un jeu de société
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

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Image du jeu (Depuis votre PC)</label>
                                            <div className="flex flex-wrap gap-3 items-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="bg-image-upload"
                                                />
                                                <label
                                                    htmlFor="bg-image-upload"
                                                    className="cursor-pointer py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2"
                                                >
                                                    <ImageIcon className="w-3.5 h-3.5" /> Choisir une image
                                                </label>
                                                {uploadingImage && <span className="text-xs text-slate-500 animate-pulse">Téléversement...</span>}
                                                {bgForm.image_url && !uploadingImage && (
                                                    <span className="text-xs text-emerald-600 font-medium truncate max-w-xs">
                                                        ✅ Image sélectionnée
                                                    </span>
                                                )}
                                            </div>
                                            <div className="pt-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ou URL de l'image</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: https://..."
                                                    value={bgForm.image_url}
                                                    onChange={(e) => setBgForm({ ...bgForm, image_url: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 mt-1 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 font-light"
                                                />
                                            </div>
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

                                    {/* Real-time Preview Box */}
                                    <div className="bg-[#080711] p-6 md:p-8 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4">
                                        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider pb-2 border-b border-indigo-950/40 flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Aperçu en temps réel
                                        </h3>
                                        <div className="max-w-md mx-auto">
                                            <BoardGameCard
                                                game={previewBoardGame}
                                                isExpanded={expandedPreviewBg}
                                                onToggleExpand={() => setExpandedPreviewBg(!expandedPreviewBg)}
                                                onBookClick={() => {}}
                                                t={t}
                                                i18n={i18n}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Board Games List */}
                                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
                                        <div className="flex-1 space-y-2">
                                            <h2 className="text-lg font-bold text-slate-900">Jeux en boutique ({filteredBoardGames.length})</h2>
                                            <input
                                                type="text"
                                                placeholder="Rechercher un jeu..."
                                                value={bgSearch}
                                                onChange={(e) => setBgSearch(e.target.value)}
                                                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:border-indigo-600 w-full sm:w-64 font-light shadow-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleImportBggHot}
                                            disabled={actionLoading}
                                            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition disabled:opacity-50 shrink-0 self-end sm:self-auto"
                                        >
                                            <Zap className="w-3.5 h-3.5" /> {actionLoading && message.text?.includes("BGG") ? 'Importation...' : 'Importer 100 Populaires BGG'}
                                        </button>
                                    </div>

                                    <div className="divide-y divide-slate-100 max-h-[850px] overflow-y-auto custom-scrollbar">
                                        {filteredBoardGames.map((game) => (
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
                                                            {game.min_players}-{game.max_players} joueurs | {game.play_time} mins
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
                                        {filteredBoardGames.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 italic font-light">
                                                Aucun jeu de société trouvé.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Confirmation Modal for Deletion */}
            {deleteConfirmId && deleteConfirmType && (() => {
                const info = getDeleteModalInfo();
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-100/50 space-y-6 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 text-red-650">
                                <AlertTriangle className="w-6 h-6 shrink-0" />
                                <h3 className="text-xl font-black text-slate-950 tracking-tight">{info.title}</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed font-light">
                                {info.description}
                            </p>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setDeleteConfirmId(null); setDeleteConfirmType(null); }}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-sm transition"
                                >
                                    Confirmer la suppression
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

export default DashboardAdmin;
