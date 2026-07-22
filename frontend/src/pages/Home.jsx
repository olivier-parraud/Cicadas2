import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Trophy, Users, MessageSquare, Mail, X, Lock } from 'lucide-react';
import Button from '../components/Button';
import BoardGameCard from '../components/BoardGameCard';
import TournamentCard from '../components/TournamentCard';
import { toast } from 'react-hot-toast';

function Home() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [featuredGames, setFeaturedGames] = useState([]);
    const [expandedGames, setExpandedGames] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [openParticipantsId, setOpenParticipantsId] = useState(null);
    const [myTourneyRegistrations, setMyTourneyRegistrations] = useState([]);
    const [myEventRegistrations, setMyEventRegistrations] = useState([]);

    // Contact modal states
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Vous devez être connecté pour envoyer un message.");
            navigate('/login');
            return;
        }

        if (!contactMessage.trim()) {
            toast.error("Veuillez saisir un message.");
            return;
        }

        setSendingMessage(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5050/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: contactSubject,
                    content: contactMessage
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Votre message a été envoyé aux administrateurs !");
                setContactSubject('');
                setContactMessage('');
                setIsContactModalOpen(false);
            } else {
                toast.error(data.error || "Une erreur est survenue lors de l'envoi.");
            }
        } catch (err) {
            console.error("Erreur envoi message :", err);
            toast.error("Erreur réseau lors de l'envoi.");
        } finally {
            setSendingMessage(false);
        }
    };

    const toggleParticipants = (id) => {
        setOpenParticipantsId(openParticipantsId === id ? null : id);
    };

    const toggleExpand = (gameId) => {
        setExpandedGames(prev => ({
            ...prev,
            [gameId]: !prev[gameId]
        }));
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const testimonials = t('home_page.testimonials.items', { returnObjects: true }) || [];
    const faqItems = t('home_page.faq.items', { returnObjects: true }) || [];

    const slides = [
        {
            image: "/assets/img/hero_magic.png",
            title: t('home_page.slides.slide_1.title'),
            desc: t('home_page.slides.slide_1.desc')
        },
        {
            image: "/images/place/ground_floor.png",
            title: t('home_page.slides.slide_2.title'),
            desc: t('home_page.slides.slide_2.desc')
        },
        {
            image: "/images/place/bar_zone.png",
            title: t('home_page.slides.slide_3.title'),
            desc: t('home_page.slides.slide_3.desc')
        },
        {
            image: "/images/place/upstairs_chill.png",
            title: t('home_page.slides.slide_4.title'),
            desc: t('home_page.slides.slide_4.desc')
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        const fetchFeaturedGames = async () => {
            try {
                const res = await fetch('http://localhost:5050/api/boardgames');
                if (res.ok) {
                    const data = await res.json();
                    setFeaturedGames(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Erreur chargement jeux vedettes:", error);
            }
        };
        fetchFeaturedGames();
    }, []);

    const isAuthenticated = !!localStorage.getItem('token');

    const fetchUpcomingEvents = async (silent = false) => {
        if (!silent) setEventsLoading(true);
        try {
            const resTourneys = await fetch('http://localhost:5050/api/tournaments');
            let tourneys = [];
            if (resTourneys.ok) {
                tourneys = await resTourneys.json();
            }

            const resEvents = await fetch('http://localhost:5050/api/events');
            let events = [];
            if (resEvents.ok) {
                events = await resEvents.json();
            }

            const merged = [...tourneys, ...events].sort((a, b) => new Date(a.date) - new Date(b.date));
            setUpcomingEvents(merged.slice(0, 3));
        } catch (error) {
            console.error("Erreur chargement événements à venir :", error);
        } finally {
            setEventsLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        if (!isAuthenticated) return;
        try {
            const token = localStorage.getItem('token');
            const resTourneys = await fetch('http://localhost:5050/api/tournaments/my-registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resTourneys.ok) {
                const data = await resTourneys.json();
                setMyTourneyRegistrations(data);
            }

            const resEvents = await fetch('http://localhost:5050/api/events/my-registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resEvents.ok) {
                const data = await resEvents.json();
                setMyEventRegistrations(data);
            }
        } catch (error) {
            console.error("Erreur chargement inscriptions:", error);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
        fetchRegistrations();
    }, [isAuthenticated]);

    const handleRegisterToggle = async (activity, isRegistered) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const isEvent = !!activity.type;
        const url = isEvent 
            ? `http://localhost:5050/api/events/${activity.id}/register`
            : `http://localhost:5050/api/tournaments/${activity.id}/register`;
        const method = isRegistered ? 'DELETE' : 'POST';
        const token = localStorage.getItem('token');

        setActionLoadingId(activity.id);
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                if (isEvent) {
                    setMyEventRegistrations(prev => isRegistered ? prev.filter(id => id !== activity.id) : [...prev, activity.id]);
                } else {
                    setMyTourneyRegistrations(prev => isRegistered ? prev.filter(id => id !== activity.id) : [...prev, activity.id]);
                }
                toast.success(isRegistered ? t('tournaments_page.success_unregister') : t('tournaments_page.success_register'));
                fetchUpcomingEvents(true);
            } else {
                toast.error(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            toast.error(t('tournaments_page.err_conn'));
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#05040a] text-white selection:bg-[#F4AF23] selection:text-[#05040a]">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#130f25] to-black text-white py-24 md:py-32 px-4 border-b border-white/5">
                {/* Decorative glowing circles */}
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#563D82]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#F4AF23]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-[#F4AF23]/10 text-[#F4AF23] border border-[#F4AF23]/20">
                            ✨ Espace de jeu & Tournois TCG
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-[#F4AF23] leading-tight">
                            {t('home_page.hero.title')}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            {t('home_page.hero.description')}
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                onClick={() => navigate('/reservations')}
                                className="font-extrabold text-base py-3.5 px-8 shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                            >
                                {t('home_page.hero.cta')}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex justify-center w-full">
                        <div className="relative group w-full max-w-md lg:max-w-none">
                            {/* Neon border background */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#563D82] to-[#F4AF23] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                            {/* Carousel Container */}
                            <div className="relative bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-[4/3] w-full">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover opacity-95"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
                                            }}
                                        />

                                        {/* Info Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-md p-4 border-t border-white/5">
                                            <h4 className="font-bold text-white text-sm tracking-wide">
                                                {slide.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-light mt-0.5">
                                                {slide.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Arrow Navigation */}
                                <button
                                    onClick={(e) => { e.preventDefault(); setActiveSlide(prev => (prev - 1 + slides.length) % slides.length); }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 border border-white/10 flex items-center justify-center text-white hover:bg-[#563D82] transition z-20"
                                    aria-label="Slide précédent"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); setActiveSlide(prev => (prev + 1) % slides.length); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 border border-white/10 flex items-center justify-center text-white hover:bg-[#563D82] transition z-20"
                                    aria-label="Slide suivant"
                                >
                                    ❯
                                </button>

                                {/* Dot Indicators */}
                                <div className="absolute top-3 right-3 flex gap-1.5 z-20 bg-slate-950/60 p-1.5 rounded-full border border-slate-800/40">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => { e.preventDefault(); setActiveSlide(index); }}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-indigo-500 scale-125' : 'bg-slate-600 hover:bg-slate-400'
                                                }`}
                                            aria-label={`Aller au slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto py-20 px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {t('home_page.features.title')}
                    </h2>
                    <p className="text-lg text-slate-400 font-light">
                        {t('home_page.features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-[#130f25]/45 p-8 rounded-2xl border border-white/5 shadow-sm hover:shadow-xl hover:border-[#F4AF23]/30 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-[#563D82]/10 text-[#F4AF23] border border-[#563D82]/20 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#563D82] group-hover:text-white transition-colors duration-300">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F4AF23] transition-colors">
                            {t('home_page.features.items.booking.title')}
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            {t('home_page.features.items.booking.description')}
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#130f25]/45 p-8 rounded-2xl border border-white/5 shadow-sm hover:shadow-xl hover:border-[#F4AF23]/30 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-[#563D82]/10 text-[#F4AF23] border border-[#563D82]/20 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#563D82] group-hover:text-white transition-colors duration-300">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F4AF23] transition-colors">
                            {t('home_page.features.items.tournaments.title')}
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            {t('home_page.features.items.tournaments.description')}
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#130f25]/45 p-8 rounded-2xl border border-white/5 shadow-sm hover:shadow-xl hover:border-[#F4AF23]/30 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-[#563D82]/10 text-[#F4AF23] border border-[#563D82]/20 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#563D82] group-hover:text-white transition-colors duration-300">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F4AF23] transition-colors">
                            {t('home_page.features.items.groups.title')}
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-light">
                            {t('home_page.features.items.groups.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="w-full bg-[#0d0b17] border-y border-white/5 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            {t('home_page.how_it_works.title')}
                        </h2>
                        <p className="text-lg text-slate-400 font-light">
                            {t('home_page.how_it_works.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting line for larger screens */}
                        <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-[#563D82]/30 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-[#563D82] text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-[#563D82]/20 group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {t('home_page.how_it_works.steps.step_1.title')}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_1.description')}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-[#563D82] text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-[#563D82]/20 group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {t('home_page.how_it_works.steps.step_2.title')}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_2.description')}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-[#563D82] text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-[#563D82]/20 group-hover:scale-110 transition-transform">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {t('home_page.how_it_works.steps.step_3.title')}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_3.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Activities Section */}
            {upcomingEvents.length > 0 && (
                <div className="max-w-7xl mx-auto py-20 px-4 border-t border-white/5">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-[#F4AF23]/10 text-[#F4AF23] border border-[#F4AF23]/20">
                            <Calendar className="w-3.5 h-3.5" /> {t('home_page.upcoming_badge', 'Prochains Événements & Tournois')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            {t('home_page.upcoming_title', 'Nos Prochains Rendez-vous')}
                        </h2>
                        <p className="text-lg text-slate-400 font-light">
                            {t('home_page.upcoming_subtitle', "Rejoignez-nous pour nos soirées Draft, tournois officiels ou séances d'initiation.")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {upcomingEvents.map((activity) => {
                            const isEvent = !!activity.type;
                            const uniqueKey = `${isEvent ? 'event' : 'tourney'}-${activity.id}`;
                            const isReg = isEvent 
                                ? myEventRegistrations.includes(activity.id) 
                                : myTourneyRegistrations.includes(activity.id);
                            return (
                                <TournamentCard
                                    key={uniqueKey}
                                    activity={activity}
                                    isAuthenticated={isAuthenticated}
                                    isRegistered={isReg}
                                    actionLoading={actionLoadingId === activity.id}
                                    isOpenParticipants={openParticipantsId === uniqueKey}
                                    onToggleParticipants={() => toggleParticipants(uniqueKey)}
                                    onAction={() => handleRegisterToggle(activity, isReg)}
                                    onLoginRedirect={() => navigate('/login')}
                                    t={t}
                                    i18n={i18n}
                                />
                            );
                        })}
                    </div>

                    <div className="text-center mt-12 flex justify-center gap-6">
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F4AF23] hover:text-[#ffbe3b] transition"
                        >
                            <Calendar className="w-4 h-4" /> {t('home_page.upcoming_all_events', 'Tous les Événements')}
                        </Link>
                        <Link
                            to="/tournaments"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F4AF23] hover:text-[#ffbe3b] transition"
                        >
                            <Trophy className="w-4 h-4" /> {t('home_page.upcoming_all_tournaments', 'Tous les Tournois')}
                        </Link>
                    </div>
                </div>
            )}

            {/* Featured Board Games Showcase */}
            {featuredGames.length > 0 && (
                <div className="max-w-7xl mx-auto py-20 px-4 border-t border-white/5">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-[#F4AF23]/10 text-[#F4AF23] border border-[#F4AF23]/20">
                            {t('home_page.featured.badge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            {t('home_page.featured.title')}
                        </h2>
                        <p className="text-lg text-slate-400 font-light">
                            {t('home_page.featured.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredGames.map((game) => (
                            <BoardGameCard
                                key={game.id}
                                game={game}
                                isExpanded={!!expandedGames[game.id]}
                                onToggleExpand={() => toggleExpand(game.id)}
                                onBookClick={() => navigate(`/reservations?game=${encodeURIComponent(game.name)}&type=BOARD_GAME`)}
                                t={t}
                                i18n={i18n}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/boardgames"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#F4AF23] hover:text-[#ffbe3b] transition"
                        >
                            {t('home_page.featured.view_all')}
                        </Link>
                    </div>
                </div>
            )}

            {/* Testimonials Section */}
            <div className="max-w-7xl mx-auto py-20 px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {t('home_page.testimonials.title')}
                    </h2>
                    <p className="text-lg text-slate-400 font-light">
                        {t('home_page.testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.isArray(testimonials) && testimonials.map((t, idx) => (
                        <div key={idx} className="bg-[#130f25]/45 p-8 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#563D82]/45 transition duration-300">
                            <div className="space-y-4">
                                <div className="flex text-amber-400 gap-0.5">
                                    {"★★★★★".split("").map((star, i) => (
                                        <span key={i} className="text-xl">{star}</span>
                                    ))}
                                </div>
                                <p className="text-slate-300 italic leading-relaxed font-light">
                                    "{t.quote}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                                <div className="w-11 h-11 bg-gradient-to-tr from-[#563D82] to-[#F4AF23] text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                                    {t.name ? t.name.charAt(0) : "P"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                    <p className="text-xs text-[#F4AF23] font-bold">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#20163a] to-[#0c0919] py-16 px-8 md:px-16 text-center text-white border border-[#563D82]/25 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#563D82]/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t('home_page.cta.title')}
                        </h2>
                        <p className="text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
                            {t('home_page.cta.description')}
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/reservations" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-3.5 px-8 rounded-xl transition duration-300 shadow-md shadow-amber-500/10">
                                {t('home_page.cta.buttons.book')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <div className="bg-[#130f25]/60 border border-[#563D82]/20 rounded-3xl p-8 backdrop-blur-md space-y-6 relative overflow-hidden">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#F4AF23]/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#563D82]/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="max-w-2xl mx-auto space-y-3 relative z-10 flex flex-col items-center">
                        <MessageSquare className="w-10 h-10 text-[#F4AF23]" />
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">
                            Une question ou besoin d'aide ?
                        </h2>
                        <p className="text-sm text-slate-400 font-light max-w-lg mx-auto">
                            Envoyez un message direct à nos administrateurs. Nous vous répondrons dans les plus brefs délais !
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    setIsContactModalOpen(true);
                                }}
                                className="bg-[#563D82] hover:bg-[#6c4fa1] text-white border border-[#F4AF23]/35 hover:border-[#F4AF23]/60 font-extrabold py-3 px-8 rounded-xl transition duration-300 shadow-md shadow-purple-500/5 cursor-pointer text-sm"
                            >
                                Contacter l'équipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto py-20 px-4 border-t border-white/5">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        {t('home_page.faq.title')}
                    </h2>
                    <p className="text-slate-400 font-light">
                        {t('home_page.faq.subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    {Array.isArray(faqItems) && faqItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#130f25]/45 rounded-xl border border-white/5 shadow-sm overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-[#1f1a3a]/45 transition-colors"
                            >
                                <span className="font-bold text-white text-base md:text-lg">
                                    {item.question}
                                </span>
                                <span className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F4AF23] transition-transform duration-300 font-mono text-xl ${activeFaq === index ? 'rotate-45' : ''}`}>
                                    ＋
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-96 border-t border-white/5' : 'max-h-0'}`}
                            >
                                <div className="p-6 text-slate-400 font-light leading-relaxed">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isContactModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
                    <div className="bg-[#130f25] backdrop-blur-md text-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/10 space-y-6 p-6 md:p-8 animate-in fade-in zoom-in duration-200 relative">
                        {/* Decorative glow */}
                        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#F4AF23]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#563D82]/15 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-[#F4AF23]" />
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Nouveau Message</h3>
                            </div>
                            <button 
                                onClick={() => setIsContactModalOpen(false)}
                                className="text-white/60 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!isAuthenticated ? (
                            <div className="space-y-6 text-center py-4 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-white">Connexion Requise</h4>
                                    <p className="text-sm text-white/60 font-light leading-relaxed max-w-sm mx-auto">
                                        Vous devez être connecté à votre compte Cicados pour pouvoir envoyer un message à nos administrateurs.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsContactModalOpen(false)}
                                        className="text-xs font-bold text-white/70 hover:text-white px-5 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition cursor-pointer"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsContactModalOpen(false);
                                            navigate('/login');
                                        }}
                                        className="text-xs font-extrabold bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] px-6 py-3 rounded-xl transition cursor-pointer shadow-md shadow-amber-500/10"
                                    >
                                        Se connecter
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Objet</label>
                                    <input 
                                        type="text"
                                        value={contactSubject}
                                        onChange={(e) => setContactSubject(e.target.value)}
                                        placeholder="Ex: Question sur un tournoi, Suggestion..."
                                        className="w-full bg-[#0c0919] border border-white/10 focus:border-[#F4AF23] text-white text-sm px-4 py-3 rounded-xl outline-none transition"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Votre Message <span className="text-rose-500">*</span></label>
                                    <textarea
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        placeholder="Écrivez votre message ici..."
                                        required
                                        rows="5"
                                        className="w-full bg-[#0c0919] border border-white/10 focus:border-[#F4AF23] text-white text-sm px-4 py-3 rounded-xl outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsContactModalOpen(false)}
                                        className="text-xs font-bold text-white/70 hover:text-white px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition cursor-pointer"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={sendingMessage}
                                        className="text-xs font-bold bg-[#F4AF23] hover:bg-[#ffbe3b] disabled:bg-slate-700 text-[#05040a] px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                                    >
                                        {sendingMessage && <div className="w-3.5 h-3.5 border-2 border-[#05040a] border-t-transparent rounded-full animate-spin"></div>}
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Home;