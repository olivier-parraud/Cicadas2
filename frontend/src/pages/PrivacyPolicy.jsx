import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, UserCheck, Trash2, ArrowLeft, HeartHandshake, Cookie } from 'lucide-react';

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#05040a] text-slate-200 selection:bg-[#F4AF23] selection:text-[#05040a] pb-24">
            
            {/* En-tête */}
            <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#130f25] to-black py-16 px-4 border-b border-white/5 text-center">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#563D82]/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#F4AF23]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#F4AF23] hover:underline mb-2">
                        <ArrowLeft className="w-3.5 h-3.5" /> Revenir à l'accueil
                    </Link>
                    <div className="inline-block mx-auto bg-[#F4AF23]/10 border border-[#F4AF23]/30 text-[#F4AF23] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Vos données & votre vie privée
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                        Chez Cicados, nous respectons votre vie privée. Voici en toute transparence comment nous protégeons vos informations.
                    </p>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

                {/* 1. Qui sommes-nous */}
                <div className="bg-[#130f25]/70 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                        <HeartHandshake className="w-5 h-5 text-[#F4AF23]" />
                        <h2 className="text-lg md:text-xl font-bold">1. Qui gère vos données ?</h2>
                    </div>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Le site <strong className="text-white font-medium">Cicados</strong> est édité par l'équipe du café-boutique Cicados, situé au <strong className="text-white font-medium">42 Rue du Cyber-Jeu, 75011 Paris</strong>.
                    </p>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Pour toute question concernant vos données ou votre compte, vous pouvez nous écrire directement à : <a href="mailto:contact@cicados.fr" className="text-[#F4AF23] underline font-medium">contact@cicados.fr</a>.
                    </p>
                </div>

                {/* 2. Ce que nous collectons */}
                <div className="bg-[#130f25]/70 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-5">
                    <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                        <UserCheck className="w-5 h-5 text-[#F4AF23]" />
                        <h2 className="text-lg md:text-xl font-bold">2. Quelles informations recueillons-nous ?</h2>
                    </div>

                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Nous ne vous demandons que le strict minimum pour profiter du café et participer aux événements :
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                        <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 space-y-1.5">
                            <span className="font-bold text-white block"> Votre adresse email</span>
                            <span className="text-slate-400 font-light block">Pour vous connecter à votre compte et recevoir vos confirmations de réservation.</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 space-y-1.5">
                            <span className="font-bold text-white block"> Votre mot de passe</span>
                            <span className="text-slate-400 font-light block">Entièrement chiffré et sécurisé. Personne, pas même nous, ne peut le lire en clair.</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 space-y-1.5">
                            <span className="font-bold text-white block"> Vos prénom & nom</span>
                            <span className="text-slate-400 font-light block">Pour vous accueillir chaleureusement au bar lors de votre venue.</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#0c0919]/60 border border-white/5 space-y-1.5">
                            <span className="font-bold text-white block"> Votre pseudonyme public</span>
                            <span className="text-slate-400 font-light block">Affiché sur les listes de tournois pour protéger votre nom de famille des autres joueurs.</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                        <strong className="font-bold text-amber-300"> Ce que nous ne vous demandons JAMAIS :</strong>
                        <p className="mt-1 font-light text-slate-300">
                            Aucun numéro de téléphone obligatoire, aucune localisation géographique, et aucune donnée bancaire enregistrée sur notre site.
                        </p>
                    </div>
                </div>

                {/* 3. À quoi servent ces données */}
                <div className="bg-[#130f25]/70 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                        <Lock className="w-5 h-5 text-[#F4AF23]" />
                        <h2 className="text-lg md:text-xl font-bold">3. À quoi servent vos données ?</h2>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300 font-light">
                        <li className="flex items-start gap-2">
                            <span className="text-[#F4AF23] font-bold">•</span>
                            <span>Gérer vos réservations de tables et vos emprunts de jeux de société.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#F4AF23] font-bold">•</span>
                            <span>Valider votre inscription aux tournois de cartes (Magic, Pokémon, Lorcana, etc.).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#F4AF23] font-bold">•</span>
                            <span>Vous répondre personnellement quand vous nous envoyez un message via le support.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span className="text-white font-medium">Zéro revente : vos données restent strictement chez Cicados et ne sont JAMAIS vendues ni transmises à des tiers publicitaires.</span>
                        </li>
                    </ul>
                </div>

                {/* 4. Vos droits */}
                <div className="bg-[#130f25]/70 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                        <ShieldCheck className="w-5 h-5 text-[#F4AF23]" />
                        <h2 className="text-lg md:text-xl font-bold">4. Vous gardez le contrôle total</h2>
                    </div>

                    <div className="space-y-3 text-sm text-slate-300 font-light leading-relaxed">
                        <p>
                            Vous pouvez modifier vos informations personnelles à tout moment en vous rendant sur votre <Link to="/profile" className="text-[#F4AF23] underline font-medium">page Profil</Link>.
                        </p>
                        <p>
                            Vous pouvez également <strong className="text-white font-medium">supprimer définitivement votre compte en un clic</strong> depuis votre profil. Toutes vos données personnelles, réservations et messages seront alors effacés immédiatement et définitivement de nos serveurs.
                        </p>
                    </div>
                </div>

                {/* 5. Cookies et navigation */}
                <div className="bg-[#130f25]/70 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                        <Cookie className="w-5 h-5 text-[#F4AF23]" />
                        <h2 className="text-lg md:text-xl font-bold">5. Cookies & navigation respectueuse</h2>
                    </div>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Nous n'utilisons <strong className="text-white font-medium">aucun cookie publicitaire ni traceur espion</strong>.
                    </p>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                        Seul un identifiant technique sécurisé est conservé dans votre navigateur pour vous permettre de rester connecté pendant votre navigation.
                    </p>
                </div>

                {/* Bouton retour */}
                <div className="text-center pt-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#F4AF23] hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Retourner sur le site
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default PrivacyPolicy;
