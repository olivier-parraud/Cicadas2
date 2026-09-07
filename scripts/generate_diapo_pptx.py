import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank

    # Colors
    BG_COLOR = RGBColor(17, 13, 32)        # #110D20 (deep dark violet)
    CARD_BG = RGBColor(28, 20, 52)         # #1C1434 (card surface)
    CARD_BORDER = RGBColor(67, 50, 102)    # #433266 (subtle border)
    GOLD_AMBER = RGBColor(255, 191, 0)     # #FFBF00 (primary accent)
    PURPLE_LILAC = RGBColor(192, 132, 252) # #C084FC (tag / highlight)
    PURPLE_NEON = RGBColor(168, 85, 247)  # #A855F7
    TEXT_WHITE = RGBColor(255, 255, 255)   # #FFFFFF
    TEXT_MUTED = RGBColor(156, 163, 175)   # #9CA3AF
    ACCENT_GREEN = RGBColor(52, 211, 153)  # #34D399 (solution / success)
    ACCENT_RED = RGBColor(248, 113, 113)   # #F87171 (problem / error)
    ACCENT_CYAN = RGBColor(56, 189, 248)   # #38BDF8 (tech / info)

    # Helper: Set slide background
    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background() # no line

    # Helper: Add Header
    def add_header(slide, section_tag, title_text, slide_num):
        # Section Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(8.0), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = section_tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = GOLD_AMBER

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(10.5), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

        # Slide Number (bottom right or top right)
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.45), Inches(1.0), Inches(0.4))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = f"{slide_num:02d} / 30"
        p_num.font.size = Pt(12)
        p_num.font.bold = True
        p_num.font.color.rgb = PURPLE_LILAC
        p_num.alignment = PP_ALIGN.RIGHT

    # Helper: Add Card
    def add_card(slide, left, top, width, height, title, items, badge="", accent_color=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = accent_color if accent_color else CARD_BORDER
        card.line.width = Pt(1.5 if accent_color else 1)

        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Badge (optional)
        if badge:
            p_badge = tf.paragraphs[0]
            p_badge.text = badge.upper()
            p_badge.font.size = Pt(10)
            p_badge.font.bold = True
            p_badge.font.color.rgb = accent_color if accent_color else PURPLE_LILAC
            p_title = tf.add_paragraph()
        else:
            p_title = tf.paragraphs[0]

        p_title.text = title
        p_title.font.size = Pt(18)
        p_title.font.bold = True
        p_title.font.color.rgb = GOLD_AMBER if not accent_color else accent_color
        p_title.space_after = Pt(12)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"• {item}"
            p_item.font.size = Pt(14)
            p_item.font.color.rgb = TEXT_WHITE
            p_item.space_after = Pt(6)

    # ==========================================
    # SLIDE 1 : COUVERTURE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)
    
    # Title Box
    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.4), Inches(11.33), Inches(3.0))
    tf = t_box.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "TITRE PROFESSIONNEL DWWM — SESSION 2026"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GOLD_AMBER
    p.space_after = Pt(14)

    p = tf.add_paragraph()
    p.text = "CICADOS"
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Plateforme Web de Réservation de Tables & Événements pour Café-Jeux et Duels TCG"
    p.font.size = Pt(20)
    p.font.color.rgb = PURPLE_LILAC
    p.space_after = Pt(20)

    # Info cards bottom
    add_card(s1, Inches(1.0), Inches(5.0), Inches(5.3), Inches(1.8), "Candidat", [
        "Olivier PARRAUD",
        "Développeur Fullstack Web & Web Mobile",
        "Référentiel REAC — Ministère du Travail"
    ], "Profil", GOLD_AMBER)

    add_card(s1, Inches(6.8), Inches(5.0), Inches(5.5), Inches(1.8), "Établissement & Évaluation", [
        "La Plateforme — Marseille",
        "Titre Professionnel Niveau 5 (Bac +2)",
        "Soutenance devant Jury Professionnel"
    ], "Cadre", PURPLE_LILAC)

    # ==========================================
    # SLIDE 2 : PARCOURS & RECONVERSION
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "1. Introduction", "Parcours & Reconversion Professionnelle", 2)
    
    add_card(s2, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Socle Technique", [
        "Bac Professionnel Système Numérique",
        "Option Réseaux informatiques",
        "Rigueur logique & gestion",
        "Mécanismes d'infrastructure"
    ], "Origines", ACCENT_CYAN)

    add_card(s2, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Le Déclic Web", [
        "Période charnière de reconversion",
        "Envie de création concrète",
        "Allier rigueur backend & ergonomie front",
        "Passion pour l'univers du jeu"
    ], "Transition", GOLD_AMBER)

    add_card(s2, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "La Plateforme", [
        "Formation intensive DWWM",
        "Apprentissage par projets réels",
        "Pratiques professionnelles modernes",
        "Scrum, Git collaboratif, autonomie"
    ], "Validation", PURPLE_LILAC)

    # ==========================================
    # SLIDE 3 : CONTEXTE LUDIQUE
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "1. Introduction", "Le Marché Hybride : Bar à Jeux & Duels TCG", 3)

    add_card(s3, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "L'Essor des Cafés-Jeux", [
        "Lieux hybrides : café, bar & boutique",
        "Forte demande de convivialité",
        "Consommation + location d'espaces",
        "Rotation rapide des tables"
    ], "Tendance", GOLD_AMBER)

    add_card(s3, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Le Boom des TCG", [
        "Magic: The Gathering, Pokémon",
        "Lorcana, Yu-Gi-Oh!, Riftbound",
        "Événements compétitifs hebdomadaires",
        "Besoin de formats officiels certifiés"
    ], "Communauté", PURPLE_LILAC)

    add_card(s3, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "La Réalité Opérationnelle", [
        "Gestion logistique complexe",
        "Temps limité pour le gérant",
        "Attente forte d'immédiateté client",
        "Nécessité de digitalisation"
    ], "Terrain", ACCENT_CYAN)

    # ==========================================
    # SLIDE 4 : LE BESOIN & PROBLÉMATIQUES
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "1. Introduction", "Problématiques Métier & Besoins Identifiés", 4)

    add_card(s4, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Surbooking Physique", [
        "Capacité restreinte : 4 tables",
        "Conflits horaires récurrents",
        "Perte de clients déçus",
        "Gestion papier / tableur inadaptée"
    ], "Problème 1", ACCENT_RED)

    add_card(s4, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Gestion des Tournois", [
        "Inscriptions dispersées (réseaux, SMS)",
        "Jauges dépassées sans contrôle",
        "Désistements non anticipés",
        "Manque de visibilité en temps réel"
    ], "Problème 2", ACCENT_RED)

    add_card(s4, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Communication Éparpillée", [
        "Questions règles / decks sans canal direct",
        "Stock boutique inconnu du public",
        "Saisie manuelle des fiches jeux chronophage",
        "Absence de back-office unifié"
    ], "Problème 3", ACCENT_RED)

    # ==========================================
    # SLIDE 5 : LA SOLUTION CICADOS
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "1. Introduction", "La Solution Cicados : Écosystème Tout-en-Un", 5)

    add_card(s5, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "Réservation 0 Conflit", [
        "Contrôle anti-surbooking",
        "Allocation dynamique 4 tables",
        "Grille horaire temps réel",
        "Vérification du stock jeu"
    ], "Moteur", ACCENT_GREEN)

    add_card(s5, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "Tournois TCG", [
        "Agenda dynamique mensuel",
        "Jauges automatiques",
        "Inscription 1-clic sécurisée",
        "Listes joueurs réactives"
    ], "Événements", GOLD_AMBER)

    add_card(s5, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "Ludothèque & Stock", [
        "Catalogue 100+ jeux",
        "Import automatique BGG",
        "Contrôle rapide du stock (+/-)",
        "Failover haute résilience"
    ], "Boutique", PURPLE_LILAC)

    add_card(s5, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "Support & Back-Office", [
        "Messagerie membre multi-tours",
        "Pastille rouge réactive",
        "Console admin 6 onglets",
        "Gestion globale en 1 clic"
    ], "Gestion", ACCENT_CYAN)

    # ==========================================
    # SLIDE 6 : MÉTHODOLOGIE AGILE SCRUM
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "2. Conception", "Organisation de Projet & Méthode Agile Scrum", 6)

    add_card(s6, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "Sprint 0 : Cadrage", [
        "Cahier des charges complet",
        "Modélisation BDD (MCD/MLD)",
        "Wireframes & Maquettes Figma",
        "Dictionnaire de données"
    ], "Semaine 1", ACCENT_CYAN)

    add_card(s6, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "Sprint 1 : Core & MVC", [
        "Serveur Express & Pool MySQL",
        "Design System Tailwind CSS",
        "Pages Accueil & Ludothèque",
        "Fiches détails de jeux"
    ], "Semaine 2", GOLD_AMBER)

    add_card(s6, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "Sprint 2 : Métier Clé", [
        "Auth JWT & Rôles (RBAC)",
        "Moteur anti-surbooking",
        "Inscriptions tournois TCG",
        "Grille horaire interactive"
    ], "Semaine 3", PURPLE_LILAC)

    add_card(s6, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "Sprint 3 : Admin & Tests", [
        "Dashboard Admin 6 onglets",
        "Messagerie client multi-tours",
        "Proxy BGG & Failover JSON",
        "Tests E2E automatisés"
    ], "Semaine 4", ACCENT_GREEN)

    # ==========================================
    # SLIDE 7 : PERSONAS UTILISATEURS
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "2. Conception", "Typologie des Utilisateurs Cibles (Personas)", 7)

    add_card(s7, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Sarah (27 ans)", [
        "Joueuse compétitive Magic",
        "Besoin : inscription express",
        "Visibilité jauges en temps réel",
        "Contact direct avec l'organisateur",
        "Zéro tolérance pour les bugs"
    ], "Compétitrice TCG", GOLD_AMBER)

    add_card(s7, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Thomas (34 ans)", [
        "Père de famille, joueur casual",
        "Besoin : réserver table le week-end",
        "Savoir si un jeu est en stock",
        "Clarté des tarifs et horaires",
        "Interface fluide sur mobile"
    ], "Joueur Occasionnel", PURPLE_LILAC)

    add_card(s7, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Olivier (45 ans)", [
        "Gérant du café-boutique",
        "Besoin : vue 360° du planning",
        "Répondre aux messages en 1 clic",
        "Ajuster stocks instantanément",
        "Importer catalogues sans ressaisie"
    ], "Administrateur", ACCENT_CYAN)

    # ==========================================
    # SLIDE 8 : PRIORISATION MOSCOW
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_header(s8, "2. Conception", "Périmètre Fonctionnel : Matrice MoSCoW", 8)

    add_card(s8, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "MUST HAVE (Vital)", [
        "Authentification sécurisée JWT",
        "Réservation anti-surbooking",
        "Inscriptions aux tournois TCG",
        "Dashboard Admin (CRUD)",
        "Catalogue jeux responsive"
    ], "Socle V1", ACCENT_RED)

    add_card(s8, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "SHOULD HAVE (Majeur)", [
        "Messagerie support multi-tours",
        "Gestion des stocks boutique (+/-)",
        "Importateur automatique BGG",
        "Secours panne JSON (Failover)",
        "Pastille rouge admin réactive"
    ], "Valeur Ajoutée", GOLD_AMBER)

    add_card(s8, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "COULD HAVE (Confort)", [
        "Paiement tournoi en ligne (Stripe)",
        "WebSockets temps réel (Socket.io)",
        "Export PDF ticket avec QR Code",
        "Filtres avancés par durée/thème"
    ], "Évolutions", PURPLE_LILAC)

    add_card(s8, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "WON'T HAVE (Hors V1)", [
        "App mobile native React Native",
        "Boutique e-commerce avec livraison",
        "Système de classement Elo annuel",
        "Carte de fidélité dématérialisée"
    ], "Roadmap V2", TEXT_MUTED)

    # ==========================================
    # SLIDE 9 : SITEMAP & ROUTES
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9)
    add_header(s9, "2. Conception", "Arborescence & Navigation de l'Application", 9)

    add_card(s9, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Zone Publique", [
        "/ : Accueil immersif & Événements",
        "/boardgames : Catalogue ludothèque",
        "/tournament : Calendrier tournois",
        "/login & /register : Portails Auth",
        "Modale de contact accessible partout"
    ], "Visiteurs", GOLD_AMBER)

    add_card(s9, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Zone Membre (JWT)", [
        "/reservations : Choix date/table",
        "/my-reservations : Suivi activités",
        "/profile : Données personnelles",
        "Fil support client multi-tours",
        "Annulation en 1 clic"
    ], "Joueurs Connectés", PURPLE_LILAC)

    add_card(s9, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Zone Admin (RBAC)", [
        "/admin : Console 6 onglets",
        "1. Réservations & 2. Tournois",
        "3. Événements & 4. Jeux / Stocks",
        "5. Utilisateurs & 6. Messages",
        "Import BGG Hot 100 en 1 clic"
    ], "Rôle Admin", ACCENT_CYAN)

    # ==========================================
    # SLIDE 10 : MODÉLISATION BDD
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10)
    add_header(s10, "2. Conception", "Modélisation de la Donnée : Schéma Relationnel", 10)

    add_card(s10, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "9 Tables Relationnelles", [
        "users (identités, rôles, avatars)",
        "rooms (les 4 tables de jeux)",
        "reservations (créneaux, statuts)",
        "tournaments & tournament_reg",
        "events & event_registrations",
        "board_games & messages"
    ], "Architecture", GOLD_AMBER)

    add_card(s10, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Intégrité Référentielle", [
        "Moteur MySQL InnoDB strict",
        "Clés étrangères ON DELETE CASCADE",
        "Clés primaires composites anti-doublon",
        "Contraintes d'unicité (email, tournoi/user)"
    ], "Cohérence BDD", ACCENT_GREEN)

    add_card(s10, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Optimisation Indexée", [
        "Index idx_reservation_times",
        "Index idx_email pour l'authentification",
        "Typage strict (ENUM, INT UNSIGNED)",
        "Prepared statements systématiques"
    ], "Performances", ACCENT_CYAN)

    # ==========================================
    # SLIDE 11 : LA STACK TECHNIQUE
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11)
    add_header(s11, "3. Architecture & Choix", "La Stack Technique Fullstack Choisie", 11)

    add_card(s11, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "Frontend SPA", [
        "React 18",
        "Vite 7 (Build rapide)",
        "Tailwind CSS",
        "Lucide Icons (SVG purs)",
        "React Router DOM"
    ], "Client", GOLD_AMBER)

    add_card(s11, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "Backend REST API", [
        "Node.js (Runtime)",
        "Express 4 (Framework)",
        "Architecture MVC",
        "Middlewares de contrôle",
        "Fast-XML-Parser (Proxy)"
    ], "Serveur", PURPLE_LILAC)

    add_card(s11, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "Base de Données", [
        "MySQL 8.0",
        "Moteur InnoDB",
        "mysql2/promise",
        "Connection Pooling",
        "Transactions ACID"
    ], "Stockage", ACCENT_CYAN)

    add_card(s11, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "Sécurité & DevOps", [
        "JSON Web Tokens (JWT)",
        "Bcrypt (Hachage)",
        "Multer (Upload contrôlé)",
        "Puppeteer (Tests E2E)",
        "Docker & Git"
    ], "Outillage", ACCENT_GREEN)

    # ==========================================
    # SLIDE 12 : POURQUOI REACT 18 & VITE ?
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12)
    add_header(s12, "3. Architecture & Choix", "Justification : React 18 & Vite 7 (Frontend)", 12)

    add_card(s12, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Architecture SPA", [
        "Aucun rechargement de page",
        "Fluidité de navigation totale",
        "État conservé en mémoire",
        "Consommation brute de JSON",
        "Ressenti application native"
    ], "Expérience Client", GOLD_AMBER)

    add_card(s12, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "React 18 & Composants", [
        "Écosystème robuste et standard",
        "Isolation des logiques d'état",
        "useTransition pour la réactivité",
        "Composants UI modulaires et testables",
        "Virtual DOM ultra-performant"
    ], "Développement", PURPLE_LILAC)

    add_card(s12, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Vite 7 & ES Modules", [
        "Démarrage serveur < 1 seconde",
        "Hot Module Replacement (HMR) direct",
        "Bundling optimisé sous Rollup",
        "Tree-shaking strict sur Lucide Icons",
        "Productivité décuplée"
    ], "Outillage", ACCENT_CYAN)

    # ==========================================
    # SLIDE 13 : POURQUOI NODE.JS & MYSQL ?
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_bg(s13)
    add_header(s13, "3. Architecture & Choix", "Justification : Node.js, Express & MySQL 8", 13)

    add_card(s13, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Node.js & Event Loop", [
        "Modèle I/O asynchrone non-bloquant",
        "Gestion efficace des pics de requêtes",
        "Un seul langage : JS du front au back",
        "Performances élevées sur requêtes web"
    ], "Asynchronisme", GOLD_AMBER)

    add_card(s13, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Express Pipeline", [
        "Contrôle total des middlewares",
        "Filtrage CORS strict",
        "Interception d'erreurs centralisée",
        "Structure MVC claire et pérenne"
    ], "Architecture API", PURPLE_LILAC)

    add_card(s13, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "MySQL 8 Relationnel", [
        "Rejet catégorique du NoSQL (besoin ACID)",
        "Pool de connexions mysql2 persistant",
        "Requêtes préparées anti-injection SQL",
        "Transactions pour l'anti-surbooking"
    ], "Fiabilité Données", ACCENT_GREEN)

    # ==========================================
    # SLIDE 14 : ENVIRONNEMENT & OUTILLAGE
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_bg(s14)
    add_header(s14, "3. Architecture & Choix", "Environnement, Qualité & Versioning", 14)

    add_card(s14, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Git & Conventions", [
        "Conventional Commits stricts",
        "feat(...), fix(...), refactor(...)",
        "Historique lisible et traçable",
        "Gestion de branches par feature"
    ], "Versioning", GOLD_AMBER)

    add_card(s14, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Conteneurisation Docker", [
        "Environnement isolé et reproductible",
        "Fichier docker-compose.yml",
        "Service MySQL 8 conteneurisé",
        "Zéro écart dev / recette"
    ], "DevOps", ACCENT_CYAN)

    add_card(s14, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Assurance Qualité", [
        "Postman pour recette des routes API",
        "Puppeteer pour validation E2E",
        "Figma pour fidélité UI/UX",
        "Audits de sécurité réguliers"
    ], "Fiabilité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 15 : F1 - RÉSERVATION (BESOIN & SOLUTION)
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_bg(s15)
    add_header(s15, "4. Développement (F1)", "Moteur de Réservation & Anti-Surbooking", 15)

    add_card(s15, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Le Besoin Métier", [
        "Établissement limité à 4 tables physiques",
        "Empêcher formellement deux réservations concurrentes",
        "Garantir qu'un jeu unique (stock = 1) ne soit pas pris 2 fois",
        "Donner au joueur la visibilité immédiate sur les heures libres"
    ], "Problématique", ACCENT_RED)

    add_card(s15, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Solution Développée", [
        "Page de réservation réactive avec calendrier personnalisé",
        "Grille horaire dynamique heure par heure (vert/orange/rouge)",
        "Calcul automatique de l'heure de fin selon la durée choisie",
        "Attribution automatique de la 1ère table physique libre"
    ], "Fonctionnalité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 16 : F1 - RÉSERVATION (DIFFICULTÉ & RÉSOLUTION)
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_bg(s16)
    add_header(s16, "4. Développement (F1)", "Algorithme d'Overlap & Sécurité SQL", 16)

    add_card(s16, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "La Difficulté Rencontrée", [
        "Cas limites des chevauchements partiels d'horaires",
        "Une session de 14h à 16h entre en collision avec 15h-17h",
        "Risque d'écrasement en cas de clics quasi-simultanés",
        "Gestion conjointe de la table ET du stock du jeu emprunté"
    ], "Obstacle", ACCENT_RED)

    add_card(s16, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Résolution Technique", [
        "Formule mathématique d'overlap temporel :",
        "start_time < newEndTime AND end_time > newStartTime",
        "Filtrage SQL strict sur les réservations actives",
        "Transaction SQL atomique (START TRANSACTION / ROLLBACK)",
        "Exception HTTP 400 claire en cas de saturation"
    ], "Résolution", ACCENT_GREEN)

    # ==========================================
    # SLIDE 17 : F2 - TOURNOIS TCG (BESOIN & SOLUTION)
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_bg(s17)
    add_header(s17, "4. Développement (F2)", "Inscriptions & Gestion des Tournois TCG", 17)

    add_card(s17, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Le Besoin Métier", [
        "Gestion hebdomadaire des tournois (Magic, Pokémon, Lorcana)",
        "Respect strict de la jauge maximale de joueurs",
        "Inscription et désinscription en autonomie par le joueur",
        "Affichage instantané des places restantes sans rechargement"
    ], "Problématique", ACCENT_RED)

    add_card(s17, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Solution Développée", [
        "Page Tournaments.jsx avec filtres par jeu de cartes",
        "Jauges visuelles progressives de remplissage",
        "Bouton intelligent : S'inscrire / Déjà inscrit / Complet",
        "Accordéon interactif affichant la liste des participants"
    ], "Fonctionnalité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 18 : F2 - TOURNOIS TCG (DIFFICULTÉ & RÉSOLUTION)
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_bg(s18)
    add_header(s18, "4. Développement (F2)", "Intégrité SQL & Concurrence d'Inscription", 18)

    add_card(s18, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "La Difficulté Rencontrée", [
        "Double-clic rapide provoquant une double inscription",
        "Risque de dépassement de jauge sur deux requêtes concurrentes",
        "Mise à jour visuelle ciblée sans recharger tout l'écran",
        "Blocage potentiel de l'interface globale lors du chargement"
    ], "Obstacle", ACCENT_RED)

    add_card(s18, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Résolution Technique", [
        "Clé primaire composite SQL : (tournament_id, user_id)",
        "Interception de l'erreur native MySQL : ER_DUP_ENTRY",
        "Contrôle de jauge avant insertion (registered < capacity)",
        "Isolation du state de chargement (actionLoadingId)",
        "Mise à jour réactive du state React local"
    ], "Résolution", ACCENT_GREEN)

    # ==========================================
    # SLIDE 19 : F3 - DASHBOARD ADMIN (BESOIN & SOLUTION)
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_bg(s19)
    add_header(s19, "4. Développement (F3)", "Console d'Administration & Gestion Stocks", 19)

    add_card(s19, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Le Besoin Métier", [
        "Centraliser la gestion globale du café en une seule interface",
        "Contrôler les réservations, tournois, membres et messages",
        "Permettre au gérant de modifier les stocks boutique en direct",
        "Éviter les erreurs de manipulation ou suppressions involontaires"
    ], "Problématique", ACCENT_RED)

    add_card(s19, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Solution Développée", [
        "DashboardAdmin.jsx structuré en 6 onglets dédiés",
        "Contrôle rapide des stocks boutique via boutons (+ / -)",
        "Messagerie support avec fil de réponses multi-tours",
        "Modales de confirmation strictes avant suppression"
    ], "Fonctionnalité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 20 : F3 - DASHBOARD ADMIN (DIFFICULTÉ & RÉSOLUTION)
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    set_bg(s20)
    add_header(s20, "4. Développement (F3)", "Sécurité RBAC & Ergonomie Back-Office", 20)

    add_card(s20, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "La Difficulté Rencontrée", [
        "Empêcher tout accès illégitime aux données sensibles",
        "Volume important de réservations difficile à lire",
        "Maintien de la cohérence visuelle des alertes sans WebSockets",
        "Temps de réponse instantané exigé sur l'ajustement de stock"
    ], "Obstacle", ACCENT_RED)

    add_card(s20, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Résolution Technique", [
        "Double barrière RBAC : vérif token front + middleware 403 back",
        "Moteur de tri dynamique multi-colonnes côté client",
        "Pastille rouge synchronisée par événement messages_updated",
        "Requêtes AJAX asynchrones PATCH pour mise à jour stock"
    ], "Résolution", ACCENT_GREEN)

    # ==========================================
    # SLIDE 21 : F4 (BONUS) - PROXY BGG (BESOIN & SOLUTION)
    # ==========================================
    s21 = prs.slides.add_slide(blank_layout)
    set_bg(s21)
    add_header(s21, "4. Développement (F4)", "Proxy BoardGameGeek & Enrichissement Catalogue", 21)

    add_card(s21, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Le Besoin Métier", [
        "Saisir 100 fiches de jeux à la main = dizaines d'heures perdues",
        "Besoin de données fiables (joueurs, durées, visuels HD)",
        "L'API officielle BoardGameGeek est la référence mondiale",
        "Permettre au gérant d'importer le catalogue en un seul clic"
    ], "Problématique", ACCENT_RED)

    add_card(s21, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Solution Développée", [
        "Bouton 'Importer BGG Hot 100' sur la console admin",
        "Appel automatisé vers l'API XML2 de BoardGameGeek",
        "Parsing et normalisation des métadonnées ludiques",
        "Enregistrement direct dans la table board_games"
    ], "Fonctionnalité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 22 : F4 (BONUS) - PROXY BGG & FAILOVER
    # ==========================================
    s22 = prs.slides.add_slide(blank_layout)
    set_bg(s22)
    add_header(s22, "4. Développement (F4)", "Transcodage XML/JSON & Haute Résilience", 22)

    add_card(s22, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Deux Défis Techniques", [
        "1. Blocage CORS du navigateur sur l'API externe BGG",
        "2. BGG renvoie exclusivement du format XML complexe",
        "3. Risque d'écran blanc si la base MySQL subit une panne",
        "Nécessité de garantir la continuité de consultation"
    ], "Obstacle", ACCENT_RED)

    add_card(s22, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "La Résolution Technique", [
        "Proxy backend Node.js éliminant les restrictions CORS",
        "Transcodage XML vers JSON ultra-rapide via fast-xml-parser",
        "Failover automatique : bascule sur boardgame-list.json local",
        "Continuité de service garantie à 100% pour les visiteurs"
    ], "Résolution", ACCENT_GREEN)

    # ==========================================
    # SLIDE 23 : SÉCURITÉ & RGPD
    # ==========================================
    s23 = prs.slides.add_slide(blank_layout)
    set_bg(s23)
    add_header(s23, "5. Points Techniques", "Sécurité OWASP & Conformité RGPD", 23)

    add_card(s23, Inches(0.8), Inches(2.0), Inches(2.7), Inches(4.8), "Mots de Passe & Auth", [
        "Hachage Bcrypt (coût 10)",
        "Zéro mot de passe en clair",
        "Tokens JWT signés HMAC",
        "Durée de vie limitée (24h)"
    ], "Authentification", GOLD_AMBER)

    add_card(s23, Inches(3.8), Inches(2.0), Inches(2.7), Inches(4.8), "Anti-Injections SQL", [
        "mysql2/promise préparé",
        "Placeholders '?' stricts",
        "Séparation code / donnée",
        "Risque neutralisé à 100%"
    ], "Base de Données", PURPLE_LILAC)

    add_card(s23, Inches(6.8), Inches(2.0), Inches(2.7), Inches(4.8), "Contrôle d'Accès", [
        "Middlewares RBAC",
        "Contrôle strict rôle 'ADMIN'",
        "Erreurs 401 & 403 HTTP",
        "CORS limité au client Vite"
    ], "Autorisations", ACCENT_CYAN)

    add_card(s23, Inches(9.8), Inches(2.0), Inches(2.7), Inches(4.8), "Conformité RGPD", [
        "Minimisation des données (Art. 5)",
        "Pseudo pour anonymat en tournoi",
        "Zéro traceur tiers ni pub (CNIL)",
        "Droit à l'oubli (ON DELETE CASCADE)"
    ], "Protection Données", ACCENT_GREEN)

    # ==========================================
    # SLIDE 24 : SÉCURISATION DES MÉDIAS
    # ==========================================
    s24 = prs.slides.add_slide(blank_layout)
    set_bg(s24)
    add_header(s24, "5. Points Techniques", "Sécurisation des Uploads de Fichiers (Multer)", 24)

    add_card(s24, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Risques Identifiés", [
        "Exécution de scripts malveillants (.php / .js)",
        "Traversée de répertoire (injection ../)",
        "Déni de service par saturation de disque (DoS)",
        "Fichiers corrompus ou invisibles"
    ], "Menaces", ACCENT_RED)

    add_card(s24, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Contre-Mesures Multer", [
        "Contrôle de type MIME strict (JPEG, PNG, WEBP)",
        "Rejet automatique des extensions exécutables",
        "Renommage avec nom unique (Timestamp + UUID)",
        "Limite matérielle stricte à 2 Mo par fichier"
    ], "Parades", ACCENT_GREEN)

    add_card(s24, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Expérience Utilisateur", [
        "Prévisualisation instantanée (Live Preview)",
        "Feedback direct sur le formulaire",
        "Stockage organisé dans /uploads",
        "Intégration directe aux profils & affiches"
    ], "Ergonomie", GOLD_AMBER)

    # ==========================================
    # SLIDE 25 : TESTS AUTOMATISÉS E2E
    # ==========================================
    s25 = prs.slides.add_slide(blank_layout)
    set_bg(s25)
    add_header(s25, "5. Points Techniques", "Assurance Qualité : Tests E2E Automatisés", 25)

    add_card(s25, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Pourquoi Puppeteer ?", [
        "Contrôle natif du moteur Chromium",
        "Simulation d'un utilisateur réel en conditions réelles",
        "Validation de la chaîne complète : React + API + MySQL",
        "Exécution en mode Headless ultra-rapide"
    ], "Choix de l'Outil", GOLD_AMBER)

    add_card(s25, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Parcours Testé", [
        "1. Connexion membre sécurisée",
        "2. Sélection d'une date & horaire",
        "3. Soumission de réservation de table",
        "4. Vérification du toast de succès & capture d'écran"
    ], "Scénario Critique", PURPLE_LILAC)

    add_card(s25, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Bénéfice Concret", [
        "30 secondes d'exécution automatique",
        "Remplace 15 minutes de tests manuels répétitifs",
        "Zéro régression bloquante avant livraison",
        "Garantie de fiabilité pour le jury"
    ], "Rentabilité", ACCENT_GREEN)

    # ==========================================
    # SLIDE 26 : ERGONOMIE & DESIGN SYSTEM
    # ==========================================
    s26 = prs.slides.add_slide(blank_layout)
    set_bg(s26)
    add_header(s26, "5. Points Techniques", "Design System, Identité Visuelle & Accessibilité", 26)

    add_card(s26, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Identité Forte", [
        "Palette cohérente Jaune Ambré & Violet Sombre",
        "Ambiance taverne geek / club de jeu moderne",
        "Cartes dépolies en Glassmorphism",
        "Bordures dorées fines et lueurs ambiantes"
    ], "Direction Artistique", GOLD_AMBER)

    add_card(s26, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Responsive Mobile-First", [
        "Grille adaptative 12 colonnes desktop / 4 mobile",
        "Menu burger optimisé pour écrans tactiles",
        "Tableaux de bord scrollables sans perte d'infos",
        "Composants réutilisables standardisés"
    ], "Adaptabilité", PURPLE_LILAC)

    add_card(s26, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Accessibilité (A11y)", [
        "Contraste texte/fond respectant les normes WCAG",
        "Icônes doublées de labels explicites",
        "Pastilles de couleur doublées de texte (disponible/complet)",
        "Focus visible sur tous les éléments interactifs"
    ], "Inclusivité", ACCENT_CYAN)

    # ==========================================
    # SLIDE 27 : BILAN DU PROJET
    # ==========================================
    s27 = prs.slides.add_slide(blank_layout)
    set_bg(s27)
    add_header(s27, "6. Conclusion", "Bilan du Projet & Couverture du Référentiel DWWM", 27)

    add_card(s27, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Activité-Type 1 (Front)", [
        "Interfaces dynamiques React 18 & Vite",
        "Design System Tailwind & Responsive",
        "Sécurisation des routes et gestion d'état",
        "Validation formulaires & retours visuels réactifs"
    ], "Compétences Validées", GOLD_AMBER)

    add_card(s27, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Activité-Type 2 (Back)", [
        "API REST complète Node.js / Express MVC",
        "Base de données relationnelle MySQL 8",
        "Authentification JWT & Sécurité OWASP",
        "Algorithmes métiers complexes & résilience"
    ], "Compétences Validées", PURPLE_LILAC)

    add_card(s27, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Bilan Global", [
        "Projet livré et 100% fonctionnel",
        "Alignement parfait avec le besoin du café-boutique",
        "Autonomie technique démontrée de bout en bout",
        "Prêt pour une mise en production réelle"
    ], "Résultat", ACCENT_GREEN)

    # ==========================================
    # SLIDE 28 : DIFFICULTÉS & APPRENTISSAGES
    # ==========================================
    s28 = prs.slides.add_slide(blank_layout)
    set_bg(s28)
    add_header(s28, "6. Conclusion", "Difficultés Surmontées & Enseignements", 28)

    add_card(s28, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Ce qui a été Complexe", [
        "Gestion fine des intervalles de réservation SQL",
        "Isolation des états asynchrones en React 18",
        "Parsing robuste des flux XML externes",
        "Gestion rigoureuse du temps et du périmètre"
    ], "Défis Techniques", ACCENT_RED)

    add_card(s28, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Ce que j'ai Appris", [
        "La conception BDD préalable évite 80% des bugs",
        "L'importance des requêtes préparées et de l'intégrité",
        "La rigueur des conventions Git et des commits",
        "Relier chaque choix technique à un besoin métier réel"
    ], "Apprentissages", GOLD_AMBER)

    add_card(s28, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Posture Professionnelle", [
        "Méthode de débogage structurée",
        "Recherche autonome dans la doc technique anglophone",
        "Capacité à arbitrer entre perfection et livrable",
        "Confiance pour intégrer une équipe dev"
    ], "Évolution", ACCENT_GREEN)

    # ==========================================
    # SLIDE 29 : PERSPECTIVES D'ÉVOLUTION (V2)
    # ==========================================
    s29 = prs.slides.add_slide(blank_layout)
    set_bg(s29)
    add_header(s29, "6. Conclusion", "Perspectives d'Évolution (Feuille de Route V2)", 29)

    add_card(s29, Inches(0.8), Inches(2.0), Inches(3.6), Inches(4.8), "Paiement en Ligne", [
        "Intégration Stripe Checkout",
        "Paiement direct des droits d'entrée aux tournois",
        "Sécurisation des réservations par acompte",
        "Webhooks bancaires sécurisés"
    ], "Évolution 1", GOLD_AMBER)

    add_card(s29, Inches(4.8), Inches(2.0), Inches(3.6), Inches(4.8), "Temps Réel WebSocket", [
        "Remplacement du polling par Socket.io",
        "Mise à jour instantanée des jauges multi-écrans",
        "Notification push des messages support",
        "Expérience interactive pour les tournois en direct"
    ], "Évolution 2", PURPLE_LILAC)

    add_card(s29, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Application Mobile", [
        "Application hybride React Native",
        "Déploiement iOS & Android",
        "Ticket de réservation avec QR Code scannable",
        "Notifications push de début de tournoi"
    ], "Évolution 3", ACCENT_CYAN)

    # ==========================================
    # SLIDE 30 : CLÔTURE & ÉCHANGE AVEC LE JURY
    # ==========================================
    s30 = prs.slides.add_slide(blank_layout)
    set_bg(s30)
    
    t_box30 = s30.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.33), Inches(2.5))
    tf30 = t_box30.text_frame
    tf30.word_wrap = True
    
    p = tf30.paragraphs[0]
    p.text = "CONCLUSION"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GOLD_AMBER
    p.space_after = Pt(14)

    p = tf30.add_paragraph()
    p.text = "Merci pour votre attention !"
    p.font.size = Pt(50)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(10)

    p = tf30.add_paragraph()
    p.text = "Place aux questions et échanges avec le jury"
    p.font.size = Pt(22)
    p.font.color.rgb = PURPLE_LILAC

    add_card(s30, Inches(1.0), Inches(4.6), Inches(5.3), Inches(2.2), "Projet Cicados", [
        "Code source complet disponible sur GitHub",
        "Dossier de projet & fiches techniques validés",
        "Démonstration live prête à la demande"
    ], "Ressources", GOLD_AMBER)

    add_card(s30, Inches(6.8), Inches(4.6), Inches(5.5), Inches(2.2), "Olivier PARRAUD", [
        "Candidat Titre Professionnel DWWM 2026",
        "Développeur Fullstack Web & Web Mobile",
        "Établissement La Plateforme — Marseille"
    ], "Contact & Échange", PURPLE_LILAC)

    # Save
    out_path = "/Applications/MAMP/htdocs/Cicadas2/diapo_presentation_cicados.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully to: {out_path}")

if __name__ == "__main__":
    create_presentation()
