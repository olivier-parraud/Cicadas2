# 📘 DOSSIER DE PROJET PROFESSIONNEL — CICADOS

**Titre professionnel visé :** Développeur Web et Web Mobile (DWWM)  
**Projet :** Cicados — Plateforme de réservation de tables de jeux, gestion d'événements et boutique  
**Candidat :** [PARRAUD Olivier]  
**Organisme de formation :** La Plateforme  
**Stack technique :** React 18 (Vite 7) + Node.js (Express) + MySQL (MAMP) + Tailwind CSS + Lucide React  
**Date de session :** Juillet 2026  

---

## SOMMAIRE

1. [Introduction](#1--introduction)
   - 1.1 [Parcours professionnel et reconversion](#11-parcours-professionnel-et-reconversion)
   - 1.2 [Le choix du développement web et de la formation O'Clock](#12-le-choix-du-développement-web-et-de-la-formation-oclock)
2. [Cahier des Charges du Projet (Mis à Jour)](#2--cahier-des-charges-du-projet-mis-à-jour)
   - 2.1 [Genèse et évolution du projet Cicados](#21-genèse-et-évolution-du-projet-cicados)
   - 2.2 [Besoins, contraintes, problématiques logistiques et solutions](#22-besoins-contraintes-problématiques-logistiques-et-solutions)
   - 2.3 [Typologie de la clientèle (Personas)](#23-typologie-de-la-clientèle-personas)
   - 2.4 [Matrice de priorisation MoSCoW mise à jour](#24-matrice-de-priorisation-moscow-mise-à-jour)
   - 2.5 [User Stories de l'application (Complètes et à jour)](#25-user-stories-de-lapplication-complètes-et-à-jour)
3. [Conception Technique et Fonctionnelle](#3--conception-technique-et-fonctionnelle)
   - 3.1 [Arborescence du site (Sitemap mis à jour)](#31-arborescence-du-site-sitemap-mis-à-jour)
   - 3.2 [Dictionnaire des routes de navigation (Front & Back)](#32-dictionnaire-des-routes-de-navigation-front--back)
   - 3.3 [Modélisation de la base de données (MCD, MLD, MPD mis à jour)](#33-modélisation-de-la-base-de-données-mcd-mld-mpd-mis-à-jour)
   - 3.4 [Dictionnaire de données de la base de données (Inclus table `messages`)](#34-dictionnaire-de-données-de-la-base-de-données-inclus-table-messages)
4. [Spécifications Techniques, Stack et Outils Utilisés](#4--spécifications-techniques-stack-et-outils-utilisés)
   - 4.1 [Choix et justification de la stack et des outils (Problématique / Besoin / Solution)](#41-choix-et-justification-de-la-stack-et-des-outils-problématique--besoin--solution)
   - 4.2 [Gestion de projet Agile (Méthodologie Scrum et sprints)](#42-gestion-de-projet-agile-méthodologie-scrum-et-sprints)
   - 4.3 [Conventions de codage, de versioning (Git) et de commits](#43-conventions-de-codage-de-versioning-git-et-de-commits)
5. [Validation des Compétences du Référentiel (REAC DWWM)](#5--validation-des-compétences-du-référentiel-reac-dwwm)
   - 5.1 [Activité 1 : Développer la partie front-end d'une application web ou web mobile](#51-activité-1--développer-la-partie-front-end-dune-application-web-ou-web-mobile)
   - 5.2 [Activité 2 : Développer la partie back-end d'une application web ou web mobile](#52-activité-2--développer-la-partie-back-end-dune-application-web-ou-web-mobile)
6. [Réalisations Techniques et Étude du Code Source (Nouveautés incluses)](#6--réalisations-techniques-et-étude-du-code-source-nouveautés-incluses)
   - 6.1 [Rôle et analyse des fichiers clés du Frontend (`Profile.jsx`, `DashboardAdmin.jsx`, `ContactModal.jsx`, `Header.jsx`)](#61-rôle-et-analyse-des-fichiers-clés-du-frontend-profilejsx-dashboardadminjsx-contactmodaljsx-headerjsx)
   - 6.2 [Rôle et analyse des fichiers clés du Backend (`message.controller.js`, `message.model.js`, `message.routes.js`)](#62-rôle-et-analyse-des-fichiers-clés-du-backend-messagecontrollerjs-messagemodeljs-messageroutesjs)
7. [Focus Algorithmique & Fonctionnalités Avancées (Nouveautés)](#7--focus-algorithmique--fonctionnalités-avancées-nouveautés)
   - 7.1 [L'algorithme de détection des conflits de réservation](#71-lalgorithme-de-détection-des-conflits-de-réservation)
   - 7.2 [Le Proxy BGG, l'importation de masse et la conversion XML vers JSON](#72-le-proxy-bgg-limportation-de-masse-et-la-conversion-xml-vers-json)
   - 7.3 [Le basculement dynamique en cas de panne (Sauvegarde JSON)](#73-le-basculement-dynamique-en-cas-de-panne-sauvegarde-json)
   - 7.4 [Le Système de Messagerie Multi-Tours & Synchronisation Réactive Temps Réel](#74-le-système-de-messagerie-multi-tours--synchronisation-réactive-temps-réel)
   - 7.5 [Gestion fine de l'état React et Isolation des Modales (Fix overlay Pokémon)](#75-gestion-fine-de-létat-react-et-isolation-des-modales-fix-overlay-pokémon)
8. [Jeux d'Essai et Scénarios de Validation](#8--jeux-dessai-et-scénarios-de-validation)
   - 8.1 [Scénario A : Inscription et Détection de Conflit de Table](#scénario-a--inscription-et-détection-de-conflit-de-table)
   - 8.2 [Scénario B : Remplissage et activités pour 5 utilisateurs différents](#scénario-b--remplissage-et-activités-pour-5-utilisateurs-différents)
   - 8.3 [Scénario C : Messagerie et Échanges Multi-Tours Membre <-> Admin](#scénario-c--messagerie-et-échanges-multi-tours-membre---admin)
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

## 2 — CAHIER DES CHARGES DU PROJET (MIS À JOUR)

### 2.1 Genèse et évolution du projet Cicados
Le concept de **Cicados** est né d'une passion personnelle pour les univers ludiques, en particulier les **jeux de cartes à collectionner (TCG)** comme *Magic: The Gathering*, *Pokémon TCG*, *One Piece Card Game*, *Yu-Gi-Oh!*, *Disney Lorcana*, *Riftbound TCG*, ainsi que les **jeux de société modernes**. Les établissements hybrides, mêlant boutique, café et espace de jeu, connaissent un essor remarquable. Cependant, ces structures se heurtent fréquemment à des difficultés d'organisation logistique et de communication client.

Initialement pensé comme un outil de réservation de tables et d'inscriptions aux tournois, **Cicados s'est enrichi de fonctionnalités majeures** pour couvrir l'ensemble du besoin opérationnel d'un café-boutique moderne :
1. **Un système de messagerie et support client bidirectionnel** permettant aux membres d'interagir directement avec les administrateurs et d'entretenir un fil de discussion multi-tours.
2. **La gestion de boutique et du stock en temps réel** pour la vente des jeux de société.
3. **Des modules avancés d'administration** avec prévisualisation en temps réel (*Live Preview*) et importation automatisée des jeux les plus populaires depuis BoardGameGeek (BGG).

### 2.2 Besoins, contraintes, problématiques logistiques et solutions

#### 1. Prévention du Surbooking
* **Problématique** : Dans un établissement ayant une capacité d'accueil physique restreinte (4 tables de jeu dans notre modèle initial), la réservation sans vérification immédiate des ressources mène inévitablement à des conflits d'horaires et à une insatisfaction des clients.
* **Besoin** : Garantir qu'aucune table ne soit réservée deux fois sur un même créneau horaire.
* **Solution** : Un algorithme backend d'intersection de créneaux temporels (`start_time < ? AND end_time > ?`) qui vérifie l'occupation en temps réel avant d'attribuer dynamiquement la première table disponible.

#### 2. Communication et Support Client Intégré (Nouveauté)
* **Problématique** : Les joueurs et clients ont fréquemment des questions spécifiques (règles de tournoi, possibilité d'apporter son propre tapis de jeu, horaires spéciaux, disponibilité en boutique). Sans canal dédié, ils utilisent des e-mails externes ou des réseaux sociaux dispersés.
* **Besoin** : Offrir aux utilisateurs connectés un moyen simple d'envoyer un message aux administrateurs depuis n'importe quelle page du site, de consulter l'historique des échanges depuis leur profil et de pouvoir répondre/relancer la conversation. Côté administrateur, disposer d'un onglet centralisé pour lire, répondre et suivre l'état de chaque demande avec notifications visuelles.
* **Solution** :
  * Création d'une fenêtre modale de contact (`ContactModal.jsx`) déclenchable via un bouton "Contacter" (visible au-dessus de la FAQ).
  * Création de la table SQL `messages` avec suivi d'état (`is_read`, `admin_reply`, `replied_at`, `user_read`).
  * Implémentation d'un onglet **Messages** dans le Dashboard Admin avec filtres, recherche et formulaire de réponse rapide.
  * Ajout d'une section **Mes Messages & Support** sur la page Profil (`Profile.jsx`), centrée verticalement en dessous des données personnelles, affichant les questions et les réponses en texte blanc, et incluant un bouton **"Répondre"** ouvrant un formulaire de relance (discussion multi-tours).
  * Système de notifications réactives avec badges dynamiques (compteur rouge sur l'avatar du Header et sur l'onglet admin) alimenté par l'événement personnalisé `messages_updated`.

#### 3. Gestion de la Boutique et des Stocks de Jeux (Nouveauté)
* **Problématique** : En plus de la location de tables et des événements, l'établissement vend des jeux de société. Si un jeu est en rupture de stock, les clients risquent d'être déçus en boutique.
* **Besoin** : Afficher la disponibilité des jeux sur le catalogue public et permettre au gérant d'ajuster le stock en un clic depuis l'administration.
* **Solution** :
  * Ajout de la colonne `stock` dans la table `board_games`.
  * Affichage d'un badge dynamique sur les cartes du catalogue (`BoardGameCard.jsx`) : *"En stock: X"* ou *"Rupture de stock"*.
  * Contrôle rapide du stock sur le Dashboard Admin grâce à des boutons d'incrémentation/décrémentation instantanés (`+ / -`) via des requêtes AJAX `PATCH /api/admin/boardgames/:id/stock`.

#### 4. Isolation des Modales et Confort UI/UX (Nouveauté - Fix Overlay)
* **Problématique** : Lors du clic sur la liste des inscrits d'un événement (ex: une DRAFT Pokémon ou un tournoi), la fiche latérale du jeu Pokémon s'ouvrait simultanément sur la droite, masquant partiellement l'écran et floutant toute la page sans que le formulaire ne soit utilisable.
* **Besoin** : Rendre la consultation des participants complètement indépendante des tiroirs d'informations de jeux.
* **Solution** : Découplage strict des états React (`openParticipantsId` vs `selectedGameDetail`) avec gestion d'arrêt de propagation d'événements (`e.stopPropagation()`), garantissant que la modale des inscrits s'affiche proprement au centre sans déclencher le volet latéral.

#### 5. Importation Automatisée de Ludothèque de Masse (Nouveauté)
* **Problématique** : Saisir manuellement les caractéristiques techniques (joueurs, durée, catégorie, visuels) de 100 jeux populaires représentait des dizaines d'heures de travail de saisie pour le gérant.
* **Besoin** : Alimenter le catalogue en un clic à partir de données de référence certifiées.
* **Solution** : Un module d'importation BGG Hot (`POST /api/admin/boardgames/import-hot`) qui interroge l'API XML2 de BoardGameGeek, convertit les flux XML en JSON via `fast-xml-parser` et insère automatiquement les jeux les plus populaires en base de données.

---

### 2.3 Typologie de la clientèle (Personas)

#### Persona 1 : Thomas, le joueur de TCG compétitif
* **Profil** : 27 ans, informaticien. Joueur aguerri de *Magic: The Gathering*.
* **Besoins** : S'inscrire rapidement aux tournois officiels, suivre les jauges de places en temps réel, et pouvoir envoyer un message rapide à l'équipe pour préciser la liste de ses cartes (decklist) ou poser des questions sur le format.
* **Frustrations** : Les inscriptions floues sans confirmation et l'impossibilité d'échanger avec l'organisateur.

#### Persona 2 : Sarah, la joueuse occasionnelle de jeux de société
* **Profil** : 34 ans, responsable marketing, mère de deux enfants.
* **Besoins** : Consulter la disponibilité des jeux en stock dans la boutique, réserver une table adaptée le week-end, et suivre ses demandes de renseignements directement dans son espace membre.
* **Frustrations** : Arriver sur place et trouver un jeu en rupture ou toutes les tables occupées.

#### Persona 3 : Olivier, le gérant de la boutique
* **Profil** : 45 ans, passionné d'entrepreneuriat et de jeux de plateau.
* **Besoins** : Visualiser l'ensemble des réservations et des messages clients en un coup d'œil, répondre aux questions des joueurs depuis une interface centralisée, ajuster le stock de la boutique et importer les jeux tendance BGG en un clic.
* **Frustrations** : Devoir gérer les messages clients sur plusieurs canaux (mails, téléphone, réseaux) et saisir les fiches jeux à la main.

---

### 2.4 Matrice de priorisation MoSCoW mise à jour

```
         🔴 MUST (Indispensable)             🟡 SHOULD (Très Important)
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│  ● Authentification JWT sécurisée.    ││  ● Importation automatique BGG Hot.  │
│  ● Réservation de table anti-surbooking││  ● Système de secours JSON (Failover)│
│  ● Inscription/désinscription        ││  ● Messagerie support & relances     │
│    aux tournois TCG et événements.   ││    multi-tours membre <-> admin.     │
│  ● Dashboard Admin complet (CRUD).   ││  ● Gestion du stock boutique.        │
│  ● Espace Profil & HistoriqueActivités││  ● Téléversement d'images (Multer).  │
└──────────────────────────────────────┘└──────────────────────────────────────┘
                                        🔵 COULD (Optionnel)
                                       ┌──────────────────────────────────────┐
                                       │  ● Paiement en ligne des tournois.   │
                                       │  ● WebSockets temps réel (Socket.io).│
                                       └──────────────────────────────────────┘
```

---

### 2.5 User Stories de l'application (Complètes et à jour)

| ID | En tant que | Je veux | Afin de | Priorité |
|---|---|---|---|---|
| **US-1.1** | Visiteur | Consulter l'accueil et la FAQ interactive | Comprendre les horaires et le concept de la boutique | **MUST** 🔴 |
| **US-1.2** | Visiteur | Basculer l'interface en français ou anglais | Naviguer confortablement dans ma langue | **MUST** 🔴 |
| **US-1.3** | Visiteur | Parcourir le catalogue de jeux et voir le stock | Découvrir les jeux disponibles et s'ils sont en stock | **MUST** 🔴 |
| **US-1.4** | Visiteur / Membre | Cliquer sur "Contacter les admins" | Ouvrir une fenêtre modale pour poser une question | **SHOULD** 🟡 |
| **US-2.1** | Utilisateur | Sélectionner une date et voir les créneaux libres | Réserver une table de jeu en temps réel | **MUST** 🔴 |
| **US-2.2** | Utilisateur | M'inscrire ou me désinscrire d'un tournoi | Garantir ma place pour un événement TCG | **MUST** 🔴 |
| **US-2.3** | Utilisateur | Consulter mes messages et leurs réponses sur mon Profil | Suivre les réponses des administrateurs | **SHOULD** 🟡 |
| **US-2.4** | Utilisateur | Répondre à une conversation depuis mon Profil | Poursuivre le dialogue avec l'administration | **SHOULD** 🟡 |
| **US-3.1** | Admin | Consulter l'onglet Messages dans le Dashboard Admin | Lire les demandes clients et voir les notifications | **MUST** 🔴 |
| **US-3.2** | Admin | Rédiger une réponse à un message membre | Apporter une réponse qui notifiera le membre sur son profil | **MUST** 🔴 |
| **US-3.3** | Admin | Mettre à jour le stock d'un jeu de société (+ / -) | Refléter l'état réel de la boutique en ligne | **SHOULD** 🟡 |
| **US-3.4** | Admin | Importer les 100 jeux populaires depuis BGG | Enrichir le catalogue en un clic | **SHOULD** 🟡 |
| **US-3.5** | Admin | Prévisualiser en temps réel un événement ou un jeu | Vérifier l'apparence visuelle avant publication | **SHOULD** 🟡 |

---

## 3 — CONCEPTION TECHNIQUE ET FONCTIONNELLE

### 3.1 Arborescence du site (Sitemap mis à jour)

```
                                      [Accueil (/)]
                                            │
           ┌────────────────────────────────┼────────────────────────────────┐
     (Visiteur)                        (Connecté)                         (Admin)
           │                                │                                │
           ├─▶ Ludothèque (/boardgames)     ├─▶ Réserver (/reservations)     └─▶ Dashboard (/admin)
           ├─▶ Tournois (/tournaments)      ├─▶ Mon Agenda (/my-reservations)    ├─▶ Réservations
           ├─▶ Modale Contact (Fenêtre)    ├─▶ Mon Profil (/profile)            ├─▶ Événements
           ├─▶ Connexion (/login)           │     └─▶ Mes Messages & Support     ├─▶ Tournois
           └─▶ Inscription (/register)      └─▶ Relance conversation             ├─▶ Jeux & Stock
                                                                                 ├─▶ Messagerie (Admin)
                                                                                 └─▶ Utilisateurs
```

---

### 3.2 Dictionnaire des routes de navigation (Front & Back)

#### Routes Frontend (React Router DOM)
* `/` (Publique) : Page d'accueil avec présentation, carrousel d'activités, FAQ interactive et déclencheur du formulaire de contact.
* `/login` (Publique) : Formulaire d'authentification utilisateur.
* `/register` (Publique) : Formulaire d'inscription.
* `/boardgames` (Publique) : Catalogue de jeux de société avec indicateurs de stock en temps réel.
* `/tournaments` (Publique) : Agenda des tournois et événements avec modale d'affichage des inscrits isolée.
* `/reservations` (Privée) : Interface de réservation de table avec grille horaire interactive.
* `/my-reservations` (Privée) : Espace "Mes Activités" pour gérer ses réservations et inscriptions.
* `/profile` (Privée) : Gestion du profil et **Section Mes Messages & Support** avec fil de discussion et réponses aux admins.
* `/admin` (Privée - Rôle ADMIN) : Console d'administration centralisée structurée en 6 onglets (Réservations, Tournois, Événements, Jeux de société, Utilisateurs, **Messages**).

#### Routes Backend (Express API REST)
* **Authentification & Profil** :
  * `POST /api/auth/register` : Création de compte.
  * `POST /api/auth/login` : Authentification JWT.
  * `GET /api/auth/me` : Informations de session.
  * `PUT /api/auth/profile` : Mise à jour des informations personnelles.
  * `POST /api/auth/upload-avatar` : Téléversement de l'image de profil (Multer).
* **Réservations & Événements** :
  * `GET /api/reservations` : État d'occupation des tables.
  * `POST /api/reservations` : Création d'une réservation de table.
  * `DELETE /api/reservations/:id` : Annulation d'une réservation.
  * `GET /api/tournaments` & `GET /api/events` : Récupération des tournois et animations.
  * `POST /api/tournaments/:id/register` & `POST /api/events/:id/register` : Inscription d'un membre.
* **Messagerie & Support (Nouveauté)** :
  * `POST /api/messages` : Envoi d'un message aux administrateurs (Membre connecté).
  * `GET /api/messages/my-messages` : Liste des messages envoyés par le membre connecté.
  * `GET /api/messages/unread-count` : Nombre de réponses non lues par le membre.
  * `PUT /api/messages/:id/user-read` : Marquer la réponse de l'admin comme lue par l'utilisateur.
  * `POST /api/messages/:id/user-reply` : Répondre/relancer la conversation depuis le profil.
  * `GET /api/messages/admin` : Récupération de tous les messages clients (Admin).
  * `PUT /api/messages/admin/:id/read` : Marquer un message client comme lu (Admin).
  * `POST /api/messages/admin/:id/reply` : Rédiger et envoyer une réponse admin à un membre.
  * `DELETE /api/messages/admin/:id` : Supprimer un message (Admin).
* **Boutique, Jeux & Administration** :
  * `GET /api/boardgames` : Récupération de la ludothèque (avec fallback JSON).
  * `PATCH /api/admin/boardgames/:id/stock` : Mise à jour rapide du stock disponible (Admin).
  * `POST /api/admin/boardgames/import-hot` : Importation massive des 100 jeux BGG Hot (Admin).
  * `POST /api/admin/upload-image` : Téléversement d'image d'événement/jeu (Multer).

---

### 3.3 Modélisation de la base de données (MCD, MLD, MPD mis à jour)

#### Modèle Logique de Données (MLD)
* **users** (`id`, `email`, `password`, `firstname`, `lastname`, `pseudo`, `avatar_url`, `role`, `created_at`)
* **rooms** (`id`, `name`, `capacity`, `description`)
* **reservations** (`id`, `user_id`, `room_id`, `start_time`, `end_time`, `game_type`, `specific_game`, `players_count`, `status`)
* **tournaments** (`id`, `name`, `game`, `date`, `capacity`, `price`, `description`, `created_at`)
* **tournament_registrations** (`id`, `tournament_id`, `user_id`, `registered_at`)
* **board_games** (`id`, `name`, `min_players`, `max_players`, `play_time`, `category`, `description`, `image_url`, `rules_url`, `stock`)
* **events** (`id`, `name`, `type`, `game`, `date`, `capacity`, `price`, `description`, `created_at`)
* **event_registrations** (`id`, `event_id`, `user_id`, `registered_at`)
* **messages** (`id`, `user_id`, `subject`, `content`, `is_read`, `admin_reply`, `replied_at`, `user_read`, `created_at`)

---

### 3.4 Dictionnaire de données de la base de données (Inclus table `messages`)

#### Table : `messages` (Nouveauté)
Gère les échanges de messagerie et de support entre les membres et l'équipe d'administration.

| Champ | Type SQL | Spécificités | Rôle / Description |
|---|---|---|---|
| **id** | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique du message. |
| **user_id** | INT UNSIGNED | FOREIGN KEY, ON DELETE CASCADE | Identifiant du membre auteur de la demande. |
| **subject** | VARCHAR(255) | NOT NULL | Sujet ou titre de la demande de contact. |
| **content** | TEXT | NOT NULL | Contenu du message et historique des échanges. |
| **is_read** | TINYINT(1) | NOT NULL, DEFAULT 0 | 0 = Message non lu par l'admin (badge NOUVEAU), 1 = Lu. |
| **admin_reply** | TEXT | NULL | Dernier texte de réponse rédigé par l'administrateur. |
| **replied_at** | DATETIME | NULL | Date et heure de la dernière réponse de l'admin. |
| **user_read** | TINYINT(1) | NOT NULL, DEFAULT 1 | 0 = Nouvelle réponse admin non lue par le membre, 1 = Lue. |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'envoi du message initial. |

#### Évolution Table `board_games`
* **stock** (`INT UNSIGNED`, DEFAULT 1) : Indique le nombre d'exemplaires du jeu disponibles en boutique.

#### Évolution Table `users`
* **pseudo** (`VARCHAR(100)`, NULL) : Pseudonyme public du membre.
* **avatar_url** (`VARCHAR(500)`, NULL) : Lien vers la photo de profil téléversée par le membre.

---

## 4 — SPÉCIFICATIONS TECHNIQUES, STACK ET OUTILS UTILISÉS

### 4.1 Choix et justification de la stack et des outils (Problématique / Besoin / Solution)

```
                       ┌─────────────────────────────────────────┐
                       │                FRONTEND                 │
                       │ Vite 7 + React 18 + Tailwind + Lucide   │
                       └────────────────────┬────────────────────┘
                                            │
                                        HTTP REST
                                            │
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │                 BACKEND                 │
                       │ Node.js + Express + Multer + Fast-XML   │
                       └────────────────────┬────────────────────┘
                                            │
                                      mysql2 (Pool)
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │             BASE DE DONNÉES             │
                       │           MySQL (MAMP / Socket)         │
                       └─────────────────────────────────────────┘
```

#### 1. React 18 & Vite 7 (Frontend Core)
* **Problématique** : Construire une interface fluide, sans rechargement de page, capable d'adapter l'affichage en temps réel (badges de messagerie, jauges de tournoi, grilles horaires).
* **Besoin** : Un framework frontend composable, ultra-rapide au démarrage et performant au rendu.
* **Solution & Justification** : React 18 permet une gestion réactive de l'état avec des hooks (`useState`, `useEffect`). Vite 7 offre un bundling ultra-rapide en moins d'1.5 seconde et un rechargement à chaud (HMR) instantané.

#### 2. Tailwind CSS & Lucide React (Design & UI System)
* **Problématique** : Développer une charte graphique sombre ("Dark Premium") attrayante et responsive sans écrire des milliers de lignes de CSS personnalisées difficiles à maintenir.
* **Besoin** : Un système de design utility-first adaptable avec un jeu d'icônes vectorielles cohérent.
* **Solution & Justification** : Tailwind CSS permet d'intégrer des grilles responsives, des effets de flou (*backdrop-blur*), des dégradés et des animations directement dans les composants JSX. `Lucide React` fournit des icônes légères, personnalisables et accessibles (`Calendar`, `Trophy`, `Users`, `MessageSquare`, `Trash2`, etc.).

#### 3. Node.js & Express (Backend API REST)
* **Problématique** : Traiter des requêtes simultanées de réservation, d'authentification et de messagerie de manière asynchrone et non bloquante.
* **Besoin** : Un serveur d'API REST modulaire, rapide et facile à faire évoluer.
* **Solution & Justification** : Node.js avec Express permet de structurer les routes selon le pattern MVC, d'intégrer des middlewares de sécurité (JWT, CORS) et d'exposer des endpoints JSON propres.

#### 4. MySQL avec Pool de Connexions `mysql2` (Database)
* **Problématique** : Garantir la cohérence des réservations, empêcher les inscriptions en double et maintenir les performances sous forte charge.
* **Besoin** : Une base de données relationnelle éprouvée avec support des clés étrangères, index uniques et pools de connexions.
* **Solution & Justification** : MySQL configuré via `mysql2/promise` sur MAMP. L'utilisation d'un pool de connexions évite la réouverture coûteuse d'une connexion TCP/Socket à chaque requête HTTP.

#### 5. Multer (Gestion des Fichiers et Uploads)
* **Problématique** : Les gérants et les utilisateurs doivent pouvoir uploader leurs propres images (avatars de profil, affiches d'événements).
* **Besoin** : Intercepter les données `multipart/form-data` et sauvegarder les fichiers de façon sécurisée sur le serveur.
* **Solution & Justification** : Le middleware `multer` intercepte les uploads d'images, valide les types MIME (images uniquement) et génère des noms de fichiers uniques sécurisés dans le dossier public.

#### 6. Fast-XML-Parser (Intégration BGG API)
* **Problématique** : L'API externe de BoardGameGeek renvoie des données au format XML2, tandis que l'application React consomme du JSON.
* **Besoin** : Convertir les flux XML en objets JavaScript natifs côté serveur à la volée.
* **Solution & Justification** : `fast-xml-parser` me permet d'assurer une conversion XML vers JSON extrêmement rapide sans dépendance lourde.

#### 7. Puppeteer (Tests End-to-End Automatisés)
* **Problématique** : Vérifier manuellement le bon fonctionnement du site après chaque modification (login, navigation admin, clic onglet messages, envoi de réponses) est long et sujet aux oublis.
* **Besoin** : Un outil d'automatisation de navigateur headless pour valider les scénarios utilisateurs et capturer des preuves visuelles (screenshots).
* **Solution & Justification** : Puppeteer permet d'exécuter des scripts Node qui pilotent Chrome en mode headless, simulent les clics, remplissent les formulaires et capturent les captures d'écran de validation.

---

### 4.2 Gestion de projet Agile (Méthodologie Scrum et sprints)
Le projet a été mené selon la méthodologie Scrum sur 4 sprints révisés :
* **Sprint 0 : Cadrage et Conception** : Cahier des charges, Wireframes Excalidraw, Modélisation SQL.
* **Sprint 1 : Architecture MVC Backend et Pages Clés** : Serveur Express, pool MySQL, Accueil et Catalogue.
* **Sprint 2 : Authentification, Réservations et Interactivité** : JWT, Algorithme anti-surbooking, Grille horaire.
* **Sprint 3 : Console Admin, Messagerie Support, Stock Boutique & Tests** : Dashboard Admin 6 onglets, système de messagerie multi-tours, gestion des stocks, tests Puppeteer.

---

## 5 — VALIDATION DES COMPÉTENCES DU RÉFÉRENTIEL (REAC DWWM)

### 5.1 Activité 1 : Développer la partie front-end d'une application web ou web mobile
* **CP 1. Maquetter une application** : Conception des wireframes d'interfaces mobile et desktop dans le dossier `conception/`.
* **CP 2. Réaliser une interface utilisateur web statique et adaptable** : Intégration Tailwind CSS responsive, adaptative de 1 à 3 colonnes selon les tailles d'écran.
* **CP 3. Développer une interface utilisateur web dynamique** :
  * Composants interactifs réactifs avec React 18.
  * Formulaire de contact modale (`ContactModal.jsx`).
  * Espace de discussion multi-tours avec réponses membres/admins sur [Profile.jsx](file:///Applications/MAMP/htdocs/Cicadas2/frontend/src/pages/Profile.jsx).
  * Système d'événements sur mesure (`messages_updated`) pour mettre à jour les pastilles de notifications sans rechargement de page.

### 5.2 Activité 2 : Développer la partie back-end d'une application web ou web mobile
* **CP 5. Créer une base de données** : Script [schema.sql](file:///Applications/MAMP/htdocs/Cicadas2/backend/schema.sql) avec 8 tables relationnelles, contraintes de clés étrangères `ON DELETE CASCADE` et index composites uniques.
* **CP 6. Développer les composants d'accès aux données** : Modèles d'accès SQL paramétrés (`Message`, `Reservation`, `User`, `BoardGame`) sécurisés contre les injections SQL.
* **CP 7. Développer la partie back-end d'une application web ou web mobile** : Architecture MVC propre sous Express avec middlewares d'authentification JWT (`authMiddleware`) et d'autorisation de rôle (`adminMiddleware`).

---

## 6 — RÉALISATIONS TECHNIQUES ET ÉTUDE DU CODE SOURCE (NOUVEAUTÉS INCLUSES)

### 6.1 Rôle et analyse des fichiers clés du Frontend

#### 1. Gestion du Profil et Messagerie Membre : `Profile.jsx`
Le composant `Profile.jsx` intègre désormais deux cartes distinctes superposées et centrées :
* **Carte 1** : Gestion des données personnelles (Avatar, Pseudo, Email, Prénom, Nom, Mot de passe).
* **Carte 2 (Mes Messages & Support)** : Affiche l'historique des échanges entre le membre et l'équipe. Les réponses d'administration sont stylisées en **texte blanc** (`text-white`) pour une lisibilité optimale. Chaque message comprend un bouton **"Répondre"** qui ouvre un formulaire de relance en ligne, permettant une conversation continue.

```javascript
// Extrait de l'envoi d'une réponse membre depuis Profile.jsx
const handleUserReply = async (msgId) => {
    if (!userReplyText.trim()) return;
    setUserReplyLoading(true);
    try {
        const res = await fetch(`http://localhost:5050/api/messages/${msgId}/user-reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reply: userReplyText })
        });
        if (res.ok) {
            setMessage({ type: 'success', text: "Votre réponse a été transmise aux administrateurs !" });
            setReplyingMessageId(null);
            setUserReplyText('');
            fetchMyMessages();
            window.dispatchEvent(new Event('messages_updated'));
        }
    } catch (err) {
        console.error("Erreur relance utilisateur :", err);
    } finally {
        setUserReplyLoading(false);
    }
};
```

#### 2. Console d'Administration Centralisée : `DashboardAdmin.jsx`
Le Dashboard Admin comprend 6 onglets de gestion dont l'onglet **Messages** :
* Affiche le nombre de messages reçus et le nombre de messages non lus (`unreadMessagesCount`).
* Propose un moteur de recherche en temps réel filtrant par expéditeur, sujet ou contenu.
* Permet de marquer un message comme lu, d'y répondre directement et de supprimer une demande.

#### 3. Composant Modale de Contact : `ContactModal.jsx`
Une modale accessible depuis l'accueil et le Header permettant à tout membre connecté d'envoyer un message aux administrateurs.

---

### 6.2 Rôle et analyse des fichiers clés du Backend

#### Modèle Messagerie : `message.model.js`
Gère les requêtes SQL préparées pour l'insertion de messages, le suivi de la lecture et la mise à jour des fils de discussion :

```javascript
// backend/src/models/message.model.js
const Message = {
    async create({ userId, subject, content }) {
        const sql = 'INSERT INTO messages (user_id, subject, content) VALUES (?, ?, ?)';
        return query(sql, [userId, subject, content]);
    },
    async reply(id, replyText) {
        const sql = 'UPDATE messages SET admin_reply = ?, replied_at = NOW(), user_read = 0 WHERE id = ?';
        return query(sql, [replyText, id]);
    },
    async userReply(id, userId, updatedContent) {
        const sql = 'UPDATE messages SET content = ?, admin_reply = NULL, replied_at = NULL, is_read = 0, user_read = 1 WHERE id = ? AND user_id = ?';
        return query(sql, [updatedContent, id, userId]);
    }
};
```

---

## 7 — FOCUS ALGORITHMIQUE & FONCTIONNALITÉS AVANCÉES (NOUVEAUTÉS)

### 7.1 L'algorithme de détection des conflits de réservation
Formule logique de chevauchement d'intervalles temporels :
$$\text{Début}_1 < \text{Fin}_2 \quad \text{et} \quad \text{Fin}_1 > \text{Début}_2$$

---

### 7.2 Le Proxy BGG, l'importation de masse et la conversion XML vers JSON
Interrogation des API BGG, conversion instantanée XML vers JSON avec `fast-xml-parser` et insertion massive des 100 jeux les plus populaires.

---

### 7.3 Le basculement dynamique en cas de panne (Sauvegarde JSON)
En cas de coupure de la base de données SQL, le système bascule automatiquement vers la lecture de `boardgame-list.json`.

---

### 7.4 Le Système de Messagerie Multi-Tours & Synchronisation Réactive Temps Réel
* **Problématique** : Lorsqu'un utilisateur répond à un message d'administrateur, le Dashboard Admin doit immédiatement identifier cette relance comme un nouveau message non lu (`is_read = 0`) avec augmentation du compteur de notifications.
* **Solution** : Lorsqu'un utilisateur soumet une relance depuis son profil, le contrôleur backend `userReplyMessage` concatène l'historique dans `content`, réinitialise `admin_reply` à `NULL` et définit `is_read = 0`. Le frontend émet alors l'événement natif `messages_updated` qui déclenche le rafraîchissement réactif du Header et du Dashboard Admin sans rechargement de page.

---

### 7.5 Gestion fine de l'état React et Isolation des Modales (Fix overlay Pokémon)
* **Problématique** : Cliquer sur la liste des joueurs d'une DRAFT ouvrait intempestivement le panneau d'informations Pokémon.
* **Solution** : Séparation stricte de l'état d'ouverture des participants (`openParticipantsId`) et d'affichage des détails du jeu (`selectedGameDetail`) avec annulation de la propagation des clics (`e.stopPropagation()`).

---

## 8 — JEUX D'ESSAI ET SCÉNARIOS DE VALIDATION

### Scénario A : Inscription et Détection de Conflit de Table
Validation du blocage des réservations simultanées en cas de saturation des 4 tables de l'établissement.

### Scénario B : Remplissage et activités pour 5 utilisateurs différents
Validation croisée des inscriptions aux tournois, réservations de jeux et ateliers sur 5 jours.

### Scénario C : Messagerie et Échanges Multi-Tours Membre <-> Admin
1. **Action 1** : L'utilisateur `Pierre` envoie un message : *"Puis-je apporter mon propre tapis de jeu ?"*.
2. **Résultat 1** : Le message apparaît dans l'onglet Messages de l'Admin avec le badge **NOUVEAU** et la notification `1` dans le Header Admin.
3. **Action 2** : L'Admin répond : *"Oui tout à fait !"*.
4. **Résultat 2** : Le badge de notification s'affiche sur la photo de profil de `Pierre`. Dans son profil, la réponse apparaît en **texte blanc** sous sa question.
5. **Action 3** : `Pierre` clique sur **"Répondre"** dans son profil et écrit : *"Merci ! Et pour les dés ?"*.
6. **Résultat 3** : Le message repasse en **NOUVEAU** (`is_read = 0`) côté Admin avec l'historique complet imprimé.

---

## 9 — VEILLE TECHNOLOGIQUE ET SÉCURITÉ (OWASP)
* **Injections SQL** : Requêtes préparées avec placeholders `?` via `mysql2`.
* **CORS** : Configuration stricte restreignant l'API à l'origine du frontend Vite (`http://localhost:5173`).
* **Signature JWT** : Chiffrement HMAC-SHA256 avec clé secrète `.env` et middleware de vérification `authMiddleware`.
* **RBAC** : Middleware `adminMiddleware` contrôlant les droits `role === 'ADMIN'`.

---

## 10 — UTILISATION DE RESSOURCES ANGLOPHONES
Exploitation permanente des documentations officielles anglophones : API BoardGameGeek XML2, documentation React 18, Vite 7, `mysql2`, `fast-xml-parser` et `i18next`.

---

## 11 — CONCLUSION ET PERSPECTIVES D'ÉVOLUTION

### Conclusion
La conception et le développement de l'application **Cicados** constituent un projet complet et abouti. L'intégration de la réservation de tables, de l'agenda des tournois, de la boutique avec gestion de stock et du système de messagerie support multi-tours répond fidèlement aux besoins opérationnels d'un café-boutique de jeux. L'ensemble des compétences du Titre Professionnel DWWM est validé.

### Perspectives d'Évolution
1. **Paiement en ligne (Stripe)** : Permettre le règlement en ligne des frais d'inscriptions aux tournois.
2. **Notifications WebSockets (Socket.io)** : Actualisation instantanée des jauges et messages sans pooling HTTP.
3. **Application mobile (React Native)** : Porter l'application sur mobile iOS et Android.
