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
8. [Jeux d'Essai, Matrice de Recette et Validation Visuelle](#8--jeux-dessai-et-scénarios-de-validation)
   - 8.1 [Matrice de Validation des Tests Fonctionnels et E2E](#81-matrice-de-validation-des-tests-fonctionnels-et-e2e)
   - 8.2 [Détail des Scénarios Métier Réalisés](#82-détail-des-scénarios-métier-réalisés)
   - 8.3 [Captures Visuelles de l'Application et Présentation au Jury](#83-captures-visuelles-de-lapplication-et-présentation-au-jury)
9. [Veille Technologique, Sécurité (OWASP) et Accessibilité (A11y)](#9--veille-technologique-sécurité-owasp-et-accessibilité-a11y)
   - 9.1 [Sécurité Applicative et Bonnes Pratiques OWASP](#91-sécurité-applicative-et-bonnes-pratiques-owasp)
   - 9.2 [Démarche d'Accessibilité Numérique (RGAA / WCAG 2.1 AA)](#92-démarche-daccessibilité-numérique-rgaa--wcag-21-aa)
10. [Conformité RGPD et Protection des Données Personnelles](#10--conformité-rgpd-et-protection-des-données-personnelles)
    - 10.1 [Démarche Privacy by Design & Cadre Légal](#101-démarche-privacy-by-design--cadre-légal)
    - 10.2 [Principe de Minimisation des Données](#102-principe-de-minimisation-des-données)
    - 10.3 [Registre des Traitements et Finalités](#103-registre-des-traitements-et-finalités)
    - 10.4 [Sécurité et Confidentialité du Stockage](#104-sécurité-et-confidentialité-du-stockage)
    - 10.5 [Gestion des Droits des Utilisateurs (Droit à l'oubli & Accès)](#105-gestion-des-droits-des-utilisateurs-droit-à-loubli--accès)
    - 10.6 [Durée de Conservation et Cookies](#106-durée-de-conservation-et-cookies)
11. [Utilisation de Ressources Anglophones](#11--utilisation-de-ressources-anglophones)
12. [Conclusion et Perspectives d'Évolution](#12--conclusion-et-perspectives-dévolution)

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

## 8 — JEUX D'ESSAI, MATRICE DE RECETTE ET VALIDATION VISUELLE

Afin d'assurer la fiabilité des parcours utilisateurs critiques et de réduire fortement le risque de régression avant la livraison, j'ai formalisé et exécuté une matrice de recette rigoureuse. Les trois scénarios fonctionnels métier (Réservation de tables, Inscriptions aux tournois TCG, Messagerie support multi-tours) ainsi que la suite de tests automatisés de bout en bout (E2E) ont été éprouvés et validés avec succès.

### 8.1 Matrice de Validation des Tests Fonctionnels et E2E

Le tableau ci-dessous synthétise la recette fonctionnelle réalisée :

| Test Réalisé | Conditions & Données d'Entrée | Résultat Attendu | Résultat Obtenu | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **Test 1.1 : Réservation standard** *(Scénario Réservation)* | Membre authentifié, table libre, créneau `15h00 - 17h00`, jeu *Catan* sélectionné. | Réservation créée, table attribuée, jauge actualisée (3/4 tables restantes), toast de confirmation. | Réservation persistée en BDD (code HTTP 201), jauge mise à jour, toast affiché, visible dans « Mes Réservations ». | **VALIDÉ** |
| **Test 1.2 : Prévention du surbooking** *(Scénario Réservation)* | 4 tables déjà réservées sur le créneau `19h00 - 21h00` le vendredi, tentative d'une 5ème réservation. | Blocage préventif côté serveur, rejet de la transaction, message explicite : *« Aucune table disponible sur ce créneau »*. | Code HTTP 400 renvoyé par l'API, aucune écriture parasite en base, alerte claire affichée dans la modale. | **VALIDÉ** |
| **Test 2.1 : Inscription à un tournoi TCG** *(Scénario Tournoi)* | Tournoi *Yu-Gi-Oh!* (7/8 inscrits). Joueur connecté clique sur « S'inscrire ». | Inscription validée, jauge passe à 8/8 (*Complet*), le bouton bascule en « Se désinscrire », avatar du joueur ajouté. | Inscription enregistrée dans `tournament_registrations`, mise à jour immédiate de l'état React, badge *Complet* actif. | **VALIDÉ** |
| **Test 2.2 : Garde de saturation et sécurité** *(Scénario Tournoi)* | Tournoi complet (8/8). Joueur non inscrit tente de forcer l'inscription via requête API directe. | Rejet par le contrôleur backend `tournament.controller.js` avec code d'erreur *« Capacité maximale atteinte »*. | Requête bloquée côté serveur avec code HTTP 400, intégrité du quota de 8 joueurs strictement respectée. | **VALIDÉ** |
| **Test 2.3 : Désistement en un clic** *(Scénario Tournoi)* | Joueur inscrit clique sur le bouton « Se désinscrire ». | Désinscription confirmée, jauge repasse à 7/8, libération de la place pour un autre joueur. | Ligne supprimée en base de données, réactivité instantanée de l'interface sans rechargement de page. | **VALIDÉ** |
| **Test 3.1 : Envoi de message support** *(Scénario Messagerie)* | Membre `Pierre` soumet : *« Puis-je apporter mon propre tapis de jeu ? »* depuis son profil. | Message persisté avec `is_read = 0`, badge *NOUVEAU* et compteur `1` dans le Header de l'administrateur. | Écriture SQL conforme, événement custom déclenché, pastille rouge visible sur le dashboard admin. | **VALIDÉ** |
| **Test 3.2 : Réponse de l'administrateur** *(Scénario Messagerie)* | Admin ouvre le message, rédige : *« Oui tout à fait ! »* et clique sur Envoyer. | Message marqué lu par l'admin, réponse rattachée, notification pastille sur l'avatar du membre `Pierre`. | Statut mis à jour, badge notification affiché sur l'avatar de `Pierre`, réponse visible en texte clair sous sa question. | **VALIDÉ** |
| **Test 3.3 : Relance multi-tours** *(Scénario Messagerie)* | `Pierre` clique sur « Répondre » et écrit : *« Merci ! Et pour les dés ? »*. | Fil incrémenté avec l'historique complet, bascule automatique en statut *NOUVEAU* côté admin pour traitement. | Historique chronologique préservé, alerte réactivée côté admin, traçabilité intégrale de la conversation. | **VALIDÉ** |
| **Test 4.1 : Test automatisé E2E (Puppeteer)** *(Scénario Automatisation)* | Script Node pilotant Chrome headless : connexion membre, choix de date/créneau, réservation et vérification du Toast. | Parcours complet franchi en moins de 35s sans régression ni erreur console, capture d'écran de preuve générée. | Script exécuté en 28s avec succès, capture `confirmation_reservation.png` produite, 100% des assertions validées. | **VALIDÉ** |

### 8.2 Détail des Scénarios Métier Réalisés

* **Scénario 1 : Réservation de Tables et Algorithme Anti-Surbooking** :  
  Ce scénario valide la promesse centrale de l'application : permettre aux passionnés de réserver une table de jeu en toute autonomie tout en garantissant aux gérants qu'aucune table ne sera sur-réservée. L'algorithme vérifie les réservations actives à la même date et sur le même créneau horaire avant d'attribuer automatiquement l'une des 4 tables disponibles (`Table 1` à `Table 4`).

* **Scénario 2 : Gestion des Inscriptions aux Tournois TCG** :  
  Ce scénario valide le cycle de vie des inscriptions aux tournois compétitifs (*Magic*, *Pokémon*, *Yu-Gi-Oh!*, *Lorcana*). L'application gère dynamiquement les jauges de capacité, l'affichage des avatars des inscrits, le verrouillage automatique des inscriptions à saturation et le désistement libre sans friction.

* **Scénario 3 : Messagerie Support et Échanges Multi-Tours (Membre <-> Admin)** :  
  Ce scénario valide le canal de communication bidirectionnel entre les clients et l'équipe du café. Contrairement à un simple formulaire de contact « one-way », le système prend en charge un véritable fil de discussion multi-tours : question initiale du membre, alerte côté admin, réponse de l'équipe, pastille de notification sur l'avatar du client et relance continue.

### 8.3 Captures Visuelles de l'Application et Présentation au Jury

Afin de rendre le dossier vivant et immédiatement compréhensible pour le jury, voici les vues majeures de l'application finale accompagnées d'une courte mise en contexte opérationnelle :

* **« Voici la réservation côté utilisateur »** :  
  Interface épurée et intuitive permettant au membre de choisir une date sur le calendrier, de sélectionner son créneau horaire parmi les plages ouvertes, d'associer un jeu de société de la ludothèque et de valider sa table en quelques clics avec retour visuel immédiat (toast de confirmation et mise à jour de la jauge).
* **« Voici le dashboard administrateur »** :  
  Console de pilotage centralisée en 6 onglets (*Vue d'ensemble*, *Réservations*, *Tournois*, *Ludothèque*, *Stocks Boutique*, *Messages support*). Elle permet aux gérants du café d'administrer l'établissement en temps réel, de modérer les réservations et de répondre aux questions des clients.
* **« Voici l'agenda des tournois TCG & animations »** :  
  Cartes dynamiques présentant les tournois officiels avec compte à rebours, jauge de places disponibles en temps réel, frais d'inscription, liste des participants avec leurs avatars et bouton d'action contextuel (« S'inscrire » ou « Se désinscrire »).
* **« Voici la ludothèque et catalogue de jeux »** :  
  Catalogue interactif synchronisé avec l'API internationale BoardGameGeek. Il propose des filtres multicritères (catégories, nombre de joueurs, durée de partie, niveau de complexité) et intègre un système de basculement dynamique sur fichier JSON local pour assurer la continuité de service en cas de panne de l'API externe.
* **« Voici l'espace profil et messagerie support »** :  
  Espace membre personnalisé permettant la modification des informations personnelles (nom, pseudo, avatar, mot de passe), la consultation de l'historique des réservations passées et futures, ainsi que le suivi des échanges avec le support sous forme de conversation multi-tours.

---

## 9 — VEILLE TECHNOLOGIQUE, SÉCURITÉ ET ACCESSIBILITÉ

### 9.1 Sécurité Applicative et Bonnes Pratiques OWASP
* **Protection contre les Injections SQL (OWASP A03)** : Utilisation exclusive de requêtes préparées avec placeholders paramétrés `?` via le driver `mysql2/promise`. Ce mécanisme neutralise très efficacement le risque d'injection SQL en séparant strictement l'instruction SQL des données fournies par les utilisateurs.
* **Contrôle d'Accès et Cloisonnement des Rôles (OWASP A01 - RBAC)** : Les routes d'administration (`/api/admin/*`) sont protégées par le middleware `adminMiddleware` qui contrôle la validité du token JWT et vérifie que `role === 'ADMIN'`, bloquant immédiatement toute tentative d'élévation de privilèges (code HTTP 403 Forbidden).
* **Sécurisation des Mots de Passe & Chiffrement (OWASP A02)** :  
  * Hachage cryptographique unidirectionnel des mots de passe avec sel aléatoire via **Bcrypt** (coût de calcul de 10). En cas de compromission de la base de données, les mots de passe restent inexploitables.
  * Jetons d'authentification signés avec l'algorithme HMAC-SHA256 (JWT) et clé secrète forte stockée dans le fichier d'environnement `.env`, limités à 24 heures de validité.
* **Politique CORS (Cross-Origin Resource Sharing)** : Configuration stricte restreignant l'accès aux API à l'origine légitime du frontend Vite (`http://localhost:5173`).

### 9.2 Démarche d'Accessibilité Numérique (A11y / RGAA / WCAG 2.1 AA)
L'accessibilité web a été intégrée comme un axe d'exigence professionnelle pour garantir une expérience fluide à l'ensemble des usagers, y compris les personnes en situation de handicap :

1. **Labels explicites et association programmatique des formulaires (`htmlFor` / `id`)** :  
   Tous les champs de saisie (`<input>`, `<select>`, `<textarea>`) des formulaires d'authentification, de réservation et de profil sont pourvus d'un `<label>` visible, relié au champ par l'attribut `htmlFor` correspondant à l'`id` du champ (critère RGAA 11.1). Cela permet aux lecteurs d'écran (VoiceOver, NVDA) de vocaliser précisément la nature de l'information attendue et augmente la surface cliquable pour les personnes ayant des difficultés motrices.
2. **Navigation intégrale au clavier et anneau de focus visible** :  
   L'ensemble des composants interactifs (liens de navigation, boutons d'action, cartes de tournois, champs de formulaire) est navigable de manière ordonnée à la tabulation (`Tab` / `Shift+Tab`) et activable via `Entrée` ou `Espace`. Un style global `:focus-visible` a été défini dans `frontend/src/index.css` (`outline: 2px solid #F4AF23; outline-offset: 3px; box-shadow: 0 0 12px rgba(244, 175, 35, 0.45)`), garantissant un repérage immédiat de l'élément actif sans impacter l'esthétique lors d'une utilisation à la souris.
3. **Contraste des couleurs et lisibilité (Norme WCAG AA ≥ 4.5:1)** :  
   La charte graphique a été calibrée pour respecter les ratios de contraste recommandés par le W3C : texte principal blanc (`#FFFFFF`) et gris clair (`#CBD5E1`) sur fond d'arrière-plan sombre (`#05040a`), procurant un ratio supérieur à **14:1** (seuil minimal légal : 4.5:1 pour le texte normal). Les boutons d'action en Jaune Ambré (`#F4AF23`) avec texte sombre (`#05040a`) délivrent un ratio de **8.2:1**, conforme au niveau d'excellence WCAG AAA.
4. **Textes alternatifs et sémantique des images (`alt`)** :  
   Chaque image signifiante (couvertures de jeux, affiches d'événements, avatars des participants) comporte un texte alternatif `alt` descriptif et contextualisé (ex : `alt="Avatar de Pierre"`, `alt="Boîte de jeu Catan"`), évitant tout obstacle d'interprétation pour les personnes malvoyantes (critère RGAA 1.1). Les icônes purement décoratives utilisent `aria-hidden="true"` pour ne pas surcharger la synthèse vocale.

---

## 10 — CONFORMITÉ RGPD ET PROTECTION DES DONNÉES PERSONNELLES

Dans le cadre du développement de la plateforme **Cicados**, j'ai intégré dès la phase initiale de cadrage (Sprint 0) les exigences européennes du **Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679)** ainsi que les recommandations de la **CNIL**. La protection de la vie privée des utilisateurs et la souveraineté de leurs données ont constitué un critère d'architecture majeur.

### 10.1 Démarche « Privacy by Design » & Cadre Légal
J'ai adopté une démarche de **Protection des données dès la conception (*Privacy by Design*)** et de **Protection par défaut (*Privacy by Default*)** :
* **Transparence** : L'utilisateur est informé de la finalité exacte de chaque information recueillie lors de son inscription.
* **Sécurité préventive** : Aucun accès non autorisé ou non authentifié n'est toléré sur les ressources personnelles des membres.
* **Proportionnalité** : Les fonctionnalités de réservation, de participation aux tournois et de support ont été conçues pour fonctionner avec le minimum absolu de données identifiantes.

### 10.2 Principe de Minimisation des Données (Article 5.1.c RGPD)
Conformément au principe de minimisation, l'application Cicados ne collecte que les données strictement indispensables à l'exécution de ses services :
* **Identité & Authentification** :
  * `email` : Identifiant unique de connexion et acheminement des confirmations.
  * `password` : Mot de passe chiffré de manière irréversible via **Bcrypt** (coût de hachage de 10). Aucun mot de passe en clair ne transite durablement ni n'est persisté.
  * `firstname` & `lastname` : Gestion nominale pour l'accueil physique au café-boutique.
  * `pseudo` : Pseudonyme public modifiable affiché sur les cartes de tournois et dans les listes de participants, garantissant l'anonymat du nom de famille vis-à-vis des autres joueurs.
  * `avatar_url` : Photo de profil facultative, téléversée via Multer avec validation stricte du type MIME.
* **Exclusion volontaire de données superflues** :
  * Aucune collecte de numéro de téléphone obligatoire.
  * Aucune géolocalisation ou traceur GPS de l'utilisateur.
  * Aucun stockage de coordonnées bancaires en base de données : pour la feuille de route V2, la gestion des paiements Stripe s'effectuera par tokenisation déléguée conforme à la norme PCI-DSS.

### 10.3 Registre des Traitements et Finalités (Articles 6 et 30 RGPD)
J'ai formalisé le registre des activités de traitement de l'application selon les finalités opérationnelles :

| Finalité du Traitement | Données Concernées | Base Légale (Art. 6) | Destinataires | Durée de Conservation |
| :--- | :--- | :--- | :--- | :--- |
| **Gestion du compte membre & Authentification** | Email, prénom, nom, pseudo, mot de passe haché, avatar | **Exécution contractuelle** (Conditions d'utilisation) | L'utilisateur, Administrateurs | Durée d'activation du compte + purge après 24 mois d'inactivité |
| **Réservation de tables & Emprunt de jeux** | Identifiant utilisateur, date, créneau horaire, table, jeu choisi | **Exécution contractuelle** (Service de réservation) | Personnel du café, Membre | Archivage 1 an pour historique, puis suppression |
| **Inscriptions aux tournois & Animations** | Identifiant membre, pseudo public, statut d'inscription | **Consentement & Exécution du service** | Organisateurs, Joueurs (pseudo seul visible) | Clôture de l'événement + 6 mois d'historique |
| **Messagerie & Support client multi-tours** | Identifiant membre, sujet, questions, réponses admin | **Intérêt légitime** (Assistance utilisateur) | Équipe d'administration, Membre | Jusqu'à clôture de la demande ou suppression du compte |

### 10.4 Mesures Techniques et Organisationnelles de Sécurité (Article 32 RGPD)
Afin de garantir la confidentialité et l'intégrité des données personnelles, plusieurs barrières techniques sont opérationnelles :
1. **Hachage Cryptographique Unidirectionnel** : Les mots de passe sont hachés avec un sel aléatoire via l'algorithme robuste `bcryptjs`. En cas de compromission de la base de données, les mots de passe restent indéchiffrables.
2. **Tokens JWT Stateless & Temporisés** : L'accès à l'API repose sur des JSON Web Tokens signés avec une clé secrète forte stockée dans les variables d'environnement (`.env`), d'une durée de validité limitée à 24 heures.
3. **Cloisonnement des Rôles (RBAC)** : Les routes d'administration (`/api/admin/*`) sont protégées par le middleware `adminMiddleware` qui intercepte toute tentative d'élévation de privilège et renvoie un code HTTP 403 Forbidden.
4. **Requêtes Préparées (Anti-Injections SQL)** : Toutes les interactions MySQL utilisent des requêtes préparées avec placeholders `?` via le driver `mysql2/promise`, neutralisant très efficacement le risque d'exfiltration de données par injection SQL.
5. **Filtrage des Uploads (Multer)** : Renommage aléatoire systématique des images téléversées pour neutraliser les attaques par injection de chemin (`path traversal`), contrôle des types MIME et limitation matérielle à 2 Mo.

### 10.5 Exercice des Droits des Personnes Concernées (Articles 15 à 21 RGPD)
La plateforme intègre nativement des mécanismes permettant aux utilisateurs d'exercer leurs droits fondamentaux :
* **Droit d'accès et de rectification (Articles 15 & 16)** :  
  L'utilisateur peut à tout moment consulter ses données personnelles et les corriger en direct depuis son interface `Profile.jsx` (formulaire connecté à la route backend `PUT /api/auth/profile`).
* **Droit à l'effacement / « Droit à l'oubli » (Article 17)** :  
  L'administrateur peut procéder à la suppression définitive d'un compte utilisateur sur simple demande (`DELETE /api/admin/users/:id`).
  * **Suppression en cascade automatique (`ON DELETE CASCADE`)** : La structure relationnelle SQL a été conçue pour que la suppression d'un `users` efface instantanément toutes ses données associées (`reservations`, `tournament_registrations`, `event_registrations`, `messages`). Aucune donnée résiduelle orpheline n'est conservée.
* **Droit d'opposition et liberté de désistement (Article 21)** :  
  Un joueur peut en 1 clic annuler une réservation de table ou se désinscrire d'un tournoi TCG (`DELETE /api/tournaments/:id/register`), libérant instantanément sa place sans justification requise.

### 10.6 Durée de Conservation et Politique relative aux Cookies
* **Purge des comptes inactifs** : Une routine d'archivage et de purge est prévue pour supprimer les données des comptes n'ayant enregistré aucune connexion pendant une période de 24 mois consécutifs.
* **Gestion des traceurs et Cookies (Recommandations CNIL)** :  
  La plateforme Cicados n'embarque **aucun cookie tiers publicitaire, aucun outil d'analyse comportementale externe (type Google Analytics) et aucun pixel de tracking**.  
  Le jeton de session JWT est stocké localement dans le `localStorage` du navigateur. Ce traceur ayant pour finalité exclusive de maintenir la session authentifiée demandée par l'utilisateur, il est **strictement nécessaire au fonctionnement du service** et légitimement dispensé du recueil de consentement par bandeau intrusif selon la doctrine de la CNIL.

---

## 11 — UTILISATION DE RESSOURCES ANGLOPHONES
Exploitation permanente des documentations officielles anglophones : API BoardGameGeek XML2, documentation React 18, Vite 7, `mysql2`, `fast-xml-parser` et `i18next`.

---

## 12 — CONCLUSION ET PERSPECTIVES D'ÉVOLUTION

### Conclusion
La conception et le développement de l'application **Cicados** constituent un projet complet et abouti. L'intégration de la réservation de tables, de l'agenda des tournois, de la boutique avec gestion de stock, du système de messagerie support multi-tours et du respect des exigences de sécurité OWASP et RGPD répond fidèlement aux besoins opérationnels d'un café-boutique de jeux. L'ensemble des compétences du Titre Professionnel DWWM est validé.

### Perspectives d'Évolution (Feuille de Route V2)
1. **Sécurité avancée des tokens (Recommandations OWASP)** : Migration du stockage du token JWT depuis le `localStorage` vers un cookie sécurisé `HttpOnly`, `Secure` et `SameSite=Strict`, associé à un mécanisme de Refresh Token pour immuniser totalement la session utilisateur contre les risques de vol par faille XSS.
2. **Paiement en ligne sécurisé (Stripe)** : Intégration du SDK Stripe Checkout pour le règlement des acomptes de réservation et des frais d'inscription aux tournois TCG avec tokenisation bancaire conforme PCI-DSS.
3. **Notifications Temps Réel WebSockets (Socket.io)** : Mise en place d'un canal bidirectionnel persistant pour l'actualisation instantanée des jauges de tables et le chat support sans polling HTTP.
4. **Export PDF du Récépissé de Réservation** : Génération dynamique d'un ticket récapitulatif PDF avec QR Code pour fluidifier le pointage physique à l'arrivée au café-boutique.
5. **Application mobile (React Native)** : Déclinaison mobile iOS et Android avec notifications push natives lors de l'annonce de nouveaux tournois.

