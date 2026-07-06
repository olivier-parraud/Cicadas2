import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TranslatedText from '../components/TranslatedText';

function Home() {
    const { t, i18n } = useTranslation();
    const [activeFaq, setActiveFaq] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [featuredGames, setFeaturedGames] = useState([]);
    const [expandedGames, setExpandedGames] = useState({});

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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-600 selection:text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white py-24 md:py-32 px-4 border-b border-indigo-900/50">
                {/* Decorative glowing circles */}
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            ✨ Espace de jeu & Tournois TCG
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
                            {t('home_page.hero.title')}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            {t('home_page.hero.description')}
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/reservations" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]">
                                {t('home_page.hero.cta')}
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex justify-center w-full">
                        <div className="relative group w-full max-w-md lg:max-w-none">
                            {/* Neon border background */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                            {/* Carousel Container */}
                            <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-[4/3] w-full">
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
                                        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md p-4 border-t border-indigo-900/40">
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
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 border border-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition z-20"
                                    aria-label="Slide précédent"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); setActiveSlide(prev => (prev + 1) % slides.length); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 border border-slate-800 flex items-center justify-center text-white hover:bg-indigo-600 transition z-20"
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('home_page.features.title')}
                    </h2>
                    <p className="text-lg text-slate-600 font-light">
                        {t('home_page.features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-semibold shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            📅
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                            {t('home_page.features.items.booking.title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                            {t('home_page.features.items.booking.description')}
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-semibold shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            🏆
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                            {t('home_page.features.items.tournaments.title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                            {t('home_page.features.items.tournaments.description')}
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-semibold shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            👥
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                            {t('home_page.features.items.groups.title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                            {t('home_page.features.items.groups.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="w-full bg-slate-100 border-y border-slate-200 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {t('home_page.how_it_works.title')}
                        </h2>
                        <p className="text-lg text-slate-600 font-light">
                            {t('home_page.how_it_works.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting line for larger screens */}
                        <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-indigo-200/50 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {t('home_page.how_it_works.steps.step_1.title')}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_1.description')}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {t('home_page.how_it_works.steps.step_2.title')}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_2.description')}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {t('home_page.how_it_works.steps.step_3.title')}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-light">
                                {t('home_page.how_it_works.steps.step_3.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Board Games Showcase */}
            {featuredGames.length > 0 && (
                <div className="max-w-7xl mx-auto py-20 px-4 border-t border-slate-200/10">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {t('home_page.featured.badge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t('home_page.featured.title')}
                        </h2>
                        <p className="text-lg text-slate-400 font-light">
                            {t('home_page.featured.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredGames.map((game) => (
                            <div
                                key={game.id}
                                className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
                            >
                                <div>
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                                        <img
                                            src={game.image_url}
                                            alt={game.name}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-4 left-4 inline-flex items-center py-1 px-3 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                                            {t('categories.' + game.category, { defaultValue: game.category })}
                                        </span>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {game.name}
                                        </h3>

                                        <div className="flex gap-2 text-xs font-bold text-slate-600">
                                            <span className="bg-slate-100/50 py-1 px-2.5 rounded-lg">
                                                {t('boardgames_page.players_count', { min: game.min_players, max: game.max_players })}
                                            </span>
                                            <span className="bg-slate-100/50 py-1 px-2.5 rounded-lg">
                                                {t('boardgames_page.duration', { time: game.play_time })}
                                            </span>
                                        </div>

                                        {(() => {
                                            const words = game.description ? game.description.split(/\s+/) : [];
                                            const isLong = words.length > 50;
                                            const isExpanded = !!expandedGames[game.id];
                                            return (
                                                <p className="text-slate-600 text-sm leading-relaxed font-light">
                                                    <TranslatedText 
                                                        text={game.description} 
                                                        toLang={i18n.resolvedLanguage || i18n.language || 'fr'} 
                                                        isExpanded={isExpanded} 
                                                    />
                                                    {isLong && (
                                                        <button
                                                            onClick={() => toggleExpand(game.id)}
                                                            className="text-indigo-600 hover:text-indigo-500 font-bold ml-1.5 inline-block focus:outline-none transition-colors cursor-pointer"
                                                        >
                                                            {isExpanded ? t('boardgames_page.see_less') : t('boardgames_page.see_more')}
                                                        </button>
                                                    )}
                                                </p>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <Link
                                        to={`/reservations?game=${encodeURIComponent(game.name)}&type=BOARD_GAME`}
                                        className="w-full text-center block py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300"
                                    >
                                        {t('home_page.featured.book_to_play')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/boardgames"
                            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-indigo-400 transition"
                        >
                            {t('home_page.featured.view_all')}
                        </Link>
                    </div>
                </div>
            )}

            {/* Testimonials Section */}
            <div className="max-w-7xl mx-auto py-20 px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('home_page.testimonials.title')}
                    </h2>
                    <p className="text-lg text-slate-600 font-light">
                        {t('home_page.testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.isArray(testimonials) && testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div className="space-y-4">
                                <div className="flex text-amber-400 gap-0.5">
                                    {"★★★★★".split("").map((star, i) => (
                                        <span key={i} className="text-xl">{star}</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 italic leading-relaxed font-light">
                                    "{t.quote}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                                <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                                    {t.name ? t.name.charAt(0) : "P"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                    <p className="text-xs text-indigo-600">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900 py-16 px-8 md:px-16 text-center text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t('home_page.cta.title')}
                        </h2>
                        <p className="text-lg text-indigo-100 font-light leading-relaxed max-w-xl mx-auto">
                            {t('home_page.cta.description')}
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/reservations" className="bg-white hover:bg-slate-100 text-indigo-900 font-bold py-3.5 px-8 rounded-xl transition duration-300 shadow-md">
                                {t('home_page.cta.buttons.book')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto py-20 px-4 border-t border-slate-200">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {t('home_page.faq.title')}
                    </h2>
                    <p className="text-slate-600 font-light">
                        {t('home_page.faq.subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    {Array.isArray(faqItems) && faqItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-950 text-base md:text-lg">
                                    {item.question}
                                </span>
                                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 transition-transform duration-300 font-mono text-xl ${activeFaq === index ? 'rotate-45' : ''}`}>
                                    ＋
                                </span>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-96 border-t border-slate-50' : 'max-h-0'}`}
                            >
                                <div className="p-6 text-slate-600 font-light leading-relaxed">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;