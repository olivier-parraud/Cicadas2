// seed-data.js — Seed tournaments, events (drafts), test users, and reservations for all games
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cicados',
    ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {}),
});

async function seed() {
    const conn = await pool.getConnection();
    try {
        console.log('🔗 Connecté à MySQL. Début du seeding...\n');

        // ─── 1. Supprimer les anciennes données (dans l'ordre des contraintes de clés étrangères) ───
        await conn.execute('DELETE FROM event_registrations');
        await conn.execute('DELETE FROM tournament_registrations');
        await conn.execute('DELETE FROM reservations');
        await conn.execute('DELETE FROM events');
        await conn.execute('DELETE FROM tournaments');
        await conn.execute('DELETE FROM rooms');
        await conn.execute("DELETE FROM users WHERE email LIKE 'testuser%@cicados.fr'");
        console.log('🗑️  Anciennes données de test nettoyées.');

        // ─── 1.5 Création de 4 Tables de Jeu (Rooms) ───
        const defaultRooms = [
            ['Table 1', 4, 'Table standard équipée avec Playmats TCG.'],
            ['Table 2', 4, 'Table standard équipée avec Playmats TCG.'],
            ['Table 3', 8, 'Table géante Commander / Drafts / Grands jeux de plateau.'],
            ['Table 4', 6, 'Espace Lounge confortable en mezzanine.']
        ];
        for (const r of defaultRooms) {
            await conn.execute(
                'INSERT INTO rooms (name, capacity, description) VALUES (?, ?, ?)',
                r
            );
        }
        console.log('✅ 4 tables de jeu (salles) insérées.');

        // ─── 2. Création de 5 Utilisateurs de Test ───
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.default.hash('testpassword', 10);
        const testUsers = [
            ['testuser1@cicados.fr', hashedPassword, 'Pierre', 'Martin', 'Pierrot'],
            ['testuser2@cicados.fr', hashedPassword, 'Sophie', 'Dubois', 'Soph'],
            ['testuser3@cicados.fr', hashedPassword, 'Thomas', 'Bernard', 'TomTee'],
            ['testuser4@cicados.fr', hashedPassword, 'Julie', 'Moreau', 'Juju'],
            ['testuser5@cicados.fr', hashedPassword, 'Nicolas', 'Petit', 'Nico']
        ];
        const userIds = [];
        for (const u of testUsers) {
            const [res] = await conn.execute(
                'INSERT INTO users (email, password, firstname, lastname, pseudo) VALUES (?, ?, ?, ?, ?)',
                u
            );
            userIds.push(res.insertId);
        }
        console.log(`✅ 5 utilisateurs de test insérés :`);
        testUsers.forEach((u, i) => console.log(`   - ${u[2]} ${u[3]} (${u[0]})`));

        // ─── 3. Tournois pour tous les jeux ───
        const tournaments = [
            ['Friday Night Magic - Modern',       'Magic: The Gathering',           '2026-07-24 19:30:00', 16, 5.00,  'Rejoignez-nous pour le traditionnel FNM hebdomadaire ! Format Modern, 3 rondes suisses. Boosters promo pour le top 4.'],
            ['Pokémon TCG Cup : Standard',         'Pokémon TCG',                    '2026-07-25 10:00:00', 32, 7.50,  'Tournoi officiel Pokémon League Cup. Format Standard. Pensez à apporter votre Decklist imprimée.'],
            ['One Piece Card Game - OP Championship', 'One Piece Card Game',         '2026-07-26 14:00:00', 24, 8.00,  'Tournoi construit One Piece Card Game. Format standard OP-09. Dotations officielles Bandai.'],
            ['Yu-Gi-Oh! Local - Advanced',         'Yu-Gi-Oh!',                      '2026-07-27 18:00:00', 32, 5.00,  'Tournoi local Yu-Gi-Oh format Advanced. 4 rondes suisses + Top 8. OTS Packs en dotation.'],
            ['Lorcana Challenge : Shimmering Skies', 'Disney Lorcana',              '2026-07-28 19:00:00', 16, 6.00,  'Tournoi construite Lorcana. Promos de participation pour tous les joueurs.'],
            ['Star Wars Unlimited - Premier',      'Star Wars Unlimited',            '2026-07-29 14:30:00', 16, 7.00,  'Tournoi construit Star Wars Unlimited. Format Premier. Promos Alt-Art pour le Top 4.'],
            ['Final Fantasy TCG - Crystal Cup',    'Final Fantasy TCG',              '2026-07-30 14:00:00', 16, 6.00,  'Crystal Cup locale Final Fantasy TCG. Format L7, toutes les cartes Opus I à XIV autorisées.'],
            ['Altered TCG - Tournoi Découverte',   'Altered TCG',                    '2026-07-31 15:00:00', 16, 5.00,  'Premier tournoi Altered TCG au shop ! Venez découvrir le nouveau jeu de cartes physique-digital.'],
            ['Dragon Ball Super CG - Regionals Qualifier', 'Dragon Ball Super Card Game', '2026-08-01 10:00:00', 32, 10.00, 'Qualificatif régional Dragon Ball Super Card Game. Format construit. Tapis de jeu exclusif pour le Top 8.'],
        ];

        const tournamentIds = [];
        for (const t of tournaments) {
            const [res] = await conn.execute(
                'INSERT INTO tournaments (name, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
                t
            );
            tournamentIds.push(res.insertId);
        }
        console.log(`✅ ${tournaments.length} tournois insérés.`);

        // ─── 4. Événements (Drafts / Initiations) pour tous les jeux ───
        const events = [
            ['Draft MTG : Horizons Modern 3',          'draft', 'Magic: The Gathering',           '2026-07-24 14:00:00', 24, 15.00, 'Draft compétitif Horizons Modern 3. 3 boosters par joueur fournis + dotations.'],
            ['Draft Pokémon : Faille Paradoxe',        'draft', 'Pokémon TCG',                    '2026-07-25 14:30:00', 16, 12.00, 'Soirée Draft Pokémon TCG avec des boosters Faille Paradoxe. Découvrez le format limité !'],
            ['Draft One Piece : OP-09',                'draft', 'One Piece Card Game',            '2026-07-26 18:00:00', 16, 12.00, 'Draft One Piece Card Game avec 6 boosters OP-09 par joueur. Format sealed.'],
            ['Draft Yu-Gi-Oh! : Battle Pack 3',        'draft', 'Yu-Gi-Oh!',                      '2026-07-27 14:00:00', 16, 10.00, 'Soirée Draft Yu-Gi-Oh avec Battle Pack 3. Construisez votre deck à partir de boosters !'],
            ['Draft Lorcana : Ciel Scintillant',       'draft', 'Disney Lorcana',                 '2026-07-28 14:00:00', 12, 15.00, 'Draft Lorcana avec 6 boosters Ciel Scintillant par joueur. Idéal pour les collectionneurs.'],
            ['Draft Star Wars Unlimited : Ombres',     'draft', 'Star Wars Unlimited',            '2026-07-29 18:30:00', 12, 14.00, 'Draft Star Wars Unlimited extension Ombres de la Galaxie. 6 boosters fournis.'],
            ['Draft Final Fantasy TCG : Opus XV',      'draft', 'Final Fantasy TCG',              '2026-07-30 18:00:00', 12, 13.00, 'Draft Final Fantasy TCG avec 6 boosters Opus XV par joueur.'],
            ['Initiation Altered TCG',                 'initiation', 'Altered TCG',               '2026-07-31 11:00:00', 20, 0.00,  'Séance découverte gratuite du jeu Altered TCG. Decks de prêt fournis par le magasin.'],
            ['Draft Dragon Ball Super CG',             'draft', 'Dragon Ball Super Card Game',    '2026-08-01 14:00:00', 16, 12.00, 'Draft Dragon Ball Super Card Game avec des boosters de la dernière extension.'],
            ['Avant-Première MTG : Bloomburrow',       'avant_premiere', 'Magic: The Gathering',  '2026-08-05 12:00:00', 32, 25.00, 'Avant-Première Bloomburrow ! Recevez votre kit de pré-release et découvrez la nouvelle extension en avant-première.'],
        ];

        const eventIds = [];
        for (const e of events) {
            const [res] = await conn.execute(
                'INSERT INTO events (name, type, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                e
            );
            eventIds.push(res.insertId);
        }
        console.log(`✅ ${events.length} événements insérés.`);

        // ─── 5. Inscriptions aux Tournois pour les 5 utilisateurs ───
        const tournamentRegistrations = [
            // User 1
            [tournamentIds[0], userIds[0]], // Pierre -> MTG
            [tournamentIds[1], userIds[0]], // Pierre -> Pokemon
            [tournamentIds[2], userIds[0]], // Pierre -> One Piece
            // User 2
            [tournamentIds[3], userIds[1]], // Sophie -> YuGiOh
            [tournamentIds[4], userIds[1]], // Sophie -> Lorcana
            [tournamentIds[5], userIds[1]], // Sophie -> Star Wars
            // User 3
            [tournamentIds[6], userIds[2]], // Thomas -> Final Fantasy
            [tournamentIds[7], userIds[2]], // Thomas -> Altered
            [tournamentIds[8], userIds[2]], // Thomas -> Dragon Ball
            // User 4
            [tournamentIds[0], userIds[3]], // Julie -> MTG
            [tournamentIds[4], userIds[3]], // Julie -> Lorcana
            [tournamentIds[7], userIds[3]], // Julie -> Altered
            // User 5
            [tournamentIds[1], userIds[4]], // Nicolas -> Pokemon
            [tournamentIds[5], userIds[4]], // Nicolas -> Star Wars
            [tournamentIds[8], userIds[4]], // Nicolas -> Dragon Ball
        ];

        for (const tr of tournamentRegistrations) {
            await conn.execute(
                'INSERT INTO tournament_registrations (tournament_id, user_id) VALUES (?, ?)',
                tr
            );
        }
        console.log(`✅ Inscriptions aux tournois générées.`);

        // ─── 6. Inscriptions aux Événements pour les 5 utilisateurs ───
        const eventRegistrations = [
            // User 1
            [eventIds[0], userIds[0]], // Pierre -> Draft MTG
            [eventIds[1], userIds[0]], // Pierre -> Draft Pokemon
            [eventIds[2], userIds[0]], // Pierre -> Draft One Piece
            // User 2
            [eventIds[3], userIds[1]], // Sophie -> Draft YuGiOh
            [eventIds[4], userIds[1]], // Sophie -> Draft Lorcana
            [eventIds[5], userIds[1]], // Sophie -> Draft Star Wars
            // User 3
            [eventIds[6], userIds[2]], // Thomas -> Draft Final Fantasy
            [eventIds[7], userIds[2]], // Thomas -> Initiation Altered
            [eventIds[8], userIds[2]], // Thomas -> Draft Dragon Ball
            // User 4
            [eventIds[0], userIds[3]], // Julie -> Draft MTG
            [eventIds[7], userIds[3]], // Julie -> Initiation Altered
            [eventIds[9], userIds[3]], // Julie -> AP MTG
            // User 5
            [eventIds[1], userIds[4]], // Nicolas -> Draft Pokemon
            [eventIds[8], userIds[4]], // Nicolas -> Draft Dragon Ball
            [eventIds[9], userIds[4]], // Nicolas -> AP MTG
        ];

        for (const er of eventRegistrations) {
            await conn.execute(
                'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)',
                er
            );
        }
        console.log(`✅ Inscriptions aux événements générées.`);

        // ─── 7. Réservations de Tables pour tous les types de jeux ───
        const [rooms] = await conn.execute('SELECT id FROM rooms');
        if (rooms.length < 4) {
            console.log('⚠️  Pas assez de tables en base (< 4), réservations de tables ignorées.');
        } else {
            const reservationList = [
                // User 1 (Pierre)
                { userId: userIds[0], gameType: 'MTG', gameName: 'Magic: The Gathering', date: '2026-07-24', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[0], gameType: 'POKEMON', gameName: 'Pokémon TCG', date: '2026-07-25', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[0], gameType: 'BOARD_GAME', gameName: 'Azul', date: '2026-07-26', time: '18:00', roomOffset: 2, players: 3 },
                // User 2 (Sophie)
                { userId: userIds[1], gameType: 'ONE_PIECE', gameName: 'One Piece Card Game', date: '2026-07-24', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[1], gameType: 'YUGIOH', gameName: 'Yu-Gi-Oh!', date: '2026-07-25', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[1], gameType: 'BYOG', gameName: "J'apporte mon jeu", date: '2026-07-27', time: '14:00', roomOffset: 0, players: 4 },
                // User 3 (Thomas)
                { userId: userIds[2], gameType: 'LORCANA', gameName: 'Disney Lorcana', date: '2026-07-25', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[2], gameType: 'STAR_WARS', gameName: 'Star Wars Unlimited', date: '2026-07-26', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[2], gameType: 'BOARD_GAME', gameName: 'Codenames', date: '2026-07-28', time: '18:00', roomOffset: 2, players: 6 },
                // User 4 (Julie)
                { userId: userIds[3], gameType: 'FINAL_FF', gameName: 'Final Fantasy TCG', date: '2026-07-26', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[3], gameType: 'ALTERED', gameName: 'Altered TCG', date: '2026-07-27', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[3], gameType: 'BOARD_GAME', gameName: '7 Wonders', date: '2026-07-29', time: '18:00', roomOffset: 2, players: 4 },
                // User 5 (Nicolas)
                { userId: userIds[4], gameType: 'DBS', gameName: 'Dragon Ball Super Card Game', date: '2026-07-27', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[4], gameType: 'BOARD_GAME', gameName: 'Carcassonne Big Box 6', date: '2026-07-28', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[4], gameType: 'MTG', gameName: 'Magic: The Gathering', date: '2026-07-29', time: '16:00', roomOffset: 1, players: 2 },
            ];

            for (const res of reservationList) {
                const startTime = `${res.date} ${res.time}:00`;
                const startObj = new Date(startTime);
                startObj.setHours(startObj.getHours() + 2);
                
                const endYear = startObj.getFullYear();
                const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
                const endDay = String(startObj.getDate()).padStart(2, '0');
                const endHour = String(startObj.getHours()).padStart(2, '0');
                const endMin = String(startObj.getMinutes()).padStart(2, '0');
                const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

                const roomId = rooms[res.roomOffset % rooms.length].id;

                await conn.execute(
                    "INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count) VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)",
                    [res.userId, roomId, startTime, endTime, res.gameType, res.gameName, res.players]
                );
            }
            console.log(`✅ ${reservationList.length} réservations de tables créées pour les 5 utilisateurs.`);
        }

        console.log('\n🎉 Seeding de test terminé avec succès !');
    } catch (err) {
        console.error('❌ Erreur lors du seeding :', err);
    } finally {
        conn.release();
        await pool.end();
    }
}

seed();
