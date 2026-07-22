import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Trophy, Users, Download, Clock, AlertTriangle, Trash2, Dice6, ImageIcon, Zap, Plus, X } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import BoardGameCard from '../components/BoardGameCard';

function DashboardAdmin() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(null);

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
    const [editingTourney, setEditingTourney] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    // Search states
    const [resSearch, setResSearch] = useState('');
    const [resSortKey, setResSortKey] = useState(null);
    const [resSortOrder, setResSortOrder] = useState('asc');

    const handleSort = (key) => {
        if (resSortKey === key) {
            setResSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setResSortKey(key);
            setResSortOrder('asc');
        }
    };

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
        rules_url: '',
        stock: 1
    });

    // Custom calendar navigation states for Admin creation forms
    const [tourneyCalDate, setTourneyCalDate] = useState(new Date());
    const [eventCalDate, setEventCalDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        let firstDayIndex = date.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(null);
        }
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const isDayPast = (day) => {
        if (!day) return true;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return day < startOfToday;
    };

    const selectTourneyDay = (day) => {
        if (!day) return;
        const yyyy = day.getFullYear();
        const mm = String(day.getMonth() + 1).padStart(2, '0');
        const dd = String(day.getDate()).padStart(2, '0');
        setTourneyForm(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));
    };

    const selectEventDay = (day) => {
        if (!day) return;
        const yyyy = day.getFullYear();
        const mm = String(day.getMonth() + 1).padStart(2, '0');
        const dd = String(day.getDate()).padStart(2, '0');
        setEventForm(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));
    };

    const handleUpdateStock = async (gameId, newStock) => {
        const validatedStock = Math.max(0, newStock);
        setActionLoading(true);
        try {
            const res = await fetch(`http://localhost:5050/api/admin/boardgames/${gameId}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock: validatedStock })
            });
            if (res.ok) {
                setBoardGames(prev => prev.map(g => g.id === gameId ? { ...g, stock: validatedStock } : g));
                setMessage({ type: 'success', text: 'Stock mis à jour avec succès !' });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Erreur mise à jour stock' });
            }
        } catch (err) {
            console.error('Erreur stock:', err);
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

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
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('http://localhost:5050/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user.role !== 'ADMIN') {
                        setIsAdmin(false);
                        setLoading(false);
                    } else {
                        setIsAdmin(true);
                        // User is admin, fetch data
                        fetchAdminData();
                    }
                } else {
                    setIsAdmin(false);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erreur de vérification admin :", error);
                setIsAdmin(false);
                setLoading(false);
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

    const startEditTourney = (tourney) => {
        const dt = new Date(tourney.date);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const hh = String(dt.getHours()).padStart(2, '0');
        const min = String(dt.getMinutes()).padStart(2, '0');

        setEditingTourney({
            id: tourney.id,
            name: tourney.name,
            game: tourney.game,
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${min}`,
            capacity: tourney.capacity,
            price: tourney.price,
            description: tourney.description || ''
        });
    };

    const handleUpdateTourneySubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const formattedDate = `${editingTourney.date} ${editingTourney.time}:00`;
            const response = await fetch(`http://localhost:5050/api/admin/tournaments/${editingTourney.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editingTourney.name,
                    game: editingTourney.game,
                    date: formattedDate,
                    capacity: parseInt(editingTourney.capacity, 10),
                    price: parseFloat(editingTourney.price || 0),
                    description: editingTourney.description
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Tournoi mis à jour avec succès !' });
                setEditingTourney(null);
                fetchAdminData();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la modification.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
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

    const startEditEvent = (event) => {
        const dt = new Date(event.date);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const hh = String(dt.getHours()).padStart(2, '0');
        const min = String(dt.getMinutes()).padStart(2, '0');

        setEditingEvent({
            id: event.id,
            name: event.name,
            type: event.type,
            game: event.game,
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${min}`,
            capacity: event.capacity,
            price: event.price,
            description: event.description || ''
        });
    };

    const handleUpdateEventSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const formattedDate = `${editingEvent.date} ${editingEvent.time}:00`;
            const response = await fetch(`http://localhost:5050/api/admin/events/${editingEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editingEvent.name,
                    type: editingEvent.type,
                    game: editingEvent.game,
                    date: formattedDate,
                    capacity: parseInt(editingEvent.capacity, 10),
                    price: parseFloat(editingEvent.price || 0),
                    description: editingEvent.description
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Événement mis à jour avec succès !' });
                setEditingEvent(null);
                fetchAdminData();
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la modification.' });
            }
        } catch (err) {
            console.error(err);
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
            return 'text-blue-500 bg-black border-blue-500';
        }
        switch (type) {
            case 'MTG':
                return 'text-orange-500 bg-black border-orange-500';
            case 'POKEMON':
                return 'text-amber-500 bg-black border-amber-500';
            case 'ONE_PIECE':
                return 'text-cyan-500 bg-black border-cyan-500';
            case 'YUGIOH':
                return 'text-rose-500 bg-black border-rose-500';
            case 'STAR_WARS':
                return 'text-blue-500 bg-black border-blue-500';
            case 'LORCANA':
                return 'text-purple-500 bg-black border-purple-500';
            case 'FINAL_FF':
                return 'text-teal-500 bg-black border-teal-500';
            case 'ALTERED':
                return 'text-indigo-300 bg-black border-indigo-400';
            case 'DBS':
                return 'text-emerald-500 bg-black border-emerald-500';
            default:
                return 'text-slate-600 bg-slate-100 border-slate-200';
        }
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

    const filteredReservations = reservations.filter(r => {
        const q = resSearch.toLowerCase().trim();
        if (!q) return true;
        const name = `${r.firstname || ''} ${r.lastname || ''}`.toLowerCase();
        const email = (r.email || '').toLowerCase();
        const game = (r.specific_game || '').toLowerCase();
        const table = (r.tableName || '').toLowerCase();
        const status = (r.status || '').toLowerCase();
        return name.includes(q) || email.includes(q) || game.includes(q) || table.includes(q) || status.includes(q);
    });

    const sortedReservations = [...filteredReservations].sort((a, b) => {
        if (!resSortKey) return 0;

        let valA = '';
        let valB = '';

        if (resSortKey === 'user') {
            valA = `${a.firstname || ''} ${a.lastname || ''}`.toLowerCase().trim();
            valB = `${b.firstname || ''} ${b.lastname || ''}`.toLowerCase().trim();
        } else if (resSortKey === 'table') {
            valA = (a.tableName || '').toLowerCase().trim();
            valB = (b.tableName || '').toLowerCase().trim();
        } else if (resSortKey === 'start_time') {
            valA = new Date(a.start_time).getTime();
            valB = new Date(b.start_time).getTime();
        } else if (resSortKey === 'end_time') {
            valA = new Date(a.end_time).getTime();
            valB = new Date(b.end_time).getTime();
        } else if (resSortKey === 'game') {
            valA = (a.specific_game || '').toLowerCase().trim();
            valB = (b.specific_game || '').toLowerCase().trim();
        } else if (resSortKey === 'status') {
            valA = (a.status || '').toLowerCase().trim();
            valB = (b.status || '').toLowerCase().trim();
        }

        if (valA < valB) return resSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return resSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    if (isAdmin === null) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs font-semibold">Vérification des droits d'accès...</p>
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full bg-[#130f25]/85 border-2 border-red-500/30 rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6 backdrop-blur-md relative overflow-hidden">
                    {/* Glowing decorative indicator */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F4AF23]/10 rounded-full blur-2xl"></div>

                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center justify-center mx-auto text-red-500 shadow-lg shadow-red-500/5">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white uppercase">Accès Non Autorisé</h2>
                        <div className="h-0.5 w-12 bg-red-500/40 mx-auto rounded-full"></div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed">
                        Désolé, cette zone est réservée exclusivement aux administrateurs de <strong>Cicadas</strong>.
                        Vous ne possédez pas les autorisations nécessaires pour consulter ce tableau de bord.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 px-6 rounded-2xl text-sm font-extrabold tracking-wide bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40 hover:bg-[#684b9c] transition-all duration-300 cursor-pointer"
                    >
                        Retourner à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-200 pb-20">
            {/* Dark Premium Admin Header */}
            <div className="bg-slate-950 text-white py-12 px-4 md:px-8 border-b border-indigo-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Console d'administration</span>
                        <h1 className="text-3xl font-extrabold tracking-tight mt-1">Dashboard Admin</h1>
                    </div>
                    {/* Navigation tabs */}
                    <div className="flex flex-wrap md:flex-nowrap gap-2.5 bg-slate-900/95 p-2 rounded-2xl border border-slate-800/85 w-full md:w-auto shadow-inner">
                        <button
                            onClick={() => { setActiveTab('reservations'); setMessage({ type: '', text: '' }); }}
                            className={`py-3 px-6 md:px-8 rounded-xl text-sm font-extrabold text-center flex-1 md:flex-none tracking-wide transition duration-200 cursor-pointer ${
                                activeTab === 'reservations' 
                                ? 'bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40' 
                                : 'text-slate-400 hover:text-[#F4AF23] hover:bg-slate-800/30'
                            }`}
                        >
                            Réservations
                        </button>
                        <button
                            onClick={() => { setActiveTab('tournaments'); setMessage({ type: '', text: '' }); }}
                            className={`py-3 px-6 md:px-8 rounded-xl text-sm font-extrabold text-center flex-1 md:flex-none tracking-wide transition duration-200 cursor-pointer ${
                                activeTab === 'tournaments' 
                                ? 'bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40' 
                                : 'text-slate-400 hover:text-[#F4AF23] hover:bg-slate-800/30'
                            }`}
                        >
                            Tournois
                        </button>
                        <button
                            onClick={() => { setActiveTab('events'); setMessage({ type: '', text: '' }); }}
                            className={`py-3 px-6 md:px-8 rounded-xl text-sm font-extrabold text-center flex-1 md:flex-none tracking-wide transition duration-200 cursor-pointer ${
                                activeTab === 'events' 
                                ? 'bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40' 
                                : 'text-slate-400 hover:text-[#F4AF23] hover:bg-slate-800/30'
                            }`}
                        >
                            Événements
                        </button>
                        <button
                            onClick={() => { setActiveTab('boardgames'); setMessage({ type: '', text: '' }); }}
                            className={`py-3 px-6 md:px-8 rounded-xl text-sm font-extrabold text-center flex-1 md:flex-none tracking-wide transition duration-200 cursor-pointer ${
                                activeTab === 'boardgames' 
                                ? 'bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40' 
                                : 'text-slate-400 hover:text-[#F4AF23] hover:bg-slate-800/30'
                            }`}
                        >
                            Jeux de société
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setMessage({ type: '', text: '' }); }}
                            className={`py-3 px-6 md:px-8 rounded-xl text-sm font-extrabold text-center flex-1 md:flex-none tracking-wide transition duration-200 cursor-pointer ${
                                activeTab === 'users' 
                                ? 'bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40' 
                                : 'text-slate-400 hover:text-[#F4AF23] hover:bg-slate-800/30'
                            }`}
                        >
                            Utilisateurs
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-6">
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-semibold max-w-2xl border transition-all ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
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
                            <div className="bg-[#130f25]/75 rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0c0919]/65">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-white">Toutes les réservations de tables</h2>
                                        <p className="text-xs text-slate-400 font-light mt-0.5">Filtrer par nom de client, email, jeu ou statut</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                        <div className="relative w-full sm:w-80 md:w-96">
                                            <input
                                                type="text"
                                                placeholder="Rechercher un nom, email, jeu..."
                                                value={resSearch}
                                                onChange={(e) => setResSearch(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500 placeholder:font-normal"
                                            />
                                        </div>
                                        <span className="text-xs bg-indigo-50 text-indigo-300 border border-indigo-950 font-extrabold py-2.5 px-4 rounded-xl shrink-0">
                                            {filteredReservations.length} / {reservations.length} réservation(s)
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="!bg-[#0c0919]/60 !text-slate-350 text-xs uppercase font-bold border-b !border-white/5 select-none">
                                                <th
                                                    onClick={() => handleSort('user')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Utilisateur
                                                        {resSortKey === 'user' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('table')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Table
                                                        {resSortKey === 'table' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('start_time')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Début
                                                        {resSortKey === 'start_time' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('end_time')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Fin
                                                        {resSortKey === 'end_time' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('game')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Jeu
                                                        {resSortKey === 'game' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('status')}
                                                    className="p-4 cursor-pointer hover:!bg-white/5 transition duration-150"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        Statut
                                                        {resSortKey === 'status' ? (resSortOrder === 'asc' ? <span className="text-[#F4AF23] text-sm">▲</span> : <span className="text-[#F4AF23] text-sm">▼</span>) : <span className="text-slate-400 opacity-40">↕</span>}
                                                    </div>
                                                </th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y !divide-white/5 text-sm">
                                            {sortedReservations.map((res) => {
                                                const startStr = new Date(res.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
                                                const endStr = new Date(res.end_time).toLocaleString('fr-FR', { timeStyle: 'short' });

                                                return (
                                                    <tr key={res.id} className="hover:bg-white/5 transition">
                                                        <td className="p-4">
                                                            <div className="font-bold text-[#F4AF23]">
                                                                {res.firstname || res.lastname ? `${res.firstname || ''} ${res.lastname || ''}`.trim() : '—'}
                                                            </div>
                                                            <div className="text-xs text-slate-450">{res.email}</div>
                                                        </td>
                                                        <td className="p-4 font-semibold text-slate-300">
                                                            {(() => {
                                                                if (!res.tableName) return 'Table Standard';
                                                                const match = res.tableName.match(/Table\s+\d+/i);
                                                                return match ? match[0] : res.tableName;
                                                            })()}
                                                        </td>
                                                        <td className="p-4 text-slate-400">{startStr}</td>
                                                        <td className="p-4 text-slate-400">{endStr}</td>
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
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${res.status === 'CONFIRMED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
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
                                    <form onSubmit={handleCreateTourney} className="bg-[#130f25]/75 p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-4 text-white">
                                        <h2 className="text-lg font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                                            <Plus className="w-5 h-5 text-white" /> Créer un tournoi
                                        </h2>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Nom de l'événement</label>
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

                                        {/* Custom Interactive Calendar for Tournaments */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date du tournoi</label>

                                            <div className="bg-[#0b0917]/95 border border-white/5 rounded-2xl p-4.5 space-y-3.5 shadow-xl">
                                                <div className="flex justify-between items-center px-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setTourneyCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer font-bold border border-white/5"
                                                    >
                                                        ◀
                                                    </button>
                                                    <span className="text-xs font-extrabold text-[#F4AF23] uppercase tracking-wider">
                                                        {tourneyCalDate.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTourneyCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer font-bold border border-white/5"
                                                    >
                                                        ▶
                                                    </button>
                                                </div>

                                                {/* Weekdays */}
                                                <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/5">
                                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                                                        <span key={i}>{d}</span>
                                                    ))}
                                                </div>

                                                {/* Days of the month grid */}
                                                <div className="grid grid-cols-7 gap-1 text-center">
                                                    {getDaysInMonth(tourneyCalDate.getFullYear(), tourneyCalDate.getMonth()).map((day, idx) => {
                                                        if (!day) {
                                                            return <div key={`empty-${idx}`} className="aspect-square"></div>;
                                                        }
                                                        const past = isDayPast(day);
                                                        const selected = tourneyForm.date === `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;

                                                        let dayClass = "text-slate-300 hover:bg-[#563D82]/20 hover:text-[#F4AF23] cursor-pointer";
                                                        if (past) {
                                                            dayClass = "text-slate-700 opacity-20 cursor-not-allowed";
                                                        } else if (selected) {
                                                            dayClass = "bg-[#563D82] text-white border border-[#F4AF23] font-extrabold shadow-lg shadow-[#563D82]/40";
                                                        }

                                                        return (
                                                            <button
                                                                key={day.getTime()}
                                                                type="button"
                                                                disabled={past}
                                                                onClick={() => selectTourneyDay(day)}
                                                                className={`aspect-square rounded-xl flex items-center justify-center text-xs transition duration-200 ${dayClass}`}
                                                            >
                                                                {day.getDate()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={tourneyForm.time}
                                                    onChange={(e) => setTourneyForm({ ...tourneyForm, time: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-[#0c0919] text-slate-200 font-light"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Date choisie</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    placeholder="Choisissez ci-dessus"
                                                    value={tourneyForm.date}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-800/50 text-slate-300 font-bold"
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
                                                onAction={() => { }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tournaments List */}
                                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4 text-white">
                                    <div className="pb-4 border-b border-indigo-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-extrabold text-slate-100">Tournois existants ({filteredTournaments.length})</h2>
                                            <p className="text-xs text-slate-400 font-light mt-0.5">Filtrer par nom de tournoi ou jeu de cartes</p>
                                        </div>
                                        <div className="relative w-full sm:w-80 md:w-96">
                                            <input
                                                type="text"
                                                placeholder="Rechercher un tournoi..."
                                                value={tourneySearch}
                                                onChange={(e) => setTourneySearch(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-md transition-all !placeholder-slate-500 placeholder:font-normal"
                                            />
                                        </div>
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
                                                        onEdit={() => startEditTourney(tourney)}
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
                                    <form onSubmit={handleCreateEvent} className="bg-[#130f25]/75 p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-4 text-white">
                                        <h2 className="text-lg font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                                            <Plus className="w-5 h-5 text-white" /> Créer un événement
                                        </h2>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Nom de l'événement</label>
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

                                        {/* Custom Interactive Calendar for Events */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date de l'événement</label>

                                            <div className="bg-[#0b0917]/95 border border-white/5 rounded-2xl p-4.5 space-y-3.5 shadow-xl">
                                                <div className="flex justify-between items-center px-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEventCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer font-bold border border-white/5"
                                                    >
                                                        ◀
                                                    </button>
                                                    <span className="text-xs font-extrabold text-[#F4AF23] uppercase tracking-wider">
                                                        {eventCalDate.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEventCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer font-bold border border-white/5"
                                                    >
                                                        ▶
                                                    </button>
                                                </div>

                                                {/* Weekdays */}
                                                <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/5">
                                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                                                        <span key={i}>{d}</span>
                                                    ))}
                                                </div>

                                                {/* Days of the month grid */}
                                                <div className="grid grid-cols-7 gap-1 text-center">
                                                    {getDaysInMonth(eventCalDate.getFullYear(), eventCalDate.getMonth()).map((day, idx) => {
                                                        if (!day) {
                                                            return <div key={`empty-${idx}`} className="aspect-square"></div>;
                                                        }
                                                        const past = isDayPast(day);
                                                        const selected = eventForm.date === `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;

                                                        let dayClass = "text-slate-300 hover:bg-[#563D82]/20 hover:text-[#F4AF23] cursor-pointer";
                                                        if (past) {
                                                            dayClass = "text-slate-700 opacity-20 cursor-not-allowed";
                                                        } else if (selected) {
                                                            dayClass = "bg-[#563D82] text-white border border-[#F4AF23] font-extrabold shadow-lg shadow-[#563D82]/40";
                                                        }

                                                        return (
                                                            <button
                                                                key={day.getTime()}
                                                                type="button"
                                                                disabled={past}
                                                                onClick={() => selectEventDay(day)}
                                                                className={`aspect-square rounded-xl flex items-center justify-center text-xs transition duration-200 ${dayClass}`}
                                                            >
                                                                {day.getDate()}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={eventForm.time}
                                                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-[#0c0919] text-slate-200 font-light"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Date choisie</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    placeholder="Choisissez ci-dessus"
                                                    value={eventForm.date}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-800/50 text-slate-300 font-bold"
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
                                                onAction={() => { }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Events List */}
                                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-indigo-950/40 shadow-xl space-y-4 text-white">
                                    <div className="pb-4 border-b border-indigo-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-extrabold text-slate-100">Événements enregistrés ({filteredEvents.length})</h2>
                                            <p className="text-xs text-slate-400 font-light mt-0.5">Filtrer par titre ou jeu principal</p>
                                        </div>
                                        <div className="relative w-full sm:w-80 md:w-96">
                                            <input
                                                type="text"
                                                placeholder="Rechercher un événement..."
                                                value={eventSearch}
                                                onChange={(e) => setEventSearch(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-md transition-all !placeholder-slate-500 placeholder:font-normal"
                                            />
                                        </div>
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
                                                        onEdit={() => startEditEvent(e)}
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
                            <div className="bg-[#130f25]/75 rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0c0919]/65">
                                    <div className="flex flex-col gap-1 w-full md:w-auto">
                                        <h2 className="text-xl font-extrabold text-white">Utilisateurs inscrits</h2>
                                        <p className="text-xs text-slate-400 font-light">Rechercher par prénom, nom, pseudo ou email</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                        <div className="relative w-full sm:w-80 md:w-96">
                                            <input
                                                type="text"
                                                placeholder="Rechercher un membre..."
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500 placeholder:font-normal"
                                            />
                                        </div>
                                        <span className="text-xs bg-[#563D82]/30 text-indigo-200 border border-[#563D82]/40 font-extrabold py-2.5 px-4 rounded-xl shrink-0">
                                            Total : {filteredUsers.length} / {users.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="!bg-[#0c0919]/60 !text-slate-350 text-xs uppercase font-bold border-b !border-white/5">
                                                <th className="p-4">Prénom & Nom</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Date d'inscription</th>
                                                <th className="p-4">Rôle</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y !divide-white/5 text-sm">
                                            {filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-white/5 transition">
                                                    <td className="p-4 font-bold text-[#F4AF23]">
                                                        {u.firstname || u.lastname ? `${u.firstname || ''} ${u.lastname || ''}`.trim() : '—'}
                                                    </td>
                                                    <td className="p-4 text-slate-300 font-mono text-xs">{u.email}</td>
                                                    <td className="p-4 text-slate-400">
                                                        {new Date(u.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.role === 'ADMIN' ? 'bg-[#563D82]/30 border-[#563D82]/50 text-[#F4AF23]' : 'bg-slate-800/40 border-white/5 text-slate-300'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleToggleRole(u.id, u.role)}
                                                            disabled={actionLoading}
                                                            className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-white/10 hover:bg-white/5 hover:text-white text-slate-300 transition disabled:opacity-50 cursor-pointer"
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
                                    <form onSubmit={handleCreateBoardGame} className="bg-[#130f25]/75 p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl space-y-4 text-white">
                                        <h2 className="text-lg font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                                            Ajouter un jeu de société
                                        </h2>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Nom du jeu</label>
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

                                        <div className="grid grid-cols-2 gap-4">
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
                                                <label className="text-xs font-bold text-slate-500 uppercase">Stock (Exemplaires)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={bgForm.stock !== undefined ? bgForm.stock : 1}
                                                    onChange={(e) => setBgForm({ ...bgForm, stock: Math.max(0, Number(e.target.value)) })}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 font-light"
                                                />
                                            </div>
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
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition duration-300 shadow-md shadow-indigo-600/10 disabled:opacity-50 cursor-pointer"
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
                                                onBookClick={() => { }}
                                                t={t}
                                                i18n={i18n}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Board Games List */}
                                <div className="lg:col-span-7 bg-[#130f25]/75 rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-white/5 flex flex-col gap-4 bg-[#0c0919]/65">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-extrabold text-white">Jeux en boutique ({filteredBoardGames.length})</h2>
                                            <p className="text-xs text-slate-400 font-light">Rechercher par nom de jeu, mécanique ou catégorie</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher un jeu de société..."
                                                    value={bgSearch}
                                                    onChange={(e) => setBgSearch(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500 placeholder:font-normal"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y !divide-white/5 max-h-[850px] overflow-y-auto custom-scrollbar">
                                        {filteredBoardGames.map((game) => (
                                            <div key={game.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={game.image_url}
                                                        alt={game.name}
                                                        className="w-12 h-12 rounded-lg object-contain p-0.5 !bg-[#0c0919]/60 !border-white/5"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=100';
                                                        }}
                                                    />
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-indigo-300 bg-[#563D82]/35 px-2 py-0.5 rounded border border-indigo-950/40">
                                                            {game.category}
                                                        </span>
                                                        <h3 className="font-extrabold text-slate-100 mt-1">{game.name}</h3>
                                                        <p className="text-xs text-slate-450 font-light mt-0.5">
                                                            {game.min_players}-{game.max_players} joueurs | {game.play_time} mins
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Controleur de stock en direct */}
                                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                                    <div className="flex items-center gap-1.5 bg-[#0c0919]/60 p-1.5 rounded-xl border border-white/5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateStock(game.id, (game.stock !== undefined ? game.stock : 1) - 1)}
                                                            disabled={actionLoading || (game.stock !== undefined ? game.stock : 1) <= 0}
                                                            className="w-6 h-6 rounded-lg !bg-[#563D82] hover:!bg-[#684b9c] text-white font-extrabold text-xs flex items-center justify-center shadow-sm disabled:opacity-30 cursor-pointer border border-white/5"
                                                            title="Diminuer le stock"
                                                        >
                                                            -
                                                        </button>
                                                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${(game.stock !== undefined ? game.stock : 1) > 0
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                            }`}>
                                                            {game.stock !== undefined ? game.stock : 1} en stock
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateStock(game.id, (game.stock !== undefined ? game.stock : 1) + 1)}
                                                            disabled={actionLoading}
                                                            className="w-6 h-6 rounded-lg !bg-[#563D82] hover:!bg-[#684b9c] text-white font-extrabold text-xs flex items-center justify-center shadow-sm cursor-pointer border border-white/5"
                                                            title="Augmenter le stock"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteBoardGame(game.id)}
                                                        disabled={actionLoading}
                                                        className="py-1.5 px-3 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
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

            {/* Custom Modal for Tournament Editing */}
            {editingTourney && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full mx-4 shadow-2xl border border-slate-100/50 space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-indigo-650" /> Modifier le tournoi
                            </h3>
                            <button
                                onClick={() => setEditingTourney(null)}
                                className="text-slate-400 hover:text-slate-650 focus:outline-none transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateTourneySubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nom du tournoi</label>
                                <input
                                    type="text"
                                    required
                                    value={editingTourney.name}
                                    onChange={(e) => setEditingTourney({ ...editingTourney, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Jeu</label>
                                    <select
                                        value={editingTourney.game}
                                        onChange={(e) => setEditingTourney({ ...editingTourney, game: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    >
                                        <option>Magic: The Gathering</option>
                                        <option>Pokémon TCG</option>
                                        <option>One Piece Card Game</option>
                                        <option>Yu-Gi-Oh!</option>
                                        <option>Star Wars Unlimited</option>
                                        <option>Disney Lorcana</option>
                                        <option>Final Fantasy TCG</option>
                                        <option>Altered TCG</option>
                                        <option>Dragon Ball Super Card Game</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Capacité max</label>
                                    <input
                                        type="number"
                                        required
                                        min="4"
                                        value={editingTourney.capacity}
                                        onChange={(e) => setEditingTourney({ ...editingTourney, capacity: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={editingTourney.date}
                                        onChange={(e) => setEditingTourney({ ...editingTourney, date: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                    <input
                                        type="time"
                                        required
                                        value={editingTourney.time}
                                        onChange={(e) => setEditingTourney({ ...editingTourney, time: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Prix de participation (€)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    value={editingTourney.price}
                                    onChange={(e) => setEditingTourney({ ...editingTourney, price: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Format, dotations, détails additionnels..."
                                    value={editingTourney.description}
                                    onChange={(e) => setEditingTourney({ ...editingTourney, description: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingTourney(null)}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Modal for Event Editing */}
            {editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full mx-4 shadow-2xl border border-slate-100/50 space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-650" /> Modifier l'événement
                            </h3>
                            <button
                                onClick={() => setEditingEvent(null)}
                                className="text-slate-400 hover:text-slate-650 focus:outline-none transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateEventSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'événement</label>
                                <input
                                    type="text"
                                    required
                                    value={editingEvent.name}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Type d'événement</label>
                                    <select
                                        value={editingEvent.type}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    >
                                        <option value="avant_premiere">Avant-Première</option>
                                        <option value="draft">Draft</option>
                                        <option value="initiation">Initiation</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Jeu associé</label>
                                    <select
                                        value={editingEvent.game}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, game: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Capacité max</label>
                                    <input
                                        type="number"
                                        required
                                        min="4"
                                        value={editingEvent.capacity}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, capacity: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Prix de participation (€)</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={editingEvent.price}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={editingEvent.date}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                    <input
                                        type="time"
                                        required
                                        value={editingEvent.time}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Détails sur le format, la dotation..."
                                    value={editingEvent.description}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white text-slate-900"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingEvent(null)}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="py-2.5 px-5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
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

export default DashboardAdmin;
