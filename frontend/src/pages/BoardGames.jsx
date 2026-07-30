import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BoardGameCard from '../components/BoardGameCard';

function BoardGames() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [boardGames, setBoardGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [playersFilter, setPlayersFilter] = useState('');

    const [expandedGames, setExpandedGames] = useState({});

    const toggleExpand = (gameId) => {
        setExpandedGames(prev => ({
            ...prev,
            [gameId]: !prev[gameId]
        }));
    };

    useEffect(() => {
        const fetchBoardGames = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/boardgames');
                if (!response.ok) {
                    throw new Error(t('boardgames_page.load_err'));
                }
                const data = await response.json();
                setBoardGames(data);
            } catch (err) {
                console.error(err);
                setError(err.message || t('tournaments_page.err_conn'));
            } finally {
                setLoading(false);
            }
        };

        fetchBoardGames();
    }, []);

    // Get unique categories for filtering
    const categories = ['All', ...new Set(boardGames.map(game => game.category))];

    // Filter logic
    const filteredGames = boardGames.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;

        let matchesPlayers = true;
        if (playersFilter !== '') {
            const count = parseInt(playersFilter, 10);
            matchesPlayers = count >= game.min_players && count <= game.max_players;
        }

        return matchesSearch && matchesCategory && matchesPlayers;
    });

    return (
        <div className="min-h-screen text-white selection:bg-[#F4AF23] selection:text-[#05040a] pb-20">
            {/* Header Section delimited in a card with About page background */}
            <div className="max-w-7xl mx-auto pt-10 px-4 md:px-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#181232] via-[#130f25] to-[#0c0919] border border-[#F4AF23]/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-4 text-center">
                    {/* Ambient background glows like About page */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#563D82]/25 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#F4AF23]/15 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-[#F4AF23] leading-tight">
                            {t('boardgames_page.title')}
                        </h1>
                        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                            {t('boardgames_page.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
                {error && (
                    <div className="p-4 rounded-xl text-sm font-semibold max-w-2xl mx-auto border bg-rose-500/10 border-rose-500/20 text-rose-300">
                        {error}
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div className="bg-[#130f25]/75 p-6 md:p-8 rounded-3xl border-2 border-white/10 shadow-xl flex flex-col md:flex-row gap-5 items-stretch justify-between backdrop-blur-md">
                    {/* Search Field */}
                    <div className="flex-1 min-w-[280px]">
                        <label className="block text-xs font-extrabold text-[#F4AF23] uppercase tracking-wider mb-2">{t('boardgames_page.search_label')}</label>
                        <input
                            type="text"
                            placeholder={t('boardgames_page.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold border-2 border-[#F4AF23]/40 bg-[#0c0919] text-white focus:outline-none focus:border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-inner transition-all duration-300 placeholder:text-slate-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-80">
                        <label className="block text-xs font-extrabold text-[#F4AF23] uppercase tracking-wider mb-2">{t('boardgames_page.category_label')}</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold border-2 border-[#F4AF23]/40 bg-[#0c0919] text-white focus:outline-none focus:border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 hover:border-[#F4AF23] transition-all duration-300 cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'All' ? t('boardgames_page.all_categories') : t('categories.' + cat, { defaultValue: cat })}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Players Filter */}
                    <div className="w-full md:w-56">
                        <label className="block text-xs font-extrabold text-[#F4AF23] uppercase tracking-wider mb-2">{t('boardgames_page.players_label')}</label>
                        <input
                            type="text"
                            placeholder={t('boardgames_page.players_placeholder')}
                            value={playersFilter}
                            onChange={(e) => setPlayersFilter(e.target.value)}
                            className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold border-2 border-[#F4AF23]/40 bg-[#0c0919] text-white focus:outline-none focus:border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-inner transition-all duration-300 placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-[#F4AF23] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-400 text-sm">{t('boardgames_page.loading')}</p>
                    </div>
                ) : filteredGames.length === 0 ? (
                    <div className="bg-[#130f25]/45 p-12 rounded-3xl border border-white/5 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                        <span className="text-4xl">🎲</span>
                        <h3 className="text-lg font-bold text-white">{t('boardgames_page.no_game')}</h3>
                        <p className="text-slate-400 font-light text-sm">
                            {t('boardgames_page.no_game_desc')}
                        </p>
                    </div>
                ) : (
                    /* Games Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {filteredGames.map((game) => (
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
                )}
            </div>
        </div>
    );
}

export default BoardGames;
