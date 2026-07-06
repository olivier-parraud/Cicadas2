import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function Reservations() {
    const isAuthenticated = !!localStorage.getItem('token');
    const location = useLocation();

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        gameType: 'MTG',
        date: today,
        time: '14:00',
        duration: '2',
        specificGame: '',
        playersCount: '2'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [existingReservations, setExistingReservations] = useState([]);
    const [loadingPlanning, setLoadingPlanning] = useState(false);

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
                setStatus({ type: 'success', message: 'Réservation confirmée ! Votre table vous attendra.' });
                // Réinitialiser le formulaire en conservant la date et rechargeant le planning
                setFormData(prev => ({ ...prev, time: '14:00', duration: '2', specificGame: '', playersCount: '2' }));
                fetchReservationsForDate(formData.date);
            } else {
                setStatus({ type: 'error', message: data.error || 'Erreur lors de la réservation' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Impossible de contacter le serveur.' });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
                    <div className="text-5xl">🔒</div>
                    <h2 className="text-2xl font-bold text-slate-900">Connexion requise</h2>
                    <p className="text-slate-500 font-light text-sm">
                        Vous devez être connecté à votre compte Cicados pour pouvoir réserver une table de jeu.
                    </p>
                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-md w-full block text-xs">
                        Se connecter
                    </Link>
                    <div className="text-xs text-slate-400">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-600 selection:text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        ☕ Salle de Jeu & TCG
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">Réserver une table</h1>
                    <p className="text-base text-slate-500 max-w-xl mx-auto font-light">
                        Choisissez votre jeu, planifiez votre séance en consultant les créneaux libres, et venez vous affronter chez Cicados !
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Formulaire de réservation (gauche) */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 shadow-xl rounded-3xl border border-slate-100 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                            <span>🎲</span> Demande de réservation
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status.message && (
                                <div className={`p-4 rounded-xl text-xs font-semibold border ${
                                    status.type === 'success' 
                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                                        : (status.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-indigo-50 border-indigo-100 text-indigo-800')
                                }`}>
                                    {status.message}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Jeu / TCG</label>
                                <select 
                                    name="gameType"
                                    value={formData.gameType}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                >
                                    <option value="MTG">Magic: The Gathering</option>
                                    <option value="YUGIOH">Yu-Gi-Oh!</option>
                                    <option value="POKEMON">Pokémon TCG</option>
                                    <option value="LORCANA">Disney Lorcana</option>
                                    <option value="BOARD_GAME">Jeu de société</option>
                                    <option value="OTHER">Autre</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de joueurs</label>
                                <select 
                                    name="playersCount"
                                    value={formData.playersCount}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 bg-white"
                                >
                                    <option value="1">1 joueur</option>
                                    <option value="2">2 joueurs</option>
                                    <option value="3">3 joueurs</option>
                                    <option value="4">4 joueurs</option>
                                    <option value="5">5 joueurs</option>
                                    <option value="6">6 joueurs</option>
                                    <option value="7">7 joueurs</option>
                                    <option value="8">8+ joueurs</option>
                                </select>
                            </div>

                            {formData.gameType === 'BOARD_GAME' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Jeu de société</label>
                                    <input 
                                        type="text" 
                                        name="specificGame"
                                        placeholder="Ex: Catan, Azul..."
                                        value={formData.specificGame}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input 
                                        type="date" 
                                        name="date"
                                        required
                                        min={today}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light bg-white"
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Heure d'arrivée</label>
                                    <input 
                                        type="time" 
                                        name="time"
                                        required
                                        min="09:00"
                                        max="23:00"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Durée (heures)</label>
                                <input 
                                    type="number" 
                                    name="duration"
                                    required
                                    min="1"
                                    max="10"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-650 font-light"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition duration-300 shadow-md shadow-indigo-600/10 cursor-pointer"
                            >
                                Réserver ma table
                            </button>
                        </form>
                    </div>

                    {/* Planning Interactif (droite) */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 shadow-xl rounded-3xl border border-slate-100 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>📅</span> Disponibilité des tables de jeu
                            </h2>
                            <p className="text-xs text-slate-400 font-light mt-1">
                                Nous possédons 4 tables de jeux. Sélectionnez une date pour visualiser l'occupation et choisir un créneau libre.
                            </p>
                        </div>

                        {!formData.date ? (
                            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 space-y-4">
                                <span className="text-5xl animate-bounce">🗓️</span>
                                <h3 className="text-sm font-bold text-slate-700">Aucune date sélectionnée</h3>
                                <p className="text-xs text-slate-400 font-light max-w-xs">
                                    Veuillez indiquer une date de visite dans le formulaire de gauche pour charger le planning horaire de nos tables.
                                </p>
                            </div>
                        ) : loadingPlanning ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-xs text-slate-400">Interrogation de l'agenda des tables...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-xs">
                                    <span className="font-bold text-slate-700">Disponibilités pour le :</span>
                                    <span className="font-extrabold text-indigo-750 bg-indigo-100 py-1.5 px-3.5 rounded-full border border-indigo-200/50">
                                        {new Date(formData.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {TIME_SLOTS.map(slot => {
                                        const occupied = getOccupiedTablesCount(slot);
                                        const available = 4 - occupied;
                                        const isSelected = formData.time === slot;
                                        
                                        let bgClass = "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-150 text-emerald-800 cursor-pointer";
                                        let badgeClass = "bg-emerald-600 text-white";
                                        let label = `${available} tables libres`;
                                        let disabled = false;

                                        if (available <= 0) {
                                            bgClass = "bg-rose-50 border-rose-150 text-rose-800 opacity-60 cursor-not-allowed";
                                            badgeClass = "bg-rose-600 text-white";
                                            label = "Complet";
                                            disabled = true;
                                        } else if (available === 1) {
                                            bgClass = "bg-amber-50 hover:bg-amber-100/80 border-amber-150 text-amber-800 cursor-pointer";
                                            badgeClass = "bg-amber-600 text-white";
                                            label = "1 table libre";
                                        }

                                        if (isSelected && !disabled) {
                                            bgClass = "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-102 cursor-pointer font-bold";
                                            badgeClass = "bg-white text-indigo-700";
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
                                
                                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Disponible (2 à 4 libres)
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Presque plein (1 libre)
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> Complet (0 libre)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservations;