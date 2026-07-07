import React from 'react';
import TranslatedText from './TranslatedText';
import Button from './Button';

function EventCard({
    event,
    isAuthenticated,
    isRegistered,
    actionLoading,
    isOpenParticipants,
    onToggleParticipants,
    onAction,
    onLoginRedirect,
    t,
    i18n,
    isAdmin = false
}) {
    const spotsLeft = event.capacity - event.registeredCount;
    const isFull = spotsLeft <= 0;
    const dateObj = new Date(event.date);

    // Date formatting with time for events
    const formattedDate = dateObj.toLocaleString(i18n.resolvedLanguage || i18n.language || 'fr', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    // ─── Type config ───
    const typeConfig = {
        avant_premiere: {
            label: t('events_page.prerelease'),
            emoji: '✨',
            colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        },
        draft: {
            label: t('events_page.draft'),
            emoji: '🃏',
            colorClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        },
        initiation: {
            label: t('events_page.initiation'),
            emoji: '🎓',
            colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }
    };

    const currentType = typeConfig[event.type] || { label: event.type, emoji: '📅', colorClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };

    // ─── Game styling helpers ───
    const getGameColorClass = (game) => {
        const g = game.toLowerCase();
        if (g.includes('magic')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (g.includes('pokémon') || g.includes('pokemon')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (g.includes('one piece')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        if (g.includes('yu-gi-oh') || g.includes('yugioh')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (g.includes('star wars')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (g.includes('lorcana')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (g.includes('final fantasy')) return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
        if (g.includes('altered')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        if (g.includes('dragon ball')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    const getGameEmoji = (game) => {
        const g = game.toLowerCase();
        if (g.includes('magic')) return '🃏';
        if (g.includes('pokémon') || g.includes('pokemon')) return '⚡';
        if (g.includes('one piece')) return '🏴‍☠️';
        if (g.includes('yu-gi-oh') || g.includes('yugioh')) return '🐉';
        if (g.includes('star wars')) return '🚀';
        if (g.includes('lorcana')) return '🏰';
        if (g.includes('final fantasy')) return '💎';
        if (g.includes('altered')) return '🔮';
        if (g.includes('dragon ball')) return '💥';
        return '🎲';
    };

    const getImageForGame = (game) => {
        const g = game ? game.toLowerCase() : '';
        if (g.includes('magic')) return '/images/TCG/Magic.jpg';
        if (g.includes('pokémon') || g.includes('pokemon')) return '/images/TCG/Pokemon';
        if (g.includes('one piece')) return '/images/TCG/ONE-PIECE-LOGO.jpg';
        if (g.includes('yu-gi-oh') || g.includes('yugioh')) return '/images/TCG/Yugioh.png';
        if (g.includes('star wars')) return '/images/TCG/Star-Wars.jpeg';
        if (g.includes('lorcana')) return '/images/TCG/Lorcana.webp';
        if (g.includes('final fantasy')) return '/images/TCG/FF-logo.png';
        if (g.includes('altered')) return '/images/TCG/altered-logo.webp';
        if (g.includes('dragon ball')) return '/images/TCG/Dragon-ball.jpeg';
        return '/images/TCG/Magic.jpg';
    };

    // ─── Button labels ───
    const actionUnregisterLabel = t('events_page.btn_registered') + ' (Se désinscrire)';
    const actionRegisterLabel = t('events_page.btn_register');
    const actionFullLabel = t('events_page.btn_full');

    return (
        <div className="rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 group bg-white border-slate-100 hover:border-indigo-150 hover:shadow-xl text-slate-800">
            <div>
                {/* Header Image */}
                <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                    <img
                        src={getImageForGame(event.game)}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 space-y-4">
                    {/* Game badge, type badge & price */}
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getGameColorClass(event.game)}`}>
                                {getGameEmoji(event.game)} {event.game}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${currentType.colorClass}`}>
                                {currentType.emoji} {currentType.label}
                            </span>
                        </div>
                        <span className="text-xs font-extrabold text-indigo-500 bg-indigo-500/10 py-1 px-2.5 rounded-lg font-mono border border-indigo-500/20">
                            {event.price === 0 || event.price === "0.00"
                                ? t('events_page.price_free')
                                : `${Number(event.price).toFixed(2)}€`}
                        </span>
                    </div>

                    {/* Event title */}
                    <h3 className="text-xl font-extrabold tracking-tight transition-colors text-slate-950 group-hover:text-indigo-650">
                        {event.name}
                    </h3>

                    {/* Date and spots left */}
                    <div className="space-y-2 text-xs font-light text-slate-600">
                        <div className="flex items-center gap-2.5">
                            <span>📅</span>
                            <span className="capitalize">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span>👥</span>
                            <span className={spotsLeft <= 3 && spotsLeft > 0 ? "text-amber-400 font-bold" : isFull ? "text-red-400 font-bold" : ""}>
                                {isFull
                                    ? t('events_page.btn_full')
                                    : spotsLeft === 1
                                        ? t('events_page.spots_left', { count: spotsLeft })
                                        : t('events_page.spots_left_plural', { count: spotsLeft })}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed font-light pt-2 text-slate-650">
                        <TranslatedText text={event.description} toLang={i18n.resolvedLanguage || i18n.language || 'fr'} />
                    </p>

                    {/* Collapsible Registered Players List */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onToggleParticipants}
                            className="flex items-center justify-between w-full text-left text-xs font-semibold transition cursor-pointer bg-transparent border-none text-slate-500 hover:text-indigo-600"
                        >
                            <span>👥 {t('tournaments_page.participants', 'Inscrits')} ({event.registeredCount})</span>
                            <span className={`transition-transform duration-200 transform ${isOpenParticipants ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {isOpenParticipants && (
                            <div className="mt-2 p-3 rounded-xl border max-h-36 overflow-y-auto bg-slate-50 border-slate-200/50">
                                {event.participants && event.participants.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {event.participants.map((p, idx) => (
                                            <span key={idx} className="inline-block text-[10px] px-2 py-0.5 rounded-lg border bg-white text-slate-700 border-slate-200/50">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs italic text-slate-400">
                                        {t('events_page.no_registered', 'Aucun inscrit pour le moment.')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action button */}
            <div className="p-6 md:p-8 pt-0 border-t flex items-center justify-between gap-4 border-slate-100">
                {isAdmin ? (
                    <Button
                        variant="danger"
                        onClick={onAction}
                        loading={actionLoading}
                        className="w-full"
                    >
                        Supprimer
                    </Button>
                ) : !isAuthenticated ? (
                    <Button
                        variant="secondary"
                        onClick={onLoginRedirect}
                        className="w-full text-indigo-700 bg-indigo-50 border-transparent hover:bg-indigo-100"
                    >
                        {t('tournaments_page.login_required')}
                    </Button>
                ) : isRegistered ? (
                    <Button
                        variant="danger"
                        onClick={onAction}
                        loading={actionLoading}
                        className="w-full"
                    >
                        {actionUnregisterLabel}
                    </Button>
                ) : (
                    <Button
                        variant={isFull ? 'secondary' : 'primary'}
                        onClick={onAction}
                        loading={actionLoading}
                        disabled={isFull}
                        className={`w-full ${isFull
                            ? 'bg-slate-100 text-slate-400 border border-slate-200/50 hover:bg-slate-100'
                            : 'border-transparent'
                            }`}
                    >
                        {isFull ? actionFullLabel : actionRegisterLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default EventCard;
