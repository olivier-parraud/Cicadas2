import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import Button from '../components/Button';

const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function Reservations() {
    const { t, i18n } = useTranslation();
    const isAuthenticated = !!localStorage.getItem('token');
    const location = useLocation();

    const today = new Date().toISOString().split('T')[0];

    const getDefaultTime = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const futureSlot = TIME_SLOTS.find(slot => {
            const slotHour = parseInt(slot.split(':')[0], 10);
            return slotHour > currentHour;
        });
        return futureSlot || "14:00";
    };

    const [formData, setFormData] = useState({
        gameType: 'MTG',
        date: today,
        time: getDefaultTime(),
        duration: '2',
        specificGame: '',
        playersCount: '2'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [existingReservations, setExistingReservations] = useState([]);
    const [loadingPlanning, setLoadingPlanning] = useState(false);
    const [boardGames, setBoardGames] = useState([]);
    const [reservedGames, setReservedGames] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const game = queryParams.get('game');
        const type = queryParams.get('type');

        if (game || type) {
            setFormData(prev => ({
                ...prev,
                gameType: type || prev.gameType,
                specificGame: game || prev.specificGame
            }));
        }
    }, [location]);

    useEffect(() => {
        const fetchBoardGames = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/boardgames');
                if (response.ok) {
                    const data = await response.json();
                    setBoardGames(data);
                }
            } catch (err) {
                console.error("Erreur chargement jeux de société:", err);
            }
        };
        fetchBoardGames();
    }, []);

    useEffect(() => {
        const fetchGameAvailability = async () => {
            if (!formData.date || !formData.time || !formData.duration) return;
            try {
                const res = await fetch(`http://localhost:5050/api/reservations/game-availability?date=${formData.date}&time=${formData.time}&duration=${formData.duration}`);
                if (res.ok) {
                    const data = await res.json();
                    setReservedGames(data);
                }
            } catch (err) {
                console.error("Erreur chargement disponibilité jeux:", err);
            }
        };

        fetchGameAvailability();
    }, [formData.date, formData.time, formData.duration]);

    const fetchReservationsForDate = async (selectedDate) => {
        if (!selectedDate) return;
        setLoadingPlanning(true);
        try {
            const response = await fetch(`http://localhost:5050/api/reservations?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                setExistingReservations(data);
            }
        } catch (err) {
            console.error("Erreur chargement réservations date:", err);
        } finally {
            setLoadingPlanning(false);
        }
    };

    useEffect(() => {
        fetchReservationsForDate(formData.date);
    }, [formData.date]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getOccupiedTablesCount = (slotTime) => {
        if (!formData.date || !existingReservations.length) return 0;

        const slotDateTime = new Date(`${formData.date} ${slotTime}:00`);

        return existingReservations.filter(res => {
            const start = new Date(res.start_time);
            const end = new Date(res.end_time);
            return slotDateTime >= start && slotDateTime < end;
        }).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedDateTime = new Date(`${formData.date} ${formData.time}:00`);
        if (selectedDateTime.getTime() < Date.now()) {
            setStatus({ type: 'error', message: t('reservations_page.err_past_time', 'Impossible de réserver pour une date ou heure passée.') });
            return;
        }

        setStatus({ type: 'info', message: 'Envoi de votre demande de réservation...' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5050/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: t('reservations_page.success_msg') });
                // Réinitialiser le formulaire en conservant la date et rechargeant le planning
                setFormData(prev => ({ ...prev, time: '14:00', duration: '2', specificGame: '', playersCount: '2' }));
                fetchReservationsForDate(formData.date);
            } else {
                setStatus({ type: 'error', message: data.error || t('my_reservations_page.load_tables_error') });
            }
        } catch (error) {
            setStatus({ type: 'error', message: t('my_reservations_page.err_conn') });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#05040a] flex flex-col items-center justify-center p-4">
                <div className="bg-[#130f25]/45 p-8 rounded-3xl shadow-xl border border-white/5 max-w-md w-full text-center space-y-6">
                    <div className="text-5xl">🔒</div>
                    <h2 className="text-2xl font-bold text-white">{t('my_reservations_page.need_auth')}</h2>
                    <p className="text-slate-400 font-light text-sm">
                        {t('reservations_page.need_auth')}
                    </p>
                    <Link to="/login" className="bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold py-3 px-6 rounded-xl transition shadow-md w-full block text-xs">
                        {t('reservations_page.login_btn')}
                    </Link>
                    <div className="text-xs text-slate-400">
                        {t('reservations_page.no_account')}{' '}
                        <Link to="/register" className="text-[#F4AF23] hover:text-[#ffbe3b] font-semibold">
                            {t('reservations_page.register_link')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05040a] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#F4AF23] selection:text-[#05040a]">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#F4AF23]">{t('reservations_page.title')}</h1>
                    <p className="text-base text-slate-400 max-w-xl mx-auto font-light">
                        {t('reservations_page.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Formulaire de réservation (gauche) */}
                    <div className="lg:col-span-5 bg-[#130f25]/45 p-6 md:p-8 shadow-xl rounded-3xl border border-white/5 space-y-6">
                        <h2 className="text-lg font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                            {t('reservations_page.demand_title')}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status.message && (
                                <div className={`p-4 rounded-xl text-xs font-semibold border ${status.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                        : (status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-[#563D82]/10 border-white/5 text-[#F4AF23]')
                                    }`}>
                                    {status.message}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.game_type_label')}</label>
                                <select
                                    name="gameType"
                                    value={formData.gameType}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-slate-200"
                                >
                                    <option value="POKEMON">Pokémon</option>
                                    <option value="MTG">Magic: The Gathering</option>
                                    <option value="ONE_PIECE">One Piece Card Game</option>
                                    <option value="YUGIOH">Yu-Gi-Oh!</option>
                                    <option value="STAR_WARS">Star Wars: Unlimited</option>
                                    <option value="LORCANA">Disney Lorcana</option>
                                    <option value="FINAL_FF">Final Fantasy TCG</option>
                                    <option value="ALTERED">Altered</option>
                                    <option value="DBS">Dragon Ball Super Card Game</option>
                                    <option value="BOARD_GAME">{t('my_reservations_page.board_game_type')}</option>
                                    <option value="BYOG">{t('reservations_page.byog_label')}</option>
                                    <option value="OTHER">{t('reservations_page.other_label')}</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.players_count_label')}</label>
                                <select
                                    name="playersCount"
                                    value={formData.playersCount}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 bg-[#0c0919] text-slate-200"
                                >
                                    <option value="1">{t('reservations_page.player')}</option>
                                    <option value="2">{t('reservations_page.players', { count: 2 })}</option>
                                    <option value="3">{t('reservations_page.players', { count: 3 })}</option>
                                    <option value="4">{t('reservations_page.players', { count: 4 })}</option>
                                    <option value="5">{t('reservations_page.players', { count: 5 })}</option>
                                    <option value="6">{t('reservations_page.players', { count: 6 })}</option>
                                    <option value="7">{t('reservations_page.players', { count: 7 })}</option>
                                    <option value="8">{t('reservations_page.players_8')}</option>
                                </select>
                            </div>

                            {formData.gameType === 'BOARD_GAME' && (
                                <div className="space-y-1 relative">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.specific_game_label')}</label>
                                    <input
                                        type="text"
                                        name="specificGame"
                                        placeholder="Ex: Catan, Azul..."
                                        value={formData.specificGame}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, specificGame: e.target.value }));
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 font-light bg-[#0c0919] text-slate-200"
                                    />
                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                            <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-slate-950 border border-white/5 rounded-xl shadow-2xl z-50 divide-y divide-slate-900">
                                                {boardGames
                                                     .filter(g => g.name.toLowerCase().includes(formData.specificGame.toLowerCase()))
                                                     .map(game => {
                                                         const isOutOfStock = game.stock === 0;
                                                         const isReserved = reservedGames.includes(game.name.toLowerCase().trim()) || isOutOfStock;
                                                         return (
                                                             <button
                                                                 key={game.id}
                                                                 type="button"
                                                                 disabled={isReserved}
                                                                 onClick={() => {
                                                                     if (isReserved) return;
                                                                     setFormData(prev => ({ 
                                                                         ...prev, 
                                                                         specificGame: game.name,
                                                                         playersCount: Math.max(parseInt(prev.playersCount, 10), game.min_players || 1).toString()
                                                                     }));
                                                                     setIsDropdownOpen(false);
                                                                 }}
                                                                 className={`w-full text-left px-4 py-2.5 text-xs transition flex items-center justify-between gap-3 ${
                                                                     isReserved 
                                                                         ? 'bg-rose-950/20 text-slate-500 cursor-not-allowed opacity-60' 
                                                                         : 'text-slate-200 hover:bg-indigo-900/40 hover:text-white cursor-pointer'
                                                                 }`}
                                                             >
                                                                 <div className="flex items-center gap-3">
                                                                     {game.image_url && (
                                                                         <img 
                                                                             src={game.image_url} 
                                                                             alt={game.name} 
                                                                             className="w-8 h-8 object-contain bg-white/10 rounded-md"
                                                                             onError={(e) => {
                                                                                 e.target.onerror = null;
                                                                                 e.target.src = 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
                                                                             }}
                                                                         />
                                                                     )}
                                                                     <div className="flex flex-col">
                                                                         <span className="font-bold text-slate-200 text-sm">{game.name}</span>
                                                                         <span className="text-[10px] text-slate-400 font-light">{game.category} • {game.min_players}-{game.max_players} pl.</span>
                                                                     </div>
                                                                 </div>

                                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                                                     isReserved 
                                                                         ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                                                                         : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                                 }`}>
                                                                     {isOutOfStock ? 'Indisponible' : isReserved ? 'Hors stock (Déjà réservé)' : '1 en stock'}
                                                                 </span>
                                                             </button>
                                                         );
                                                     })
                                                }
                                                {boardGames.filter(g => g.name.toLowerCase().includes(formData.specificGame.toLowerCase())).length === 0 && (
                                                    <div className="p-4 text-xs text-slate-500 font-light text-center">
                                                        {t('reservations_page.no_game_found')}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.date_label')}</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={today}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 font-light bg-[#0c0919] text-slate-200"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.time_label')}</label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        min="09:00"
                                        max="23:00"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 font-light bg-[#0c0919] text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{t('reservations_page.duration_label')}</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    min="1"
                                    max="10"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/5 text-sm focus:outline-none focus:border-[#F4AF23]/50 font-light bg-[#0c0919] text-slate-200"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3.5 shadow-md"
                            >
                                {t('reservations_page.submit_btn')}
                            </Button>
                        </form>
                    </div>

                    {/* Planning Interactif (droite) */}
                    <div className="lg:col-span-7 bg-[#130f25]/45 p-6 md:p-8 shadow-xl rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#F4AF23] shrink-0" /> {t('reservations_page.planning_title')}
                            </h2>
                            <p className="text-xs text-slate-400 font-light mt-1">
                                {t('reservations_page.planning_subtitle')}
                            </p>
                        </div>

                        {!formData.date ? (
                            <div className="py-20 text-center bg-[#0c0919]/40 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-6 space-y-4">
                                <Calendar className="w-12 h-12 text-slate-500 animate-pulse" />
                                <h3 className="text-sm font-bold text-white">{t('reservations_page.no_date_selected')}</h3>
                                <p className="text-xs text-slate-400 font-light max-w-xs">
                                    {t('reservations_page.no_date_selected_desc')}
                                </p>
                            </div>
                        ) : loadingPlanning ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-10 h-10 border-4 border-[#F4AF23] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-slate-400">{t('reservations_page.loading_planning')}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-[#0c0919]/50 p-4 rounded-2xl border border-white/5 text-xs text-white">
                                    <span className="font-bold text-slate-350">{t('reservations_page.date_dispo_title')}</span>
                                    <span className="font-extrabold text-[#F4AF23] bg-[#563D82]/30 py-1.5 px-3.5 rounded-full border border-[#563D82]/50">
                                        {new Date(formData.date).toLocaleDateString(i18n.resolvedLanguage || i18n.language || 'fr', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {TIME_SLOTS.map(slot => {
                                        const slotStart = new Date(`${formData.date} ${slot}:00`);
                                        const inPast = slotStart.getTime() < Date.now();
                                        const durationHours = parseInt(formData.duration || '2', 10);
                                        const slotEnd = new Date(slotStart.getTime() + durationHours * 60 * 60 * 1000);

                                        const occupied = getOccupiedTablesCount(slot);
                                        const available = 4 - occupied;
                                        const isSelected = formData.time === slot;

                                        // Check if the specific board game is already reserved for this slot
                                        const isGameReservedForSlot = formData.specificGame && existingReservations.some(res => {
                                            if (!res.specific_game) return false;
                                            const isSameGame = res.specific_game.trim().toLowerCase() === formData.specificGame.trim().toLowerCase();
                                            if (!isSameGame) return false;

                                            const resStart = new Date(res.start_time);
                                            const resEnd = new Date(res.end_time);

                                            return resStart < slotEnd && resEnd > slotStart;
                                        });

                                        let bgClass = "bg-[#121c17] hover:bg-[#1a2d24] border-emerald-500/25 text-emerald-400 cursor-pointer";
                                        let badgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
                                        let label = t('reservations_page.tables_free', { count: available });
                                        let disabled = false;

                                        if (inPast) {
                                            bgClass = "bg-[#0c0919]/25 border-white/5 text-slate-500 opacity-40 cursor-not-allowed";
                                            badgeClass = "bg-white/5 text-slate-500 border border-white/5";
                                            label = t('reservations_page.slot_past', 'Indisponible');
                                            disabled = true;
                                        } else if (isGameReservedForSlot) {
                                            bgClass = "bg-[#2b101d] border-rose-500/40 text-rose-300 opacity-70 cursor-not-allowed";
                                            badgeClass = "bg-rose-500/20 text-rose-300 border border-rose-500/40";
                                            label = "Hors stock";
                                            disabled = true;
                                        } else if (available <= 0) {
                                            bgClass = "bg-[#25111b] border-rose-500/25 text-rose-400 opacity-60 cursor-not-allowed";
                                            badgeClass = "bg-rose-500/10 text-rose-400 border border-rose-500/25";
                                            label = t('reservations_page.full');
                                            disabled = true;
                                        } else if (available === 1) {
                                            bgClass = "bg-[#1d1b15] hover:bg-[#2c281e] border-amber-500/25 text-amber-400 cursor-pointer";
                                            badgeClass = "bg-amber-500/10 text-amber-400 border border-amber-500/25";
                                            label = t('reservations_page.table_free');
                                        }

                                        if (isSelected && !disabled) {
                                            bgClass = "bg-[#563D82] border-[#F4AF23] text-white shadow-lg shadow-[#563D82]/30 scale-102 cursor-pointer font-bold";
                                            badgeClass = "bg-black/40 text-[#F4AF23] border border-[#F4AF23]/30";
                                        }

                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                                                className={`flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all duration-200 ${bgClass}`}
                                            >
                                                <span className="text-lg font-extrabold tracking-tight">{slot}</span>
                                                <span className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                                                    {label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> {t('reservations_page.legend_free')}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> {t('reservations_page.legend_few')}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> {t('reservations_page.legend_full')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center pt-8">
                    {isAuthenticated && (
                        <Link 
                            to="/my-reservations" 
                            className="inline-flex items-center gap-3 px-12 py-5 bg-[#130f25]/45 hover:bg-[#1f1a3a]/45 text-white font-extrabold border border-white/5 rounded-2xl text-base md:text-lg transition cursor-pointer shadow-lg hover:shadow-[#F4AF23]/5 hover:scale-102 duration-300"
                        >
                            {t('reservations_page.view_my_reservations')}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reservations;