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
    const getCategoryColorClass = () => {
        return 'bg-violet-50 text-violet-700 border-2 border-black';
    };

    const words = game.description ? game.description.split(/\s+/) : [];
    const isLong = words.length > 50;

    return (
        <div className="bg-[#140f2d]/90 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-[#563D82]/30 hover:border-[#F4AF23]/50 transition-all duration-300 group hover:-translate-y-1">
            <div>
                {/* Cover image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 relative border-b border-white/10 flex items-center justify-center">
                    <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
                        }}
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center py-1.5 px-3.5 rounded-full text-xs font-extrabold bg-[#563D82]/90 text-[#f0eaff] border-2 border-black shadow-lg backdrop-blur-md">
                        {t('categories.' + game.category, { defaultValue: game.category })}
                    </span>
                    {(game.stock === 0) && (
                        <span className="absolute top-4 right-4 inline-flex items-center py-1.5 px-3 rounded-full text-xs font-extrabold bg-rose-600/95 text-white border-2 border-black shadow-lg backdrop-blur-md uppercase tracking-wider">
                            Indisponible
                        </span>
                    )}
                </div>

                {/* Game details */}
                <div className="p-6 md:p-8 space-y-4">
                    <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-[#F4AF23] transition-colors">
                        {game.name}
                    </h3>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                        <span className="bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                            {t('boardgames_page.players_count', { min: game.min_players, max: game.max_players })}
                        </span>
                        <span className="bg-white/5 border border-white/10 py-1.5 px-3 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                            {t('boardgames_page.duration', { time: game.play_time })}
                        </span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                        <TranslatedText 
                            text={game.description} 
                            toLang={i18n.resolvedLanguage || i18n.language || 'fr'} 
                            isExpanded={isExpanded} 
                        />
                        {isLong && (
                            <button
                                onClick={onToggleExpand}
                                className="text-[#F4AF23] hover:text-[#ffbe3b] font-bold ml-1.5 inline-block focus:outline-none transition-colors cursor-pointer bg-transparent border-none"
                            >
                                {isExpanded ? t('boardgames_page.see_less') : t('boardgames_page.see_more')}
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 pt-0 border-t border-white/5 flex flex-col gap-3">
                {game.rules_url && (
                    <a
                        href={game.rules_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2 text-xs font-semibold text-slate-400 hover:text-[#F4AF23] transition duration-300"
                    >
                        {t('boardgames_page.rules_link')}
                    </a>
                )}
                {game.stock === 0 ? (
                    <button
                        type="button"
                        disabled={true}
                        className="w-full py-3 rounded-full text-xs font-extrabold bg-rose-950/40 text-rose-300 border border-rose-500/30 opacity-70 cursor-not-allowed text-center uppercase tracking-wider"
                    >
                        Indisponible (Hors stock)
                    </button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={onBookClick}
                        className="w-full py-3 shadow-lg shadow-amber-500/10"
                    >
                        {t('boardgames_page.book_to_play')}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default BoardGameCard;
