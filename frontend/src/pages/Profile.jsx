import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Shield, Calendar, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [myMessages, setMyMessages] = useState([]);
    
    // Form fields
    const [pseudo, setPseudo] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5050/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setPseudo(data.user.pseudo || '');
                    setFirstname(data.user.firstname || '');
                    setLastname(data.user.lastname || '');
                    setEmail(data.user.email || '');
                    setAvatarUrl(data.user.avatar_url || '');
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_role');
                    navigate('/login');
                }
            } catch (err) {
                console.error("Erreur chargement profil :", err);
                setMessage({ type: 'error', text: t('profile.error_loading') || 'Erreur lors du chargement du profil.' });
            } finally {
                setLoading(false);
            }
        };

        const fetchMyMessages = async () => {
            try {
                const res = await fetch('http://localhost:5050/api/messages/my-messages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyMessages(data.messages || []);
                }
            } catch (err) {
                console.error("Erreur chargement messages :", err);
            }
        };

        fetchProfile();
        fetchMyMessages();
    }, [token, navigate, t]);

    const handleMarkReplyRead = async (msgId) => {
        try {
            await fetch(`http://localhost:5050/api/messages/${msgId}/user-read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMyMessages(prev => prev.map(m => m.id === msgId ? { ...m, user_read: 1 } : m));
            window.dispatchEvent(new Event('messages_updated'));
        } catch (err) {
            console.error("Erreur marquage lu :", err);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await fetch('http://localhost:5050/api/auth/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                setAvatarUrl(data.imageUrl);
                setMessage({ type: 'success', text: 'Photo de profil importée ! N\'oubliez pas d\'enregistrer vos modifications.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors du téléversement.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau lors de l\'envoi.' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (password) {
            if (password !== confirmPassword) {
                setMessage({ type: 'error', text: t('errors.passwords_mismatch') || 'Les mots de passe ne correspondent pas' });
                return;
            }
            if (password.length < 6) {
                setMessage({ type: 'error', text: t('errors.password_too_short') || 'Le mot de passe doit contenir au moins 6 caractères' });
                return;
            }
        }

        setActionLoading(true);
        try {
            const res = await fetch('http://localhost:5050/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    firstname,
                    lastname,
                    pseudo,
                    password: password || undefined,
                    avatar_url: avatarUrl
                })
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_role', data.user.role || 'USER');
                setMessage({ type: 'success', text: t('profile.update_success') || 'Profil mis à jour avec succès !' });
                setPassword('');
                setConfirmPassword('');
                window.dispatchEvent(new Event('storage'));
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour.' });
            }
        } catch (err) {
            console.error("Erreur soumission profil :", err);
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#563D82] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-xs font-semibold">Chargement de votre profil...</p>
            </div>
        );
    }

    const registrationDate = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    return (
        <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8 backdrop-blur-md relative overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#563D82]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#F4AF23]/15 rounded-full blur-3xl"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Mon Profil</h1>
                        <p className="text-xs text-slate-400 font-light mt-1">Gérez vos informations personnelles et identifiants</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-2xl text-sm font-semibold border flex items-center gap-3 transition-all ${
                        message.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar upload container */}
                    <div className="flex flex-col items-center justify-center space-y-2 pb-4">
                        <div className="relative group w-28 h-28 rounded-full border-2 border-white/10 hover:border-[#F4AF23]/60 transition-all duration-300 overflow-hidden bg-[#0c0919]/60 shadow-lg flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-slate-400 group-hover:scale-105 transition-transform" />
                            )}
                            
                            {/* Hover Overlay */}
                            <label 
                                htmlFor="avatar-file-input" 
                                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-[10px] text-[#F4AF23] font-extrabold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            >
                                Modifier
                            </label>
                            
                            {/* Uploading loader */}
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-[#0c0919]/75 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-[#F4AF23] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        
                        <input 
                            type="file" 
                            id="avatar-file-input" 
                            accept="image/*" 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                        />
                        <p className="text-[10px] text-slate-400 font-light">Taille recommandée : moins de 2 Mo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pseudo */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Pseudo
                            </label>
                            <input
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                placeholder="Votre pseudo..."
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Adresse Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>

                        {/* Prénom */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prénom</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                placeholder="Votre prénom..."
                            />
                        </div>

                        {/* Nom */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                placeholder="Votre nom..."
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 my-6"></div>

                    {/* Change password section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[#F4AF23]" /> Modifier le mot de passe (optionnel)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                    placeholder="Au moins 6 caractères..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border-2 !border-[#F4AF23]/40 !bg-[#0c0919] !text-white text-sm font-semibold focus:outline-none focus:!border-[#F4AF23] focus:ring-4 focus:ring-[#F4AF23]/20 shadow-sm transition-all !placeholder-slate-500"
                                    placeholder="Répétez le mot de passe..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                        {/* Member since */}
                        <div className="flex items-center gap-2 text-slate-400 font-light text-xs">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span>Membre depuis le : <strong className="text-white font-semibold">{registrationDate}</strong></span>
                        </div>

                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="py-3.5 px-8 rounded-2xl text-sm font-extrabold tracking-wide bg-[#563D82] text-[#F4AF23] border border-[#F4AF23]/30 shadow-lg shadow-[#563D82]/40 hover:bg-[#684b9c] transition-all duration-300 disabled:opacity-50 cursor-pointer self-end sm:self-auto min-w-[180px] text-center"
                        >
                            {actionLoading ? 'Mise à jour...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Mes Messages & Réponses des Administrateurs */}
            <div className="max-w-2xl w-full bg-[#130f25]/80 border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 backdrop-blur-md relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#F4AF23]" /> Mes Messages & Support
                    </h2>
                    <span className="text-xs text-slate-400 font-semibold">
                        {myMessages.length} message(s) envoyé(s)
                    </span>
                </div>

                {myMessages.length === 0 ? (
                    <p className="text-sm text-slate-400 font-light text-center py-6">
                        Vous n'avez envoyé aucun message à l'administration pour le moment.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {myMessages.map(msg => {
                            const isUnreadReply = msg.admin_reply && !msg.user_read;
                            return (
                                <div 
                                    key={msg.id}
                                    onClick={() => {
                                        if (isUnreadReply) {
                                            handleMarkReplyRead(msg.id);
                                        }
                                    }}
                                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                                        isUnreadReply 
                                        ? 'bg-[#181232] border-[#F4AF23]/50 shadow-lg shadow-[#F4AF23]/10 cursor-pointer' 
                                        : 'bg-[#0c0919]/60 border-white/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2 pb-2">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            {msg.subject}
                                            {isUnreadReply && (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white uppercase tracking-wider animate-pulse">
                                                    Nouvelle Réponse !
                                                </span>
                                            )}
                                        </h3>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-light whitespace-pre-wrap">{msg.content}</p>

                                    {msg.admin_reply ? (
                                        <div className="mt-3 p-4 rounded-xl bg-[#563D82]/30 border border-[#F4AF23]/30 text-xs space-y-1">
                                            <div className="font-extrabold text-[#F4AF23] flex items-center justify-between">
                                                <span>Réponse de l'Administrateur :</span>
                                                <span className="text-[10px] text-slate-400 font-mono font-normal">
                                                    {msg.replied_at ? new Date(msg.replied_at).toLocaleString('fr-FR') : ''}
                                                </span>
                                            </div>
                                            <p className="text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
                                                {msg.admin_reply}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-[11px] text-slate-500 italic">
                                            En attente de réponse de l'équipe...
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
