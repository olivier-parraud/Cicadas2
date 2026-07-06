# 📘 Cahier des Charges — Cicados

> **Projet** : Cicados — Application web de réservation de tables de jeux et de gestion de tournois  
> **Stack technique** : React.js (Vite + Tailwind CSS v4) + Node.js (Express) + MySQL  
> **Version** : 1.0  
> **Date** : Juillet 2026

---

## 1. Synopsis et Présentation du Projet

### 1.1 Description du projet
**Cicados** est une plateforme web dédiée aux passionnés de **jeux de cartes à collectionner (TCG)** (Magic: The Gathering, Yu-Gi-Oh!, Pokémon, Lorcana) et de **jeux de société**. Elle permet à un établissement de type "café-jeux" ou "boutique de jeux" de proposer la réservation en ligne de tables de jeux et de gérer efficacement les inscriptions à ses tournois officiels et animations thématiques.

L'objectif principal est de simplifier la mise en relation entre l'établissement et sa communauté de joueurs, en offrant une expérience utilisateur fluide et immersive, tout en optimisant logistiquement l'occupation de l'espace physique du bâtiment.

### 1.2 Besoins et Problématiques
Le développement de l'application répond à plusieurs enjeux majeurs :
- **Optimisation de l'espace physique** : Assurer une synchronisation parfaite entre les réservations en ligne et l'occupation réelle des tables de jeux dans l'établissement afin d'éviter le surbooking.
- **Gestion logistique rigoureuse** : Mettre en place un système de réservation dynamique qui alloue automatiquement les tables disponibles en fonction du nombre de joueurs et du type de jeu (grands plateaux ou duels de cartes).
- **Prévention des "no-shows"** : Structurer la prise de réservations et automatiser l'envoi d'e-mails transactionnels (confirmations, rappels) pour fiabiliser la venue des joueurs.
- **Gestion fluide des tournois** : Suivre en temps réel les jauges d'inscriptions aux événements TCG pour ne jamais dépasser la capacité maximale d'accueil physique de l'établissement.

### 1.3 Typologie des Utilisateurs
L'application est conçue pour 3 profils d'utilisateurs distincts :

1. **Visiteur (Public)** :
   - **Objectif** : Découvrir l'établissement, consulter l'agenda des tournois, parcourir la ludothèque disponible (catalogue de jeux de société) et s'informer sur les tarifs et horaires.
   - **Contraintes UX** : Navigation rapide, affichage clair et visuel des disponibilités sur un calendrier, design responsive et Mobile-First.
2. **Utilisateur Authentifié (Joueur connecté)** :
   - **Objectif** : Réserver un créneau de jeu en ligne, s'inscrire ou se désinscrire à un tournoi, et gérer ses réservations actives depuis son espace personnel "Mes Activités".
   - **Contraintes UX** : Processus de réservation fluide finalisé en moins de 60 secondes, tableau de bord intuitif permettant la modification ou l'annulation rapide.
3. **Administrateur (Gestionnaire de l'établissement)** :
   - **Objectif** : Piloter l'intégralité de la plateforme. Gérer les comptes utilisateurs, valider ou annuler des réservations, créer et supprimer des tournois, administrer le catalogue de jeux de société et importer dynamiquement de nouvelles références via BoardGameGeek.
   - **Contraintes UX** : Interface d'administration épurée sous forme d'onglets (Dashboard), avec des outils d'importation et d'actions groupées en un clic.

---

## 2. Partie Fonctionnelle (User Stories)

Le périmètre fonctionnel est défini par les User Stories (US) présentées ci-dessous, structurées selon les standards de la méthode Agile et priorisées via la matrice **MoSCoW** (*MUST* : Vital, *SHOULD* : Important, *COULD* : Confort, *WON'T* : Exclu pour cette version).

```
        ┌─────────────────────────────────────────────────────────────┐
        │                     MATRICE MoSCoW                          │
        ├───────────────┬─────────────────────────────────────────────┤
        │  MUST (🔴)    │ Fonctions indispensables au noyau de l'app   │
        ├───────────────┼─────────────────────────────────────────────┤
        │  SHOULD (🟡)  │ Éléments importants mais non bloquants      │
        ├───────────────┼─────────────────────────────────────────────┤
        │  COULD (🔵)   │ Options de confort ou d'agrément            │
        ├───────────────┼─────────────────────────────────────────────┤
        │  WON'T (⚪)   │ Fonctionnalités exclues de la v1            │
        └───────────────┴─────────────────────────────────────────────┘
```

---

### EPIC-01 : Vitrine Digitale & Expérience Visiteur

**Objectif** : Offrir une interface publique attrayante permettant de comprendre le concept de l'établissement, de consulter le catalogue de jeux et l'agenda des tournois.

#### US-01.1 | Consultation de l'accueil et FAQ
- **Priorité** : **MUST** 🔴 | **Complexité** : 3 pts
- **En tant que** Visiteur  
- **Je veux** pouvoir accéder à la page d'accueil, consulter la FAQ interactive et voir la présentation générale de l'établissement  
- **Afin de** comprendre le fonctionnement du lieu, ses horaires, son plan d'accès et les modalités de réservation.
- **Critères d'acceptation** :
  - La FAQ s'affiche sous forme d'accordéon cliquable fluide (ouverture/fermeture).
  - Un carrousel d'images défile automatiquement toutes les 6 secondes sur la page d'accueil.
  - Les horaires d'ouverture et coordonnées sont affichés dans le Footer sur toutes les pages.

#### US-01.2 | Consultation bilingue (FR/EN)
- **Priorité** : **MUST** 🔴 | **Complexité** : 3 pts
- **En tant que** Visiteur / Utilisateur  
- **Je veux** que le site détecte automatiquement la langue de mon navigateur ou me permette de basculer manuellement entre le Français et l'Anglais  
- **Afin de** naviguer confortablement dans ma langue maternelle.
- **Critères d'acceptation** :
  - Un bouton de switch de langue est présent dans le Header (FR/EN).
  - La traduction s'applique instantanément à tous les éléments textuels de l'interface sans rechargement de page.

#### US-01.3 | Consultation du catalogue de jeux de société
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Visiteur  
- **Je veux** parcourir la ludothèque du site avec une recherche textuelle et un filtre par catégorie  
- **Afin de** savoir si les jeux de plateau disponibles correspondent à mes préférences et à mon groupe de joueurs.
- **Critères d'acceptation** :
  - Affichage des jeux sous forme de grille responsive.
  - Chaque jeu affiche son titre, son image, sa catégorie, le nombre de joueurs (min/max), et la durée de jeu.
  - Un bouton "Voir plus" permet d'étendre la description du jeu sans quitter la page (système de description tronquée dynamique).
  - Un bouton "Réserver ce jeu" redirige directement vers le formulaire de réservation en pré-remplissant le champ de saisie du jeu.

#### US-01.4 | Consultation de l'agenda des tournois
- **Priorité** : **MUST** 🔴 | **Complexité** : 3 pts
- **En tant que** Visiteur  
- **Je veux** visualiser les tournois TCG planifiés dans l'établissement  
- **Afin de** connaître les dates, les prix d'inscription et les jeux concernés.
- **Critères d'acceptation** :
  - Les tournois sont triés par ordre chronologique (du plus proche au plus éloigné).
  - Chaque tournoi affiche le jeu associé (ex: Magic, Pokémon), sa date, ses frais d'inscription, une jauge de capacité (barre de progression colorée), et le nombre d'inscrits en temps réel.
  - Des filtres rapides par jeu TCG permettent de trier les tournois.

---

### EPIC-02 : Système de Réservation de Tables

**Objectif** : Fournir une interface de réservation interactive avec détection automatique des conflits pour garantir qu'aucune table ne soit surbookée.

#### US-02.1 | Sélection de la date et de l'heure en temps réel
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Joueur connecté  
- **Je veux** choisir une date et visualiser instantanément les créneaux horaires disponibles  
- **Afin de** planifier ma partie en fonction des disponibilités réelles de l'établissement.
- **Critères d'acceptation** :
  - L'interface affiche une grille horaire (ex: 10h–21h) mise à jour en temps réel selon la date choisie.
  - Un code couleur simple indique l'état du créneau : Vert (≥ 2 tables libres), Orange (1 table libre), Rouge (complet, créneau désactivé et non cliquable).

#### US-02.2 | Renseignement des détails de la partie
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Joueur connecté  
- **Je veux** spécifier le type de jeu (TCG ou Jeu de société), le nom du jeu, la durée de ma session (en heures), et le nombre de joueurs  
- **Afin de** recevoir une table adaptée aux besoins de mon groupe.
- **Critères d'acceptation** :
  - Si le type de jeu est "Jeu de société", un menu déroulant d'autocomplétion filtre la ludothèque en temps réel.
  - Lors de la sélection d'un jeu du catalogue, le champ "Nombre de joueurs" s'ajuste silencieusement et automatiquement s'il est inférieur au minimum requis par le jeu.
  - L'utilisateur peut cocher une option "J'apporte mon jeu" (BYOG - Bring Your Own Game) s'il ne souhaite pas utiliser le catalogue.

#### US-02.3 | Allocation de table automatique sans conflit
- **Priorité** : **MUST** 🔴 | **Complexité** : 8 pts
- **En tant que** Système  
- **Je veux** calculer l'heure de fin de la réservation, détecter les conflits horaires sur les tables existantes et assigner automatiquement la première table libre disponible  
- **Afin de** garantir qu'aucune table physique ne subisse de double réservation.
- **Critères d'acceptation** :
  - La détection de conflit SQL s'effectue sur les réservations actives (non annulées) via la condition logique : `start_time < nouveau_end_time AND end_time > nouveau_start_time`.
  - Si aucune des 4 tables de l'établissement n'est disponible sur l'intégralité du créneau demandé, une erreur "Toutes les tables sont complètes" est retournée et l'enregistrement est bloqué.

---

### EPIC-03 : Authentification & Espace Joueur

**Objectif** : Sécuriser les accès de l'application et offrir un espace personnel aux joueurs pour gérer leurs activités de manière autonome.

#### US-03.1 | Inscription et Connexion
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Visiteur  
- **Je veux** pouvoir me créer un compte avec mon email, un mot de passe robuste, mon nom, prénom et un pseudonyme, puis m'authentifier  
- **Afin d'**accéder aux fonctionnalités de réservation et d'inscription aux tournois.
- **Critères d'acceptation** :
  - Le mot de passe saisi est crypté en base de données avec `bcrypt` (10 rounds).
  - L'authentification réussie génère un token JWT stocké de manière sécurisée (LocalStorage).
  - L'adresse e-mail doit être unique dans la base de données.

#### US-03.2 | Consultation de l'espace "Mes Activités"
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Joueur connecté  
- **Je veux** visualiser la liste de mes réservations à venir et passées ainsi que mes tournois  
- **Afin de** suivre mes engagements dans l'établissement.
- **Critères d'acceptation** :
  - Les réservations affichent de manière dynamique l'illustration du jeu de société associé (via une jointure SQL `LEFT JOIN` avec le catalogue).
  - Si l'utilisateur a choisi un jeu externe ou "BYOG", une image d'illustration générique est affichée.

#### US-03.3 | Modification et Annulation de réservation
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Joueur connecté  
- **Je veux** pouvoir modifier les détails (jeu, nombre de joueurs, date, heure) ou annuler une réservation à venir  
- **Afin de** libérer ma place ou mettre à jour ma session en cas d'imprévu.
- **Critères d'acceptation** :
  - La modification ouvre une fenêtre modale contenant le formulaire pré-rempli. Les modifications sont soumises aux mêmes règles de détection de conflits de table.
  - L'annulation demande une confirmation visuelle avant d'envoyer la requête `DELETE` au serveur.

#### US-03.4 | Inscription et Désinscription aux tournois
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant que** Joueur connecté  
- **Je veux** m'inscrire à un tournoi directement depuis la page des tournois et me désinscrire si je ne peux plus venir  
- **Afin de** réserver ma place pour la compétition.
- **Critères d'acceptation** :
  - Le bouton d'action sur la carte du tournoi s'adapte à l'état de l'utilisateur : "S'inscrire" (si non inscrit), "Se désinscrire" (si déjà inscrit), ou "Complet" (si la capacité maximale du tournoi est atteinte).
  - Une contrainte SQL unique empêche une double inscription du même utilisateur au même tournoi.

---

### EPIC-04 : Administration et Pilotage Opérationnel

**Objectif** : Permettre aux gestionnaires d'administrer l'espace, les réservations, les tournois, les utilisateurs et le catalogue de jeux depuis une interface centralisée.

#### US-04.1 | Tableau de bord des réservations globales
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant qu'**Administrateur  
- **Je veux** lister toutes les réservations des clients et modifier leur statut (CONFIRMED, PENDING, CANCELLED)  
- **Afin de** suivre et valider manuellement l'activité dans les salles.
- **Critères d'acceptation** :
  - Liste de toutes les réservations triées chronologiquement avec les détails du client (pseudo, email).
  - Boutons de mise à jour rapide du statut de la réservation (sauvegarde immédiate en base de données).

#### US-04.2 | Gestion des tournois
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant qu'**Administrateur  
- **Je veux** créer de nouveaux tournois (en saisissant le nom, le jeu TCG, la date, la capacité maximale, le prix d'entrée, et la description) ou supprimer un tournoi existant  
- **Afin de** proposer de nouveaux événements à la communauté.
- **Critères d'acceptation** :
  - Formulaire de création de tournoi complet et validé.
  - La suppression d'un tournoi supprime en cascade toutes les inscriptions associées.

#### US-04.3 | Gestion manuelle du catalogue de jeux de société
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant qu'**Administrateur  
- **Je veux** ajouter un jeu de société manuellement au catalogue en saisissant ses informations (titre, joueurs min/max, temps de jeu, catégorie, description, image) ou en retirer un  
- **Afin de** maintenir la ludothèque à jour.
- **Critères d'acceptation** :
  - Le formulaire valide les champs numériques (nombre de joueurs, durée de jeu).
  - Les jeux supprimés disparaissent instantanément du catalogue public et de l'autocomplétion des formulaires.

#### US-04.4 | Importation automatisée depuis BoardGameGeek (BGG)
- **Priorité** : **SHOULD** 🟡 | **Complexité** : 8 pts
- **En tant qu'**Administrateur  
- **Je veux** saisir un mot-clé, rechercher des jeux de société sur la base de données publique de BoardGameGeek, et importer les fiches techniques directement dans le catalogue de Cicados en un clic  
- **Afin de** gagner du temps lors de la saisie des fiches de jeux.
- **Critères d'acceptation** :
  - L'administrateur peut effectuer une recherche sur le Dashboard Admin. Les résultats affichent les jeux trouvés sur BGG avec leurs visuels.
  - L'import télécharge les détails du jeu (joueurs, durée, catégorie, description originale) et insère la fiche en base de données.

#### US-04.5 | Modération des comptes utilisateurs
- **Priorité** : **MUST** 🔴 | **Complexité** : 5 pts
- **En tant qu'**Administrateur  
- **Je veux** lister l'ensemble des comptes utilisateurs de l'application, pouvoir en supprimer ou promouvoir un joueur au rôle d'ADMIN  
- **Afin de** modérer la communauté et déléguer des droits d'administration.
- **Critères d'acceptation** :
  - La liste indique le rôle de chaque utilisateur (USER ou ADMIN).
  - Un bouton permet de basculer le rôle d'un compte instantanément.
  - La suppression d'un compte utilisateur supprime en cascade l'ensemble de ses réservations et de ses inscriptions aux tournois.

---

## 3. Cahier des Charges Technique & API REST

L'application respecte les principes de séparation des responsabilités avec un Frontend SPA et un Backend RESTful communiquant par format JSON.

```
                  ┌─────────────────────────────────────────┐
                  │                 CLIENT                  │
                  │              React.js / SPA             │
                  └────────────────────┬────────────────────┘
                                       │
                              Requêtes HTTP (JSON)
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │                 API GATE                │
                  │             Express / Node.js           │
                  └──────┬───────────────────────────┬──────┘
                         │                           │
                   authMiddleware              adminMiddleware
                         │                           │
                         ▼                           ▼
                  ┌──────────────┐            ┌──────────────┐
                  │ ROUTES USER  │            │ ROUTES ADMIN │
                  │     (MVC)    │            │     (MVC)    │
                  └──────┬───────┘            └──────┬───────┘
                         │                           │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            BASE DE DONNÉES              │
                  │                 MySQL                  │
                  └─────────────────────────────────────────┘
```

---

### 3.1 Architecture du Routage Front-End (SPA React)

Le Front-end utilise **React Router v6**. Toutes les pages publiques ou privées sont englobées dans le composant global `MainLayout.jsx` qui contient la barre de navigation responsive (`Header.jsx`) et le pied de page (`Footer.jsx`).

| URL Route | Composant React associé | Rôle / Description | Restriction d'accès |
|---|---|---|---|
| `/` | `Home.jsx` | Page d'accueil, présentation, FAQ | Publique |
| `/login` | `Login.jsx` | Formulaire d'authentification (connexion) | Publique |
| `/register` | `Register.jsx` | Formulaire de création de compte | Publique |
| `/boardgames` | `BoardGames.jsx` | Catalogue complet des jeux de société | Publique |
| `/tournaments` | `Tournaments.jsx` | Liste et inscription aux tournois TCG | Publique |
| `/reservations` | `Reservations.jsx` | Prise de réservation + grille de disponibilité | Connexion requise |
| `/my-reservations` | `MyReservations.jsx` | Espace "Mes Activités" (suivi, annulations) | Connexion requise |
| `/admin` | `DashboardAdmin.jsx` | Panneau d'administration global (5 onglets) | Rôle ADMIN requis |
| `*` | *(Redirection)* | Redirection automatique vers `/` si route inconnue | Publique |

---

### 3.2 Spécification des Points d'Entrée API REST (Back-End)

Tous les endpoints retournent des données au format standard JSON.

#### 🔐 Authentification & Session (`/api/auth`)
- **`POST /register`** : Inscription d'un nouvel utilisateur.  
  *DTO requis* : `{ "email", "password", "firstname", "lastname", "pseudo" }`  
  *Auth* : Non  
  *Réponse* : `201 Created` + token JWT.
- **`POST /login`** : Connexion utilisateur.  
  *DTO requis* : `{ "email", "password" }`  
  *Auth* : Non  
  *Réponse* : `200 OK` + token JWT + profil utilisateur.
- **`GET /me`** : Récupération du profil utilisateur connecté (utilisé pour réhydrater le state au rafraîchissement).  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + profil utilisateur.

#### 📅 Réservations de Tables (`/api/reservations`)
- **`GET /`** : Consultation publique des disponibilités pour une date spécifique.  
  *Paramètre de requête* : `?date=YYYY-MM-DD`  
  *Auth* : Non  
  *Réponse* : `200 OK` + tableau des créneaux horaires avec leur statut de disponibilité (libre/limité/complet).
- **`GET /user`** : Récupération des réservations de l'utilisateur authentifié.  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + tableau des réservations avec illustrations du catalogue.
- **`POST /`** : Création d'une nouvelle réservation de table.  
  *DTO requis* : `{ "date", "time", "duration", "gameType", "specificGame", "playersCount" }`  
  *Auth* : Oui (JWT)  
  *Réponse* : `201 Created` + détails de la réservation et de la table assignée.
- **`PUT /:id`** : Modification d'une réservation existante par son auteur.  
  *DTO requis* : `{ "date", "time", "duration", "gameType", "specificGame", "playersCount" }`  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + détails mis à jour.
- **`DELETE /:id`** : Annulation d'une réservation par son auteur.  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + message de confirmation.

#### 🏆 Tournois TCG (`/api/tournaments`)
- **`GET /`** : Récupération des tournois futurs avec le nombre d'inscrits en temps réel.  
  *Auth* : Non  
  *Réponse* : `200 OK` + tableau des tournois.
- **`GET /my-registrations`** : Liste des identifiants des tournois auxquels l'utilisateur est inscrit (pour adapter l'UI des boutons).  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + tableau d'IDs.
- **`GET /user`** : Liste complète des tournois planifiés pour l'utilisateur connecté.  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + tableau d'inscriptions.
- **`POST /:id/register`** : Inscription de l'utilisateur connecté à un tournoi.  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + message de succès.
- **`DELETE /:id/register`** : Désinscription de l'utilisateur connecté à un tournoi.  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + message de succès.

#### 🎲 Catalogue de Jeux de Société (`/api/boardgames`)
- **`GET /`** : Liste de tous les jeux de la ludothèque de l'établissement.  
  *Auth* : Non  
  *Réponse* : `200 OK` + tableau de fiches de jeux.

#### 🛡️ Administration & Modération (`/api/admin`)
*Tous ces endpoints nécessitent d'être authentifiés avec le rôle ADMIN (`authMiddleware` + `adminMiddleware`).*
- **`GET /reservations`** : Liste l'intégralité des réservations des clients de la base.  
  *Réponse* : `200 OK` + tableau de réservations.
- **`PATCH /reservations/:id`** : Modifie manuellement le statut d'une réservation (CONFIRMED/CANCELLED/PENDING).  
  *DTO requis* : `{ "status" }`  
  *Réponse* : `200 OK` + détails mis à jour.
- **`DELETE /reservations/:id`** : Supprime définitivement une réservation.  
  *Réponse* : `200 OK`.
- **`GET /users`** : Liste tous les comptes utilisateurs enregistrés.  
  *Réponse* : `200 OK` + tableau d'utilisateurs.
- **`PATCH /users/:id`** : Modifie le rôle d'un utilisateur (promeut ou rétrograde).  
  *DTO requis* : `{ "role" }`  
  *Réponse* : `200 OK` + utilisateur mis à jour.
- **`DELETE /users/:id`** : Supprime un utilisateur et toutes ses réservations/inscriptions en cascade.  
  *Réponse* : `200 OK`.
- **`POST /tournaments`** : Crée un nouveau tournoi.  
  *DTO requis* : `{ "name", "game", "date", "capacity", "price", "description" }`  
  *Réponse* : `201 Created` + tournoi créé.
- **`DELETE /tournaments/:id`** : Supprime un tournoi et ses inscriptions en cascade.  
  *Réponse* : `200 OK`.
- **`POST /boardgames`** : Ajoute un jeu de société manuellement au catalogue.  
  *DTO requis* : `{ "name", "min_players", "max_players", "play_time", "category", "description", "image_url", "rules_url" }`  
  *Réponse* : `201 Created` + jeu créé.
- **`DELETE /boardgames/:id`** : Supprime un jeu de société du catalogue.  
  *Réponse* : `200 OK`.
- **`POST /boardgames/import-hot`** : Lance le script d'importation des jeux populaires depuis BGG (BoardGameGeek).  
  *Réponse* : `200 OK` + statut de l'import.

#### 📧 Emails transactionnels (`/api/email`)
- **`POST /send`** : Envoie un email transactionnel (utilisé en interne par le serveur via l'API Brevo).  
  *DTO requis* : `{ "toEmail", "toName", "subject", "htmlContent" }`  
  *Auth* : Oui (JWT)  
  *Réponse* : `200 OK` + identifiant du message Brevo.

---

### 3.3 Modèle Conceptuel de Données (MCD)

La base de données MySQL est composée de 6 tables reliées par des clés étrangères avec suppression en cascade.

```
  ┌─────────────────────────────────────────────────────────────┐
  │                           USERS                             │
  ├─────────────────────────────────────────────────────────────┤
  │ id (INT UNSIGNED, PK, AI)                                   │
  │ email (VARCHAR(255), UNIQUE, INDEX)                         │
  │ password (VARCHAR(255))                                     │
  │ firstname (VARCHAR(100))                                    │
  │ lastname (VARCHAR(100))                                     │
  │ pseudo (VARCHAR(100), NULL)                                 │
  │ role (ENUM('USER', 'ADMIN'), DEFAULT 'USER')                │
  │ created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)           │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ├──────────────────────────────┐
                                 │ 1,N                          │ 1,N
                                 ▼                              ▼
  ┌──────────────────────────────┴──────────────┐      ┌────────┴──────────────┐
  │                RESERVATIONS                 │      │TOURNAMENT_REGISTRATION│
  ├─────────────────────────────────────────────┤      ├───────────────────────┤
  │ id (INT UNSIGNED, PK, AI)                   │      │ id (PK, AI)           │
  │ user_id (INT UNSIGNED, FK, ON DELETE CASCADE)│      │ tournament_id (FK, OD)│
  │ room_id (INT UNSIGNED, FK, ON DELETE CASCADE)│      │ user_id (FK, OD)      │
  │ start_time (DATETIME, INDEX)                │      │ registered_at (TS)    │
  │ end_time (DATETIME, INDEX)                  │      └────────▲──────────────┘
  │ game_type (ENUM('MTG', 'YUGIOH', ...))      │               │ 1,N
  │ specific_game (VARCHAR(255), NULL)          │               │
  │ players_count (INT UNSIGNED, DEFAULT 2)     │               │
  │ status (ENUM('PENDING','CONFIRMED',...))    │               │
  └──────────────────────┬──────────────────────┘               │
                         │ 1,N                                  │
                         ▼                                      │
  ┌──────────────────────┴──────────────────────┐               │
  │                   ROOMS                     │               │
  ├─────────────────────────────────────────────┤               │
  │ id (INT UNSIGNED, PK, AI)                   │               │
  │ name (VARCHAR(100))                         │               │
  │ capacity (INT UNSIGNED)                     │               │
  │ description (TEXT, NULL)                    │               │
  └─────────────────────────────────────────────┘               │
                                                                │
  ┌─────────────────────────────────────────────────────────────┐
  │                        TOURNAMENTS                          │
  ├─────────────────────────────────────────────────────────────┤
  │ id (INT UNSIGNED, PK, AI)                                   │
  │ name (VARCHAR(255))                                         │
  │ game (VARCHAR(100))                                         │
  │ date (DATETIME)                                             │
  │ capacity (INT UNSIGNED)                                     │
  │ price (DECIMAL(10,2), DEFAULT 0.00)                         │
  │ description (TEXT, NULL)                                    │
  │ created_at (TIMESTAMP)                                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                        BOARD_GAMES                          │
  ├─────────────────────────────────────────────────────────────┤
  │ id (INT UNSIGNED, PK, AI)                                   │
  │ name (VARCHAR(255), UNIQUE)                                 │
  │ min_players (INT UNSIGNED)                                  │
  │ max_players (INT UNSIGNED)                                  │
  │ play_time (INT UNSIGNED)                                    │
  │ category (VARCHAR(100))                                     │
  │ description (TEXT, NULL)                                    │
  │ image_url (VARCHAR(255), NULL)                              │
  │ rules_url (VARCHAR(255), NULL)                              │
  └─────────────────────────────────────────────────────────────┘
```

---

## 4. Annexes et Gestion des Erreurs

### 4.1 Spécifications de Validation des Inputs (Schémas Zod)

La validation stricte des données soumises garantit la sécurité de la base de données.

#### 1. Inscription Utilisateur (`authSchema`)
- **`email`** : Chaîne non vide, format email valide, convertie en minuscules.  
  *Erreur* : "Adresse email invalide."
- **`password`** : Chaîne de caractères de 6 caractères minimum.  
  *Erreur* : "Le mot de passe doit contenir au moins 6 caractères."
- **`firstname`** et **`lastname`** : Chaînes de caractères non vides de 2 caractères minimum.  
  *Erreur* : "Le nom et prénom doivent contenir au moins 2 caractères."

#### 2. Réservation de Table (`reservationSchema`)
- **`date`** : Chaîne représentant une date valide (format `YYYY-MM-DD`). La date ne peut pas être passée.  
  *Erreur* : "La date de réservation ne peut pas être dans le passé."
- **`time`** : Chaîne représentant une heure de début valide (format `HH:MM`). Doit être compris entre les heures d'ouverture (10:00 - 21:00).  
  *Erreur* : "L'établissement est fermé à cette heure. Choisissez un créneau entre 10h et 21h."
- **`duration`** : Entier positif compris entre 1 et 4 (heures).  
  *Erreur* : "La durée d'une réservation doit être comprise entre 1 et 4 heures."
- **`playersCount`** : Entier positif compris entre 2 et 10.  
  *Erreur* : "Une table accueille entre 2 et 10 joueurs."

---

### 4.2 Messages d'Erreur (Micro-copie de l'Interface)

| Composant Cible | Condition de Déclenchement | Message Affiché à l'Utilisateur | Comportement UI |
|---|---|---|---|
| **Inscription** | Format d'email invalide | "L'adresse email semble incorrecte (ex: nom@domaine.com)." | Texte rouge sous le champ |
| **Inscription** | Mot de passe trop court | "Le mot de passe doit contenir au moins 6 caractères." | Texte rouge sous le champ |
| **Inscription** | Email déjà existant | "Cette adresse email est déjà associée à un compte." | Alerte d'erreur globale (Toast) |
| **Connexion** | Couple email/password faux | "Identifiants incorrects. Veuillez réessayer." | Alerte d'erreur globale (Toast) |
| **Réservation** | Date vide | "Veuillez sélectionner une date pour votre session." | Bordure de champ rouge |
| **Réservation** | Conflit horaire (Surbooking) | "Toutes les tables sont complètes pour ce créneau." | Désactivation des créneaux dans la grille + alerte |
| **Tournois** | Double inscription d'un user | "Vous êtes déjà inscrit à ce tournoi." | Désactivation du bouton "S'inscrire" |
| **Tournois** | Capacité maximale atteinte | "Ce tournoi est complet." | Badge "Complet" rouge + bouton désactivé |

---

### 4.3 Modèles d'Emails Transactionnels (Brevo API)

Les notifications par email sont envoyées à chaque étape clé du parcours utilisateur.

#### 1. Confirmation de Réservation de Table
* **Objet** : `Cicados — Confirmation de votre réservation de table`
* **Template HTML** :
  ```html
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h2 style="color: #6366f1;">Bonjour {{firstname}},</h2>
    <p>Nous vous confirmons que votre table a bien été réservée pour votre session de jeu chez <strong>Cicados</strong> !</p>
    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 5px 0;">📅 <strong>Date</strong> : {{date}}</p>
      <p style="margin: 5px 0;">⏰ <strong>Créneau</strong> : {{startTime}} à {{endTime}} ({{duration}}h)</p>
      <p style="margin: 5px 0;">🎲 <strong>Jeu spécifié</strong> : {{specificGame}} ({{playersCount}} joueurs)</p>
      <p style="margin: 5px 0;">📍 <strong>Espace assigné</strong> : {{tableName}}</p>
    </div>
    <p>Si vous avez un empêchement, merci d'annuler ou de modifier votre réservation directement depuis votre espace client "Mes Activités" afin de libérer la table pour d'autres joueurs.</p>
    <p>Ludiquement,<br>L'équipe Cicados</p>
  </div>
  ```

#### 2. Confirmation d'Inscription à un Tournoi
* **Objet** : `Cicados — Inscription confirmée pour le tournoi : {{tournamentName}}`
* **Template HTML** :
  ```html
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h2 style="color: #6366f1;">Félicitations {{pseudo}},</h2>
    <p>Votre inscription au tournoi de cartes à collectionner chez <strong>Cicados</strong> a bien été enregistrée !</p>
    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 5px 0;">🏆 <strong>Tournoi</strong> : {{tournamentName}}</p>
      <p style="margin: 5px 0;">🎮 <strong>Jeu TCG</strong> : {{game}}</p>
      <p style="margin: 5px 0;">📅 <strong>Date et Heure</strong> : {{date}}</p>
      <p style="margin: 5px 0;">🎫 <strong>Frais de participation</strong> : {{price}} €</p>
    </div>
    <p>Veuillez vous présenter à l'accueil 15 minutes avant le début des rondes avec vos decks ou cartes prêtes à jouer.</p>
    <p>À très vite pour l'événement !<br>L'équipe Cicados</p>
  </div>
  ```
