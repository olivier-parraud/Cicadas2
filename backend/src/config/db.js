// config/db.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création du pool de connexions
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cicados',
    ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {}),
    waitForConnections: true,
    connectionLimit: 10
});
// Fonction utilitaire pour les requêtes
export async function query(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}
// Test de connexion
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL connecté');

        // Vérifier si la colonne 'role' existe sur 'users'
        const [cols] = await connection.execute("SHOW COLUMNS FROM users LIKE 'role'");
        if (cols.length === 0) {
            await connection.execute("ALTER TABLE users ADD COLUMN role ENUM('USER', 'ADMIN') DEFAULT 'USER'");
            console.log("Colonne 'role' ajoutée à la table users");
        }

        // Vérifier si la colonne 'pseudo' existe sur 'users'
        const [pseudoCols] = await connection.execute("SHOW COLUMNS FROM users LIKE 'pseudo'");
        if (pseudoCols.length === 0) {
            await connection.execute("ALTER TABLE users ADD COLUMN pseudo VARCHAR(100) DEFAULT NULL");
            console.log("Colonne 'pseudo' ajoutée à la table users");
        }

        // Créer l'administrateur par défaut s'il n'existe pas
        const [adminRows] = await connection.execute("SELECT * FROM users WHERE email = 'admin@cicados.fr'");
        if (adminRows.length === 0) {
            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.default.hash('admincicados', 10);
            await connection.execute(
                "INSERT INTO users (email, password, firstname, lastname, role) VALUES ('admin@cicados.fr', ?, 'Admin', 'Cicados', 'ADMIN')",
                [hashedPassword]
            );
            console.log("Administrateur par défaut créé : admin@cicados.fr / admincicados");
        }

        // Créer la table des tournois si inexistante
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tournaments (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                game VARCHAR(100) NOT NULL,
                date DATETIME NOT NULL,
                capacity INT UNSIGNED NOT NULL,
                price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);

        // Créer la table des inscriptions aux tournois si inexistante
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tournament_registrations (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                tournament_id INT UNSIGNED NOT NULL,
                user_id INT UNSIGNED NOT NULL,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY idx_tourney_user (tournament_id, user_id)
            ) ENGINE=InnoDB;
        `);

        // Vérifier si la colonne 'specific_game' existe sur 'reservations'
        const [specificGameCols] = await connection.execute("SHOW COLUMNS FROM reservations LIKE 'specific_game'");
        if (specificGameCols.length === 0) {
            await connection.execute("ALTER TABLE reservations ADD COLUMN specific_game VARCHAR(255) DEFAULT NULL");
            console.log("Colonne 'specific_game' ajoutée à la table reservations");
        }

        // Créer la table des jeux de société si inexistante
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS board_games (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                min_players INT UNSIGNED NOT NULL,
                max_players INT UNSIGNED NOT NULL,
                play_time INT UNSIGNED NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),
                rules_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);

        // Insérer les jeux de société à partir du fichier JSON s'il y a 6 jeux ou moins (remplace les anciennes données par 50 populaires)
        const [bgRows] = await connection.execute('SELECT COUNT(*) as count FROM board_games');
        if (bgRows[0].count <= 6) {
            console.log('Seeding des jeux de société à partir de boardgame-list.json...');

            // 1. Lire le fichier JSON
            const jsonPath = path.join(__dirname, '..', 'data', 'boardgame-list.json');
            let jsonGames = [];
            try {
                const jsonContent = fs.readFileSync(jsonPath, 'utf8');
                jsonGames = JSON.parse(jsonContent);
                console.log(`Fichier boardgame-list.json chargé : ${jsonGames.length} jeux trouvés.`);
            } catch (err) {
                console.error("Impossible de lire boardgame-list.json :", err);
            }

            // 2. Définir les métadonnées pour 50 jeux populaires présents dans le JSON
            const popularGamesMetadata = {
                "7 Wonders": {
                    min_players: 3, max_players: 7, play_time: 30,
                    category: "Stratégie",
                    description: "Prenez la tête de l'une des sept grandes cités du monde antique. Développez votre production, vos bâtiments et votre armée pour triompher.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.reposproduction.com/fr/jeux/7-wonders"
                },
                "7 Wonders Duel": {
                    min_players: 2, max_players: 2, play_time: 30,
                    category: "Stratégie",
                    description: "Conçu spécifiquement pour 2 joueurs, 7 Wonders Duel reprend la profondeur de son aîné pour un affrontement tactique direct et impitoyable.",
                    image_url: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?q=80&w=600",
                    rules_url: "https://www.reposproduction.com/fr/jeux/7-wonders-duel"
                },
                "Aeon's End": {
                    min_players: 1, max_players: 4, play_time: 60,
                    category: "Stratégie",
                    description: "Un jeu de deckbuilding coopératif où vous défendez Gravehold contre des vagues de monstres terrifiants, sans jamais mélanger votre défausse.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.matagot.com/"
                },
                "Android: Netrunner": {
                    min_players: 2, max_players: 2, play_time: 45,
                    category: "Stratégie",
                    description: "Un jeu de cartes asymétrique légendaire opposant une mégacorporation à un hacker (runner) prêt à tout pour voler ses données.",
                    image_url: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=600",
                    rules_url: "https://nullsignal.games/"
                },
                "Arkham Horror: The Card Game": {
                    min_players: 1, max_players: 4, play_time: 60,
                    category: "Stratégie",
                    description: "Menez l'enquête sur des phénomènes paranormaux inspirés des récits de H.P. Lovecraft dans ce jeu de cartes évolutif coopératif intense.",
                    image_url: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=600",
                    rules_url: "https://www.fantasyflightgames.com/"
                },
                "Azul": {
                    min_players: 2, max_players: 4, play_time: 45,
                    category: "Abstrait",
                    description: "Recrutez des artisans pour embellir les murs du Palais Royal d'Évora en posant des tuiles de mosaïques colorées de toute beauté.",
                    image_url: "/images/boardgames/azul.png",
                    rules_url: "https://www.planbgames.com/"
                },
                "Azul: Stained Glass of Sintra": {
                    min_players: 2, max_players: 4, play_time: 45,
                    category: "Abstrait",
                    description: "Assemblez de magnifiques vitraux pour la chapelle royale de Sintra dans cette déclinaison tactique et colorée de la série Azul.",
                    image_url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600",
                    rules_url: "https://www.planbgames.com/"
                },
                "Battlestar Galactica: The Board Game": {
                    min_players: 3, max_players: 6, play_time: 180,
                    category: "Stratégie",
                    description: "Menez le vaisseau Galactica vers la Terre tout en débusquant les Cylons infiltrés parmi les joueurs dans ce jeu de suspicion culte.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.fantasyflightgames.com/"
                },
                "Betrayal at Baldur's Gate": {
                    min_players: 3, max_players: 6, play_time: 60,
                    category: "Ambiance",
                    description: "Explorez les catacombes et les rues de Baldur's Gate jusqu'à ce qu'un membre du groupe succombe à la folie et trahisse ses compagnons.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://hasbro.com/"
                },
                "Betrayal at House on the Hill": {
                    min_players: 3, max_players: 6, play_time: 60,
                    category: "Ambiance",
                    description: "Explorez un manoir hanté jusqu'au déclenchement de la hantise, où l'un des explorateurs se retourne contre les autres selon 50 scénarios.",
                    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
                    rules_url: "https://hasbro.com/"
                },
                "Betrayal Legacy": {
                    min_players: 3, max_players: 5, play_time: 75,
                    category: "Ambiance",
                    description: "Vivez l'histoire d'une demeure hantée sur plusieurs générations dans cette campagne legacy épique et terrifiante.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://hasbro.com/"
                },
                "Brass: Birmingham": {
                    min_players: 2, max_players: 4, play_time: 120,
                    category: "Stratégie",
                    description: "Développez votre empire industriel en construisant des mines de charbon, des filatures et des brasseries lors de la révolution industrielle.",
                    image_url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600",
                    rules_url: "https://roxley.com/"
                },
                "Bunny Kingdom": {
                    min_players: 2, max_players: 4, play_time: 45,
                    category: "Stratégie",
                    description: "Envoyez vos seigneurs lapins conquérir les meilleures parcelles du Nouveau Monde pour y cultiver des ressources et bâtir des cités.",
                    image_url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600",
                    rules_url: "https://www.iello.fr/"
                },
                "Carcassonne Big Box 6": {
                    min_players: 2, max_players: 6, play_time: 45,
                    category: "Pose de tuiles",
                    description: "Le grand classique de pose de tuiles médiéval, regroupant le jeu de base et pas moins de 11 extensions pour des heures de jeu variées.",
                    image_url: "/images/boardgames/carcassonne.png",
                    rules_url: "https://www.zmangames.com/"
                },
                "The Castles of Burgundy": {
                    min_players: 2, max_players: 4, play_time: 90,
                    category: "Stratégie",
                    description: "Lancez les dés pour acquérir et placer des tuiles dans votre domaine de la vallée de la Loire afin de maximiser vos points de victoire.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.ravensburger.org/"
                },
                "Citadels": {
                    min_players: 2, max_players: 8, play_time: 60,
                    category: "Stratégie",
                    description: "Bâtissez la plus prestigieuse cité médiévale en sélectionnant habilement des personnages (assassin, voleur, condottiere...) à chaque tour.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.asmodee.fr/"
                },
                "Codenames": {
                    min_players: 2, max_players: 8, play_time: 15,
                    category: "Ambiance",
                    description: "Trouvez le bon mot-indice pour faire deviner tous vos noms de code d'agents secrets avant l'équipe adverse en évitant l'assassin.",
                    image_url: "/images/boardgames/codenames.png",
                    rules_url: "https://czechgames.com/"
                },
                "Codenames: Duet": {
                    min_players: 2, max_players: 2, play_time: 15,
                    category: "Ambiance",
                    description: "Une version entièrement coopérative du célèbre Codenames, spécialement optimisée pour un jeu d'équipe à deux joueurs.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://czechgames.com/"
                },
                "Coup": {
                    min_players: 2, max_players: 6, play_time: 15,
                    category: "Ambiance",
                    description: "Bluffez, corrompez et manipulez vos adversaires. Démasquez leurs mensonges pour éliminer leur influence politique et régner en maître.",
                    image_url: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=600",
                    rules_url: "https://www.indieboardsandcards.com/"
                },
                "Dead of Winter: A Crossroads Game": {
                    min_players: 2, max_players: 5, play_time: 120,
                    category: "Stratégie",
                    description: "Tentez de survivre dans une colonie humaine en plein hiver post-apocalyptique rempli de zombies, mais gare au traître potentiel !",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.plaidhatgames.com/"
                },
                "Deep Sea Adventure": {
                    min_players: 2, max_players: 6, play_time: 30,
                    category: "Ambiance",
                    description: "Plongez pour remonter des trésors enfouis, mais attention : tous les plongeurs partagent la même bouteille d'oxygène qui se vide rapidement !",
                    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600",
                    rules_url: "https://oinkgames.com/"
                },
                "Detective: A Modern Crime Board Game": {
                    min_players: 1, max_players: 5, play_time: 120,
                    category: "Stratégie",
                    description: "Résolvez des enquêtes complexes en utilisant le matériel de jeu, Internet et une base de données en ligne de la police.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://portalgames.pl/"
                },
                "Dinosaur Island": {
                    min_players: 1, max_players: 4, play_time: 90,
                    category: "Stratégie",
                    description: "Récoltez de l'ADN, créez des dinosaures et gérez le parc d'attractions le plus excitant et le plus sécurisé (ou pas...) de l'île.",
                    image_url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600",
                    rules_url: "https://pandasaurusgames.com/"
                },
                "Disney Villainous: The Worst Takes it All": {
                    min_players: 2, max_players: 6, play_time: 50,
                    category: "Famille",
                    description: "Incarnez un méchant emblématique de Disney et utilisez votre deck asymétrique pour accomplir votre dessein maléfique avant vos rivaux.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.ravensburger.fr/"
                },
                "Dominion (Second Edition)": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "Le précurseur légendaire du deckbuilding. Combinez vos cartes d'action et d'achat pour constituer le plus riche domaine féodal.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Alchemy": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "Une extension introduisant la ressource 'Potion' pour acquérir des cartes de magie et de transmutation alchimique.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Dark Ages": {
                    min_players: 2, max_players: 4, play_time: 45,
                    category: "Stratégie",
                    description: "Une extension axée sur le recyclage, le bannissement de cartes et la gestion de la dévastation économique.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Empires": {
                    min_players: 2, max_players: 4, play_time: 45,
                    category: "Stratégie",
                    description: "Ajoutez des cartes d'événements, des monuments et des dettes à rembourser pour étendre l'influence de votre empire.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Intrigue (Second Edition)": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "Cette extension apporte des choix multiples sur les cartes et une interaction plus directe entre les joueurs.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Prosperity": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "La richesse à son apogée. Introduit des cartes de valeur supérieure, des colonies et des jetons de prospérité.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Dominion: Seaside": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "Prenez le large ! Cette extension propose des cartes de durée qui restent en jeu pour influencer votre prochain tour.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.riograndegames.com/"
                },
                "Evolution": {
                    min_players: 2, max_players: 6, play_time: 60,
                    category: "Stratégie",
                    description: "Adaptez vos espèces animales à un écosystème en constante mutation pour éviter la famine et les prédateurs carnivores.",
                    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
                    rules_url: "https://www.northstargames.com/"
                },
                "Exit: The Game – The Secret Lab": {
                    min_players: 1, max_players: 4, play_time: 90,
                    category: "Ambiance",
                    description: "Résolvez des énigmes scientifiques complexes pour vous évader d'un laboratoire secret avant qu'il ne soit trop tard.",
                    image_url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600",
                    rules_url: "https://www.iello.fr/"
                },
                "Fallout": {
                    min_players: 1, max_players: 4, play_time: 150,
                    category: "Stratégie",
                    description: "Explorez les Terres Désolées post-apocalyptiques, combattez des goules et accomplissez des quêtes de faction.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.fantasyflightgames.com/"
                },
                "Hanabi": {
                    min_players: 2, max_players: 5, play_time: 25,
                    category: "Ambiance",
                    description: "Un jeu coopératif hors du commun où vous tenez vos cartes à l'envers et devez guider vos équipiers pour lancer un feu d'artifice parfait.",
                    image_url: "https://images.unsplash.com/photo-1533230832482-0c7bb0cd2c4b?q=80&w=600",
                    rules_url: "https://cocktailgames.com/"
                },
                "Kingdomino": {
                    min_players: 2, max_players: 4, play_time: 15,
                    category: "Famille",
                    description: "Développez votre domaine royal à l'aide de dominos paysages de forêt, de prairie et de lac. Un jeu familial fluide et malin.",
                    image_url: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=600",
                    rules_url: "https://blueorangegames.eu/"
                },
                "Lords of Waterdeep": {
                    min_players: 2, max_players: 5, play_time: 75,
                    category: "Stratégie",
                    description: "Incarnez un souverain secret de la cité d'Eauprofonde (Waterdeep) et recrutez des aventuriers pour accomplir des quêtes héroïques.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://dnd.wizards.com/"
                },
                "Love Letter": {
                    min_players: 2, max_players: 4, play_time: 20,
                    category: "Ambiance",
                    description: "Utilisez la déduction et le bluff pour éliminer vos rivaux et transmettre vos lettres d'amour à la Princesse.",
                    image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600",
                    rules_url: "https://www.asmodee.fr/"
                },
                "Machi Koro": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Famille",
                    description: "Lancez les dés, collectez des revenus et achetez des commerces pour transformer votre modeste village en métropole florissante (Minivilles).",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.iello.fr/"
                },
                "Machi Koro 2": {
                    min_players: 2, max_players: 5, play_time: 30,
                    category: "Famille",
                    description: "Minivilles 2 réinvente l'expérience originale avec de nouveaux bâtiments et un mode de draft de départ ultra dynamique.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.iello.fr/"
                },
                "Patchwork": {
                    min_players: 2, max_players: 2, play_time: 30,
                    category: "Abstrait",
                    description: "Rassemblez les meilleurs morceaux de tissus pour confectionner la plus belle couverture de patchwork dans ce duel d'une grande finesse.",
                    image_url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600",
                    rules_url: "https://www.lookout-games.de/"
                },
                "Sherlock Holmes Consulting Detective": {
                    min_players: 1, max_players: 8, play_time: 120,
                    category: "Stratégie",
                    description: "Enquêtez sur des affaires criminelles aux côtés du plus célèbre détective grâce à un annuaire de Londres, des journaux et un livret de cas.",
                    image_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
                    rules_url: "https://spacecowboys.fr/"
                },
                "Splendor": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Stratégie",
                    description: "Achetez des mines, des caravanes et engagez des artisans pour attirer les faveurs des nobles avec vos gemmes.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.spacecowboys.fr/"
                },
                "Splendor Duel": {
                    min_players: 2, max_players: 2, play_time: 30,
                    category: "Stratégie",
                    description: "Le duel tactique ultime dérivé de Splendor, incluant de nouvelles conditions de victoire et un plateau de gemmes commun interactif.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.spacecowboys.fr/"
                },
                "Ticket to Ride": {
                    min_players: 2, max_players: 5, play_time: 60,
                    category: "Famille",
                    description: "Reliez les villes américaines en collectant des cartes wagons. Un classique incontournable des jeux de plateau familiaux (Les Aventuriers du Rail).",
                    image_url: "/images/boardgames/ticket_to_ride.png",
                    rules_url: "https://www.daysofwonder.com/"
                },
                "Ticket to Ride: Europe": {
                    min_players: 2, max_players: 5, play_time: 60,
                    category: "Famille",
                    description: "Parcourez l'Europe du début du XXe siècle, de Paris à Constantinople, en traversant des tunnels et en posant des gares stratégiques.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.daysofwonder.com/"
                },
                "Ticket to Ride: London": {
                    min_players: 2, max_players: 4, play_time: 15,
                    category: "Famille",
                    description: "Une version rapide et urbaine de Ticket to Ride située dans le Londres trépidant des années 70.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.daysofwonder.com/"
                },
                "Ticket to Ride: New York": {
                    min_players: 2, max_players: 4, play_time: 15,
                    category: "Famille",
                    description: "Parcourez les rues de Manhattan à bord de taxis jaunes des années 60 dans ce format express trépidant.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.daysofwonder.com/"
                },
                "Ticket to Ride: Nordic Countries": {
                    min_players: 2, max_players: 3, play_time: 45,
                    category: "Famille",
                    description: "Voyagez à travers le Danemark, la Finlande, la Norvège et la Suède. Conçu spécialement pour 2 ou 3 joueurs.",
                    image_url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600",
                    rules_url: "https://www.daysofwonder.com/"
                },
                "Cat Lady": {
                    min_players: 2, max_players: 4, play_time: 30,
                    category: "Famille",
                    description: "Incarnez une dame aux chats passionnée, collectez des jouets, de la nourriture et adoptez un maximum de félins pour marquer des points.",
                    image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600",
                    rules_url: "https://www.alderac.com/cat-lady/"
                }
            };

            // 3. Vider la table pour remplacer l'ancienne liste
            await connection.execute('DELETE FROM board_games');
            console.log('Anciennes données des jeux nettoyées.');

            // 4. Parcourir la liste JSON et n'insérer que les jeux populaires qui y sont présents (limité à 50)
            const jsonGameNames = new Set(jsonGames.map(g => g.name.trim().toLowerCase()));

            let insertedCount = 0;
            for (const [name, meta] of Object.entries(popularGamesMetadata)) {
                // Vérifier si le nom existe dans le fichier JSON
                if (jsonGameNames.has(name.trim().toLowerCase())) {
                    await connection.execute(
                        'INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            name,
                            meta.min_players,
                            meta.max_players,
                            meta.play_time,
                            meta.category,
                            meta.description,
                            meta.image_url,
                            meta.rules_url
                        ]
                    );
                    insertedCount++;
                    if (insertedCount >= 50) break; // Limite à 50 max
                }
            }

            console.log(`${insertedCount} jeux populaires issus du fichier JSON insérés avec succès.`);
        }


        // Insérer les tournois par défaut s'il n'y en a pas
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM tournaments');
        if (rows[0].count === 0) {
            const defaultTournaments = [
                ['Friday Night Magic - Modern', 'Magic: The Gathering', '2026-07-03 19:30:00', 16, 5.00, 'Rejoignez-nous pour le traditionnel FNM hebdomadaire ! Format Modern, 3 rondes suisses. Boosters promo pour le top 4.'],
                ['Draft MTG : Horizons Modern 3', 'Magic: The Gathering', '2026-07-04 14:00:00', 24, 15.00, 'Draft compétitif Horizons Modern 3. 3 boosters par joueur fournis pour le draft + dotations.'],
                ['Pokémon TCG Cup : Standard', 'Pokémon TCG', '2026-07-05 10:00:00', 32, 7.50, 'Tournoi officiel Pokémon League Cup. Format Standard. Pensez à apporter votre Decklist imprimée.'],
                ['Disney Lorcana : Premier Chapitre', 'Disney Lorcana', '2026-07-08 19:00:00', 16, 6.00, 'Soirée tournoi construite Lorcana. Idéal pour tester vos decks dans une ambiance conviviale. Promos de participation pour tous.']
            ];
            for (const t of defaultTournaments) {
                await connection.execute(
                    'INSERT INTO tournaments (name, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
                    t
                );
            }
            console.log('Tournois par défaut insérés');
        }

        connection.release();
        return true;
    } catch (error) {
        console.error('Erreur MySQL:', error);
        return false;
    }
}
export default pool;