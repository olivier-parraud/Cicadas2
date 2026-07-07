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
        <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-600 selection:text-white pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white py-20 px-4 border-b border-indigo-900/50 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        🎲 {t('boardgames_page.badge')}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
                        {t('boardgames_page.title')}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        {t('boardgames_page.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-8">
                {error && (
                    <div className="p-4 rounded-xl text-sm font-semibold max-w-2xl mx-auto border bg-rose-50 border-rose-200 text-rose-800">
                        {error}
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-stretch justify-between">
                    {/* Search Field */}
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('boardgames_page.search_label')}</label>
                        <input
                            type="text"
                            placeholder={t('boardgames_page.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 px-4 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('boardgames_page.category_label')}</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full py-2.5 px-4 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'All' ? t('boardgames_page.all_categories') : t('categories.' + cat, { defaultValue: cat })}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Players Filter */}
                    <div className="w-full md:w-48">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('boardgames_page.players_label')}</label>
                        <input
                            type="number"
                            placeholder={t('boardgames_page.players_placeholder')}
                            min="1"
                            value={playersFilter}
                            onChange={(e) => setPlayersFilter(e.target.value)}
                            className="w-full py-2.5 px-4 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 text-sm">{t('boardgames_page.loading')}</p>
                    </div>
                ) : filteredGames.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200/60 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                        <span className="text-4xl">🎲</span>
                        <h3 className="text-lg font-bold text-slate-900">{t('boardgames_page.no_game')}</h3>
                        <p className="text-slate-500 font-light text-sm">
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
