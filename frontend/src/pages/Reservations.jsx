import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Reservations() {
    const isAuthenticated = !!localStorage.getItem('token');
    const location = useLocation();

    const [formData, setFormData] = useState({
        gameType: 'MTG',
        date: '',
        time: '14:00',
        duration: '2',
        specificGame: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                setFormData({ ...formData, date: '', time: '14:00', duration: '2', specificGame: '' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Erreur lors de la réservation' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Impossible de contacter le serveur.' });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion requise</h2>
                    <p className="text-gray-600 mb-8">
                        Vous devez être connecté à votre compte Cicados pour pouvoir réserver une table de jeu.
                    </p>
                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition shadow-md w-full block">
                        Se connecter
                    </Link>
                    <div className="mt-4">
                        <span className="text-gray-500 text-sm">Pas encore de compte ? </span>
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Réserver une table</h1>
                    <p className="text-lg text-gray-600">
                        Choisissez votre jeu, votre créneau, et venez vous affronter chez Cicados !
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {status.message && (
                            <div className={`p-4 rounded-md text-sm font-medium ${
                                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                                {status.message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                À quel jeu / TCG voulez-vous jouer ?
                            </label>
                            <select 
                                name="gameType"
                                value={formData.gameType}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                            >
                                <option value="MTG">Magic: The Gathering</option>
                                <option value="YUGIOH">Yu-Gi-Oh!</option>
                                <option value="POKEMON">Pokémon TCG</option>
                                <option value="LORCANA">Disney Lorcana</option>
                                <option value="BOARD_GAME">Jeu de société</option>
                                <option value="OTHER">Autre</option>
                            </select>
                        </div>

                        {formData.gameType === 'BOARD_GAME' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jeu de société sélectionné
                                </label>
                                <input 
                                    type="text" 
                                    name="specificGame"
                                    placeholder="Ex: Catan, Azul..."
                                    value={formData.specificGame}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input 
                                    type="date" 
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Heure d'arrivée
                                </label>
                                <input 
                                    type="time" 
                                    name="time"
                                    required
                                    min="09:00"
                                    max="23:00"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Durée de la session (heures)
                            </label>
                            <input 
                                type="number" 
                                name="duration"
                                required
                                min="1"
                                max="10"
                                value={formData.duration}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Confirmer la réservation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Reservations;