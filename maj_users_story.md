# 📑 Mise à Jour des User Stories — Cicados

---

## 🔴 1. EPIC 01 — MUST HAVE (Fonctionnalités Indispensables V1)

### US-01.6 | Navigation Responsive & Changement de Langue FR / EN
Priorité : MUST 🔴 | 3 pts
En tant que Visiteur ou Membre  
Je veux naviguer sur le site via un en-tête responsive (menu burger mobile) et basculer la langue entre Français et Anglais  
Afin de consulter le site dans ma langue sur mobile ou ordinateur

Critères d'acceptation :
- Page fonctionnelle traduite via de l’API DeepL et i18n.
- Toutes les pages responsives aux formats mobile et tablette.
- Menu burger fonctionnel permettant d'accéder à toutes les rubriques sur les écrans tactiles et mobiles.

---

### US-01.7 | Consultation du Catalogue de Jeux de Société
Priorité : MUST 🔴 | 5 pts
En tant que Visiteur  
Je veux parcourir la ludothèque du bar, filtrer les jeux par catégorie (Stratégie, Ambiance, Famille) et rechercher par mot-clé  
Afin de découvrir les jeux disponibles à la réservation

Critères d'acceptation :
- Affichage responsive du catalogue sous forme de cartes d'informations (visuel, titre, catégorie, nombre de joueurs min/max, durée, badge de stock boutique).
- Barre de recherche fonctionnelle permettant de filtrer instantanément par mot-clé (titre du jeu).
- Boutons de filtres par catégorie (Stratégie, Ambiance, Famille, Tous) permettant de restreindre la liste en un clic.
- Bouton d'extension "Voir la description" pour lire le résumé complet sans quitter la page.
- Bouton "Réserver ce jeu" redirigeant vers le formulaire de réservation avec le champ de saisie du jeu pré-rempli.

---

### US-01.8 | Consultation de l'Agenda et Filtres par Jeu TCG
Priorité : MUST 🔴 | 5 pts
En tant que Joueur  
Je veux consulter le calendrier complet des tournois et animations groupés par mois et les filtrer par jeu TCG  
Afin de planifier mes sorties ludiques à l'avance

Critères d'acceptation :
- Affichage chronologique des tournois et animations organisés et groupés par mois.
- Filtres interactifs par licence / jeu TCG (Magic: The Gathering, Pokémon, Yu-Gi-Oh!, Lorcana, Tous).
- Affichage clair sur chaque carte de la date, l'heure, les frais d'inscription, la jauge de remplissage/places restantes et le statut.
- Bouton d'action adaptatif ("S'inscrire", "Déjà inscrit", "Complet") s'ajustant dynamiquement au statut du joueur et au taux de remplissage.

---

### US-01.9 | Annulation de Réservation par le Membre
Priorité : MUST 🔴 | 3 pts
En tant que Joueur connecté  
Je veux annuler une réservation de table depuis la section "Mes Activités" sur mon profil  
Afin de libérer la table pour d'autres joueurs en cas d'empêchement

Critères d'acceptation :
- Affichage de la liste des réservations actives dans l'onglet "Mes Activités" du profil utilisateur.
- Bouton "Annuler" présent sur chaque réservation à venir avec demande de confirmation préalable.
- Mise à jour du statut en base de données SQL et libération immédiate du créneau et de la table sans rechargement nécessaire.
- Notification Toast de confirmation affichée à l'utilisateur ("Réservation annulée avec succès").

---

### US-01.11 | Consultation de la Page À Propos & Agréments TCG
Priorité : MUST 🔴 | 2 pts
En tant que Visiteur  
Je veux découvrir l'histoire du café-boutique Cicados, nos espaces de jeu et nos accréditations officielles TCG 
Afin de vérifier la légitimité et l'ambiance du lieu

Critères d'acceptation :
- Présentation détaillée du concept du café-boutique, des espaces de jeu et des horaires d'ouverture.
- Section dédiée exposant les accréditations officielles des éditeurs TCG (WPN / Wizards Play Network, Pokémon Play!, Konami OTS).
- Intégration des informations pratiques d'accès (adresse à Paris, accès transports).
- Interface 100% responsive adaptée aux formats mobile, tablette et ordinateur.

---

### US-01.12 | Gestion des Membres par l'Administration
Priorité : MUST 🔴 | 5 pts
En tant qu'Administrateur  
Je veux consulter la liste des membres inscrits, modifier leurs rôles (USER / ADMIN) et supprimer les comptes obsolètes  
Afin de modérer la communauté

Critères d'acceptation :
- Tableau synthétique affichant la liste complète des comptes inscrits (nom, prénom, pseudo, email, rôle actuel).
- Sélecteur/Bouton interactif permettant de basculer dynamiquement le rôle d'un membre entre USER et ADMIN.
- Bouton "Supprimer" avec confirmation pour supprimer un compte obsolète et purger ses données associées (réservations, inscriptions).
- Accès au panneau d'administration strictement restreint aux seuls comptes possédant le rôle ADMIN.

---

### US-01.13 | Inscription et Désinscription aux Animations Gratuites
Priorité : MUST 🔴 | 3 pts
En tant que Joueur connecté  
Je veux m'inscrire aux initiations gratuites, soirées à thème et avant-premières depuis la page Événements  
Afin de réserver ma place aux animations sans frais

Critères d'acceptation :
- Identification claire des animations et initiations gratuites avec mention "Gratuit" ou tarif "0 €".
- Bouton d'inscription directe actif pour les joueurs connectés, incitant à la connexion pour les visiteurs.
- Bouton de désinscription en un clic permettant d'annuler sa participation directement depuis la carte de l'événement.
- Mise à jour instantanée du compteur de participants et de la jauge de places disponibles.

---

### US-01.14 | Visualisation de la Grille des Disponibilités de Tables
Priorité : MUST 🔴 | 5 pts
En tant que Joueur  
Je veux consulter un tableau des créneaux horaires sur la page de réservation montrant le statut des 4 tables heure par heure  
Afin d'adapter l'heure de ma réservation en fonction des tables libres

Critères d'acceptation :
- Tableau/Grille horaire dynamique montrant la disponibilité heure par heure pour les 4 tables physiques de l'établissement.
- Indicateurs de couleur explicites : Vert (disponible / ≥ 2 tables libres), Orange (1 table libre), Rouge (complet / 0 table libre).
- Désactivation automatique du clic sur les créneaux complets (rouges) ou passés.
- Actualisation automatique de la grille lors de la modification de la date sélectionnée.

---

## 🟡 2. EPIC 02 — SHOULD HAVE (Fonctionnalités Très Importantes V1)

### US-02.1 | Messagerie & Support Client Multi-Tours
Priorité : SHOULD 🟡 |  8 pts
En tant que Joueur connecté  
Je veux poser une question via une modale de contact, recevoir la réponse sur mon profil et poursuivre l'échange par un bouton "Répondre"  
Afin d'entretenir une discussion suivie avec l'équipe sans passer par email

Critères d'acceptation :
- Modale de contact accessible sur le site permettant d'envoyer un message au support.
- Historique complet des échanges (questions/réponses) consultable dans l'espace profil du membre.
- Champ de saisie avec bouton "Répondre" sous le fil de discussion pour poursuivre la conversation multi-tours.
- Badge de notification visuel (pastille rouge) signalant la réception d'une nouvelle réponse de l'équipe support.

---

### US-02.2 | Gestion des Stocks de la Boutique (+ / -)
Priorité : SHOULD 🟡 |  5 pts
En tant qu'Administrateur et Client  
Je veux voir le stock en magasin sur les cartes de jeux, et permettre au gérant d'ajuster le stock en un clic via des boutons + / - sur le dashboard  
Afin de maintenir un inventaire exact en temps réel

Critères d'acceptation :
- Affichage du niveau de stock en boutique ("En stock : X") sur les fiches de jeux côté client.
- Boutons d'incrémentation (+) et de décrémentation (-) sur chaque fiche de jeu dans le Dashboard Admin.
- Mise à jour instantanée du stock en base de données sans rechargement de page.
- Modification automatique de l'indicateur visuel (ex: affichage "Rupture de stock" si la quantité est égale à 0).

---

### US-02.3 | Importation Automatisée BGG Hot (Proxy BoardGameGeek)
Priorité : SHOULD 🟡 |   8 pts
En tant qu'Administrateur  
Je veux importer les 100 jeux les plus populaires depuis BoardGameGeek via un Proxy XML vers JSON  
Afin de fournir un catalogue riche sans saisie manuelle

Critères d'acceptation :
- Endpoint Backend Proxy consommant l'API XML2 de BoardGameGeek (BGG Hot 100) et la convertissant en JSON.
- Bouton d'action "Importer les jeux BGG Hot 100" présent sur l'interface d'administration.
- Parsing et insertion automatique en base de données SQL des métadonnées (titre, visuel, durée, joueurs min/max, catégorie).
- Notification Toast précisant le nombre de jeux importés avec succès.

---

### US-02.4 | Tolérance aux Pannes SQL & Secours JSON (Failover)
Priorité : SHOULD 🟡 |  5 pts
En tant que Système  
Je veux basculer automatiquement sur un fichier de secours JSON si la base SQL est inaccessible  
Afin de maintenir le catalogue en ligne sans interruption de service

Critères d'acceptation :
- Structure try/catch capturant les erreurs d'accès à la base MySQL dans les contrôleurs du catalogue.
- Basculement automatique (*failover*) vers le fichier JSON statique local `backend/src/data/boardgame-list.json` en cas d'indisponibilité SQL.
- Distribution des données au client garantissant que la consultation du catalogue reste fonctionnelle sans interruption.
- Journalisation serveur (*logging error*) pour alerter l'administrateur système.

---

### US-02.5 | Téléversement d'Avatars et Visuels (Multer Upload)
Priorité : SHOULD 🟡 |  5 pts
En tant qu'Utilisateur et Administrateur  
Je veux téléverser ma photo de profil ou ajouter des affiches d'événements  
Afin de personnaliser l'interface et illustrer les cartes

Critères d'acceptation :
- Middleware `multer` configuré au niveau du backend pour gérer l'upload de fichiers images (JPEG, PNG, WEBP) avec contrôle du poids et du format.
- Champ d'upload d'avatar sur le profil utilisateur et champ d'upload d'affiche d'événement sur le formulaire d'administration.
- Enregistrement des fichiers média dans le répertoire public du serveur avec un nom unique (timestamp / UUID).
- Prévisualisation instantanée de l'image sélectionnée avant la validation du formulaire.

---

### US-02.6 | Mise à Jour Optimiste Admin Sans Clignotement
Priorité : SHOULD 🟡 |  5 pts
En tant qu'Administrateur  
Je veux valider ou supprimer des éléments sur la console d'administration sans rechargement de page ni écran blanc  
Afin de travailler confortablement et rapidement

Critères d'acceptation :
- Mise à jour immédiate du state local React (*Optimistic UI*) lors des actions d'ajout, de modification ou de suppression sur la console Admin.
- Exécution asynchrone des requêtes d'API en arrière-plan sans aucun rechargement global de la page (`window.location.reload()` proscrit).
- Gestion du rollback de l'état local et message d'erreur si la requête serveur échoue.
- Rendu fluide, sans clignotement ni écran blanc.

---

### US-02.7 | Notification Pastille Rouge Fixe Admin Navbar
Priorité : SHOULD 🟡 |  3 pts
En tant qu'Administrateur  
Je veux voir une pastille rouge fixe sur le bouton Admin de la navigation lorsqu'un message client est en attente de réponse  
Afin de traiter rapidement les demandes des membres

Critères d'acceptation :
- Contrôle automatique du nombre de messages clients non lus / non traités.
- Affichage d'une pastille d'alerte rouge fixe (badge) sur le bouton "Admin" de la barre de navigation.
- Disparition de la pastille une fois toutes les demandes clients traitées.
- Affichage de la notification d'alerte réservé uniquement aux comptes administrateurs.

---

### US-02.8 | Live Preview des Affiches d'Événements Admin
Priorité : SHOULD 🟡 |  3 pts
En tant qu'Administrateur  
Je veux prévisualiser l'affiche d'un tournoi ou d'un événement en direct dans le formulaire de création  
Afin de contrôler le rendu visuel avant la publication

Critères d'acceptation :
- Composant de prévisualisation en direct (*Live Preview*) affiché en parallèle du formulaire de création/édition d'événement.
- Mise à jour dynamique de l'aperçu au fur et à mesure de la saisie (titre, jeu, date, tarif, visuel).
- Rendu identique à la carte d'événement finale affichée aux membres.

---

## 🔵 3. EPIC 03 — COULD HAVE (Fonctionnalités Optionnelles / Confort V1.5)

### US-03.1 | Paiement en Ligne des Inscriptions de Tournois (Stripe)
Priorité : COULD 🔵 |  : 8 pts
En tant que Joueur  
Je veux régler mes frais d'inscription aux tournois par carte bancaire lors de mon inscription en ligne
Afin de valider définitivement ma réservation sans passer par la caisse du magasin

Critères d'acceptation :
- Intégration du composant de paiement sécurisé Stripe Checkout / Elements lors de l'inscription à un tournoi payant.
- Validation instantanée de la transaction et confirmation de l'inscription côté serveur via Webhook Stripe.
- Affichage du statut "Inscrit et Payé" sur l'espace utilisateur.
- Annulation automatique de la réservation en cas d'échec ou d'abandon du paiement.

---

### US-03.2 | Notifications Temps Réel WebSockets (Socket.io)
Priorité : COULD 🔵 |  : 8 pts
En tant que Joueur et Administrateur  
Je veux recevoir les notifications de messages et de mises à jour de jauges instantanément sans polling
Afin d'avoir un fil d'actualités en direct

Critères d'acceptation :
- Connexion WebSocket persistante établie via Socket.io entre le client React et le serveur Express.
- Notification instantanée lors de l'envoi d'un message support ou de la modification d'une jauge de tournoi sans rafraîchissement.
- Mise à jour en direct des places restantes visibles par tous les utilisateurs connectés.

---

### US-03.3 | Filtres de Recherche Avancés par Durée et Mécanique
Priorité : COULD 🔵 |  : 3 pts
En tant que Joueur  
Je veux filtrer la ludothèque par durée exacte de partie et mécanique ludique (deckbuilding, draft, pose de tuiles)
Afin de trouver le jeu idéal pour ma soirée

Critères d'acceptation :
- Sélecteur/Curseur de plages de durée (ex: < 30 min, 30-60 min, > 90 min) sur le catalogue de jeux.
- Filtres par tags de mécaniques de jeu (Deckbuilding, Draft, Placement d'ouvriers, Pose de tuiles).
- Combinaison possible des filtres de durée, de mécanique et de recherche textuelle.

---

### US-03.4 | Export PDF du Récépissé de Réservation
Priorité : COULD 🔵 |  : 3 pts
En tant que Joueur  
Je veux télécharger un ticket PDF récapitulatif de ma réservation de table avec QR Code
Afin de le présenter rapidement à l'accueil du café-boutique

Critères d'acceptation :
- Bouton "Télécharger mon récépissé PDF" disponible sur chaque réservation validée dans l'espace membre.
- Génération dynamique d'un document PDF récapitulatif (date, heure, table, nom du jeu, QR Code de validation).
- Fichier téléchargé prêt à l'impression ou à la présentation sur smartphone à l'accueil du bar.

---

## ⚪ 4. EPIC 04 — WON'T HAVE (Fonctionnalités Hors Périmètre V1 / Futures V2)

### US-04.1 | Application Mobile Native (React Native iOS/Android)
Priorité : WON'T ⚪ |  : 13 pts
En tant que Joueur mobile  
Je veux installer l'application Cicados depuis l'App Store / Google Play
Afin d'accéder à mes réservations en un tap

Critères d'acceptation :
- [Hors périmètre V1] Application mobile native dédiée développée en React Native pour iOS et Android.
- [Hors périmètre V1] Déploiement sur l'App Store et Google Play Store avec notifications Push natives.

---

### US-04.2 | Vente en Ligne E-Commerce avec Livraison à Domicile
Priorité : WON'T ⚪ |  : 13 pts
En tant que Client distant  
Je veux acheter des boîtes de jeux de société et boosters TCG en ligne et me les faire livrer chez moi
Afin d'acheter sans me déplacer physiquement en boutique

Critères d'acceptation :
- [Hors périmètre V1] Module e-commerce complet comprenant le panier, le paiement en ligne et le calcul des frais d'expédition.
- [Hors périmètre V1] Gestion des envois de colis et suivi des livraisons depuis le Dashboard Admin.

---

### US-04.3 | Système de Ligue & Classement Elo Annuel
Priorité : WON'T ⚪ |  : 8 pts
En tant que Joueur compétitif TCG  
Je veux cumuler des points Elo lors des tournois officiels de la boutique  
Afin de consulter mon classement dans la ligue annuelle Cicados

Critères d'acceptation :
- [Hors périmètre V1] Système de calcul et de mise à jour des points Elo des joueurs à l'issue de chaque match officiellement enregistré.
- [Hors périmètre V1] Page de classement général de la ligue annuelle Cicados accessible à la communauté.

---

### US-04.4 | Programme de Fidélité & Cartes Cadeaux Scannables
Priorité : WON'T ⚪ |  : 5 pts
En tant que Client régulier  
Je veux accumuler des points de fidélité à chaque réservation ou achat et utiliser des cartes cadeaux  
Afin de bénéficier de réductions sur mes prochaines sessions

Critères d'acceptation :
- [Hors périmètre V1] Accumulation automatique de points de fidélité sur le compte utilisateur convertibles en avantages/réductions.
- [Hors périmètre V1] Gestion et scan de cartes cadeaux (virtuelles et physiques) avec QR Code au comptoir de la boutique.
