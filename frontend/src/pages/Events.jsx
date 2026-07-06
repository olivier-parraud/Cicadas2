import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

function Events() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [events, setEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
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

    // Fetch events & user registrations
    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Load events list
            const resEvents = await fetch('http://localhost:5050/api/events');
            if (resEvents.ok) {
                const data = await resEvents.json();
                setEvents(data);
            }

            // Load logged in user's registrations
            if (isAuthenticated) {
                const token = localStorage.getItem('token');
                const resRegs = await fetch('http://localhost:5050/api/events/my-registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resRegs.ok) {
                    const regIds = await resRegs.json();
                    setMyRegistrations(regIds);
                }
            }
        } catch (error) {
            console.error("Erreur de chargement des événements :", error);
            toast.error(t('events_page.err_conn', 'Impossible de se connecter au serveur.'));
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchUserProfile();
    }, [isAuthenticated]);

    // Handle register / unregister click
    const handleAction = async (eventId, isRegistered) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setActionLoadingId(eventId);

        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5050/api/events/${eventId}/register`;
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
                        ? prev.filter(id => id !== eventId) 
                        : [...prev, eventId]
                );

                // Update events list locally to update count and participant list
                setEvents(prevEvents => 
                    prevEvents.map(e => {
                        if (e.id === eventId) {
                            let updatedParticipants = [...(e.participants || [])];
                            if (isRegistered) {
                                updatedParticipants = updatedParticipants.filter(p => p !== userDisplayName);
                            } else {
                                updatedParticipants.push(userDisplayName);
                            }
                            return {
                                ...e,
                                registeredCount: isRegistered ? e.registeredCount - 1 : e.registeredCount + 1,
                                participants: updatedParticipants
                            };
                        }
                        return e;
                    })
                );

                toast.success(isRegistered 
                    ? t('events_page.success_unregister', 'Désincription réussie.') 
                    : t('events_page.success_register', 'Inscription réussie ! Votre place est réservée.')
                );
            } else {
                toast.error(data.error || 'Erreur lors de l\'action.');
            }
        } catch (error) {
            console.error("Erreur action événement :", error);
            toast.error(t('events_page.err_conn', 'Erreur réseau.'));
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter events
    const filteredEvents = events.filter(e => {
        if (filter === 'all') return true;
        return e.type === filter;
    });

    const getGameColorClass = (game) => {
        const gameLower = game.toLowerCase();
        if (gameLower.includes('magic')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (gameLower.includes('one piece')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (gameLower.includes('star wars')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (gameLower.includes('lorcana')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (gameLower.includes('final fantasy')) return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
        if (gameLower.includes('altered')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        if (gameLower.includes('dragon ball')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    const getTypeColorClass = (type) => {
        if (type === 'avant_premiere') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (type === 'draft') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
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

    const getTypeEmoji = (type) => {
        if (type === 'avant_premiere') return '✨';
        if (type === 'draft') return '🃏';
        return '🎓';
    };

    return (
        <div className="min-h-screen bg-[#080711] text-white selection:bg-indigo-650 selection:text-white pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0c0a1e] via-[#120f2e] to-[#080711] text-white py-20 px-4 border-b border-indigo-950/40 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        📅 {t('events_page.badge')}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
                        {t('events_page.title')}
                    </h1>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                        {t('events_page.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-8">
                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                            filter === 'all' 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                : 'bg-[#151425]/45 border-white/5 text-slate-400 hover:text-white hover:bg-[#1a1930]'
                        }`}
                    >
                        {t('events_page.all_events')}
                    </button>
                    {[
                        { id: 'avant_premiere', name: t('events_page.prerelease') },
                        { id: 'draft', name: t('events_page.draft') },
                        { id: 'initiation', name: t('events_page.initiation') }
                    ].map(type => (
                        <button
                            key={type.id}
                            onClick={() => setFilter(type.id)}
                            className={`py-2.5 px-6 rounded-xl text-sm font-semibold border transition duration-300 cursor-pointer ${
                                filter === type.id 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                    : 'bg-[#151425]/45 border-white/5 text-slate-400 hover:text-white hover:bg-[#1a1930]'
                            }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-400 text-xs">Chargement de l'agenda...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-[#151425]/35 rounded-3xl border border-white/5 max-w-2xl mx-auto p-8 shadow-inner">
                        <span className="text-4xl block mb-4">📅</span>
                        <p className="text-slate-400 font-light text-sm">
                            {t('events_page.no_events')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((e) => {
                            const isRegistered = myRegistrations.includes(e.id);
                            const spotsLeft = e.capacity - e.registeredCount;
                            const isFull = spotsLeft <= 0;
                            const formattedDate = new Date(e.date).toLocaleString(i18n.resolvedLanguage, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            const typeNames = {
                                avant_premiere: t('events_page.prerelease'),
                                draft: t('events_page.draft'),
                                initiation: t('events_page.initiation')
                            };

                            return (
                                <div 
                                    key={e.id} 
                                    className="bg-[#151425]/45 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between border border-white/6 hover:border-indigo-500/25 transition duration-300 hover:translate-y-[-2px] shadow-lg group relative overflow-hidden"
                                >
                                    <div className="space-y-4 relative z-10">
                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getGameColorClass(e.game)}`}>
                                                {getGameEmoji(e.game)} {e.game}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getTypeColorClass(e.type)}`}>
                                                {getTypeEmoji(e.type)} {typeNames[e.type]}
                                            </span>
                                        </div>

                                        {/* Title & Info */}
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition duration-300">
                                                {e.name}
                                            </h3>
                                            <p className="text-xs text-indigo-300/80 font-medium capitalize mt-1.5 flex items-center gap-1.5">
                                                🕒 {formattedDate}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        {e.description && (
                                            <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">
                                                {e.description}
                                            </p>
                                        )}

                                        {/* Status Info */}
                                        <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-slate-400 font-medium">
                                            <span>
                                                💰 {parseFloat(e.price) === 0 ? t('events_page.price_free') : `${e.price}€`}
                                            </span>
                                            <span className={spotsLeft <= 3 && spotsLeft > 0 ? "text-amber-400 font-bold" : isFull ? "text-red-400 font-bold" : "text-slate-400"}>
                                                {isFull 
                                                    ? t('events_page.btn_full') 
                                                    : spotsLeft === 1 
                                                        ? t('events_page.spots_left', { count: spotsLeft }) 
                                                        : t('events_page.spots_left_plural', { count: spotsLeft })
                                                }
                                            </span>
                                        </div>

                                        {/* Dropdown for Participants list */}
                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleParticipants(e.id)}
                                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                                            >
                                                👥 {t('tournaments_page.participants', 'Inscrits')} ({e.registeredCount})
                                                <svg 
                                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openParticipantsId === e.id ? 'rotate-180' : ''}`} 
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {openParticipantsId === e.id && (
                                                <div className="mt-2 p-3 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                                                    {e.participants && e.participants.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {e.participants.map((p, idx) => (
                                                                <span key={idx} className="inline-block bg-[#151425]/60 text-slate-300 text-[10px] px-2 py-0.5 rounded-lg border border-white/5">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] text-slate-500 italic">Aucun inscrit pour le moment.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-6 relative z-10">
                                        {isRegistered ? (
                                            <button
                                                type="button"
                                                disabled={actionLoadingId === e.id}
                                                onClick={() => handleAction(e.id, true)}
                                                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#1e1329] border border-red-500/20 hover:border-red-500/40 text-red-400 transition cursor-pointer disabled:opacity-50"
                                            >
                                                {actionLoadingId === e.id ? '...' : t('events_page.btn_registered') + ' (Se désinscrire)'}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={isFull || actionLoadingId === e.id}
                                                onClick={() => handleAction(e.id, false)}
                                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                                                    isFull 
                                                        ? 'bg-slate-800 text-slate-500 border border-slate-700/50' 
                                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-650/10'
                                                }`}
                                            >
                                                {actionLoadingId === e.id ? '...' : isFull ? t('events_page.btn_full') : t('events_page.btn_register')}
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

export default Events;
