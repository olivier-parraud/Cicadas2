import React from 'react';
import { Calendar, Users, ChevronDown, User } from 'lucide-react';
import TranslatedText from './TranslatedText';
import Button from './Button';

function TournamentCard({
    activity,
    isAuthenticated,
    isRegistered,
    actionLoading,
    isOpenParticipants,
    onToggleParticipants,
    onAction,
    onLoginRedirect,
    onEdit = null,
    t,
    i18n,
    theme = 'light', // 'light' or 'dark'
    isAdmin = false
}) {
    const isEvent = !!activity.type;
    const spotsLeft = activity.capacity - activity.registeredCount;
    const isFull = spotsLeft <= 0;
    const dateObj = new Date(activity.date);

    // Dynamic formatting based on locale and type of activity
    const formattedDate = dateObj.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = dateObj.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const typeNames = {
        avant_premiere: t('events_page.prerelease'),
        draft: t('events_page.draft'),
        initiation: t('events_page.initiation')
    };

    const getGameColorClass = (game) => {
        const gameLower = game ? game.toLowerCase() : '';
        if (gameLower.includes('magic')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (gameLower.includes('one piece')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (gameLower.includes('star wars')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (gameLower.includes('lorcana')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (gameLower.includes('riftbound')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    const getTypeColorClass = (type) => {
        if (type === 'avant_premiere') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (type === 'draft') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    };

    const getImageForGame = (game) => {
        const gameLower = game ? game.toLowerCase() : '';
        if (gameLower.includes('magic')) {
            return '/images/TCG/Magic.jpg'; // local magic cards image
        }
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) {
            return '/images/TCG/Pokemon'; // local pokémon cards image
        }
        if (gameLower.includes('one piece')) {
            return '/images/TCG/ONE PIECE LOGO2.avif'; // local one piece cards image
        }
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) {
            return '/images/TCG/Yugioh.png'; // local yugioh image
        }
        if (gameLower.includes('lorcana')) {
            return '/images/TCG/Lorcana.webp'; // local lorcana image
        }
        if (gameLower.includes('riftbound')) {
            return '/images/TCG/Riftbound 2.webp'; // local riftbound image
        }
        return '/images/TCG/Magic.jpg'; // default fallback image
    };

    // Styling configuration (supports light and dark themes)
    const isDark = theme === 'dark';
    const cardBgClass = isDark
        ? 'bg-[#130f25]/45 backdrop-blur-md border-white/5 hover:border-[#F4AF23]/30 hover:shadow-2xl hover:shadow-[#F4AF23]/5 text-slate-300'
        : 'bg-white border-slate-100 hover:border-indigo-150 hover:shadow-xl text-slate-850';
    const titleClass = isDark ? 'text-white group-hover:text-[#F4AF23]' : 'text-slate-950 group-hover:text-indigo-650';
    const descClass = isDark ? 'text-slate-400' : 'text-slate-650';
    const detailTextClass = isDark ? 'text-slate-400' : 'text-slate-600';
    const listTriggerClass = isDark ? 'text-slate-400 hover:text-[#F4AF23]' : 'text-slate-500 hover:text-[#F4AF23]';
    const listContainerClass = isDark ? 'bg-[#0a0715] border-white/5' : 'bg-slate-50 border-slate-200/50';
    const listItemClass = isDark ? 'bg-[#150f29] text-slate-300 border-white/5' : 'bg-white text-slate-700 border-slate-200/50';
    const subBorderClass = isDark ? 'border-white/5' : 'border-slate-100';

    // Buttons actions configurations
    const actionUnregisterLabel = t('tournaments_page.unregister');
    const actionRegisterLabel = t('tournaments_page.register');
    const actionFullLabel = t('tournaments_page.full');

    return (
        <div className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 group ${cardBgClass}`}>
            <div>
                {/* Header Image */}
                <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                    <img
                        src={getImageForGame(activity.game)}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 space-y-4">
                    {/* Game badge & price */}
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getGameColorClass(activity.game)}`}>
                                {activity.game}
                            </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#F4AF23] bg-[#F4AF23]/10 py-1 px-2.5 rounded-lg font-mono border border-[#F4AF23]/20">
                            {activity.price === 0 || activity.price === "0.00"
                                ? (isEvent ? t('events_page.price_free') : t('tournaments_page.free'))
                                : `${Number(activity.price).toFixed(2)}€`}
                        </span>
                    </div>

                    {/* Tournament title */}
                    <h3 className={`text-xl font-extrabold tracking-tight transition-colors ${titleClass}`}>
                        {activity.name}
                    </h3>

                    {/* Date and details */}
                    <div className={`space-y-2 text-xs font-light ${detailTextClass}`}>
                        <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-[#F4AF23] shrink-0" />
                            <span className="capitalize font-extrabold text-[#F4AF23] bg-[#F4AF23]/10 px-2.5 py-1 rounded-lg border border-[#F4AF23]/25">
                                {formattedDate}{formattedTime ? ` à ${formattedTime}` : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className={spotsLeft <= 3 && spotsLeft > 0 ? "text-amber-400 font-bold" : isFull ? "text-red-400 font-bold" : ""}>
                                {t('tournaments_page.capacity', { registered: activity.registeredCount, capacity: activity.capacity })}
                            </span>
                        </div>
                    </div>

                    <p className={`text-sm leading-relaxed font-light pt-2 ${descClass}`}>
                        <TranslatedText text={activity.description} toLang={i18n.resolvedLanguage || i18n.language || 'fr'} />
                    </p>

                    {/* Collapsible Registered Players List */}
                    <div className={`mt-4 pt-3 border-t ${subBorderClass}`}>
                        <button
                            type="button"
                            onClick={onToggleParticipants}
                            className={`flex items-center justify-between w-full text-left text-xs font-semibold transition cursor-pointer bg-transparent border-none ${listTriggerClass}`}
                        >
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-500" />
                                {t('tournaments_page.participants', 'Inscrits')} ({activity.registeredCount})
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpenParticipants ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpenParticipants && (
                            <div className={`mt-2 p-3 rounded-xl border max-h-36 overflow-y-auto ${listContainerClass}`}>
                                {activity.participants && activity.participants.length > 0 ? (
                                    activity.participants.map((p, index) => (
                                        <div key={index} className="text-xs flex items-center gap-2 mb-2 last:mb-0">
                                            {p.avatar_url ? (
                                                <img src={p.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover border border-white/10 shrink-0" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-slate-200/10 border border-white/10 flex items-center justify-center shrink-0">
                                                    <User className="w-3 h-3 text-slate-450" />
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-300">{p.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs italic text-slate-400">
                                        {t('tournaments_page.no_registered')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action button */}
            <div className={`p-6 md:p-8 pt-0 border-t flex items-center justify-between gap-3 ${subBorderClass}`}>
                {isAdmin ? (
                    <div className="flex gap-3 w-full">
                        {onEdit && (
                            <Button
                                variant={isDark ? "secondary-dark" : "secondary"}
                                onClick={onEdit}
                                className="flex-1 text-xs"
                            >
                                Modifier
                            </Button>
                        )}
                        <Button
                            variant="danger"
                            onClick={onAction}
                            loading={actionLoading}
                            className="flex-1 text-xs"
                        >
                            Supprimer
                        </Button>
                    </div>
                ) : !isAuthenticated ? (
                    <Button
                        variant={isDark ? "secondary-dark" : "secondary"}
                        onClick={onLoginRedirect}
                        className={`w-full ${isDark ? '' : 'text-indigo-700 bg-indigo-50 border-transparent hover:bg-indigo-100'}`}
                    >
                        {t('tournaments_page.login_required')}
                    </Button>
                ) : isRegistered ? (
                    <Button
                        variant={isDark ? "danger-dark" : "danger"}
                        onClick={onAction}
                        loading={actionLoading}
                        className="w-full"
                    >
                        {actionUnregisterLabel}
                    </Button>
                ) : (
                    <Button
                        variant={isFull ? (isDark ? 'secondary-dark' : 'secondary') : 'primary'}
                        onClick={onAction}
                        loading={actionLoading}
                        disabled={isFull}
                        className={`w-full ${isFull
                            ? (isDark ? 'opacity-40 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border border-slate-200/50 hover:bg-slate-100')
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

export default TournamentCard;
