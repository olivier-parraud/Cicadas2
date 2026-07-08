import React from 'react';
import { Calendar, Users, ChevronDown } from 'lucide-react';
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
    const formattedDate = isEvent
        ? dateObj.toLocaleString(i18n.resolvedLanguage || i18n.language || 'fr', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        })
        : dateObj.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formattedTime = !isEvent
        ? dateObj.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
            hour: '2-digit',
            minute: '2-digit'
        })
        : '';

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

    const getImageForGame = (game) => {
        const gameLower = game ? game.toLowerCase() : '';
        if (gameLower.includes('magic')) {
            return '/images/TCG/Magic.jpg'; // local magic cards image
        }
        if (gameLower.includes('pokémon') || gameLower.includes('pokemon')) {
            return '/images/TCG/Pokemon'; // local pokémon cards image
        }
        if (gameLower.includes('one piece')) {
            return '/images/TCG/ONE-PIECE-LOGO.jpg'; // local one piece cards image
        }
        if (gameLower.includes('yu-gi-oh') || gameLower.includes('yugioh')) {
            return '/images/TCG/Yugioh.png'; // local yugioh image
        }
        if (gameLower.includes('star wars')) {
            return '/images/TCG/Star-Wars.jpeg'; // local star wars image
        }
        if (gameLower.includes('lorcana')) {
            return '/images/TCG/Lorcana.webp'; // local lorcana image
        }
        if (gameLower.includes('final fantasy')) {
            return '/images/TCG/FF-logo.png'; // local FF image
        }
        if (gameLower.includes('altered')) {
            return '/images/TCG/altered-logo.webp'; // local altered image
        }
        if (gameLower.includes('dragon ball')) {
            return '/images/TCG/Dragon-ball.jpeg'; // local dragon ball image
        }
        return '/images/TCG/Magic.jpg'; // default fallback image
    };

    // Styling configuration (supports light and dark themes)
    const isDark = theme === 'dark';
    const cardBgClass = isDark
        ? 'bg-[#110f24] border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 text-slate-350'
        : 'bg-white border-slate-100 hover:border-indigo-150 hover:shadow-xl text-slate-850';
    const titleClass = isDark ? 'text-white group-hover:text-indigo-400' : 'text-slate-950 group-hover:text-indigo-650';
    const descClass = isDark ? 'text-slate-400' : 'text-slate-650';
    const detailTextClass = isDark ? 'text-slate-400' : 'text-slate-600';
    const listTriggerClass = isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600';
    const listContainerClass = isDark ? 'bg-[#161430] border-white/5' : 'bg-slate-50 border-slate-200/50';
    const listItemClass = isDark ? 'bg-[#1d1b3e] text-slate-300 border-white/5' : 'bg-white text-slate-700 border-slate-200/50';
    const subBorderClass = isDark ? 'border-white/5' : 'border-slate-100';

    // Buttons actions configurations
    const actionUnregisterLabel = isEvent
        ? t('events_page.btn_registered') + ' (Se désinscrire)'
        : t('tournaments_page.unregister');

    const actionRegisterLabel = isEvent
        ? t('events_page.btn_register')
        : t('tournaments_page.register');

    const actionFullLabel = isEvent
        ? t('events_page.btn_full')
        : t('tournaments_page.full');

    return (
        <div className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 group ${cardBgClass}`}>
            <div>
                {/* Header Image */}
                <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                    <img
                        src={getImageForGame(activity.game)}
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                            {isEvent && (
                                <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getTypeColorClass(activity.type)}`}>
                                    {typeNames[activity.type]}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-extrabold text-indigo-500 bg-indigo-500/10 py-1 px-2.5 rounded-lg font-mono border border-indigo-500/20">
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
                            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="capitalize">
                                {formattedDate}{formattedTime ? ` à ${formattedTime}` : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className={spotsLeft <= 3 && spotsLeft > 0 ? "text-amber-400 font-bold" : isFull ? "text-red-400 font-bold" : ""}>
                                {isEvent
                                    ? (isFull
                                        ? t('events_page.btn_full')
                                        : spotsLeft === 1
                                            ? t('events_page.spots_left', { count: spotsLeft })
                                            : t('events_page.spots_left_plural', { count: spotsLeft }))
                                    : t('tournaments_page.capacity', { registered: activity.registeredCount, capacity: activity.capacity })
                                }
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
                                    isEvent ? (
                                        <div className="flex flex-wrap gap-1">
                                            {activity.participants.map((p, idx) => (
                                                <span key={idx} className={`inline-block text-[10px] px-2 py-0.5 rounded-lg border ${listItemClass}`}>
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        activity.participants.map((pName, index) => (
                                            <div key={index} className="text-xs flex items-center gap-2 mb-1 last:mb-0">
                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                <span>{pName}</span>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <div className="text-xs italic text-slate-400">
                                        {isEvent ? "Aucun inscrit pour le moment." : t('tournaments_page.no_registered')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action button */}
            <div className={`p-6 md:p-8 pt-0 border-t flex items-center justify-between gap-4 ${subBorderClass}`}>
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
