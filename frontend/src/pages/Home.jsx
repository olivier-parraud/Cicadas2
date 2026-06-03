import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Hero Section */}
            <div className="w-full bg-indigo-900 text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">Bienvenue chez Cicados</h1>
                <p className="text-xl max-w-2xl mx-auto mb-8 text-indigo-200">
                    L'endroit idéal pour vos parties de Magic The Gathering, Yu-Gi-Oh!, Pokémon, ou vos soirées jeux de société entre amis.
                </p>
                <Link to="/reservations" className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg">
                    Réserver une salle
                </Link>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-4xl mb-4">🎴</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Jeux de Cartes à Collectionner (TCG)</h2>
                    <p className="text-gray-600">
                        Des tables spacieuses parfaites pour disposer vos tapis de jeu. Que vous soyez joueur de MTG, Yu-Gi-Oh, Pokémon ou Lorcana, installez-vous confortablement pour vos duels ou tournois.
                    </p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="text-4xl mb-4">🎲</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Jeux de Société</h2>
                    <p className="text-gray-600">
                        Découvrez notre ludothèque ou amenez vos propres boîtes. Des tables de grande dimension pour accueillir les plus grands plateaux de jeu, dans une ambiance conviviale.
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div className="w-full bg-gray-100 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Comment ça marche ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div>
                            <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">1</span>
                            <h4 className="font-bold text-gray-800 mb-2">Choisissez votre activité</h4>
                            <p className="text-sm text-gray-600">Sélectionnez le type de jeu (TCG ou Jeu de société) pour vous proposer la table la plus adaptée.</p>
                        </div>
                        <div>
                            <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">2</span>
                            <h4 className="font-bold text-gray-800 mb-2">Sélectionnez le créneau</h4>
                            <p className="text-sm text-gray-600">Choisissez la date, l'heure et la durée de votre session de jeu selon nos disponibilités.</p>
                        </div>
                        <div>
                            <span className="bg-indigo-200 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">3</span>
                            <h4 className="font-bold text-gray-800 mb-2">Rejoignez-nous et jouez</h4>
                            <p className="text-sm text-gray-600">Une fois confirmé, présentez-vous à l'accueil le jour J. Votre table vous attendra !</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;