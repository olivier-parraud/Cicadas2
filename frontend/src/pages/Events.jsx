import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TournamentCard from '../components/TournamentCard';

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

    // Helper color/emoji functions moved to EventCard component

    return (
        <div className="min-h-screen bg-[#05040a] text-white selection:bg-[#F4AF23] selection:text-[#05040a] pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#130f25] to-black text-white py-20 px-4 border-b border-white/5 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#563D82]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#F4AF23]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-[#F4AF23] leading-tight">
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
                                ? 'bg-[#563D82] border-[#563D82] text-white shadow-md shadow-[#563D82]/20' 
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
                                    ? 'bg-[#563D82] border-[#563D82] text-white shadow-md shadow-[#563D82]/20' 
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
                        <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400 font-light text-sm">
                            {t('events_page.no_events')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((e) => (
                            <TournamentCard
                                key={e.id}
                                activity={e}
                                isAuthenticated={isAuthenticated}
                                isRegistered={myRegistrations.includes(e.id)}
                                actionLoading={actionLoadingId === e.id}
                                isOpenParticipants={openParticipantsId === e.id}
                                onToggleParticipants={() => toggleParticipants(e.id)}
                                onAction={() => handleAction(e.id, myRegistrations.includes(e.id))}
                                onLoginRedirect={() => navigate('/login')}
                                t={t}
                                i18n={i18n}
                                theme="dark"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;
