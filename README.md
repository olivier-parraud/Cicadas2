# 🎲 CICADOS — Café-Boutique de Jeux de Société & TCG

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8_MAMP-orange?logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![DWWM](https://img.shields.io/badge/Titre_Professionnel-DWWM_2026-gold)](https://www.francecompetences.fr/)

**Cicados** est une plateforme web fullstack sur mesure conçue pour un établissement hybride (café, boutique de jeux et salle de duels TCG à Paris). Elle permet la réservation de tables de jeux en ligne sans surbooking, la gestion et l'inscription aux tournois officiels, le suivi des stocks boutique en temps réel ainsi qu'un système de messagerie support client réactif.

---

## 📑 Sommaire
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🏗️ Architecture Technique](#️-architecture-technique)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Démarrage Rapide & Installation](#-démarrage-rapide--installation)
- [📡 Endpoints API REST principaux](#-endpoints-api-rest-principaux)
- [📚 Documents & Révisions DWWM](#-documents--révisions-dwwm)

---

## ✨ Fonctionnalités Principales

### 👥 Côté Membre & Visiteur
* **Réservation de Tables de Jeu** : Grille horaire interactive en temps réel empêchant tout surbooking (capacité max de 4 tables physiques).
* **Agenda des Tournois & Événements** : Inscription/désinscription en 1 clic aux tournois TCG (Magic, Pokémon, Lorcana, Yu-Gi-Oh!, Riftbound) et avant-premières avec visualisation de la liste des inscrits.
* **Catalogue de Jeux & Stocks** : Consultation de la ludothèque avec recherche, filtres par catégorie/nombre de joueurs et badges de stock boutique en direct.
* **Messagerie & Support Client Multi-Tours** : Formulaire de contact modale, notification visuelle par badge rouge sur l'avatar du header, consultation de l'historique et possibilité de répondre directement depuis son profil membre (`Profile.jsx`).
* **Page À Propos** : Présentation du concept, agréments officiels d'éditeurs TCG (WPN, Play!, OTS), horaires d'ouverture et adresse à Paris.

### 🛡️ Côté Administration (`/admin`)
* **Dashboard Centralisé à 6 Onglets** :
  1. *Réservations* : Visualisation et annulation des réservations clients.
  2. *Tournois & Événements* : Création, modification, prévisualisation en temps réel (*Live Preview*) et gestion des participants.
  3. *Boutique & Jeux* : Ajout de jeux, upload de visuels (Multer) et ajustement instantané du stock boutique via des boutons `+ / -`.
  4. *Importation BGG* : Importation automatisée en un clic des 100 jeux les plus populaires depuis l'API XML2 BoardGameGeek.
  5. *Messagerie Support* : Consultation des questions clients, filtres non lus et formulaire de réponse rapide avec notification de l'utilisateur.
  6. *Utilisateurs* : Gestion des comptes et rôles (`CLIENT` / `ADMIN`).

---

## 🏗️ Architecture Technique

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

---

## 🛠️ Stack Technique

* **Frontend** : React 18, Vite 7, Tailwind CSS, Lucide React, React Router DOM v6, i18next, React Hot Toast.
* **Backend** : Node.js, Express.js (Architecture MVC), JWT (`jsonwebtoken`), `bcrypt`, `multer` (Upload de fichiers), `fast-xml-parser` (Proxy BGG API XML2).
* **Base de données** : MySQL 8 (MAMP) avec le driver `mysql2/promise` (Pool de connexions).
* **Tests Automatisés** : Puppeteer (Chrome Headless end-to-end testing).

---

## 🚀 Démarrage Rapide & Installation

### 1. Prérequis
- **Node.js** (v18+)
- **MAMP** ou serveur MySQL actif sur le port `8889` (ou `3306`)

### 2. Cloner et configurer
```bash
git clone https://github.com/votre-compte/cicados.git
cd cicados
```

### 3. Base de données MySQL
Importez le fichier `backend/schema.sql` dans votre serveur MySQL pour créer la base `cicados` et ses 8 tables relationnelles.

### 4. Lancer le Backend
```bash
cd backend
npm install
npm run dev
```
*Le serveur API REST démarre sur **http://localhost:5050**.*

### 5. Lancer le Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*L'application React démarre sur **http://localhost:5173**.*

---

## 📡 Endpoints API REST principaux

| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/auth/register` | Inscription d'un nouveau compte | Public |
| `POST` | `/api/auth/login` | Connexion & génération du token JWT | Public |
| `GET` | `/api/reservations` | Planning et disponibilités des tables | Privé (Membre) |
| `POST` | `/api/reservations` | Réservation d'une table (Anti-surbooking) | Privé (Membre) |
| `POST` | `/api/messages` | Envoi d'un message support aux admins | Privé (Membre) |
| `POST` | `/api/messages/:id/user-reply` | Relance d'une conversation par le membre | Privé (Membre) |
| `GET` | `/api/messages/admin` | Récupération de tous les messages support | Admin |
| `POST` | `/api/messages/admin/:id/reply` | Réponse admin à un message membre | Admin |
| `PATCH` | `/api/admin/boardgames/:id/stock` | Modification rapide du stock boutique | Admin |
| `POST` | `/api/admin/boardgames/import-hot` | Importation massive BGG Hot | Admin |

---

## 📚 Documents & Révisions DWWM

* 📘 **Dossier de Projet Professionnel** : [Dossier_de_Projet_Cicados.md](file:///Applications/MAMP/htdocs/Cicadas2/Dossier_de_Projet_Cicados.md)
* 🧠 **Fiches de Révision pour la Soutenance Oral** : [FICHES_REVISION.md](file:///Applications/MAMP/htdocs/Cicadas2/FICHES_REVISION.md)

---

© 2026 **Cicados** — Développé par **PARRAUD Olivier** dans le cadre du Titre Professionnel DWWM.
