#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de mise à jour automatique de la présentation Canva 'Cicados — Soutenance Titre Pro DWWM.pptx'
Met à jour l'ensemble des diapositives en respectant :
- La mise en page et l'esthétique Canva originale
- La structure logique des 3 premières pages (Couverture, Sommaire, Candidat)
- Le déroulé officiel exigé par le professeur pour la soutenance DWWM
- Un format synthétique (titres, mots-clés, puces courtes, aucun pavé de texte)
- Suppression des résidus de template (Lorem ipsum, Thynk Unlimited)
- Modération du vocabulaire technique (réduction du risque de régression)
"""

from pptx import Presentation

PPTX_PATH = "Cicados — Soutenance Titre Pro DWWM.pptx"

def set_shape_text(shape, lines):
    """Met à jour le texte d'une forme en préservant la police et la couleur du premier run."""
    if not shape.has_text_frame:
        return
    tf = shape.text_frame
    
    font_name = None
    font_size = None
    font_bold = None
    font_color_rgb = None
    font_color_type = None
    
    if tf.paragraphs and tf.paragraphs[0].runs:
        r0 = tf.paragraphs[0].runs[0]
        font_name = r0.font.name
        font_size = r0.font.size
        font_bold = r0.font.bold
        if r0.font.color and r0.font.color.type == 1:
            font_color_type = 1
            font_color_rgb = r0.font.color.rgb

    if isinstance(lines, str):
        lines = [lines]

    for i, line in enumerate(lines):
        if i < len(tf.paragraphs):
            p = tf.paragraphs[i]
            if p.runs:
                p.runs[0].text = line
                for r in p.runs[1:]:
                    r.text = ""
            else:
                p.text = line
        else:
            p = tf.add_paragraph()
            p.text = line
            if p.runs and font_name:
                p.runs[0].font.name = font_name
                if font_size:
                    p.runs[0].font.size = font_size
                if font_bold is not None:
                    p.runs[0].font.bold = font_bold
                if font_color_type == 1 and font_color_rgb:
                    p.runs[0].font.color.rgb = font_color_rgb

    for j in range(len(lines), len(tf.paragraphs)):
        tf.paragraphs[j].text = ""


def update_presentation():
    prs = Presentation(PPTX_PATH)
    print(f"Chargement de {PPTX_PATH} ({len(prs.slides)} diapositives)...")

    # === SLIDE 1 : COUVERTURE (Conservée selon demande) ===
    print("Slide 1 : Couverture vérifiée.")

    # === SLIDE 2 : SOMMAIRE (Conservé selon demande) ===
    print("Slide 2 : Sommaire vérifié.")

    # === SLIDE 3 : PRÉSENTATION CANDIDAT (Conservée selon demande) ===
    print("Slide 3 : Présentation candidat vérifiée.")

    # === SLIDE 4 : INTRODUCTION — LE CONTEXTE ===
    s4 = prs.slides[3]
    if len(s4.shapes) > 7:
        set_shape_text(s4.shapes[7], "Café-Boutique Hybride & Spécialisé")
    if len(s4.shapes) > 8:
        set_shape_text(s4.shapes[8], "• Établissement dédié aux jeux de société et tournois de cartes TCG (Pokémon, Lorcana, Magic, Yu-Gi-Oh!).")
    if len(s4.shapes) > 9:
        set_shape_text(s4.shapes[9], "• Capacité physique de 4 tables (16 places) : besoin impératif d'un outil digital de gestion et de réservation.")

    # === SLIDE 5 : INTRODUCTION — LE BESOIN MÉTIER ===
    s5 = prs.slides[4]
    if len(s5.shapes) > 2:
        set_shape_text(s5.shapes[2], "Gestion stricte de 4 tables physiques sans aucun surbooking. Réservation en ligne en temps réel et validation instantanée.")
    if len(s5.shapes) > 3:
        set_shape_text(s5.shapes[3], "Autonomie des joueurs 24h/24. Consultation immédiate des disponibilités et suppression des erreurs de réservation manuelles.")
    if len(s5.shapes) > 5:
        set_shape_text(s5.shapes[5], "Fédération de la communauté TCG. Gestion des inscriptions aux tournois officiels avec jauges de capacité limitées.")
    if len(s5.shapes) > 7:
        set_shape_text(s5.shapes[7], "Boutique en ligne et ludothèque physique. Suivi dynamique des stocks et catalogue synchronisé.")

    # === SLIDE 6 : INTRODUCTION — LA SOLUTION CICADOS ===
    s6 = prs.slides[5]
    if len(s6.shapes) > 2:
        set_shape_text(s6.shapes[2], "Gestion centralisée des 4 tables • Algorithme d'attribution anti-conflit • Jauge en temps réel et Toast.")
    if len(s6.shapes) > 3:
        set_shape_text(s6.shapes[3], "Catalogue jeux de société synchronisé BGG • Gestion des stocks boutique • Fiches produits complètes.")
    if len(s6.shapes) > 5:
        set_shape_text(s6.shapes[5], "Agenda officiel TCG • Inscriptions/désistements en 1 clic • Liste des participants avec avatars.")
    if len(s6.shapes) > 7:
        set_shape_text(s6.shapes[7], "Support client direct asynchrone • Suivi des conversations multi-tours • Pastilles de notification gérant.")

    # === SLIDE 7 : CONCEPTION — DÉMARCHE AGILE & PRÉPARATION (Suppression Lorem Ipsum) ===
    s7 = prs.slides[6]
    if len(s7.shapes) > 1:
        set_shape_text(s7.shapes[1], "Méthodologie Agile Scrum & Sprints itératifs de 2 semaines pour garantir une livraison maîtrisée et testée.")
    if len(s7.shapes) > 9:
        set_shape_text(s7.shapes[9], "Découpage en 4 Sprints : Sprint 0 (Cadrage/MCD) • Sprint 1 (MVC/Catalogue) • Sprint 2 (Réservations/Anti-surbooking) • Sprint 3 (Admin/Tests).")
    if len(s7.shapes) > 10:
        set_shape_text(s7.shapes[10], "Prototypage & Maquettage UX/UI : Wireframes fonctionnels sous Excalidraw, validation amont des parcours clients et ergonomie mobile.")
    if len(s7.shapes) > 11:
        set_shape_text(s7.shapes[11], "Priorisation continue par la valeur : Focus absolu sur les fonctionnalités vitales (anti-surbooking, sécurité, support).")

    # === SLIDE 8 : CONCEPTION — ANALYSE MOSCOW ===
    s8 = prs.slides[7]
    if len(s8.shapes) > 2:
        set_shape_text(s8.shapes[2], [
            "Réservation anti-surbooking",
            "Catalogue boutique & stocks",
            "Messagerie support multi-tours",
            "Authentification sécurisée JWT",
            "Dashboard Administrateur"
        ])
    if len(s8.shapes) > 3:
        set_shape_text(s8.shapes[3], [
            "Organisation tournois TCG",
            "Import automatique API BGG",
            "Basculement secours JSON",
            "Support bilingue i18next"
        ])
    if len(s8.shapes) > 5:
        set_shape_text(s8.shapes[5], [
            "Paiement en ligne Stripe (V2)",
            "Application mobile native (V2)",
            "WebSockets Socket.io temps réel",
            "Classement Elo compétitif"
        ])
    if len(s8.shapes) > 7:
        set_shape_text(s8.shapes[7], [
            "Filtres de recherche avancés",
            "Statistiques de fréquentation",
            "Mode sombre / contraste A11y",
            "Export CSV des réservations"
        ])

    # === SLIDE 9 : CONCEPTION — SPÉCIFICATIONS & USER STORIES ===
    s9 = prs.slides[8]
    if len(s9.shapes) > 0:
        set_shape_text(s9.shapes[0], [
            "User Stories Métier & Critères d'Acceptation :",
            "• Joueur : Je veux réserver une table libre pour garantir ma place au café sans incertitude.",
            "• Gérant : Je veux rejeter toute 5ème réservation simultanée pour préserver l'intégrité de mes 4 tables.",
            "• Membre : Je veux échanger directement avec l'équipe pour des questions sur les tournois.",
            "Règles d'acceptation formalisées garantissant une conformité totale au cahier des charges."
        ])
    if len(s9.shapes) > 5:
        set_shape_text(s9.shapes[5], "Soutenance DWWM")

    # === SLIDE 10 : CONCEPTION — CARTOGRAPHIE DU SITE ===
    s10 = prs.slides[9]
    if len(s10.shapes) > 2:
        set_shape_text(s10.shapes[2], "Accueil immersif, catalogue ludothèque synchronisé BGG, agenda officiel des tournois TCG et infos pratiques.")
    if len(s10.shapes) > 3:
        set_shape_text(s10.shapes[3], "Réservation de tables, inscription aux tournois, profil membre et messagerie support multi-tours.")
    if len(s10.shapes) > 5:
        set_shape_text(s10.shapes[5], "Inscription sécurisée avec conformité RGPD, connexion par token JWT, hachage Bcrypt des mots de passe.")
    if len(s10.shapes) > 7:
        set_shape_text(s10.shapes[7], "Console 6 onglets : Vue d'ensemble, Réservations, Tournois, Ludothèque, Stocks Boutique, Messages support.")

    # === SLIDE 11 : CONCEPTION — MODÉLISATION DES DONNÉES ===
    s11 = prs.slides[10]
    if len(s11.shapes) > 0:
        set_shape_text(s11.shapes[0], [
            "Schéma Relationnel MySQL (MCD / MLD) :",
            "• 8 tables normalisées : users, reservations, tournaments, tournament_registrations, boardgames, events, messages...",
            "• Intégrité référentielle stricte : Clés étrangères avec ON DELETE CASCADE garantissant zéro donnée orpheline.",
            "• Clés uniques et index composites : Prévention native des doublons d'inscriptions et de réservations."
        ])

    # === SLIDE 12 : DÉVELOPPEMENT 1 — RÉSERVATION : LE BESOIN ===
    s12 = prs.slides[11]
    if len(s12.shapes) > 1:
        set_shape_text(s12.shapes[1], [
            "Le Besoin Métier : Gérer 4 tables physiques avec zéro doublon",
            "Contrainte matérielle absolue : Le café dispose exactement de 4 tables physiques (16 places assises).",
            "Le défi : Permettre une réservation autonome en ligne 24/7 tout en garantissant mathématiquement qu'aucune table ne soit sur-réservée."
        ])

    # === SLIDE 13 : DÉVELOPPEMENT 1 — RÉSERVATION : SOLUTION TECHNIQUE ===
    s13 = prs.slides[12]
    if len(s13.shapes) > 0:
        set_shape_text(s13.shapes[0], [
            "Solution Technique : Algorithme d'Intersection Temporelle SQL",
            "• Requête SQL paramétrée vérifiant le nombre de réservations actives sur le créneau demandé.",
            "• Attribution automatique séquentielle de la première table disponible (Table 1 à Table 4).",
            "• Rejet préventif avec code HTTP 400 et message explicite dès que les 4 tables sont saturées.",
            "• Retour visuel immédiat : Toast de confirmation et actualisation dynamique de la jauge côté client."
        ])

    # === SLIDE 14 : DÉVELOPPEMENT 1 — RÉSERVATION : DÉFI & RÉSOLUTION ===
    s14 = prs.slides[13]
    if len(s14.shapes) > 0:
        set_shape_text(s14.shapes[0], [
            "Difficultés Rencontrées :",
            "• Gestion des chevauchements horaires complexes et risque d'accès simultanés concurrents.",
            "Résolution & Robustesse :",
            "• Algorithme centralisé côté backend dans reservation.controller.js avec requêtes préparées atomiques.",
            "• Résultat : Zéro surbooking possible, intégrité des 4 tables 100% garantie."
        ])

    # === SLIDE 15 : DÉVELOPPEMENT 2 — MESSAGERIE : LE BESOIN ===
    s15 = prs.slides[14]
    if len(s15.shapes) > 1:
        set_shape_text(s15.shapes[1], [
            "Le Besoin Métier : Canal de support direct et asynchrone client-gérant",
            "Les joueurs et participants aux tournois ont des questions fréquentes (matériel, règles, déroulement).",
            "Enjeu : Éviter les formulaires de contact isolés 'one-way' perdus par email, offrir un fil de discussion direct et rattaché au compte membre."
        ])

    # === SLIDE 16 : DÉVELOPPEMENT 2 — MESSAGERIE : SOLUTION TECHNIQUE ===
    s16 = prs.slides[15]
    if len(s16.shapes) > 0:
        set_shape_text(s16.shapes[0], [
            "Solution Technique : Architecture Conversationnelle Multi-Tours",
            "• Interface membre : Composant Profile.jsx avec historique chronologique complet et bouton 'Répondre'.",
            "• Console administrateur : Onglet Messages dédié avec badge NOUVEAU et formulaire de réponse rapide.",
            "• Persistance SQL : Table messages (id, sender, recipient, content, created_at, is_read)."
        ])

    # === SLIDE 17 : DÉVELOPPEMENT 2 — MESSAGERIE : DÉFI & RÉSOLUTION ===
    s17 = prs.slides[16]
    if len(s17.shapes) > 0:
        set_shape_text(s17.shapes[0], [
            "Difficultés Rencontrées :",
            "• Notification immédiate du gérant et synchronisation des pastilles sans rechargement de page.",
            "Résolution & Robustesse :",
            "• Émission d'événements custom 'messages_updated' et pastille dynamique adminUnreadCount dans le Header.",
            "• Résultat : Réactivité optimale de l'équipe, traçabilité des échanges et zéro question oubliée."
        ])

    # === SLIDE 18 : DÉVELOPPEMENT 3 — IMPORT BGG : LE BESOIN ===
    s18 = prs.slides[17]
    if len(s18.shapes) > 1:
        set_shape_text(s18.shapes[1], [
            "Importation BoardGameGeek & Boutique",
            "Besoin & Enjeux Métier :",
            "• Catalogue à jour : Données de référence BGG (jaquettes, nombre de joueurs, durée, complexité).",
            "• Gain de temps : Suppression de la saisie manuelle fastidieuse de centaines de jeux de société.",
            "• Double usage : Consultation en ludothèque et gestion des stocks de vente en boutique.",
            "• Défi : Traiter un flux XML2 externe depuis une Single Page Application React."
        ])

    # === SLIDE 19 : DÉVELOPPEMENT 3 — IMPORT BGG : SOLUTION TECHNIQUE ===
    s19 = prs.slides[18]
    if len(s19.shapes) > 0:
        set_shape_text(s19.shapes[0], [
            "Solution Technique : Proxy Express & Parser XML vers JSON",
            "• Proxy Node.js : Le serveur backend interroge l'API BGG XML2 pour contourner les blocages CORS.",
            "• Conversion à la volée : fast-xml-parser transforme le flux XML brut en objets JSON structurés.",
            "• Pipeline asynchrone : Extraction propre des métadonnées et stockage en base de données MySQL."
        ])

    # === SLIDE 20 : DÉVELOPPEMENT 3 — IMPORT BGG : DÉFI & RÉSOLUTION ===
    s20 = prs.slides[19]
    if len(s20.shapes) > 0:
        set_shape_text(s20.shapes[0], [
            "Difficultés Rencontrées :",
            "• Lenteurs chroniques et erreurs 504 Gateway Timeout de l'API publique BoardGameGeek.",
            "Résolution & Tolérance aux Pannes (Failover) :",
            "• Mécanisme de basculement automatique sur fichier de secours local JSON (boardgames_backup.json).",
            "• Résultat : Continuité de service 100% assurée pour les clients et l'administration même en cas de panne de l'API externe."
        ])

    # === SLIDE 21 : CONSOLE ADMINISTRATION ===
    s21 = prs.slides[20]
    if len(s21.shapes) > 12:
        set_shape_text(s21.shapes[12], "Boardgames : Import BGG, fiches jeux détaillées et gestion des stocks boutique.")
    if len(s21.shapes) > 13:
        set_shape_text(s21.shapes[13], "Messages : Support client multi-tours, statuts de lecture et réponses rapides.")
    if len(s21.shapes) > 14:
        set_shape_text(s21.shapes[14], "Tournois : Suivi des inscrits TCG, quotas (8 max) et affichage des participants.")
    if len(s21.shapes) > 15:
        set_shape_text(s21.shapes[15], "Users : Gestion des comptes membres et administrateurs, rôles et conformité RGPD.")
    if len(s21.shapes) > 16:
        set_shape_text(s21.shapes[16], "Reservations : Grille temps réel des 4 tables, calendrier et annulations en 1 clic.")
    if len(s21.shapes) > 17:
        set_shape_text(s21.shapes[17], "Sécurité : Routes protégées par adminMiddleware et contrôle strict des privilèges.")

    # === SLIDE 22 : POINTS TECHNIQUES — ARCHITECTURE & CHOIX ===
    s22 = prs.slides[21]
    if len(s22.shapes) > 2:
        set_shape_text(s22.shapes[2], "Backend Node.js / Express : API REST modulaire en couches (Routes, Contrôleurs, Modèles SQL) avec découpage MVC strict.")
    if len(s22.shapes) > 3:
        set_shape_text(s22.shapes[3], "Frontend React 18 SPA : Interface utilisateur réactive, composants modulaires et navigation fluide sans rechargement.")
    if len(s22.shapes) > 5:
        set_shape_text(s22.shapes[5], "Base de données MySQL : Structure relationnelle solide, contraintes d'intégrité (ON DELETE CASCADE) et requêtes préparées.")
    if len(s22.shapes) > 7:
        set_shape_text(s22.shapes[7], "Pourquoi cette stack ? Écosystème JavaScript unifié (Fullstack JS), maintenabilité éprouvée et modularité.")

    # === SLIDE 23 : POINTS TECHNIQUES — SÉCURITÉ OWASP & RGPD ===
    s23 = prs.slides[22]
    if len(s23.shapes) > 11:
        set_shape_text(s23.shapes[11], "Uploads Sécurisés : Middleware Multer avec contrôle strict des types MIME et renommage aléatoire.")
    if len(s23.shapes) > 12:
        set_shape_text(s23.shapes[12], "Sécurité CORS : Configuration stricte restreignant l'accès API à l'origine du frontend Vite.")
    if len(s23.shapes) > 13:
        set_shape_text(s23.shapes[13], "Conformité RGPD : Privacy by Design, minimisation des données et droit à l'oubli automatique.")
    if len(s23.shapes) > 14:
        set_shape_text(s23.shapes[14], "Authentification JWT : Tokens stateless signés HMAC-SHA256 avec clé secrète (.env), expiration à 24h.")
    if len(s23.shapes) > 15:
        set_shape_text(s23.shapes[15], "Hachage Bcrypt : Mots de passe chiffrés avec sel aléatoire (10 rounds), résistant aux attaques brute-force.")
    if len(s23.shapes) > 16:
        set_shape_text(s23.shapes[16], "Requêtes Préparées : Placeholders paramétrés ? neutralisant très efficacement le risque d'injection SQL.")

    # === SLIDE 24 : POINTS TECHNIQUES — PERFORMANCE & TESTS E2E ===
    s24 = prs.slides[23]
    if len(s24.shapes) > 2:
        set_shape_text(s24.shapes[2], "Tests E2E Automatisés : Suite Puppeteer pilotant Chrome headless simulant le parcours critique (Login ➔ Réservation ➔ Toast).")
    if len(s24.shapes) > 3:
        set_shape_text(s24.shapes[3], "Réduction du Risque : Réduction forte des risques de régression avant mise en production (exécution complète en 28s).")
    if len(s24.shapes) > 5:
        set_shape_text(s24.shapes[5], "Performance SPA : Navigation réactive sans rechargement de page, état React optimisé et composants légers.")
    if len(s24.shapes) > 7:
        set_shape_text(s24.shapes[7], "Optimisation Réseau : Mise en cache des données BGG, requêtes ciblées et temps de réponse API < 50ms.")
    if len(s24.shapes) > 12:
        set_shape_text(s24.shapes[12], "Performance & Tests E2E")

    # === SLIDE 25 : POINTS TECHNIQUES — DESIGN SYSTEM & ACCESSIBILITÉ ===
    s25 = prs.slides[24]
    if len(s25.shapes) > 0:
        set_shape_text(s25.shapes[0], "Thème Dark & Contraste")
    if len(s25.shapes) > 2:
        set_shape_text(s25.shapes[2], "Fond sombre (#05040a) et texte blanc (#ffffff) : Ratio de contraste de 14:1 (très au-delà du seuil WCAG 4.5:1).")
    if len(s25.shapes) > 4:
        set_shape_text(s25.shapes[4], "Accent #F4AF23")
    if len(s25.shapes) > 5:
        set_shape_text(s25.shapes[5], "Boutons jaune ambré avec texte sombre : Ratio de contraste 8.2:1 (conforme norme WCAG AAA).")
    if len(s25.shapes) > 7:
        set_shape_text(s25.shapes[7], "Accessibilité A11y / RGAA")
    if len(s25.shapes) > 8:
        set_shape_text(s25.shapes[8], "Formulaires avec labels htmlFor/id, focus clavier visible (:focus-visible), textes alternatifs alt descriptifs.")

    # === SLIDE 26 : POINTS TECHNIQUES — INTERNATIONALISATION (Nettoyage Thynk Unlimited) ===
    s26 = prs.slides[25]
    if len(s26.shapes) > 0:
        set_shape_text(s26.shapes[0], [
            "Support Bilingue Français / Anglais (i18next) :",
            "• Bascule instantanée de la langue sans aucun rechargement de page.",
            "• Fichiers de traduction JSON structurés (locales/fr.json et locales/en.json).",
            "• Accueil optimal des joueurs internationaux et touristes lors des grands tournois de cartes TCG."
        ])
    if len(s26.shapes) > 4:
        set_shape_text(s26.shapes[4], "Cicados")
    if len(s26.shapes) > 5:
        set_shape_text(s26.shapes[5], "Soutenance DWWM")

    # === SLIDE 27 : BILAN & COMPÉTENCES DWWM VALIDÉES ===
    s27 = prs.slides[26]
    if len(s27.shapes) > 1:
        set_shape_text(s27.shapes[1], "Compétences Titre Pro DWWM")
    if len(s27.shapes) > 2:
        set_shape_text(s27.shapes[2], [
            "• Activité 1 (Front-end) : Maquettage, intégration responsive et développement d'une SPA React dynamique.",
            "• Activité 2 (Back-end) : Conception base relationnelle MySQL, développement d'une API REST Express sécurisée.",
            "• Qualité & Sécurité : Application des normes OWASP, conformité RGPD, accessibilité WCAG et recette de tests validée."
        ])

    # === SLIDE 28 : CONCLUSION — RETOUR D'EXPÉRIENCE & DIFFICULTÉS ===
    s28 = prs.slides[27]
    if len(s28.shapes) > 2:
        set_shape_text(s28.shapes[2], "Algorithmes Temporels : Détection des chevauchements de créneaux résolue par des requêtes SQL ciblées et atomiques.")
    if len(s28.shapes) > 3:
        set_shape_text(s28.shapes[3], "Résilience API Tierce : Pannes de BoardGameGeek surmontées grâce au basculement automatique sur sauvegarde JSON locale.")
    if len(s28.shapes) > 5:
        set_shape_text(s28.shapes[5], "État React & Modales : Résolution des propagations d'événements (fix popup Pokémon) et synchronisation des pastilles.")
    if len(s28.shapes) > 7:
        set_shape_text(s28.shapes[7], "Rigueur Méthodologique : Valeur inestimable d'une conception préalable solide (MCD, Wireframes) pour coder sereinement.")
    if len(s28.shapes) > 12:
        set_shape_text(s28.shapes[12], "Retour d'Expérience & Difficultés")

    # === SLIDE 29 : CONCLUSION — PERSPECTIVES V2 ===
    s29 = prs.slides[28]
    if len(s29.shapes) > 2:
        set_shape_text(s29.shapes[2], "Sécurité Tokens OWASP : Migration vers des cookies HttpOnly + Refresh Token pour immuniser les sessions contre le vol XSS.")
    if len(s29.shapes) > 3:
        set_shape_text(s29.shapes[3], "Paiement en ligne Stripe : Règlement sécurisé des acomptes de réservation et frais de tournois (tokenisation PCI-DSS).")
    if len(s29.shapes) > 5:
        set_shape_text(s29.shapes[5], "WebSockets Socket.io : Actualisation en temps réel des jauges de tables et chat support sans polling HTTP.")
    if len(s29.shapes) > 7:
        set_shape_text(s29.shapes[7], "Application Mobile (React Native) & Export PDF : Récépissés avec QR Code et notifications push des tournois.")

    # === SLIDE 30 : CONCLUSION — SYNTHÈSE & DÉMONSTRATION LIVE ===
    s30 = prs.slides[29]
    if len(s30.shapes) > 1:
        set_shape_text(s30.shapes[1], "Démonstration en direct des fonctionnalités majeures répondant fidèlement aux besoins opérationnels du café-boutique :")
    if len(s30.shapes) > 9:
        set_shape_text(s30.shapes[9], "1. Réservation Anti-Surbooking : Choix de créneau horaire, attribution automatique de table et confirmation instantanée.")
    if len(s30.shapes) > 10:
        set_shape_text(s30.shapes[10], "2. Inscriptions aux Tournois TCG : Mise à jour de la jauge en direct, affichage des participants et désistement en 1 clic.")
    if len(s30.shapes) > 11:
        set_shape_text(s30.shapes[11], "3. Support Client Multi-Tours : Envoi d'une question membre, pastille de notification admin et réponse immédiate.")

    # === SLIDE 31 : REMERCIEMENTS & QUESTIONS ===
    s31 = prs.slides[30]
    if len(s31.shapes) > 8:
        set_shape_text(s31.shapes[8], "Merci pour votre écoute — Questions & Échanges avec le Jury | Olivier PARRAUD")

    prs.save(PPTX_PATH)
    print(f"Mise à jour réussie et enregistrée dans {PPTX_PATH} !")

if __name__ == "__main__":
    update_presentation()
