import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
    const { t } = useTranslation();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5050/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, password, pseudo })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Inscription réussie, on redirige vers le login
                navigate('/login');
            } else {
                console.error("Données d'erreur retournées par l'API:", data);
                setError(data.error || data.message || t('register_page.default_error'));
            }
        } catch (err) {
            console.error("Erreur réseau/serveur:", err);
            setError(t('register_page.error_connection'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {t('register_page.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('register_page.already_account')}{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('register_page.login_link')}
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('register_page.firstname')}</label>
                                <input type="text" required
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('register_page.lastname')}</label>
                                <input type="text" required
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={lastname} onChange={(e) => setLastname(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('register_page.pseudo')}</label>
                            <input type="text" required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={t('register_page.pseudo_placeholder')}
                                value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('register_page.email_label')}</label>
                            <input type="email" required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('register_page.password_label')}</label>
                            <input type="password" required minLength="6"
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                {t('register_page.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;