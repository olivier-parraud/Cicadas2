import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Tournaments() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [tournaments, setTournaments] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Track which tournament's participants dropdown is open
    const [openParticipantsId, setOpenParticipantsId] = useState(null);

    const toggleParticipants = (id) => {
        setOpenParticipantsId(openParticipantsId === id ? null : id);
    };

    // Fetch tournaments & user registrations
    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Load tournaments list
            const resTourneys = await fetch('http://localhost:5000/api/tournaments');
            if (resTourneys.ok) {
                const data = await resTourneys.json();
                setTournaments(data);
            }

            // Load logged in user's registrations
            if (isAuthenticated) {
                const token = localStorage.getItem('token');
                const resRegs = await fetch('http://localhost:5000/api/tournaments/my-registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resRegs.ok) {
                    const regIds = await resRegs.json();
                    setMyRegistrations(regIds);
                }
            }
        } catch (error) {
            console.error("Erreur de chargement des tournois :", error);
            setMessage({ type: 'error', text: 'Impossible de contacter le serveur.' });
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    // Handle register / unregister click
    const handleAction = async (tourneyId, isRegistered) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setActionLoadingId(tourneyId);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5000/api/tournaments/${tourneyId}/register`;
            const method = isRegistered ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ 
                    type: 'success', 
                    text: isRegistered ? 'Désinscription réussie.' : 'Inscription au tournoi réussie ! Votre place est réservée.' 
                });
                // Reload data silently to update numbers and lists without full-page spinner
                await fetchData(true);
            } else {
                setMessage({ type: 'error', text: data.error || 'Une erreur est survenue.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Impossible de joindre le serveur.' });
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter tournaments list
    const filteredTournaments = tournaments.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'mtg') return t.game.toLowerCase().includes('magic');
        if (filter === 'pokemon') return t.game.toLowerCase().includes('pokémon') || t.game.toLowerCase().includes('pokemon');
        if (filter === 'lorcana') return t.game.toLowerCase().includes('lorcana');
        return true;
    });

    const getGameColorClass = (game) => {
        const gameLower = game.toLowerCase();
        if (gameLower.includes('magic')) return 'bg-orange-50 text-orange-700 border-orange-200/50';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return 'bg-amber-50 text-amber-700 border-amber-200/50';
        if (gameLower.includes('lorcana')) return 'bg-purple-50 text-purple-700 border-purple-200/50';
        return 'bg-slate-50 text-slate-700 border-slate-200/50';
    };

    const getGameEmoji = (game) => {
        const gameLower = game.toLowerCase();
        if (gameLower.includes('magic')) return '🃏';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return '⚡';
        if (gameLower.includes('lorcana')) return '🏰';
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
                        🏆 Événements Officiels Cicados
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
                        Tournois & Soirées TCG
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Rejoignez nos compétitions locales, défiez la communauté et tentez de remporter des boosters promo et des lots exclusifs !
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-8">
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-semibold max-w-2xl mx-auto border transition-all ${
                        message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        {message.text}
                    </div>
                )}

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
                        Tous les tournois
                    </button>
                    <button
                        onClick={() => setFilter('mtg')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${
                            filter === 'mtg' 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Magic: The Gathering
                    </button>
                    <button
                        onClick={() => setFilter('pokemon')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${
                            filter === 'pokemon' 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Pokémon TCG
                    </button>
                    <button
                        onClick={() => setFilter('lorcana')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition ${
                            filter === 'lorcana' 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Disney Lorcana
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 text-sm">Chargement des événements...</p>
                    </div>
                ) : filteredTournaments.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200/60 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                        <span className="text-4xl">🏆</span>
                        <h3 className="text-lg font-bold text-slate-900">Aucun tournoi planifié</h3>
                        <p className="text-slate-500 font-light text-sm">
                            Il n'y a pas de tournois correspondants à cette catégorie pour le moment. Revenez bientôt !
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {filteredTournaments.map((t) => {
                            const isRegistered = myRegistrations.includes(t.id);
                            const isFull = t.registeredCount >= t.capacity;
                            const tourneyDate = new Date(t.date);

                            const formattedDate = tourneyDate.toLocaleDateString('fr-FR', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            });
                            const formattedTime = tourneyDate.toLocaleTimeString('fr-FR', {
                                hour: '2-digit', 
                                minute: '2-digit'
                            });

                            return (
                                <div 
                                    key={t.id}
                                    className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative group"
                                >
                                    <div className="space-y-4">
                                        {/* Game badge & price */}
                                        <div className="flex justify-between items-center gap-4">
                                            <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold border ${getGameColorClass(t.game)}`}>
                                                {getGameEmoji(t.game)} {t.game}
                                            </span>
                                            <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 py-1.5 px-3.5 rounded-xl font-mono">
                                                {t.price === 0 || t.price === "0.00" ? 'Gratuit' : `${Number(t.price).toFixed(2)}€`}
                                            </span>
                                        </div>

                                        {/* Tournament title */}
                                        <h3 className="text-xl font-extrabold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {t.name}
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
                                                    Capacité : <strong className="text-slate-950 font-bold">{t.registeredCount}</strong> / {t.capacity} joueurs
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed font-light pt-2">
                                            {t.description}
                                        </p>

                                        {/* Collapsible Registered Players List */}
                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                            <button 
                                                type="button"
                                                onClick={() => toggleParticipants(t.id)}
                                                className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                                            >
                                                <span>👥 Liste des inscrits ({t.participants?.length || 0})</span>
                                                <span className={`transition-transform duration-200 transform ${openParticipantsId === t.id ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            
                                            {openParticipantsId === t.id && (
                                                <div className="mt-2 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/50 max-h-36 overflow-y-auto">
                                                    {t.participants && t.participants.length > 0 ? (
                                                        t.participants.map((pName, index) => (
                                                            <div key={index} className="text-xs text-slate-700 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                                <span>{pName}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-xs text-slate-400 italic">Aucun inscrit pour le moment.</div>
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
                                                Connexion requise pour participer
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(t.id, isRegistered)}
                                                disabled={actionLoadingId === t.id || (!isRegistered && isFull)}
                                                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                                                    isRegistered 
                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100/80 border border-red-200' 
                                                        : isFull 
                                                            ? 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed' 
                                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                                                }`}
                                            >
                                                {actionLoadingId === t.id ? (
                                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                ) : isRegistered ? (
                                                    'Se désinscrire'
                                                ) : isFull ? (
                                                    'Complet'
                                                ) : (
                                                    "S'inscrire"
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
