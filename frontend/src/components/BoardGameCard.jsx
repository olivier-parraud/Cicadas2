import React from 'react';
import TranslatedText from './TranslatedText';
import Button from './Button';

function BoardGameCard({
    game,
    isExpanded,
    onToggleExpand,
    onBookClick,
    t,
    i18n
}) {
    const getCategoryColorClass = (category) => {
        switch (category) {
            case 'Stratégie':
                return 'bg-violet-50 text-violet-700 border-violet-100';
            case 'Pose de tuiles':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Famille':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Abstrait':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Ambiance':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const words = game.description ? game.description.split(/\s+/) : [];
    const isLong = words.length > 50;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
            <div>
                {/* Cover image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                    <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
                        }}
                    />
                    <span className={`absolute top-4 left-4 inline-flex items-center py-1 px-3 rounded-full text-xs font-semibold border shadow-sm ${getCategoryColorClass(game.category)}`}>
                        {t('categories.' + game.category, { defaultValue: game.category })}
                    </span>
                </div>

                {/* Game details */}
                <div className="p-6 md:p-8 space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {game.name}
                    </h3>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                        <span className="bg-slate-100 py-1.5 px-3 rounded-xl flex items-center gap-1.5">
                            {t('boardgames_page.players_count', { min: game.min_players, max: game.max_players })}
                        </span>
                        <span className="bg-slate-100 py-1.5 px-3 rounded-xl flex items-center gap-1.5">
                            {t('boardgames_page.duration', { time: game.play_time })}
                        </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                        <TranslatedText 
                            text={game.description} 
                            toLang={i18n.resolvedLanguage || i18n.language || 'fr'} 
                            isExpanded={isExpanded} 
                        />
                        {isLong && (
                            <button
                                onClick={onToggleExpand}
                                className="text-indigo-600 hover:text-indigo-500 font-bold ml-1.5 inline-block focus:outline-none transition-colors cursor-pointer bg-transparent border-none"
                            >
                                {isExpanded ? t('boardgames_page.see_less') : t('boardgames_page.see_more')}
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 pt-0 border-t border-slate-50 flex flex-col gap-3">
                {game.rules_url && (
                    <a
                        href={game.rules_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition duration-300"
                    >
                        {t('boardgames_page.rules_link')}
                    </a>
                )}
                <Button
                    variant="primary"
                    onClick={onBookClick}
                    className="w-full py-3"
                >
                    {t('boardgames_page.book_to_play')}
                </Button>
            </div>
        </div>
    );
}

export default BoardGameCard;
