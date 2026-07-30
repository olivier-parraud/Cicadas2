# 🧠 FICHES DE RÉVISION DWWM — PROJET CICADOS

**Titre professionnel visé :** Développeur Web et Web Mobile (DWWM)  
**Candidat :** PARRAUD Olivier  
**Projet :** Cicados — Café-Boutique de jeux de société, TCG & Réservations  

---

## 📑 SOMMAIRE DES FICHES
1. [Fiche 1 : Vue d'Ensemble & Architecture Globale](#fiche-1--vue-densemble--architecture-globale)
2. [Fiche 2 : Frontend (React 18, Vite 7, Tailwind, State & Routing)](#fiche-2--frontend-react-18-vite-7-tailwind-state--routing)
3. [Fiche 3 : Backend (Node.js, Express, MVC & APIs Tierces)](#fiche-3--backend-nodejs-express-mvc--apis-tierces)
4. [Fiche 4 : Base de Données & Modélisation (MySQL, SQL, Index & Integrity)](#fiche-4--base-de-données--modélisation-mysql-sql-index--integrity)
5. [Fiche 5 : Sécurité & Authentification (JWT, Bcrypt, OWASP)](#fiche-5--sécurité--authentification-jwt-bcrypt-owasp)
6. [Fiche 6 : Algorithmes Métier & Fonctionnalités Clés](#fiche-6--algorithmes-métier--fonctionnalités-clés)
7. [Fiche 7 : Outils, Testing & Préparation à l'Oral DWWM](#fiche-7--outils-testing--préparation-à-loral-dwwm)

---

## FICHE 1 : Vue d'Ensemble & Architecture Globale

### 💡 Concept de l'application Cicados
* **Nature du projet** : Application web complète (Fullstack) pour un café-boutique hybride à Paris (jeux de société & cartes à collectionner TCG : Magic, Pokémon, One Piece, Yu-Gi-Oh!, Lorcana, Riftbound TCG).
* **Besoins y répondant** :
  1. Réservation en ligne de tables de jeu avec algorithme anti-surbooking.
  2. Inscription/désinscription réactive aux tournois et événements.
  3. Messagerie & support client multi-tours bidirectionnel (Membre <-> Admin).
  4. Gestion de la boutique et contrôle du stock en temps réel.
  5. Importation automatisée de ludothèque via l'API BoardGameGeek (BGG).

### 🏗️ Architecture Client-Serveur (Découplée REST)
```
┌────────────────────────────────┐         Requêtes HTTP (JSON)         ┌────────────────────────────────┐
│      FRONTEND (Client SPA)     │ ────────────────────────────────────▶ │      BACKEND (Serveur REST)    │
│  React 18 + Vite 7 + Tailwind  │ ◀──────────────────────────────────── │    Node.js + Express (MVC)     │
└────────────────────────────────┘         Réponses JSON + Status       └────────────────────────────────┘
                                                                                        │
                                                                                        ▼ Requêtes SQL (mysql2)
                                                                        ┌────────────────────────────────┐
                                                                        │      BASE DE DONNÉES (BDD)     │
                                                                        │          MySQL (MAMP)          │
                                                                        └────────────────────────────────┘
```
* **Découplage strict** : Le Frontend et le Backend sont totalement indépendants. Le serveur Express fournit une API REST stateless consommée par l'application React.

---

## FICHE 2 : Frontend (React 18, Vite 7, Tailwind, State & Routing)

### ⚛️ 1. React 18 & Vite 7
* **React 18** : Bibliothèque JavaScript pour créer des interfaces utilisateur réactives basées sur des composants réutilisables.
* **Vite 7** : Tooling et bundler ultra-rapide basé sur ESbuild (développement) et Rollup (production). Remplace avantageusement Create React App grâce au Hot Module Replacement (HMR) instantané.
* **JSX (JavaScript XML)** : Extension de syntaxe permettant d'écrire de la structure HTML directement dans du code JavaScript.

### 🎨 2. Design System & Style (Tailwind CSS & Lucide React)
* **Tailwind CSS** : Framework CSS utilitaire. Permet de styliser directement dans le JSX avec des classes atomiques (`flex`, `items-center`, `bg-[#130f25]`, `backdrop-blur-md`).
* **Avantages** : Aucune pollution de fichiers CSS globaux, responsive natif (`md:grid-cols-3`), thème Dark Premium maîtrisé.
* **Lucide React** : Bibliothèque d'icônes SVG vectorielles légères et personnalisables.

### 🔄 3. Gestion de l'État & Événements Réactifs (State Management)
* **`useState`** : Hook React permettant de déclarer des variables d'état locales réactives (ex: liste des réservations, contenu d'un formulaire, filtres).
* **`useEffect`** : Hook pour exécuter des effets de bord (appels d'API REST au chargement du composant, écouteurs d'événements, timers).
* **Événements sur-mesure (`window.dispatchEvent`)** :
  - *Cas d'usage* : Lorsqu'un utilisateur répond à un message ou qu'un admin répond, l'événement personnalisé `messages_updated` est émis.
  - *Résultat* : Le composant `Header.jsx` réactualise automatiquement le compteur de la pastille rouge sans rechargement de page (`window.location.reload()`).

### 🔀 4. Routing Client (React Router DOM)
* **SPA (Single Page Application)** : Le navigateur ne charge la page HTML initiale (`index.html`) qu'une seule fois. La navigation entre les pages modifie le DOM dynamiquement sans rafraîchir l'onglet.
* **Routes Publiques** : `/`, `/about`, `/boardgames`, `/tournaments`, `/events`, `/login`, `/register`.
* **Routes Privées Membres** : `/reservations`, `/my-reservations`, `/profile`.
* **Console Administration** : `/admin` (Protégé par rôle `ADMIN`).

### 🛠️ 5. Isolation des Modales (`e.stopPropagation()`)
* **Problématique résolue** : Lors du clic sur le bouton "Liste des inscrits" d'un tournoi, l'événement remontait jusqu'à la carte parente et ouvrait simultanément la fiche Pokémon.
* **Solution technique** : Utilisation de `e.stopPropagation()` sur le bouton de la modale pour stopper la propagation de l'événement dans l'arbre DOM.

### ⚡ 6. Mise à Jour Optimiste & Uniformisation des En-têtes Lumineux
* **Rendu Sans Clignotement (`DashboardAdmin.jsx`)** : Les actions administrateur (annulation/suppression de réservation) mettent à jour l'état local React immédiatement de façon optimiste. Le serveur est synchronisé de façon non bloquante via `fetchAdminData(false)` sans déclencher d'écran blanc ou de spinner de chargement (`loading = true`).
* **Design System & Encarts Lumineux Délimités** : Toutes les pages (`Home`, `Events`, `Tournaments`, `BoardGames`, `Reservations`, `MyReservations`) disposent d'un en-tête unifié avec un encart délimité aux coins arrondis `rounded-3xl`, bordure dorée `border-[#F4AF23]/30`, ombre portée `shadow-2xl` et halos lumineux ambrés et violets (`bg-[#563D82]/25` et `bg-[#F4AF23]/15` en `blur-3xl`).
* **Lisibilité & Polices Minimales (`index.css`)** : Rehaussement global des tailles de polices minimales (`.text-xs` à 13.6px, polices 10-11px à 12.8px) et mise en valeur des dates des cartes en jaune ambré `#F4AF23`.

---

## FICHE 3 : Backend (Node.js, Express, MVC & APIs Tierces)

### 🟢 1. Node.js & Express
* **Node.js** : Environnement d'exécution JavaScript côté serveur basant son exécution sur le moteur V8 de Google (asynchrone et non-bloquant basé sur une boucle d'événements *Event Loop*).
* **Express.js** : Framework web minimaliste et flexible pour Node.js facilitant la création des routes HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) et des middlewares.

### 📂 2. Architecture MVC (Model-View-Controller)
```
Requête Client ──▶ Router (message.routes.js) ──▶ Controller (message.controller.js)
                                                              │
                                                              ▼
Réponse JSON ◀── Controller ◀── Model (message.model.js) ◀── Requête SQL
```
* **Routes** : Définissent les endpoints d'API et leur associent les middlewares d'authentification et de contrôle.
* **Controllers** : Contiennent la logique métier (validation des données d'entrée, vérification des autorisations, formatage des réponses et gestion des erreurs).
* **Models** : Gèrent les interactions directes avec la base de données SQL via des requêtes paramétrées.

### 📤 3. Téléversement de Fichiers (Multer Middleware)
* **Multer** : Middleware Node.js pour la gestion du format `multipart/form-data`.
* **Application dans Cicados** :
  - `POST /api/auth/upload-avatar` : Téléversement et stockage de la photo de profil utilisateur.
  - `POST /api/admin/upload-image` : Upload des visuels d'événements et de jeux de société par l'admin.

### 🌐 4. Consommation d'API Tierce & Conversion (BoardGameGeek API + `fast-xml-parser`)
* **Problématique** : L'API officielle de BoardGameGeek (BGG API v2) renvoie des flux de données au format XML.
* **Solution** : Le backend Node.js agit comme un **Proxy API**. Il interroge l'API XML de BGG, convertit la structure XML en JSON natif via la bibliothèque `fast-xml-parser`, nettoie les attributs puis insère les jeux directement en base MySQL.

### 🛡️ 5. Résilience & Système de Secours (JSON Failover)
* En cas d'indisponibilité momentanée de la base de données SQL MySQL, le modèle `boardgame.model.js` bascule automatiquement sur un fichier de sauvegarde local `boardgames_backup.json` pour garantir que le catalogue public reste toujours affichable pour les visiteurs.

---

## FICHE 4 : Base de Données & Modélisation (MySQL, SQL, Index & Integrity)

### 🗄️ 1. Système de Gestion de Base de Données (SGBDR)
* **MySQL 8** (hébergé sous MAMP) : Base de données relationnelle performante.
* **`mysql2/promise`** : Pilote Node.js supportant les promesses et le `async/await` pour des requêtes non-bloquantes.
* **Pool de connexions (`mysql.createPool`)** : Maintient un jeu de connexions réutilisables ouvertes vers MySQL, évitant le coût de reconnexion à chaque requête HTTP.

### 📊 2. Structure des 8 Tables Relationnelles
1. **`users`** : `id`, `email`, `password`, `firstname`, `lastname`, `pseudo`, `avatar_url`, `role` (`CLIENT` / `ADMIN`), `created_at`.
2. **`rooms`** : `id`, `name`, `capacity` (4 tables physiques).
3. **`reservations`** : `id`, `user_id` (FK), `room_id` (FK), `start_time`, `end_time`, `game_type`, `specific_game`, `players_count`, `status`.
4. **`tournaments`** : `id`, `name`, `game`, `date`, `capacity`, `price`, `description`.
5. **`tournament_registrations`** : `id`, `tournament_id` (FK), `user_id` (FK), `registered_at`.
6. **`events`** : `id`, `title`, `type` (`DRAFT`, `PRERELEASE`, `INITIATION`), `date`, `capacity`, `price`.
7. **`event_registrations`** : `id`, `event_id` (FK), `user_id` (FK), `registered_at`.
8. **`board_games`** : `id`, `name`, `category`, `min_players`, `max_players`, `duration`, `description`, `image_url`, `stock`.
9. **`messages`** : `id`, `user_id` (FK), `subject`, `content`, `is_read`, `admin_reply`, `replied_at`, `user_read`, `created_at`.

### 🔗 3. Intégrité Référentielle & Contraintes SQL
* **Clés Primaires (`PRIMARY KEY`)** : Identifiant unique auto-incrémenté (`AUTO_INCREMENT`).
* **Clés Étrangères (`FOREIGN KEY`)** : Assurent la cohérence des liens inter-tables.
* **`ON DELETE CASCADE`** : Si un utilisateur ou un tournoi est supprimé, toutes les inscriptions et réservations associées sont automatiquement nettoyées en cascade.
* **Index Uniques Composites (`UNIQUE KEY (tournament_id, user_id)`)** : Empêche physiquement au niveau SQL qu'un utilisateur puisse s'inscrire deux fois au même tournoi.

---

## FICHE 5 : Sécurité & Authentification (JWT, Bcrypt, OWASP)

### 🔐 1. Hachage des Mots de Passe (`bcrypt`)
* **Principe** : Aucun mot de passe n'est stocké en clair dans la base de données.
* **Fonctionnement** : À l'inscription, le mot de passe est combiné à un "Grain de sel" (*Salt*) aléatoire puis haché unilatéralement via l'algorithme `bcrypt` (`bcrypt.hash(password, 10)`).
* **Vérification** : Lors de la connexion, `bcrypt.compare()` compare le mot de passe saisi avec le hash stocké.

### 🔑 2. Authentification par JSON Web Token (JWT)
* **Stateless** : Le serveur ne stocke pas de session en mémoire. L'état d'authentification est contenu dans le token.
* **Structure du JWT** :
  1. *Header* : Algorithme de signature (ex: HS256).
  2. *Payload* : Données publiques de session (`id`, `email`, `role`).
  3. *Signature* : Clé secrète connue uniquement du serveur backend (`JWT_SECRET`).
* **Flux d'utilisation** :
  1. Connexion réussie -> Le serveur génère et renvoie le token JWT.
  2. Le client stocke le token dans le `localStorage`.
  3. Pour chaque requête privée, le client envoie le header HTTP : `Authorization: Bearer <token>`.
  4. Le middleware `authMiddleware` intercepte la requête, vérifie la signature du token et extrait `req.user`.

### 🛡️ 3. Protection contre les Failles OWASP Majeures

| Faille OWASP | Risque | Solution Implémentée dans Cicados |
|---|---|---|
| **Injection SQL** | Un attaquant injecte du code SQL dans un champ de formulaire. | **Requêtes préparées SQL** (`mysql2` avec des marqueurs `?`). Les variables sont échappées et traitées comme des valeurs littérales. |
| **XSS (Cross-Site Scripting)** | Injection de scripts malveillants JS dans les pages. | **React s'occupe d'échapper automatiquement** tout le contenu rendu dans le JSX (pas de `dangerouslySetInnerHTML`). |
| **Broken Access Control** | Un utilisateur modifie l'URL pour accéder à des fonctions d'administration. | **`adminMiddleware` backend** vérifiant strictement `req.user.role === 'ADMIN'` sur chaque route d'administration. |
| **Mots de passe faibles / Vol** | Fuite de base de données. | **Hachage salé Bcrypt (10 rounds)** + Tokens JWT signés. |

---

## FICHE 6 : Algorithmes Métier & Fonctionnalités Clés

### 📅 1. Algorithme Anti-Surbooking de Tables de Jeu
* **Problématique** : L'établissement physique possède 4 tables de jeux. Il est interdit d'attribuer une table si les 4 sont déjà réservées sur le créneau demandé.
* **Formule d'intersection temporelle SQL** :
  Deux créneaux $[A_{start}, A_{end}]$ et $[B_{start}, B_{end}]$ se chevauchent si et seulement si :
  $$\text{start\_time} < B_{end} \quad \text{AND} \quad \text{end\_time} > B_{start}$$
* **Déroulement de l'algorithme** :
  1. La requête SQL compte le nombre de réservations confirmées en chevauchement pour la date et le créneau demandés.
  2. Si le nombre de réservations occupées est $\ge 4$, la réservation est refusée avec le message *"Toutes les tables sont occupées sur ce créneau"*.
  3. Sinon, l'algorithme identifie la première table (`room_id`) disponible parmi les 4 et enregistre la réservation.

### 💬 2. Système de Messagerie Support Multi-Tours
* **Flux de discussion** :
  1. *Membre* : Clique sur "Contacter les admins" -> Envoie un message (`is_read = 0`, `user_read = 1`).
  2. *Header & Admin* : Badge de notification "NOUVEAU" s'affiche sur le Dashboard Admin.
  3. *Admin* : Rédige une réponse (`admin_reply`, `replied_at = NOW()`, `user_read = 0`).
  4. *Membre* : Reçoit une notification rouge sur son avatar. Sur son Profil (`Profile.jsx`), la réponse s'affiche en texte blanc sous sa question.
  5. *Relance Membre* : Le membre clique sur "Répondre" -> Le nouveau texte s'ajoute à la suite de la conversation et le statut repasse en non lu côté admin (Discussion multi-tours).

### 📦 3. Contrôle des Stocks Boutique en Temps Réel
* Ajout de la colonne `stock` sur la table `board_games`.
* Affichage d'un badge dynamique sur les cartes du catalogue (`BoardGameCard.jsx`) : *"En stock: X"* ou *"Rupture de stock"*.
* Boutons d'incrémentation/décrémentation rapide `+ / -` sur le Dashboard Admin via des requêtes AJAX `PATCH /api/admin/boardgames/:id/stock`.

---

## FICHE 7 : Outils, Testing & Préparation à l'Oral DWWM

### 🛠️ 1. Outils de Développement & Versioning
* **Git & GitHub** : Versionnement du code source, branches d'exécutions et messages de commits structurés.
* **MAMP** : Environnement serveur local intégrant Apache, PHP et le serveur de base de données MySQL sur le port 8889.

### 🧪 2. Tests Automatisés (Puppeteer)
* **Puppeteer** : Outil d'automatisation de navigateur Chrome headless sous Node.js.
* **Scénarios validés** :
  - Navigation et réservation de tables sous contrainte de créneaux.
  - Test d'envoi et de réponse de messagerie multi-tours.
  - Validation visuelle par captures d'écran automatisées dans le dossier d'artifacts.

### 🎯 3. Questions Réponses Pièges Fréquentes du Jury DWWM

#### Q1 : "Pourquoi avoir choisi React plutôt qu'un site classique en HTML/PHP ?"
> **Réponse** : "React offre une expérience utilisateur fluide type SPA (Single Page Application) sans aucun rechargement de page. Pour un site de réservation et d'agenda interactif avec des notifications en temps réel et des modales (comme la liste des inscrits ou le formulaire de contact), la gestion dynamique de l'état avec React apporte un confort inégalé. De plus, cela permet d'avoir une API REST totalement indépendante et réutilisable pour une future application mobile."

#### Q2 : "Comment prémunissez-vous votre site contre les injections SQL ?"
> **Réponse** : "Toutes les requêtes vers ma base de données MySQL passent par le driver `mysql2` avec des requêtes préparées utilisant des marqueurs d'emplacement `?`. Les valeurs saisies par les utilisateurs ne sont jamais concaténées directement dans la chaîne SQL, ce qui neutralise complètement les injections SQL."

#### Q3 : "Comment fonctionne votre système d'authentification ?"
> **Réponse** : "À la connexion, le serveur vérifie l'email et le mot de passe haché via Bcrypt. Si la combinaison est valide, le serveur génère un JSON Web Token (JWT) contenant le payload de l'utilisateur (`id`, `email`, `role`) signé avec une clé secrète. Le client conserve ce token dans son `localStorage` et le transmet dans l'en-tête `Authorization: Bearer` pour chaque requête protégée."

#### Q4 : "Comment empêchez-vous le surbooking sur vos tables de jeux ?"
> **Réponse** : "Côté backend, lors d'une demande de réservation, une requête SQL vérifie le chevauchement d'horaires (`start_time < nouveau_fin AND end_time > nouveau_debut`). Si le nombre de tables occupées atteint la capacité maximale de 4 tables, la réservation est bloquée immédiatement."

#### Q5 : "Si l'API externe BoardGameGeek tombe en panne, que se passe-t-il ?"
> **Réponse** : "J'ai mis en place un mécanisme de tolérance aux pannes (Failover). Si l'API BGG ou la base de données ne répond pas, mon modèle bascule automatiquement sur un fichier de secours local JSON (`boardgames_backup.json`), garantissant l'affichage continu du catalogue."

#### Q6 : "Comment évitez-vous les clignotements d'écran lors des actions dans l'administration ?"
> **Réponse** : "J'utilise le pattern de mise à jour optimiste de l'état React. Lors d'une suppression ou d'un changement de statut, l'état React local du composant `DashboardAdmin.jsx` est immédiatement modifié sans attendre le retour réseau. La resynchronisation avec la base MySQL s'exécute ensuite en arrière-plan de façon non bloquante via `fetchAdminData(false)` sans déclencher le spinner de chargement global, garantissant un rendu fluide à 60 FPS sans aucun clignotement."
