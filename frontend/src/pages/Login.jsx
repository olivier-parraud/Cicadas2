import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5050/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Stocker le token et le rôle (localStorage)
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_role', data.user.role || 'USER');
                // Rediriger vers l'accueil
                window.location.href = '/';
            } else {
                console.error("Données d'erreur retournées par l'API:", data);
                setError(data.error || data.message || t('login_page.default_error'));
            }
        } catch (err) {
            console.error("Erreur réseau/serveur:", err);
            setError(t('login_page.error_connection'));
        }
    };

    return (
        <div className="min-h-screen bg-[#05040a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#F4AF23] selection:text-[#05040a]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#F4AF23]">
                    {t('login_page.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    {t('login_page.or')}{' '}
                    <Link to="/register" className="font-medium text-[#F4AF23] hover:text-[#ffbe3b]">
                        {t('login_page.create_account')}
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
                        <div>
                            <label className="block text-sm font-medium text-slate-350">{t('login_page.email_label')}</label>
                            <div className="mt-1">
                                <input id="email" type="email" required
                                    className="appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-350">{t('login_page.password_label')}</label>
                            <div className="mt-1">
                                <input id="password" type="password" required
                                    className="appearance-none block w-full px-3.5 py-2.5 border border-white/5 bg-[#0c0919] text-white rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:border-[#F4AF23]/50 sm:text-sm font-light"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-[#05040a] bg-[#F4AF23] hover:bg-[#ffbe3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4AF23] transition-colors cursor-pointer">
                                {t('login_page.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;