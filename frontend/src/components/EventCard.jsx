import React from 'react';
import { Calendar, Users, Clock, ChevronDown, User } from 'lucide-react';
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
    isAdmin = false,

    // Reservation-specific props
    isReservation = false,
    reservation = null,
    onEditReservation = null,
    onCancelReservation = null
}) {
    // helpers
    const getGameTypeName = (type) => {
        switch (type) {
            case 'POKEMON': return 'Pokémon';
            case 'MTG': return 'Magic: The Gathering';
            case 'ONE_PIECE': return 'One Piece Card Game';
            case 'YUGIOH': return 'Yu-Gi-Oh!';
            case 'LORCANA': return 'Disney Lorcana';
            case 'RIFTBOUND': return 'Riftbound TCG';
            case 'DBS': return 'Dragon Ball Super Card Game';
            case 'BOARD_GAME': return t('my_reservations_page.board_game_type', 'Jeux de société');
            case 'BYOG': return t('my_reservations_page.byog_type', 'BYOG');
            default: return t('my_reservations_page.other_type', 'Autre');
        }
    };

    const getGameImage = (type, specificGame) => {
        const gameLower = (specificGame || '').toLowerCase();
        if (type === 'BOARD_GAME') {
            return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
        }

        switch (type) {
            case 'MTG': return '/images/TCG/Magic.jpg';
            case 'POKEMON': return '/images/TCG/Pokemon';
            case 'ONE_PIECE': return '/images/TCG/ONE-PIECE-LOGO.jpg';
            case 'YUGIOH': return '/images/TCG/Yugioh.png';
            case 'LORCANA': return '/images/TCG/Lorcana.webp';
            case 'RIFTBOUND': return '/images/TCG/Riftbound 2.webp';
            case 'DBS': return '/images/TCG/Dragon-ball.jpeg';
            case 'BYOG': return 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
            default: return '/images/TCG/Magic.jpg';
        }
    };

    const formatRoomName = (roomName, gameType) => {
        if (!roomName) return 'Table Standard';
        const match = roomName.match(/Table\s+\d+/i);
        return match ? match[0] : roomName;
    };

    const getGameColorClass = (game) => {
        const g = (game || '').toLowerCase();
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

    const typeConfig = {
        avant_premiere: {
            label: t('events_page.prerelease'),
            colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        },
        draft: {
            label: t('events_page.draft'),
            colorClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        },
        initiation: {
            label: t('events_page.initiation'),
            colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }
    };

    // Calculate dates & times
    const dateSource = isReservation && reservation ? reservation.start_time : event?.date;
    const dateObj = new Date(dateSource);
    const formattedDate = dateObj.toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString(i18n.resolvedLanguage || i18n.language || 'fr', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (isReservation && reservation) {
        const resGameName = getGameTypeName(reservation.game_type);
        const durationHours = reservation.end_time ? Math.round((new Date(reservation.end_time) - new Date(reservation.start_time)) / (1000 * 60 * 60)) : 2;
        const imageUrl = reservation.boardgame_image_url || getGameImage(reservation.game_type, reservation.specific_game);

        return (
            <div className="rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 group bg-[#130f25]/45 backdrop-blur-md border-white/5 hover:border-[#F4AF23]/30 hover:shadow-2xl hover:shadow-[#F4AF23]/5 text-slate-300">
                <div>
                    {/* Header Image */}
                    <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                        <img
                            src={imageUrl}
                            alt={reservation.specific_game || reservation.game_type}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Content Box */}
                    <div className="p-6 md:p-8 space-y-4">
                        {/* Game badge & Room badge */}
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getGameColorClass(resGameName)}`}>
                                {resGameName}
                            </span>
                            <span className="text-xs font-bold bg-[#191428] border border-white/5 py-1 px-2.5 rounded-lg flex items-center gap-1.5 text-slate-300">
                                {formatRoomName(reservation.room_name, reservation.game_type)}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-extrabold tracking-tight transition-colors text-white group-hover:text-[#F4AF23]">
                            {reservation.specific_game || resGameName}
                        </h3>

                        {/* Details */}
                        <div className="space-y-2 text-xs font-light text-slate-600">
                            <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                                <span className="capitalize">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                                <span>
                                    {t('my_reservations_page.duration_hours', {
                                        time: formattedTime,
                                        duration: durationHours
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                                <span>{t('reservations_page.players', { count: reservation.players_count })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reservation Actions */}
                <div className="p-6 md:p-8 pt-0 border-t flex gap-3 border-slate-100">
                    <Button
                        variant="secondary"
                        onClick={onEditReservation}
                        className="flex-1"
                    >
                        {t('my_reservations_page.edit_btn')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onCancelReservation}
                        className="flex-1"
                    >
                        {t('my_reservations_page.cancel_btn')}
                    </Button>
                </div>
            </div>
        );
    }

    // Otherwise, render standard Event Card (unchanged design)
    const spotsLeft = event.capacity - event.registeredCount;
    const isFull = spotsLeft <= 0;
    const currentType = typeConfig[event.type] || { label: event.type, colorClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };

    // ─── Game styling helpers ───
    const getGameColorClassEvent = (game) => {
        const g = (game || '').toLowerCase();
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

    const getImageForGameEvent = (game) => {
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

    // Button labels
    const actionUnregisterLabel = t('events_page.btn_registered') + ' (Se désinscrire)';
    const actionRegisterLabel = t('events_page.btn_register');
    const actionFullLabel = t('events_page.btn_full');

    return (
        <div className="rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 group bg-[#130f25]/45 backdrop-blur-md border-white/5 hover:border-[#F4AF23]/30 hover:shadow-2xl hover:shadow-[#F4AF23]/5 text-slate-300">
            <div>
                {/* Header Image */}
                <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                    <img
                        src={getImageForGameEvent(event.game)}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 space-y-4">
                    {/* Game badge, type badge & price */}
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${getGameColorClassEvent(event.game)}`}>
                                {event.game}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold border ${currentType.colorClass}`}>
                                {currentType.label}
                            </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#F4AF23] bg-[#F4AF23]/10 py-1 px-2.5 rounded-lg font-mono border border-[#F4AF23]/20">
                            {event.price === 0 || event.price === "0.00"
                                ? t('events_page.price_free')
                                : `${Number(event.price).toFixed(2)}€`}
                        </span>
                    </div>

                    {/* Event title */}
                    <h3 className="text-xl font-extrabold tracking-tight transition-colors text-white group-hover:text-[#F4AF23]">
                        {event.name}
                    </h3>

                    {/* Date and spots left */}
                    <div className="space-y-2 text-xs font-light text-slate-400">
                        <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className="capitalize">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span className={spotsLeft <= 3 && spotsLeft > 0 ? "text-amber-400 font-bold" : isFull ? "text-red-400 font-bold" : ""}>
                                {t('tournaments_page.capacity', { registered: event.registeredCount, capacity: event.capacity })}
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
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-500" />
                                {t('tournaments_page.participants', 'Inscrits')} ({event.registeredCount})
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpenParticipants ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpenParticipants && (
                            <div className="mt-2 p-3 rounded-xl border max-h-36 overflow-y-auto bg-[#0c0919]/60 border-white/5">
                                {event.participants && event.participants.length > 0 ? (
                                    event.participants.map((p, index) => (
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
