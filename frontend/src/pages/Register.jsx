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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError('Le mot de passe doit contenir au moins 1 caractère spécial.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

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
        <div className="min-h-screen bg-[#05040a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#F4AF23] selection:text-[#05040a]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#F4AF23]">
                    {t('register_page.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    {t('register_page.already_account')}{' '}
                    <Link to="/login" className="font-medium text-[#F4AF23] hover:text-[#ffbe3b]">
                        {t('register_page.login_link')}
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#130f25]/45 py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-white/5 backdrop-blur-md">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-350">{t('register_page.firstname')}</label>
                                <input type="text" required
                                    className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                    value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-350">{t('register_page.lastname')}</label>
                                <input type="text" required
                                    className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                    value={lastname} onChange={(e) => setLastname(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-350">{t('register_page.pseudo')}</label>
                            <input type="text" required
                                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                placeholder={t('register_page.pseudo_placeholder')}
                                value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-350">{t('register_page.email_label')}</label>
                            <input type="email" required
                                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-350">{t('register_page.password_label')}</label>
                            <input type="password" required minLength="8"
                                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            
                            <div className="mt-2.5 p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-xs text-indigo-200">
                                <p className="font-bold text-indigo-300">Préréquis du mot de passe :</p>
                                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300 font-light">
                                    <li>Au moins <strong className="font-semibold text-white">8 caractères</strong></li>
                                    <li>Au moins <strong className="font-semibold text-white">1 caractère spécial</strong></li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-350">Confirmer le mot de passe</label>
                            <input type="password" required minLength="8"
                                className="mt-1 appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-[#05040a] bg-[#F4AF23] hover:bg-[#ffbe3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4AF23] transition-colors cursor-pointer">
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