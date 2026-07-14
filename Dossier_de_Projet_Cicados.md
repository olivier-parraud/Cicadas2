# 📘 DOSSIER DE PROJET PROFESSIONNEL — CICADOS

**Titre professionnel visé :** Développeur Web et Web Mobile (DWWM)  
**Projet :** Cicados — Plateforme de réservation de tables de jeux et de gestion d'événements  
**Candidat :** [Votre Nom Complet]  
**Organisme de formation :** École O'Clock  
**Stack technique :** React.js (Vite) + Node.js (Express) + MySQL  
**Date de session :** Juillet 2026  

---

## SOMMAIRE

1. [Introduction](#1--introduction)
   - 1.1 [Parcours professionnel et reconversion](#11-parcours-professionnel-et-reconversion)
   - 1.2 [Le choix du développement web et de la formation O'Clock](#12-le-choix-du-développement-web-et-de-la-formation-oclock)
2. [Cahier des Charges du Projet](#2--cahier-des-charges-du-projet)
   - 2.1 [Genèse du projet Cicados](#21-genèse-du-projet-cicados)
   - 2.2 [Besoins, contraintes et problématiques logistiques](#22-besoins-contraintes-et-problématiques-logistiques)
   - 2.3 [Typologie de la clientèle (Personas)](#23-typologie-de-la-clientèle-personas)
   - 2.4 [Matrice de priorisation MoSCoW](#24-matrice-de-priorisation-moscow)
   - 2.5 [User Stories de l'application](#25-user-stories-de-lapplication)
3. [Conception Technique et Fonctionnelle](#3--conception-technique-et-fonctionnelle)
   - 3.1 [Arborescence du site (Sitemap)](#31-arborescence-du-site-sitemap)
   - 3.2 [Dictionnaire des routes de navigation](#32-dictionnaire-des-routes-de-navigation)
   - 3.3 [Modélisation de la base de données (MCD, MLD, MPD)](#33-modélisation-de-la-base-de-données-mcd-mld-mpd)
   - 3.4 [Dictionnaire de données de la base de données](#34-dictionnaire-de-données-de-la-base-de-données)
4. [Spécifications Techniques et Gestion de Projet](#4--spécifications-techniques-et-gestion-de-projet)
   - 4.1 [Choix et justification de la stack technique](#41-choix-et-justification-de-la-stack-technique)
   - 4.2 [Gestion de projet Agile (Méthodologie Scrum et sprints)](#42-gestion-de-projet-agile-méthodologie-scrum-et-sprints)
   - 4.3 [Conventions de codage, de versioning (Git) et de commits](#43-conventions-de-codage-de-versioning-git-et-de-commits)
5. [Validation des Compétences du Référentiel (REAC DWWM)](#5--validation-des-compétences-du-référentiel-reac-dwwm)
   - 5.1 [Activité 1 : Développer la partie front-end d'une application web ou web mobile](#51-activité-1--développer-la-partie-front-end-dune-application-web-ou-web-mobile)
   - 5.2 [Activité 2 : Développer la partie back-end d'une application web ou web mobile](#52-activité-2--développer-la-partie-back-end-dune-application-web-ou-web-mobile)
6. [Réalisations Techniques et Étude du Code Source](#6--réalisations-techniques-et-étude-du-code-source)
   - 6.1 [Rôle et analyse des fichiers clés du Frontend](#61-rôle-et-analyse-des-fichiers-clés-du-frontend)
   - 6.2 [Rôle et analyse des fichiers clés du Backend](#62-rôle-et-analyse-des-fichiers-clés-du-backend)
7. [Focus Algorithmique & Fonctionnalités Avancées](#7--focus-algorithmique--fonctionnalités-avancées)
   - 7.1 [L'algorithme de détection des conflits de réservation](#71-lalgorithme-de-détection-des-conflits-de-réservation)
   - 7.2 [Le Proxy BGG et le convertisseur XML vers JSON](#72-le-proxy-bgg-et-le-convertisseur-xml-vers-json)
   - 7.3 [Le basculement dynamique en cas de panne (Sauvegarde JSON)](#73-le-basculement-dynamique-en-cas-de-panne-sauvegarde-json)
8. [Jeux d'Essai et Scénarios de Validation](#8--jeux-dessai-et-scénarios-de-validation)
9. [Veille Technologique et Sécurité (OWASP)](#9--veille-technologique-et-sécurité-owasp)
10. [Utilisation de Ressources Anglophones](#10--utilisation-de-ressources-anglophones)
11. [Conclusion et Perspectives d'Évolution](#11--conclusion-et-perspectives-dévolution)

---

## 1 — INTRODUCTION

### 1.1 Parcours professionnel et reconversion
Mon parcours est marqué par une expérience significative dans l'industrie de la restauration. Durant plusieurs années, j'ai exercé en tant que directeur et propriétaire de mon propre établissement. Cette aventure entrepreneuriale m'a permis d'acquérir de solides compétences de gestion administrative, d'encadrement d'équipe, de communication interpersonnelle et de résolution rapide de problèmes en situation de stress intense. 

La crise sanitaire liée à la pandémie de COVID-19 a profondément affecté le secteur de la restauration. Durant les périodes de fermeture administrative et de confinement, j'ai été amené à réfléchir à mon avenir professionnel. J'ai alors cherché une reconversion qui me permettrait de valoriser mes compétences de gestion et d'organisation tout en m'ouvrant les portes d'un domaine porteur, créatif et tourné vers l'avenir. C'est durant cette période de transition que j'ai commencé à m'intéresser de près au développement informatique. En concevant en autodidacte de petites pages statiques, j'ai découvert une véritable passion pour la programmation, la structuration logique des bases de données et la résolution de défis techniques. J'ai compris que le développement web m'offrait l'opportunité de lier la rigueur logique de la conception backend à l'aspect visuel et interactif du frontend.

### 1.2 Le choix du développement web et de la formation O'Clock
Afin de concrétiser cette reconversion et d'acquérir un niveau technique professionnel, j'ai choisi de suivre la formation intensive de l'école **O'Clock**. L'approche pédagogique novatrice en téléprésentiel m'a permis de me consacrer pleinement à l'apprentissage du développement dans un cadre structuré et exigeant, reproduisant fidèlement les conditions du travail en équipe de développement moderne (méthodologie Scrum, outils de versioning collaboratif Git/GitHub, réunions quotidiennes).

La formation s'est découpée en trois phases majeures :
* **La formation socle (3 mois)** : Apprentissage approfondi des bases du web (HTML5, CSS3, JavaScript moderne), de la modélisation et de la structuration de bases de données SQL, ainsi que de l'architecture MVC.
* **La spécialisation (1 mois)** : Focus complet sur un framework moderne, me permettant d'appréhender la gestion réactive de l'état global et la création de composants réutilisables complexes.
* **Le projet professionnel de fin d'études (1 mois)** : C'est dans ce cadre, équivalent au projet de fin de formation (« Apothéose »), que j'ai développé l'application **Cicados**. Ce projet personnel m'a permis de mettre en application l'ensemble des compétences théoriques et pratiques acquises, de la rédaction du cahier des charges initial jusqu'au déploiement et à la validation des scénarios de test.

---

## 2 — CAHIER DES CHARGES DU PROJET

### 2.1 Genèse du projet Cicados
Le concept de **Cicados** est né d'une passion personnelle pour les univers ludiques, en particulier les **jeux de cartes à collectionner (TCG)** comme *Magic: The Gathering*, *Yu-Gi-Oh!, Pokémon, Lorcana*, ainsi que les **jeux de société modernes**. Les établissements hybrides, mêlant boutique, café et espace de jeu, connaissent un essor remarquable. Cependant, ces structures se heurtent fréquemment à des difficultés d'organisation logistique. 

Les gérants de ces commerces doivent souvent arbitrer manuellement l'allocation de leurs tables physiques de jeu entre des joueurs souhaitant faire une partie de jeu de plateau (nécessitant de grands espaces de table) et des tournois officiels de TCG qui mobilisent de nombreuses tables sur des créneaux horaires fixes. Cicados a été imaginé pour répondre précisément à cette problématique en proposant une solution de réservation de table dynamique et de gestion d'événements centralisée.

### 2.2 Besoins, contraintes et problématiques logistiques

#### Prévention du Surbooking
Dans un établissement ayant une capacité d'accueil physique restreinte (4 tables de jeu dans notre modèle initial), la réservation sans vérification immédiate des ressources mène inévitablement à des conflits d'horaires et à une insatisfaction des clients. L'application doit impérativement calculer et vérifier en temps réel si une table est physiquement disponible sur l'intégralité du créneau horaire souhaité (heure de début + durée de jeu) avant d'enregistrer la réservation.

#### Adéquation Table / Jeu
Les jeux de société volumineux nécessitent des plateaux de grande taille, tandis que les TCG (duels de cartes) peuvent se jouer sur des formats de table plus compacts. L'application doit ainsi collecter les caractéristiques du jeu sélectionné pour s'assurer que le nombre de participants ne dépasse pas la capacité d'accueil physique de la table assignée par le système.

#### Engagement et No-Show
Les réservations gratuites en ligne favorisent les comportements de désengagement (les clients ne se présentent pas à l'heure réservée sans annuler préalablement). Cicados adresse ce problème en intégrant un système d'e-mails transactionnels automatisés de confirmation et de rappel, et en fournissant un espace utilisateur simplifié permettant d'annuler ou de modifier une réservation en deux clics.

#### Suivi des Inscriptions aux Événements TCG
L'organisation de tournois TCG est soumise à des jauges de capacité strictes, fixées par les éditeurs de jeux ou par la capacité d'accueil de la boutique. L'application doit mettre à disposition des visiteurs des jauges d'inscription dynamiques en temps réel et bloquer automatiquement toute nouvelle inscription dès que l'événement affiche complet.

#### Charte graphique et contraintes visuelles des Tags (Identité visuelle)
Pour que l'interface de l'administration et du catalogue public soit intuitive, des contraintes d'identité visuelle fortes ont été appliquées sur la coloration des étiquettes (tags) :
* **Jeux de cartes (TCG) comme Pokémon** : Pour assurer une reconnaissance immédiate par les joueurs, l'étiquette doit adopter un style distinct : **fond noir, contour rouge et écriture rouge**. De plus, dans la partie administrative, les étiquettes de chaque jeu TCG héritent précisément de la couleur définie pour les événements par jeu TCG correspondants (rouge pour Pokémon, bleu pour Yu-Gi-Oh, etc.).
* **Apport personnel (BYOG - "J'apporte mon jeu")** : Pour se détacher clairement des jeux loués ou prêtés par la boutique, l'étiquette "J'apporte mon jeu" adopte un style **bleu vif** contrasté.
* **Problématiques de lisibilité (Altered)** : Les premières versions de l'interface utilisaient des couleurs pastel claires pour le jeu de cartes à collectionner *Altered*. Ces couleurs manquaient de contraste sur le fond sombre premium, rendant les étiquettes illisibles pour les utilisateurs ayant des déficiences visuelles. Nous avons donc retravaillé le contraste en augmentant la saturation de la couleur de fond et en ajoutant des contours clairs pour assurer une conformité avec les critères d'accessibilité WCAG AA.

### 2.3 Typologie de la clientèle (Personas)

#### Persona 1 : Thomas, le joueur de TCG compétitif
* **Profil** : 27 ans, informaticien. Joueur aguerri de *Magic: The Gathering*.
* **Besoins** : Thomas souhaite s'inscrire rapidement aux tournois hebdomadaires officiels (Friday Night Magic). Il a besoin de suivre en temps réel la jauge d'inscription pour ne pas rater sa place et souhaite recevoir une confirmation claire par e-mail avec le prix d'inscription et l'horaire de début pour préparer son deck.
* **Frustrations** : Il déteste devoir se déplacer en boutique ou appeler par téléphone pour s'assurer qu'il reste de la place pour un événement.

#### Persona 2 : Sarah, la joueuse occasionnelle de jeux de société
* **Profil** : 34 ans, responsable marketing, mère de deux enfants.
* **Besoins** : Sarah cherche à planifier des après-midis ludiques en famille le week-end. Elle souhaite consulter le catalogue de jeux de la boutique pour s'assurer que des jeux adaptés à ses enfants de 8 et 10 ans sont disponibles, puis réserver une table libre pour un créneau de 2 heures le samedi après-midi.
* **Frustrations** : Arriver sur place avec ses enfants et trouver toutes les tables occupées, ou devoir attendre qu'une table se libère.

#### Persona 3 : Olivier, le gérant de la boutique
* **Profil** : 45 ans, passionné d'entrepreneuriat et de jeux de plateau.
* **Besoins** : Olivier a besoin d'avoir une vision globale de l'occupation de son espace de jeu. Il souhaite visualiser toutes les réservations sur un calendrier d'administration, valider manuellement des statuts de réservation de table, créer de nouveaux événements TCG rapidement et alimenter sa ludothèque de prêt sans devoir saisir manuellement chaque fiche technique de jeu de société.
* **Frustrations** : Passer des heures à saisir des fiches techniques de jeux à la main ou gérer les réservations sur un cahier papier papier sujet aux ratures et aux erreurs de surbooking.

### 2.4 Matrice de priorisation MoSCoW
Pour garantir la livraison d'un produit fonctionnel dans les délais impartis, les fonctionnalités ont été réparties selon la méthode MoSCoW :

```
         🔴 MUST (Indispensable)             🟡 SHOULD (Très Important)
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│  ● Authentification JWT sécurisée.    ││  ● Importation automatique de jeux   │
│  ● Réservation de table en temps réel││    depuis BoardGameGeek (BGG).       │
│  ● Algorithme anti-surbooking.       ││  ● Système de basculement résilient  │
│  ● Inscription/désinscription        ││    du catalogue sur fichier JSON.    │
│    aux tournois TCG et événements.   ││  ● Emails transactionnels (Brevo API)│
│  ● Espace "Mes Activités" joueur.    │└──────────────────────────────────────┘
│  ● Dashboard d'administration (CRUD).│         🔵 COULD (Optionnel)
└──────────────────────────────────────┘┌──────────────────────────────────────┐
                                        │  ● Système d'avis sur les jeux.      │
                                        │  ● Notifications push temps réel.    │
                                        └──────────────────────────────────────┘
```

### 2.5 User Stories de l'application

| ID | En tant que | Je veux | Afin de | Priorité |
|---|---|---|---|---|
| **US-1.1** | Visiteur | Consulter l'accueil et la FAQ interactive | Comprendre les horaires et le concept de la boutique | **MUST** 🔴 |
| **US-1.2** | Visiteur | Basculer l'interface en français ou anglais | Naviguer confortablement dans ma langue | **MUST** 🔴 |
| **US-1.3** | Visiteur | Parcourir le catalogue de jeux de société | Découvrir les jeux disponibles et leurs critères (joueurs, durée) | **MUST** 🔴 |
| **US-1.4** | Visiteur | Consulter l'agenda des tournois | Connaître les événements, frais d'entrée et jauges de places | **MUST** 🔴 |
| **US-2.1** | Utilisateur | Sélectionner une date et voir les créneaux libres | Réserver une table de jeu en temps réel | **MUST** 🔴 |
| **US-2.2** | Utilisateur | Choisir un jeu dans le catalogue ou cocher "BYOG" | Recevoir une table adaptée à ma partie | **MUST** 🔴 |
| **US-2.3** | Utilisateur | Modifier ou annuler une réservation de table | Libérer l'espace en cas d'imprévu ou mettre à jour ma session | **MUST** 🔴 |
| **US-2.4** | Utilisateur | M'inscrire ou me désinscrire d'un tournoi | Garantir ma place pour un événement TCG | **MUST** 🔴 |
| **US-3.1** | Admin | Visualiser et filtrer l'ensemble des réservations | Gérer le planning de l'établissement | **MUST** 🔴 |
| **US-3.2** | Admin | Créer, modifier et supprimer des tournois/événements | Animer la communauté de joueurs | **MUST** 🔴 |
| **US-3.3** | Admin | Importer des jeux de société depuis BGG | Enrichir rapidement le catalogue de prêt | **SHOULD** 🟡 |
| **US-3.4** | Admin | Administrer les rôles des utilisateurs | Déléguer des droits d'administration ou modérer | **MUST** 🔴 |

---

## 3 — CONCEPTION TECHNIQUE ET FONCTIONNELLE

### 3.1 Arborescence du site (Sitemap)
L'application se structure en une architecture de navigation à page unique (SPA) fluide, organisée selon les accès utilisateur :

```
                                  [Accueil (/)]
                                        │
           ┌────────────────────────────┼────────────────────────────┐
     (Visiteur)                    (Connecté)                     (Admin)
           │                            │                            │
           ├─▶ Catalogue (/boardgames)  ├─▶ Réserver (/reservations) └─▶ Dashboard (/admin)
           ├─▶ Tournois (/tournaments)  └─▶ Mon Agenda                   ├─▶ Réservations
           ├─▶ Connexion (/login)          (/my-reservations)            ├─▶ Événements
           └─▶ Inscription (/register)                                   ├─▶ Tournois
                                                                         ├─▶ Ludothèque
                                                                         └─▶ Utilisateurs
```

### 3.2 Dictionnaire des routes de navigation

#### Routes Frontend (React Router)
* `/` (Publique) : Page d'accueil avec présentation, carrousel d'activités, et accordéon FAQ.
* `/login` (Publique) : Formulaire d'authentification utilisateur.
* `/register` (Publique) : Formulaire d'inscription.
* `/boardgames` (Publique) : Ludothèque complète, filtres par catégorie/joueurs, recherche textuelle.
* `/tournaments` (Publique) : Agenda des tournois et événements avec jauges d'inscriptions.
* `/reservations` (Privée) : Interface de prise de réservation avec sélection de date et grille horaire interactive.
* `/my-reservations` (Privée) : Espace personnel « Mes Activités » listant les réservations et inscriptions de l'utilisateur avec options d'édition/annulation.
* `/admin` (Privée - Rôle ADMIN requis) : Console d'administration centralisée structurée en 5 onglets de gestion CRUD.

#### Routes Backend (Express API REST)
* `POST /api/auth/register` : Création de compte.
* `POST /api/auth/login` : Authentification et retour du token JWT.
* `GET /api/auth/me` : Récupération des informations de session de l'utilisateur connecté.
* `GET /api/reservations` : Récupération de l'état d'occupation des tables pour une date.
* `GET /api/reservations/user` : Liste des réservations de l'utilisateur connecté.
* `POST /api/reservations` : Création d'une réservation de table.
* `PUT /api/reservations/:id` : Modification d'une réservation.
* `DELETE /api/reservations/:id` : Annulation d'une réservation.
* `GET /api/tournaments` : Liste des tournois à venir.
* `POST /api/tournaments/:id/register` : Inscription d'un utilisateur à un tournoi.
* `DELETE /api/tournaments/:id/unregister` : Désinscription d'un tournoi.
* `GET /api/boardgames` : Récupération du catalogue de jeux de société (avec fallback local JSON).
* `GET /api/admin/reservations` : Récupération de toutes les réservations système (Admin).
* `PATCH /api/admin/reservations/:id/status` : Validation/mise à jour du statut d'une réservation (Admin).
* `DELETE /api/admin/reservations/:id` : Suppression d'une réservation (Admin).
* `GET /api/admin/users` : Liste de tous les utilisateurs (Admin).
* `PUT /api/admin/users/:id/role` : Modification du rôle d'un utilisateur (Admin).
* `DELETE /api/admin/users/:id` : Suppression définitive d'un compte (Admin).
* `POST /api/admin/tournaments` : Publication d'un nouveau tournoi (Admin).
* `PUT /api/admin/tournaments/:id` : Modification d'un tournoi (Admin).
* `DELETE /api/admin/tournaments/:id` : Suppression d'un tournoi (Admin).
* `POST /api/admin/events` : Publication d'un nouvel événement (Admin).
* `PUT /api/admin/events/:id` : Modification d'un événement (Admin).
* `DELETE /api/admin/events/:id` : Suppression d'un événement (Admin).
* `POST /api/admin/boardgames` : Ajout manuel d'un jeu de société (Admin).
* `DELETE /api/admin/boardgames/:id` : Retire un jeu du catalogue (Admin).
* `POST /api/admin/boardgames/import-hot` : Importation des jeux les plus populaires de BoardGameGeek (Admin).

### 3.3 Modélisation de la base de données (MCD, MLD, MPD)

#### Modèle Conceptuel de Données (MCD)
La modélisation conceptuelle de l'application Cicados s'articule autour des entités centrales et de leurs associations logiques :

```
    ┌──────────┐ 1,N             1,N ┌──────────────┐
    │  USERS   │────────────────────▶│ TOURNAMENTS  │ (via inscription)
    └────┬─────┘                     └──────────────┘
         │ 1,N
         │
         │ (effectue)
         ▼
    ┌──────────┐ 1,N             1,1 ┌──────────────┐
    │ RESERVAT.│────────────────────▶│    ROOMS     │ (concerne une table)
    └──────────┘                     └──────────────┘
```

#### Modèle Logique de Données (MLD)
* **users** (`id`, `email`, `password`, `firstname`, `lastname`, `pseudo`, `role`, `created_at`)
* **rooms** (`id`, `name`, `capacity`, `description`)
* **reservations** (`id`, `user_id`, `room_id`, `start_time`, `end_time`, `game_type`, `specific_game`, `players_count`, `status`)
* **tournaments** (`id`, `name`, `game`, `date`, `capacity`, `price`, `description`, `created_at`)
* **tournament_registrations** (`id`, `tournament_id`, `user_id`, `registered_at`)
* **board_games** (`id`, `name`, `min_players`, `max_players`, `play_time`, `category`, `description`, `image_url`, `rules_url`)
* **events** (`id`, `name`, `type`, `game`, `date`, `capacity`, `price`, `description`, `created_at`)
* **event_registrations** (`id`, `event_id`, `user_id`, `registered_at`)

### 3.4 Dictionnaire de données de la base de données

#### Table : `users`
Contient les informations des utilisateurs inscrits et des administrateurs.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'utilisateur. |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Adresse e-mail de connexion. |
| **password** | VARCHAR(255) | NOT NULL | Mot de passe de l'utilisateur (haché en bcrypt). |
| **firstname** | VARCHAR(100) | NOT NULL | Prénom de l'utilisateur. |
| **lastname** | VARCHAR(100) | NOT NULL | Nom de famille de l'utilisateur. |
| **pseudo** | VARCHAR(100) | NULL | Pseudonyme facultatif affiché publiquement. |
| **role** | ENUM('USER', 'ADMIN') | NOT NULL, DEFAULT 'USER' | Droits d'accès de l'utilisateur sur la plateforme. |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date et heure de création du compte. |

#### Table : `rooms`
Représente les ressources physiques de l'établissement (les tables de jeu disponibles).

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de la table physique. |
| **name** | VARCHAR(100) | NOT NULL | Libellé de la table (ex: Table 1, Table 2). |
| **capacity** | INT UNSIGNED | NOT NULL | Nombre maximum de joueurs acceptés sur la table. |
| **description** | TEXT | NULL | Note optionnelle sur l'emplacement ou le format de la table. |

#### Table : `reservations`
Gère les réservations de tables effectuées par les joueurs.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de la réservation. |
| **user_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence à l'utilisateur auteur de la réservation. |
| **room_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence à la table physique assignée par l'algorithme. |
| **start_time** | DATETIME | NOT NULL, INDEX | Date et heure de début de la session de jeu. |
| **end_time** | DATETIME | NOT NULL, INDEX | Date et heure de fin (calculée : début + durée de jeu). |
| **game_type** | VARCHAR(100) | NOT NULL | Type d'activité (BYOG, BOARD_GAME, ou TCG spécifique). |
| **specific_game** | VARCHAR(255) | NULL | Nom du jeu choisi par l'utilisateur pour la session. |
| **players_count** | INT UNSIGNED | NOT NULL, DEFAULT 2 | Nombre de participants prévus à la session de jeu. |
| **status** | ENUM | NOT NULL, DEFAULT 'PENDING' | Statut de réservation ('PENDING', 'CONFIRMED', 'CANCELLED'). |

#### Table : `tournaments`
Stocke les détails des compétitions officielles de cartes à collectionner (TCG) créées par les gérants.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique du tournoi. |
| **name** | VARCHAR(255) | NOT NULL | Nom officiel de l'événement de compétition. |
| **game** | VARCHAR(100) | NOT NULL | Nom du jeu TCG associé (ex: Magic: The Gathering). |
| **date** | DATETIME | NOT NULL | Date et heure de début de la compétition. |
| **capacity** | INT UNSIGNED | NOT NULL | Jauge maximale de participants autorisés physiquement. |
| **price** | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Frais de participation au tournoi en euros. |
| **description** | TEXT | NULL | Règlement, structure des rondes et dotations prévues. |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'enregistrement du tournoi. |

#### Table : `tournament_registrations`
Table de liaison gérant les inscriptions des joueurs aux tournois.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'inscription. |
| **tournament_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence au tournoi concerné. |
| **user_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence au joueur inscrit. |
| **registered_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date et heure d'inscription. |

> [!IMPORTANT]
> **Contrainte d'unicité d'inscription aux tournois** : Un index unique composite `UNIQUE KEY idx_tourney_user (tournament_id, user_id)` est appliqué sur cette table de liaison. Il empêche de manière stricte, au niveau de la base de données, qu'un même utilisateur s'inscrive plusieurs fois à un seul et même événement.

#### Table : `events`
Stocke les animations thématiques et soirées de jeux créées par l'établissement.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'événement. |
| **name** | VARCHAR(255) | NOT NULL | Nom de l'événement. |
| **type** | VARCHAR(100) | NOT NULL | Type d'animation (ex: Soirée découverte, Draft, Amical). |
| **game** | VARCHAR(100) | NOT NULL | Jeu associé (ex: Lorcana, Altered). |
| **date** | DATETIME | NOT NULL | Date et heure de début de l'événement. |
| **capacity** | INT UNSIGNED | NOT NULL | Nombre maximum de participants autorisés physiquement. |
| **price** | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Prix d'inscription à l'animation. |
| **description** | TEXT | NULL | Présentation des règles, de l'animation ou des dotations. |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création de la fiche d'événement. |

#### Table : `event_registrations`
Table de liaison gérant les réservations de places des utilisateurs pour les événements hors tournoi.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant de l'inscription. |
| **event_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence à l'événement concerné. |
| **user_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Référence à l'utilisateur inscrit. |
| **registered_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date et heure d'inscription. |

> [!IMPORTANT]
> **Index Unique Composite** : Tout comme pour les tournois, la table `event_registrations` dispose d'un index composite unique `UNIQUE KEY idx_event_user (event_id, user_id)` pour bloquer de manière inaltérable toute double inscription d'un même joueur.

---

## 4 — SPÉCIFICATIONS TECHNIQUES ET GESTION DE PROJET

### 4.1 Choix et justification de la stack technique
Pour concevoir Cicados, j'ai sélectionné une stack technologique robuste et moderne répondant aux exigences de réactivité, de découplage et de pérennité du projet :

```
                       ┌───────────────────────────────┐
                       │           FRONTEND            │
                       │    Vite + React + Tailwind    │
                       └───────────────┬───────────────┘
                                       │
                                   HTTP REST
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │           BACKEND             │
                       │       Node.js + Express       │
                       └───────────────┬───────────────┘
                                       │
                                   mysql2 pool
                                       ▼
                       ┌───────────────────────────────┐
                       │       BASE DE DONNÉES         │
                       │             MySQL             │
                       └───────────────────────────────┘
```

#### Frontend : React.js (Vite)
* **Composants Réutilisables** : React permet d'isoler des blocs d'interface complexes (cartes d'activités, boutons dynamiques, accordéons de FAQ, formulaires de recherche) et de les réutiliser sur différentes pages, réduisant la duplication de code et optimisant la maintenance.
* **Single Page Application (SPA)** : Grâce à React Router v6, la navigation entre le catalogue, le formulaire de réservation et l'agenda utilisateur s'effectue de manière instantanée côté client. Les composants se montent et se démontent de manière fluide sans nécessiter de rechargements complets de pages, offrant un confort d'utilisation comparable à une application mobile.
* **Vite** : Remplaçant avantageusement les anciens utilitaires de compilation lourds, Vite compile les ressources du frontend en moins de 1,5 seconde et accélère considérablement le cycle de développement grâce au rechargement à chaud (HMR).
* **Tailwind CSS** : Permet de concevoir des interfaces graphiques complexes et adaptatives directement au sein des fichiers JSX de composants, sans générer de feuilles de styles externes redondantes.

#### Backend : Node.js (Express)
* **Asynchronisme et Performance** : Node.js est particulièrement adapté pour gérer des requêtes concurrentes à haut débit grâce à son boucle d'événements non bloquante. L'accès à la base de données s'effectue de manière entièrement asynchrone grâce à des promesses.
* **Flexibilité** : Express offre un cadre minimaliste et hautement configurable pour exposer des points d'accès REST retournant du JSON propre, facilitant son intégration avec le client React.

#### Base de Données : MySQL
* **Relations Complexes et Intégrité** : L'allocation de tables, la gestion des inscriptions d'utilisateurs et le calcul de places nécessitent de réaliser des jointures et de faire appliquer des contraintes fortes (contraintes de clés étrangères `ON DELETE CASCADE`, index uniques). MySQL gère de manière native l'intégrité référentielle des données.
* **mysql2 avec Pool de Connexions** : L'utilisation de `mysql2` permet de maintenir un pool de connexions SQL actives et ouvertes en mémoire. Cela évite le coût en ressources réseau et en temps processeur lié à l'ouverture et la fermeture d'une nouvelle connexion SQL à chaque requête client.

### 4.2 Gestion de projet Agile (Méthodologie Scrum et sprints)
Le développement de Cicados a suivi la méthodologie agile **Scrum** sur 4 sprints d'une semaine chacun, rythmés par des jalons précis :

* **Sprint 0 : Cadrage et Conception** :
  * Rédaction du cahier des charges et élaboration des Personas et User Stories.
  * Conception des wireframes d'interface avec Excalidraw.
  * Modélisation de la base de données (MCD, MLD, MPD) et écriture du script d'initialisation SQL.
* **Sprint 1 : Architecture MVC Backend et Pages Clés** :
  * Initialisation du serveur Express et configuration du pool de connexions SQL.
  * Implémentation du routeur backend et création des premiers modèles de données.
  * Création de la page d'accueil frontend et intégration du catalogue de jeux de société statique.
* **Sprint 2 : Authentification, Réservations et Interactivité** :
  * Développement du système d'authentification JWT (inscription, connexion sécurisée).
  * Intégration de l'algorithme d'allocation de table et de la grille horaire de disponibilité interactive.
  * Ajout de la barre de recherche avec autocomplétion pour la ludothèque sur le formulaire de réservation.
* **Sprint 3 : Console d'Administration, Veille et Polissage** :
  * Implémentation du tableau de bord d'administration (CRUD tournois, événements, utilisateurs).
  * Développement du proxy d'importation automatique depuis l'API de BoardGameGeek.
  * Intégration du système de traduction bilingue (i18next).
  * Phase de tests d'intégration, correction de bugs et déploiement de l'application.

### 4.3 Conventions de codage, de versioning (Git) et de commits
Pour garantir la lisibilité et l'organisation du projet, un cadre de règles strictes a été appliqué :
* **Style de Code** : Utilisation de la nomenclature `camelCase` pour les variables, fonctions et attributs en JavaScript, `PascalCase` pour les classes et composants React, et `snake_case` pour les colonnes et clés de la base de données SQL.
* **Gestion des Branches Git** :
  * `master` / `main` : Branche de production contenant uniquement le code stable validé.
  * `dev` : Branche d'intégration où sont fusionnées les fonctionnalités testées.
  * Branches éphémères : Une branche par fonctionnalité (ex: `feat/res-conflict-check`) ou correction (ex: `bugfix/bgg-proxy-cors`).
* **Formatage des Commits (Conventional Commits)** : Chaque message de validation respecte la structure `type: description` (ex : `feat: add local JSON fallback for boardgames catalog`).

---

## 5 — VALIDATION DES COMPÉTENCES DU RÉFÉRENTIEL (REAC DWWM)

### 5.1 Activité 1 : Développer la partie front-end d'une application web ou web mobile

#### CP 1. Maquetter une application
* **Mise en œuvre** : Avant d'écrire la moindre ligne de code, j'ai élaboré des schémas d'interface utilisateur (Wireframes) à l'aide d'Excalidraw, modélisant les flux d'écrans pour le format mobile-first et le format desktop de la page d'accueil, du catalogue de jeux et du formulaire de réservation.
* **Preuve dans le projet** : Les fichiers wireframes créés lors de la phase de conception sont intégrés dans les annexes du projet (voir dossier `conception/` à la racine).

#### CP 2. Réaliser une interface utilisateur web statique et adaptable
* **Mise en œuvre** : J'ai codé l'interface de Cicados en utilisant Tailwind CSS pour adapter dynamiquement la structure des pages selon la taille d'écran. La navigation bascule sur un menu tactile hamburger repliable sur mobile, et la disposition des cartes d'événements et de jeux de société se réorganise automatiquement d'une colonne unique (mobile) à trois colonnes (grand écran).
* **Preuve dans le projet** : Les styles responsives implémentés dans [Header.jsx](file:///Applications/MAMP/htdocs/Cicadas2/frontend/src/components/Header.jsx) avec les directives Tailwind `@media` (`hidden md:flex`, `md:hidden`, etc.).

#### CP 3. Développer une interface utilisateur web dynamique
* **Mise en œuvre** : J'ai programmé des formulaires interactifs (connexion, inscription, réservation) sécurisés par des expressions régulières pour valider les données en temps réel côté client. Le module d'autocomplétion filtre la liste de suggestions dynamiquement lors de la saisie d'un jeu de société, et la grille des heures de réservation se met à jour en temps réel lors du changement de date sans rechargement.
* **Preuve dans le projet** : La logique de mise à jour d'état synchrone et d'autocomplétion programmée dans [Reservations.jsx](file:///Applications/MAMP/htdocs/Cicadas2/frontend/src/pages/Reservations.jsx#L55-L120).

---

### 5.2 Activité 2 : Développer la partie back-end d'une application web ou web mobile

#### CP 5. Créer une base de données
* **Mise en œuvre** : J'ai conçu le script SQL de structure de base de données de l'application. Au démarrage du serveur, l'application initialise le pool et effectue automatiquement des vérifications et des migrations de table (création automatique des tables manquantes, ajout de colonnes comme `players_count` sur la table `reservations`) pour assurer l'intégrité de la base.
* **Preuve dans le projet** : Le script [schema.sql](file:///Applications/MAMP/htdocs/Cicadas2/backend/schema.sql) décrivant les tables, index et clés étrangères, ainsi que le module d'initialisation de connexion asynchrone dans [db.js](file:///Applications/MAMP/htdocs/Cicadas2/backend/src/config/db.js).

#### CP 6. Développer les composants d'accès aux données
* **Mise en œuvre** : J'ai programmé l'ensemble des requêtes d'interrogation et de mise à jour SQL dans des modules de modèles JavaScript dédiés (`User`, `Reservation`, `Tournament`, `BoardGame`). Ces requêtes effectuent des jointures SQL complexes (comme l'agrégation de réservations et le calcul du nombre d'inscrits en temps réel) et sont sécurisées contre les injections SQL grâce au mécanisme de requêtes préparées avec remplacement de paramètres (placeholders `?`).
* **Preuve dans le projet** : Les requêtes SQL paramétrées dans [reservation.model.js](file:///Applications/MAMP/htdocs/Cicadas2/backend/src/models/reservation.model.js) et [tournament.model.js](file:///Applications/MAMP/htdocs/Cicadas2/backend/src/models/tournament.model.js).

#### CP 7. Développer la partie back-end d'une application web ou web mobile
* **Mise en œuvre** : Le backend de l'application est structuré selon le design pattern **MVC (Modèle-Vue-Contrôleur)**. J'ai configuré les routeurs Express pour diriger les requêtes HTTP, implémenté des middlewares de sécurité pour décoder et vérifier les signatures des tokens JWT, et programmé les contrôleurs contenant les règles de gestion métier.
* **Preuve dans le projet** : Les contrôleurs et les routes de l'API REST sous `backend/src/controllers/` et `backend/src/routes/`.

---

## 6 — RÉALISATIONS TECHNIQUES ET ÉTUDE DU CODE SOURCE

### 6.1 Rôle et analyse des fichiers clés du Frontend

#### Point d'entrée de l'application React : `main.jsx`
Le fichier `main.jsx` est le point d'ancrage de la Single Page Application. Il importe la bibliothèque de rendu `ReactDOM` pour injecter le composant principal `App` au sein de la balise HTML identifiée par l'ID `root` dans le document global `index.html`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n.js'; // Initialisation de i18next pour la traduction bilingue

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Routage centralisé : `App.jsx`
Le composant `App.jsx` déclare la structure de navigation de l'application à l'aide de React Router v6. Il définit un routeur principal et utilise le composant parent `MainLayout` pour encapsuler les pages et afficher de manière cohérente le Header et le Footer sur l'ensemble du site.

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BoardGames from './pages/BoardGames';
import Tournaments from './pages/Tournaments';
import Reservations from './pages/Reservations';
import MyReservations from './pages/MyReservations';
import DashboardAdmin from './pages/DashboardAdmin';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="boardgames" element={<BoardGames />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="my-reservations" element={<MyReservations />} />
          <Route path="admin" element={<DashboardAdmin />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 6.2 Rôle et analyse des fichiers clés du Backend

#### Initialisation du serveur : `server.js`
Le point d'entrée du serveur backend Express configure les middlewares essentiels (CORS, parsing JSON, loggers), importe les différents routeurs modularisés de l'application et démarre l'écoute sur le port configuré.

```javascript
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './src/routes/auth.routes.js';
import reservationRoutes from './src/routes/reservation.routes.js';
import tournamentRoutes from './src/routes/tournament.routes.js';
import boardgameRoutes from './src/routes/boardgame.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { testConnection } from './src/config/db.js';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: 'http://localhost:5173' })); // Autorise les requêtes CORS depuis le front Vite
app.use(express.json());

// Enregistrement des routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/boardgames', boardgameRoutes);
app.use('/api/admin', adminRoutes);

// Démarrage du serveur et test de la connexion BDD
app.listen(PORT, async () => {
    console.log(`Serveur Express en écoute sur le port ${PORT}`);
    await testConnection();
});
```

---

## 7 — FOCUS ALGORITHMIQUE & FONCTIONNALITÉS AVANCÉES

### 7.1 L'algorithme de détection des conflits de réservation

#### Problématique
Lorsqu'un utilisateur effectue ou modifie une réservation de table pour une date donnée, d'une heure de début à une heure de fin, le système doit garantir qu'il reste au moins une table physique de jeu de libre dans l'établissement sur l'intégralité du créneau demandé.

#### Solution algorithmique
Pour détecter si des réservations existantes se chevauchent avec le nouveau créneau demandé, nous appliquons la formule logique de chevauchement d'intervalles temporels. Deux créneaux `[A, B]` et `[C, D]` se chevauchent si et seulement si :
$$\text{Début}_1 < \text{Fin}_2 \quad \text{et} \quad \text{Fin}_1 > \text{Début}_2$$

Dans notre modèle SQL, cela se traduit par la recherche des réservations actives (non annulées) qui intersectent le créneau souhaité :
```sql
SELECT room_id 
FROM reservations 
WHERE status != 'CANCELLED' 
  AND start_time < ? 
  AND end_time > ?
```
Où le premier paramètre est l'heure de fin calculée de la nouvelle réservation, et le second paramètre est l'heure de début de la nouvelle réservation.

#### Implémentation SQL (`reservation.model.js`)
La méthode `findAvailableRoom` effectue cette vérification et attribue automatiquement la première table libre (non renvoyée par la sous-requête de conflit) :

```javascript
async findAvailableRoom(startTime, endTime) {
    // 1. Lister les tables occupées sur ce créneau
    const sqlOccupied = `
        SELECT room_id 
        FROM reservations 
        WHERE status != 'CANCELLED' 
          AND start_time < ? 
          AND end_time > ?
    `;
    const occupiedRows = await query(sqlOccupied, [endTime, startTime]);
    const occupiedRoomIds = occupiedRows.map(r => r.room_id);

    // 2. Récupérer toutes les tables de l'établissement
    const allRooms = await query('SELECT id FROM rooms');
    
    // 3. Trouver la première table qui n'est pas occupée
    const freeRoom = allRooms.find(room => !occupiedRoomIds.includes(room.id));
    return freeRoom ? freeRoom.id : null; // Retourne l'ID de la table libre, ou null si complet
}
```

### 7.2 Le Proxy BGG et le convertisseur XML vers JSON

#### Problématique
Pour alimenter automatiquement la ludothèque, le backend interroge les API de BoardGameGeek (BGG). Cependant, l'API de BGG retourne exclusivement des flux de données au format **XML**, alors que l'application React attend des objets structurés au format **JSON**. 

#### Solution
Le contrôleur backend `bgg.controller.js` sert de proxy applicatif. Il exécute la requête HTTP vers BGG, récupère la réponse brute au format XML, puis exploite la bibliothèque performante `fast-xml-parser` pour la convertir instantanément en un objet JavaScript natif avant de la renvoyer au client sous format JSON.

```javascript
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
});

export const searchBggGames = async (req, res) => {
    try {
        const { query } = req.query;
        const response = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`);
        const xmlText = await response.text();
        
        // Conversion XML vers JSON à la volée
        const jsonData = parser.parse(xmlText);
        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: "Erreur de communication avec BoardGameGeek" });
    }
};
```

### 7.3 Le basculement dynamique en cas de panne (Sauvegarde JSON)

#### Problématique
Si le serveur de base de données MySQL est arrêté ou subit une panne, le catalogue de jeux de société de l'application devient inaccessible, bloquant la consultation et la prise de réservation. Pour assurer une tolérance aux pannes maximale (**fault tolerance**), l'application doit basculer de façon transparente sur un mode dégradé.

#### Solution
J'ai implémenté un système de **failover** dans le contrôleur [boardgame.controller.js](file:///Applications/MAMP/htdocs/Cicadas2/backend/src/controllers/boardgame.controller.js). Si la requête de lecture SQL `BoardGame.findAll()` échoue, le contrôleur intercepte l'erreur, bascule immédiatement sur la lecture asynchrone du fichier JSON de sauvegarde locale `/backend/src/data/boardgame-list.json`, normalise à la volée ses propriétés avec des valeurs cohérentes par défaut et un visuel générique de remplacement, puis retourne les données au client sans interrompre l'expérience utilisateur.

```javascript
// controllers/boardgame.controller.js
export const getBoardGames = async (req, res) => {
    try {
        const games = await BoardGame.findAll();
        res.json(games);
    } catch (error) {
        console.error("Panne base de données ! Basculement sur boardgame-list.json :", error);
        try {
            const jsonPath = path.join(__dirname, '..', 'data', 'boardgame-list.json');
            const data = await fs.readFile(jsonPath, 'utf8');
            const gamesList = JSON.parse(data);

            const fallbackGames = gamesList.map((game, index) => ({
                id: index + 10000,
                name: game.name,
                min_players: 2,
                max_players: 4,
                play_time: 45,
                category: "Famille",
                description: `Jeu de société : ${game.name}. Ce jeu fait partie de la ludothèque Cicados. (Données de secours chargées depuis le fichier local).`,
                image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600',
                rules_url: null
            }));

            res.json(fallbackGames);
        } catch (jsonError) {
            console.error("Erreur critique : impossible de lire le fichier de secours JSON :", jsonError);
            res.status(500).json({ error: "Impossible de charger les jeux de société (serveurs hors ligne)." });
        }
    }
};
```

---

## 8 — JEUX D'ESSAI ET SCÉNARIOS DE VALIDATION

Afin de valider la conformité de l'application par rapport au cahier des charges, j'ai défini et exécuté des scénarios de test d'intégration pas à pas :

### Scénario A : Inscription et Détection de Conflit de Table

#### 1. Contexte de départ
La base de données est initialement vierge de réservations pour la date du `2026-07-20`. L'établissement possède 4 tables physiques (IDs 1, 2, 3, 4) déclarées dans la table `rooms`.

#### 2. Action 1 : Création d'une première réservation
* **Payload HTTP POST `/api/reservations`** :
  ```json
  {
    "date": "2026-07-20",
    "time": "14:00",
    "duration": 2,
    "gameType": "BOARD_GAME",
    "specificGame": "7 Wonders",
    "playersCount": 4
  }
  ```
* **Résultat attendu** : L'API retourne un code `201 Created` et confirme l'allocation de la table 1 (ID 1) pour le créneau de `14:00 à 16:00`.
* **Enregistrement en BDD** :
  ```sql
  SELECT id, room_id, start_time, end_time, status 
  FROM reservations 
  WHERE date(start_time) = '2026-07-20';
  ```
  *Résultat* : 1 ligne insérée, `room_id = 1`, `start_time = '2026-07-20 14:00:00'`, `end_time = '2026-07-20 16:00:00'`.

#### 3. Action 2 : Remplissage complet du créneau
Trois autres réservations distinctes sont créées par des utilisateurs différents sur le même créneau de `14:00 à 16:00`.
* **Résultat attendu** : Les tables 2, 3, et 4 sont allouées avec succès. Les 4 tables physiques de l'établissement sont désormais occupées simultanément de 14:00 à 16:00.

#### 4. Action 3 : Tentative de surbooking
Un cinquième utilisateur tente de soumettre une réservation de table pour la même date à `15:00` pour une durée de 1 heure.
* **Payload HTTP POST `/api/reservations`** :
  ```json
  {
    "date": "2026-07-20",
    "time": "15:00",
    "duration": 1,
    "gameType": "BYOG",
    "specificGame": "J'apporte mon jeu",
    "playersCount": 2
  }
  ```
* **Calcul logique** : Le créneau demandé (`15:00 à 16:00`) chevauche les 4 réservations actives (occupées de `14:00 à 16:00`).
* **Résultat attendu** : L'API backend bloque l'insertion, retourne un code HTTP `400 Bad Request` et renvoie le message JSON : `{ "error": "Toutes les tables sont complètes pour ce créneau." }`. La base de données reste saine et le surbooking a été évité avec succès.

### Scénario B : Remplissage et activités pour 5 utilisateurs différents (Drafts, Tournois, Ludothèque)

Pour tester le comportement de la base de données en conditions réelles et valider les parcours utilisateurs croisés, nous avons conçu un jeu d'essai impliquant 5 comptes joueurs différents effectuant des réservations de jeux et des inscriptions à des événements sur 5 jours consécutifs.

#### 1. Comptes de test créés en base de données
Cinq utilisateurs distincts ont été pré-créés en base de données avec des mots de passe hachés sécurisés et des adresses mails uniques :
1. **User 1** : Pseudo: `AlexTCG` (ID: 101, email: `alex@cicados.fr`)
2. **User 2** : Pseudo: `MarieBoardG` (ID: 102, email: `marie@cicados.fr`)
3. **User 3** : Pseudo: `JulieMagic` (ID: 103, email: `julie@cicados.fr`)
4. **User 4** : Pseudo: `PierreAltered` (ID: 104, email: `pierre@cicados.fr`)
5. **User 5** : Pseudo: `ThomasDuels` (ID: 105, email: `thomas@cicados.fr`)

#### 2. Déroulement du jeu d'essai chronologique

##### Jour 1 : Mercredi 15 Juillet 2026 — Inscription au Tournoi Pokémon par User 1
* **Action** : `AlexTCG` se connecte et s'inscrit au tournoi officiel Pokémon (ID: 12) prévu le samedi suivant.
* **Payload HTTP POST `/api/tournaments/12/register`** (avec Header JWT de `AlexTCG`).
* **Requête SQL déclenchée** :
  ```sql
  INSERT INTO tournament_registrations (tournament_id, user_id) VALUES (12, 101);
  ```
* **Résultat attendu** : Inscription réussie (`200 OK`). La jauge d'inscrits du tournoi Pokémon augmente de 1 sur l'affichage public du site. Un email de confirmation contenant le règlement officiel du tournoi est envoyé via l'API Brevo.

##### Jour 2 : Jeudi 16 Juillet 2026 — Réservation de Table Ludothèque par User 2
* **Action** : `MarieBoardG` souhaite réserver une table pour jouer à *7 Wonders* avec ses amis de 18:00 à 21:00.
* **Payload HTTP POST `/api/reservations`** :
  ```json
  {
    "date": "2026-07-16",
    "time": "18:00",
    "duration": 3,
    "gameType": "BOARD_GAME",
    "specificGame": "7 Wonders",
    "playersCount": 4
  }
  ```
* **Résultat attendu** : L'algorithme vérifie les disponibilités. La table 1 (ID: 1) est libre sur ce créneau et lui est attribuée (`201 Created`). Une confirmation est envoyée par e-mail avec un récapitulatif détaillé.

##### Jour 3 : Vendredi 17 Juillet 2026 — Participation à un Draft Magic par User 3
* **Action** : `JulieMagic` s'inscrit au Draft officiel hebdomadaire de Magic (ID: 15).
* **Payload HTTP POST `/api/events/15/register`**.
* **Résultat attendu** : Le système vérifie que la jauge n'est pas pleine (24 inscrits pour 30 places max). L'inscription est validée et enregistrée en table `event_registrations` (`200 OK`).

##### Jour 4 : Samedi 18 Juillet 2026 — Partie Amicale (BYOG) par User 4
* **Action** : `PierreAltered` apporte ses propres decks du nouveau jeu *Altered* pour jouer avec un ami de 14:00 à 16:00.
* **Payload HTTP POST `/api/reservations`** :
  ```json
  {
    "date": "2026-07-18",
    "time": "14:00",
    "duration": 2,
    "gameType": "BYOG",
    "specificGame": "Altered - Deck personnel",
    "playersCount": 2
  }
  ```
* **Résultat attendu** : Le système alloue la table 1. Le tag "Altered - Deck personnel" apparaît sur le planning avec un style bleu vif (J'apporte mon jeu).

##### Jour 5 : Dimanche 19 Juillet 2026 — Session Duel par User 5
* **Action** : `ThomasDuels` réserve une table de 15:00 à 16:30 pour une partie de *7 Wonders Duel*.
* **Payload HTTP POST `/api/reservations`** :
  ```json
  {
    "date": "2026-07-19",
    "time": "15:00",
    "duration": 2, // Arrondi à l'heure supérieure pour la gestion des créneaux
    "gameType": "BOARD_GAME",
    "specificGame": "7 Wonders Duel",
    "playersCount": 2
  }
  ```
* **Résultat attendu** : La table 1 est réservée pour sa session de 15:00 à 17:00. Le catalogue ayant configuré le nombre de joueurs min/max pour ce jeu de 2 à 2, le système accepte la requête.

---

## 9 — VEILLE TECHNOLOGIQUE ET SÉCURITÉ (OWASP)

La sécurité des données utilisateurs et la robustesse de l'API REST de Cicados ont fait l'objet d'une attention rigoureuse tout au long de la phase de conception technique, en ciblant les vulnérabilités courantes définies par l'**OWASP** :

### 1. Injections SQL
* **Risque** : Un attaquant saisit du code SQL malveillant dans les champs de formulaire (ex: `' OR '1'='1`) pour manipuler les requêtes de base de données.
* **Parade** : Toutes les requêtes d'accès aux données dans nos modèles exploitent le mécanisme des **requêtes préparées** (Prepared Statements) fournies par le driver `mysql2`. Les valeurs saisies par les utilisateurs sont transmises séparément de la structure de la requête SQL sous forme de paramètres (placeholders `?`), rendant toute injection SQL techniquement impossible.

### 2. Cross-Origin Resource Sharing (CORS)
* **Risque** : Des scripts malveillants s'exécutant sur d'autres domaines tiers tentent d'interroger notre API REST pour extraire des informations sensibles.
* **Parade** : Le backend Express configure de manière stricte le middleware `cors` pour accepter uniquement les requêtes HTTP provenant de l'origine de confiance de l'application frontend (`http://localhost:5173` en développement), bloquant toute requête en provenance d'autres origines non autorisées.

### 3. Gestion et Signature des Tokens JWT
* **Risque** : Usurpation d'identité en falsifiant le contenu ou la signature des jetons de session utilisateur.
* **Parade** : Les jetons d'authentification JSON Web Tokens (JWT) générés lors de la connexion sont chiffrés et signés cryptographiquement côté serveur à l'aide d'une clé secrète robuste stockée dans le fichier d'environnement `.env`. Le middleware `authMiddleware` intercepte et valide la signature de ce token à chaque appel de route privée. Si le token est modifié, expiré ou corrompu, l'accès est immédiatement rejeté avec un code HTTP `401 Unauthorized`.

### 4. Contrôle d'Accès aux Données (Rôles)
* **Risque** : Un utilisateur malveillant connecté tente d'accéder aux fonctions d'administration ou de modifier les données d'un autre client.
* **Parade** : L'authentification et les droits sont vérifiés par des middlewares distincts montés en série. Les routes d'administration (`/api/admin/*`) sont sécurisées par un middleware d'autorisation de rôle `adminMiddleware` qui vérifie que le champ `role` décodé dans le token JWT possède bien la valeur `'ADMIN'`. De même, lors de la modification ou annulation d'une réservation, le modèle vérifie systématiquement que l'identifiant du demandeur (`req.user.id`) correspond bien à l'auteur original de l'enregistrement (`user_id` de la réservation en base).

---

## 10 — UTILISATION DE RESSOURCES ANGLOPHONES

Le développement informatique moderne exige une lecture et une compréhension constante de documentations et de spécifications techniques rédigées exclusivement en langue anglaise. Durant la conception de Cicados, j'ai régulièrement exploité des sites anglophones pour résoudre des défis techniques majeurs :
* **API de BoardGameGeek** : La documentation de l'API XML2 de BoardGameGeek étant intégralement en anglais, j'ai dû analyser les différents schémas de requêtes et de réponses pour programmer le contrôleur proxy, extraire les identifiants d'objets et parser les flux de données XML.
* **Documentation de mysql2 et Pool de Connexion** : Pour concevoir une gestion de pool de connexions SQL performante et robuste, j'ai exploité la documentation officielle du package npm `mysql2` en anglais pour configurer correctement les options de timeout et de limite de connexions.
* **Spécifications i18next** : La configuration de la détection de langue côté client a nécessité l'étude de la documentation de `i18next` en anglais pour l'intégration des hooks de traduction `useTranslation` et du chargement des fichiers de ressources de traduction JSON.

---

## 11 — CONCLUSION ET PERSPECTIVES D'ÉVOLUTION

### Conclusion
La conception et le développement de l'application **Cicados** constituent un projet d'apprentissage et de validation de compétences particulièrement riche. Il m'a permis d'appréhender le cycle de vie complet d'un projet web moderne, de la structuration logique des tables SQL à la mise en œuvre de mécaniques UX complexes et adaptatives côté client. 

La mise en application de l'architecture MVC côté serveur, couplée au découpage modulaire du client React et aux mécanismes de sécurité avancés (JWT, détection de conflits SQL, tolérance aux pannes JSON), valide l'ensemble des compétences requises pour l'obtention du Titre Professionnel de Développeur Web et Web Mobile.

### Perspectives d'Évolution
Pour enrichir l'application dans des versions ultérieures, plusieurs évolutions logicielles intéressantes pourraient être envisagées :
1. **Paiement en ligne** : Intégrer une API de paiement sécurisée (Stripe) pour permettre aux joueurs de s'acquitter de leurs frais d'inscription aux tournois directly lors de leur inscription sur le site.
2. **Notifications temps réel (WebSockets)** : Implémenter la bibliothèque Socket.io pour alerter instantanément un administrateur lors d'une nouvelle prise de réservation ou pour actualiser en direct les jauges d'inscriptions aux tournois ouverts sans nécessiter de rafraîchissement manuel de la page par l'utilisateur.
3. **Application mobile native (React Native)** : Capitaliser sur la structure modulaire de nos composants frontend en React pour compiler et distribuer une application mobile native sous iOS et Android, renforçant l'accès rapide au planning et à l'espace utilisateur pour les joueurs réguliers de l'établissement.
