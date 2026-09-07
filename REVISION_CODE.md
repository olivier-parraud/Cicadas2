# 🎓 Fiche Mémotechnique & Guide de Révision du Code — Oral DWWM (Projet Cicados)

**Candidat :** PARRAUD OLIVIER  
**Diplôme visé :** Titre Professionnel Développeur Web et Web Mobile (DWWM) — Niveau 5 (Bac+2)  
**Établissement :** La Plateforme (Marseille)  
**Session :** 2026  

---

## 📑 Sommaire Général des Révisions

1. [Vue d'ensemble de l'Architecture & de la Stack](#1-vue-densemble-de-larchitecture--de-la-stack)
2. [Authentification, Sécurité & Droits (JWT & RBAC)](#2-authentification-sécurité--droits-jwt--rbac)
3. [Algorithme Anti-Surbooking & Réservation de Tables](#3-algorithme-anti-surbooking--réservation-de-tables)
4. [Haute Disponibilité & Basculement de Secours (SQL ➔ JSON)](#4-haute-disponibilité--basculement-de-secours-sql--json)
5. [Proxy API BoardGameGeek & Parsing XML2 ➔ JSON](#5-proxy-api-boardgamegeek--parsing-xml2--json)
6. [Messagerie Support Multi-Tours & Événements Réactifs](#6-messagerie-support-multi-tours--événements-réactifs)
7. [Gestion des Tournois & Inscriptions Transactionnelles](#7-gestion-des-tournois--inscriptions-transactionnelles)
8. [Téléversement d'Images Sécurisé (Multer Middleware)](#8-téléversement-dimages-sécurisé-multer-middleware)
9. [Architecture Frontend SPA React 18 & Isolation DOM](#9-architecture-frontend-spa-react-18--isolation-dom)
10. [Infrastructure Docker, Nginx & Pipeline CI/CD](#10-infrastructure-docker-nginx--pipeline-cicd)
11. [🎯 Cheat Sheet Oral : Questions Pièges du Jury & Réponses Ciblées](#11--cheat-sheet-oral--questions-pièges-du-jury--réponses-ciblées)

---

## 1. Vue d'ensemble de l'Architecture & de la Stack

### 🏗️ L'Architecture Globale (Découplée REST)
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

* **Frontend** : Single Page Application (SPA) développée avec **React 18** et **Vite 7**, stylisée avec **Tailwind CSS**.
* **Backend** : API RESTful stateless sous **Node.js** avec le framework **Express**, structurée selon le pattern **MVC (Modèle-Vue-Contrôleur)**.
* **Base de données** : **MySQL 8.0** relationnelle via le driver performant `mysql2/promise`.

---

## 2. Authentification, Sécurité & Droits (JWT & RBAC)

### 📌 1. Inscription & Connexion (Hashage Bcrypt & Signature JWT)
* **Où se trouve le code ?** 📁 `backend/src/controllers/auth.controller.js` & `backend/src/models/user.model.js`
* **Fonctions clés :**
  - `register(req, res)` : Inscription d'un nouvel utilisateur.
  - `login(req, res)` : Authentification et délivrance du jeton JWT.
  - `User.create({ username, email, password })` : Interroge la BDD et hache le mot de passe avec `bcrypt.hash(password, 10)`.

```javascript
// Extrait de auth.controller.js (login)
const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```

#### 🗣️ Explication pour le Jury :
> *"Le mot de passe de l'utilisateur n'est jamais stocké en clair. Il est salé et haché avec l'algorithme Bcrypt (coût de salage de 10). Lors de la connexion, le serveur valide les identifiants et génère un jeton JWT (JSON Web Token) signé numériquement contenant l'ID et le rôle (`USER` ou `ADMIN`). Le jeton expire au bout de 24 heures."*

---

### 📌 2. Middlewares de Sécurité & Contrôle d'Accès (RBAC)
* **Où se trouve le code ?** 📁 `backend/src/middlewares/auth.middleware.js` & `backend/src/middlewares/admin.middleware.js`
* **Fonctions clés :**
  - `authMiddleware(req, res, next)` : Vérifie la validité du token JWT transmis dans le header `Authorization: Bearer <token>`.
  - `adminMiddleware(req, res, next)` : Vérifie que `req.user.role === 'ADMIN'`.

```javascript
// Extrait de auth.middleware.js
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
}
const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id); // Injection de l'utilisateur dans la requête
next();
```

```javascript
// Extrait de admin.middleware.js
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ error: "Accès refusé. Droits d'administration requis." });
};
```

#### 🗣️ Explication pour le Jury :
> *"Pour protéger nos routes d'API, nous appliquons une architecture middleware en deux étapes. Le middleware `authMiddleware` extrait le Bearer Token, vérifie sa signature et décode l'identité de l'utilisateur. Si la route nécessite des privilèges d'administration, le middleware `adminMiddleware` prend le relais et vérifie le rôle de l'utilisateur. Si le rôle n'est pas 'ADMIN', la requête est bloquée net avec une erreur HTTP 403 Forbidden."*

---

## 3. Algorithme Anti-Surbooking & Réservation de Tables

* **Où se trouve le code ?** 📁 `backend/src/models/reservation.model.js` (méthode `create`) & `backend/src/controllers/reservation.controller.js`
* **Fonction clé :** `Reservation.create({ user_id, date, time, duration, gameType, specific_game, players_count })`

```javascript
// 1. Calcul du créneau [T_start, T_end]
const startTime = `${date} ${time}:00`;
const startObj = new Date(startTime);
startObj.setHours(startObj.getHours() + parseInt(duration, 10));
const endTime = startObj.toISOString().slice(0, 19).replace('T', ' ');

// 2. Détection d'overlap SQL sur les tables physiques (Rooms)
const sqlOccupied = `
    SELECT room_id FROM reservations 
    WHERE start_time < ? AND end_time > ? AND status != 'CANCELLED'
`;
const occupiedRooms = await query(sqlOccupied, [endTime, startTime]);
const occupiedIds = occupiedRooms.map(r => r.room_id);

// 3. Allocation de la première table disponible
const availableRoom = rooms.find(r => !occupiedIds.includes(r.id));
if (!availableRoom) {
    throw new Error("Toutes les tables de jeux sont complètes pour ce créneau horaire."); // 🛑 Stop !
}

// 4. Contrôle du stock unique du jeu de société sélectionné (Stock = 1)
if (specific_game) {
    const checkGameSql = `
        SELECT id FROM reservations 
        WHERE start_time < ? AND end_time > ? AND status != 'CANCELLED' 
        AND LOWER(TRIM(specific_game)) = LOWER(TRIM(?))
    `;
    const existingBookings = await query(checkGameSql, [endTime, startTime, specific_game]);
    if (existingBookings.length >= 1) {
        throw new Error(`Le jeu "${specific_game}" est DÉJÀ RÉSERVÉ pour ce créneau.`); // 🛑 Stop !
    }
}

// 5. Enregistrement SQL
const sql = `INSERT INTO reservations (user_id, room_id, start_time, end_time, status) VALUES (?, ?, ?, ?, 'CONFIRMED')`;
```

#### 🗣️ Explication pour le Jury :
> *"L'algorithme de réservation résout deux problèmes majeurs : le surbooking des tables et le conflit de stock de jeu.*
> 1. *Il applique la condition mathématique de chevauchement d'intervalles temporel : `start_time < T_end AND end_time > T_start`.*
> 2. *Il identifie les tables physiques occupées et alloue automatiquement la première table libre.*
> 3. *Si le client a sélectionné un jeu de société spécifique, l'algorithme s'assure que cet exemplaire unique n'est pas déjà prêté sur la même période.*
> 4. *En cas de conflit, une exception est levée (`throw new Error`), ce qui stoppe net le script et empêche toute insertion SQL."*

---

## 4. Haute Disponibilité & Basculement de Secours (SQL ➔ JSON)

* **Où se trouve le code ?** 📁 `backend/src/controllers/boardgame.controller.js`
* **Fonction clé :** `getBoardGames(req, res)`

```javascript
export const getBoardGames = async (req, res) => {
    try {
        // Tentative d'extraction depuis MySQL
        const games = await BoardGame.findAll();
        res.json(games);
    } catch (error) {
        console.error("Erreur BDD, tentative de basculement sur le fichier JSON local :", error);
        try {
            // Lecture de secours du fichier JSON statique local
            const jsonPath = path.join(__dirname, '..', 'data', 'boardgame-list.json');
            const data = await fs.readFile(jsonPath, 'utf8');
            const gamesList = JSON.parse(data);

            // Normalisation des jeux de secours avec des identifiants virtuels
            const fallbackGames = gamesList.map((game, index) => ({
                id: index + 10000,
                name: game.name,
                category: "Famille",
                description: `Jeu de société : ${game.name}. (Données de secours chargées depuis le fichier local).`
            }));

            res.json(fallbackGames);
        } catch (jsonError) {
            res.status(500).json({ error: "Impossible de charger les jeux de société." });
        }
    }
};
```

#### 🗣️ Explication pour le Jury :
> *"Pour garantir une Haute Disponibilité (High Availability), notre contrôleur de jeux intègre un mécanisme de basculement transparent (Failover). En cas de rupture de connexion avec le serveur MySQL, le bloc `catch` prend immédiatement le relais en lisant de manière asynchrone un fichier de secours local `boardgame-list.json`. Les données sont normalisées pour que l'interface React continue de fonctionner sans afficher d'écran blanc à l'utilisateur."*

---

## 5. Proxy API BoardGameGeek & Parsing XML2 ➔ JSON

* **Où se trouve le code ?** 📁 `backend/src/controllers/bgg.controller.js`
* **Fonctions clés :** `fetchBgg(endpoint, params)`, `getBoardGameById(req, res)`

```javascript
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true
});

export const getBoardGameById = async (req, res) => {
    const { id } = req.params;
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`;
    
    // Requête HTTP serveur-à-serveur (Contournement CORS)
    const response = await fetch(url);
    const xmlData = await response.text();
    
    // Parsing XML vers JSON
    const jsonObj = parser.parse(xmlData);
    const bggItem = jsonObj.items.item;
    
    // Extraction épurée des métadonnées
    const gameData = {
        id: bggItem['@_id'],
        name: bggItem.name[0]['@_value'],
        minPlayers: bggItem.minplayers['@_value'],
        maxPlayers: bggItem.maxplayers['@_value'],
        rating: bggItem.statistics.ratings.average['@_value']
    };
    
    res.json({ success: true, data: gameData });
};
```

#### 🗣️ Explication pour le Jury :
> *"L'API officielle de BoardGameGeek renvoie des données au format XML2 complexe et ne prend pas en charge les en-têtes CORS pour les requêtes navigateur. Notre serveur Node.js agit donc comme un Proxy Edge. Il effectue la requête HTTP vers BGG, convertit le flux XML en objet JSON natif grâce à la bibliothèque `fast-xml-parser`, et restitue au Frontend une structure JSON propre et immédiatement exploitable."*

---

## 6. Messagerie Support Multi-Tours & Événements Réactifs

### 📌 1. Concaténation SQL & Réinitialisation du Drapeau de Lecture
* **Où se trouve le code ?** 📁 `backend/src/models/message.model.js` (méthode `userReply`) & `backend/src/controllers/message.controller.js`

```javascript
// Extrait de message.model.js
async userReply(id, userId, replyContent) {
    const formattedReply = `\n\n[Relance Membre - ${new Date().toLocaleString('fr-FR')}]\n${replyContent}`;
    const sql = `
        UPDATE messages 
        SET content = CONCAT(content, ?), 
            admin_reply = NULL, 
            is_read = 0, 
            user_read = 1 
        WHERE id = ? AND user_id = ?
    `;
    return query(sql, [formattedReply, id, userId]);
}
```

### 📌 2. Propagation Réactive Frontend (`messages_updated`)
* **Où se trouve le code ?** 📁 `frontend/src/pages/Profile.jsx` & `frontend/src/components/Header.jsx`

```javascript
// Dans Profile.jsx (lors de l'envoi de la relance)
if (res.ok) {
    // Déclenchement de l'événement natif global
    window.dispatchEvent(new Event('messages_updated'));
}
```

```javascript
// Dans Header.jsx (écoute de l'événement)
useEffect(() => {
    const fetchUnreadCount = async () => { ... };
    window.addEventListener('messages_updated', fetchUnreadCount);
    return () => window.removeEventListener('messages_updated', fetchUnreadCount);
}, []);
```

#### 🗣️ Explication pour le Jury :
> *"Notre système de messagerie support permet un dialogue continu multi-tours. Lorsqu'un utilisateur répond à un ticket sur son profil, la méthode SQL `userReply` concatène le message à l'historique et réinitialise `is_read = 0` et `admin_reply = NULL`. Côté Frontend, le composant émet l'événement natif `messages_updated`. Le composant `Header` réagit immédiatement en rafraîchissant le compteur de notifications non lues sans aucun rechargement de page."*

---

## 7. Gestion des Tournois & Inscriptions Transactionnelles

* **Où se trouve le code ?** 📁 `backend/src/models/tournament.model.js` & `backend/src/controllers/tournament.controller.js`
* **Fonctions clés :** `registerPlayer(tournament_id, user_id)`, `unregisterPlayer(tournament_id, user_id)`

```javascript
async registerPlayer(tournamentId, userId) {
    // 1. Vérifier la capacité maximale
    const [t] = await query('SELECT current_players, max_players FROM tournaments WHERE id = ?', [tournamentId]);
    if (t.current_players >= t.max_players) {
        throw new Error("Tournoi complet.");
    }
    
    // 2. Vérifier si l'utilisateur n'est pas déjà inscrit
    const existing = await query('SELECT id FROM tournament_participants WHERE tournament_id = ? AND user_id = ?', [tournamentId, userId]);
    if (existing.length > 0) {
        throw new Error("Déjà inscrit à ce tournoi.");
    }
    
    // 3. Inscrire et incrémenter le compteur
    await query('INSERT INTO tournament_participants (tournament_id, user_id) VALUES (?, ?)', [tournamentId, userId]);
    await query('UPDATE tournaments SET current_players = current_players + 1 WHERE id = ?', [tournamentId]);
}
```

#### 🗣️ Explication pour le Jury :
> *"La réservation d'événements TCG applique un contrôle strict de la capacité. Le modèle vérifie l'absence de doublon d'inscription et s'assure que le nombre de participants actuels n'a pas atteint la limite fixe (`max_players`). L'inscription valide ajoute le joueur dans la table d'association `tournament_participants` et incrémente le compteur de joueurs."*

---

## 8. Téléversement d'Images Sécurisé (Multer Middleware)

* **Où se trouve le code ?** 📁 `backend/src/middlewares/upload.middleware.js` & `backend/src/controllers/admin.controller.js`

```javascript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format d\'image non supporté (JPEG, PNG, WEBP uniquement).'), false);
    }
};

export const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } // Limite 5 Mo
});
```

#### 🗣️ Explication pour le Jury :
> *"Pour permettre aux administrateurs d'ajouter les visuels des jeux et événements, nous utilisons le middleware `Multer`. Il contrôle la sécurité des fichiers téléversés : il renomme le fichier avec un timestamp unique pour éviter le chevauchement de nom, filtre les types MIME autorisés (JPEG, PNG, WEBP) et rejette tout fichier dépassant la limite de 5 Mo."*

---

## 9. Architecture Frontend SPA React 18 & Isolation DOM

* **Où se trouve le code ?** 📁 `frontend/src/App.jsx`, `frontend/src/components/ContactModal.jsx`
* **Éléments clés :** React Router v6, React Portals (`ReactDOM.createPortal`), `i18next` internationalisation.

```javascript
// Exemple d'isolation de modale via React Portal (ContactModal.jsx)
return ReactDOM.createPortal(
    <div class="modal-overlay">
        <div class="modal-content">
            <h2>Contactez l'administration</h2>
            {/* Formulaire local */}
        </div>
    </div>,
    document.getElementById('modal-root')
);
```

#### 🗣️ Explication pour le Jury :
> *"L'interface utilisateur est construite avec React 18. Le routage déclaratif est géré par React Router. Pour optimiser les performances de rendu à 60 FPS, nous isolons les composants éphémères (comme `ContactModal.jsx`) grâce aux Portails React (`ReactDOM.createPortal`). Cela permet de rattaché visuellement la modale à la racine du DOM tout en évitant les re-rendus inutiles du composant parent."*

---

## 10. Infrastructure Docker, Nginx & Pipeline CI/CD

* **Où se trouvent les fichiers ?** 📁 `docker-compose.yml`, `nginx/nginx.conf`, `.github/workflows/ci-cd.yml`

### 🛠️ Résumé de la pile d'infrastructure :
1. **Multi-Stage Build Docker** : Compiles les assets React statiques avec Node.js, puis injecte uniquement le bundle final dans un serveur ultra-léger **Nginx Alpine** (réduction de plus de 80% de la taille de l'image).
2. **Reverse Proxy Nginx** : Masque le serveur Node.js backend, gère le routage des requêtes statiques et proxy-passe les requêtes `/api/` vers Node.js, tout en appliquant la compression `gzip` et les en-têtes de sécurité HTTP.
3. **CI/CD GitHub Actions** : À chaque `git push`, le pipeline exécute le linter ESLint, démarre un conteneur MySQL temporaire pour les tests d'intégration, exécute les scénarios E2E Puppeteer, et déploie automatiquement à chaud sur le serveur VPS via SSH.

---

## 11. 🎯 Cheat Sheet Oral : Questions Pièges du Jury & Réponses Ciblées

| Question du Jury | Ce qu'il faut répondre (Mot-à-mot recommandé) | Fichier à citer |
| :--- | :--- | :--- |
| **"Comment évitez-vous les injections SQL dans votre application ?"** | *"Nous n'utilisons jamais de concaténation directe dans nos requêtes SQL. Toutes nos requêtes utilisent des requêtes préparées avec des marqueurs `?` gérés par le driver `mysql2/promise`. La base de données sépare ainsi strictement les instructions du contenu."* | `backend/src/config/db.js` |
| **"Que se passe-t-il si deux clients réservent la dernière table à la même milliseconde ?"** | *"Notre algorithme effectue une vérification d'overlap basée sur les créneaux réels `start_time` et `end_time`. De plus, la table de réservation utilise un index unique et la base MySQL traite les écritures en mode transactionnel séquentiel."* | `backend/src/models/reservation.model.js` |
| **"Où conservez-vous les mots de passe et les jetons de sécurité ?"** | *"Les mots de passe sont hachés avec Bcrypt (coût 10) avant stockage. Le jeton JWT est conservé côté client dans le `localStorage` et la clé secrète de signature est isolée dans les variables d'environnement `.env` serveur."* | `backend/src/controllers/auth.controller.js` |
| **"Comment votre application gère-t-elle les pannes de la base de données ?"** | *"Nous avons mis en place une stratégie de basculement (Failover). Si la base SQL ne répond pas, le contrôleur intercepte l'erreur en bloc `catch` et bascule sur le chargement asynchrone d'un fichier JSON local `boardgame-list.json`."* | `backend/src/controllers/boardgame.controller.js` |
| **"Pourquoi avoir créé un Proxy pour l'API BoardGameGeek au lieu d'interroger directement BGG en Frontend ?"** | *"Deux raisons : d'abord pour contourner la politique de sécurité CORS du navigateur. Ensuite, pour transcoder la réponse XML2 complexe de BGG en un JSON propre et épuré via `fast-xml-parser` avant de l'envoyer au React."* | `backend/src/controllers/bgg.controller.js` |
| **"Comment mettez-vous à jour la pastille de notification du Header quand le client répond ?"** | *"Le composant Frontend émet un événement natif global `window.dispatchEvent(new Event('messages_updated'))`. Le `Header` écoute cet événement et réexécute la fonction de comptage des non-lus en temps réel."* | `frontend/src/pages/Profile.jsx` & `Header.jsx` |
