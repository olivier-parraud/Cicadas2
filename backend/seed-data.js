// seed-data.js — Seed tournaments, events (drafts/initiations/avant-premières), 8 test users, and table reservations for all TCGs
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
        console.log('🔗 Connecté à MySQL. Génération complète des tournois et événements TCG...\n');
        try {
            await conn.execute("ALTER TABLE reservations MODIFY COLUMN game_type VARCHAR(50) DEFAULT 'OTHER'");
        } catch (e) {}

        // ─── 1. Supprimer les anciennes données ───
        await conn.execute('DELETE FROM event_registrations');
        await conn.execute('DELETE FROM tournament_registrations');
        await conn.execute('DELETE FROM reservations');
        await conn.execute('DELETE FROM events');
        await conn.execute('DELETE FROM tournaments');
        await conn.execute('DELETE FROM rooms');
        await conn.execute("DELETE FROM users WHERE email LIKE 'testuser%@cicados.fr'");
        console.log('🗑️  Anciennes données nettoyées.');

        // ─── 1.5 Création de 4 Tables de Jeu (Rooms) ───
        const defaultRooms = [
            ['Table 1 (Magic / Riftbound / TCG)', 4, 'Table standard équipée avec Playmats TCG.'],
            ['Table 2 (Yu-Gi-Oh / Lorcana)', 4, 'Table dédiée aux duels de cartes'],
            ['Table 3 (Jeux de Société)', 8, 'Grande table ronde idéale pour les jeux de plateau'],
            ['Table 4 (Jeux de Société)', 6, 'Grande table rectangulaire idéale pour les jeux de plateau']
        ];
        for (const r of defaultRooms) {
            await conn.execute('INSERT INTO rooms (name, capacity, description) VALUES (?, ?, ?)', r);
        }
        console.log('✅ 4 tables de jeu insérées.');

        // ─── 2. Création de 8 Utilisateurs de Test ───
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.default.hash('testpassword', 10);
        const testUsers = [
            ['testuser1@cicados.fr', hashedPassword, 'Pierre', 'Martin', 'Pierrot'],
            ['testuser2@cicados.fr', hashedPassword, 'Sophie', 'Dubois', 'Soph'],
            ['testuser3@cicados.fr', hashedPassword, 'Thomas', 'Bernard', 'TomTee'],
            ['testuser4@cicados.fr', hashedPassword, 'Julie', 'Moreau', 'Juju'],
            ['testuser5@cicados.fr', hashedPassword, 'Nicolas', 'Petit', 'Nico'],
            ['testuser6@cicados.fr', hashedPassword, 'Alexandre', 'Roux', 'AlexR'],
            ['testuser7@cicados.fr', hashedPassword, 'Camille', 'Mercier', 'Cami'],
            ['testuser8@cicados.fr', hashedPassword, 'Lucas', 'Lefebvre', 'Luki']
        ];
        const userIds = [];
        for (const u of testUsers) {
            const [res] = await conn.execute(
                'INSERT INTO users (email, password, firstname, lastname, pseudo) VALUES (?, ?, ?, ?, ?)',
                u
            );
            userIds.push(res.insertId);
        }
        console.log(`✅ 8 utilisateurs de test créés.`);

        // ─── 3. Tournois pour TOUS les TCG (2 tournois par TCG = 14 tournois) ───
        const tournaments = [
            // Magic: The Gathering
            ['Friday Night Magic - Modern',           'Magic: The Gathering',           '2026-07-24 19:30:00', 16, 5.00,  'Rejoignez-nous pour le traditionnel FNM hebdomadaire ! Format Modern, 3 rondes suisses. Boosters promo pour le top 4.'],
            ['MTG Commander Showdown',                 'Magic: The Gathering',           '2026-08-04 18:30:00', 20, 4.00,  'Soirée Commander EDH à 4 joueurs par table. Cartes promos et ambiance festive.'],
            
            // Pokémon TCG
            ['Pokémon TCG Cup : Standard',             'Pokémon TCG',                    '2026-07-25 10:00:00', 32, 7.50,  'Tournoi officiel Pokémon League Cup. Format Standard. Decklist obligatoire.'],
            ['Pokémon League Challenge : Stellar Crown', 'Pokémon TCG',                '2026-08-06 14:00:00', 24, 6.00,  'Tournoi officiel de classement League Challenge avec dotations en boosters Couronne Étincelante.'],
            
            // One Piece Card Game
            ['One Piece Card Game - OP Championship',     'One Piece Card Game',         '2026-07-26 14:00:00', 24, 8.00,  'Tournoi construit One Piece Card Game. Format standard OP-09. Dotations officielles Bandai.'],
            ['One Piece Store Tournament - OP-09',        'One Piece Card Game',         '2026-08-07 19:00:00', 16, 7.00,  'Tournoi local One Piece. Tapis de jeu promo et cartes alternatives pour le Top 3.'],
            
            // Yu-Gi-Oh!
            ['Yu-Gi-Oh! Local - Advanced',             'Yu-Gi-Oh!',                      '2026-07-27 18:00:00', 32, 5.00,  'Tournoi local Yu-Gi-Oh format Advanced. 4 rondes suisses + Top 8. OTS Packs en dotation.'],
            ['Yu-Gi-Oh! Remote Duel Tournament',        'Yu-Gi-Oh!',                      '2026-08-08 17:00:00', 16, 5.00,  'Tournoi officiel Yu-Gi-Oh en boutique. Packs promo OTS et tapis de duelliste à remporter.'],
            
            // Disney Lorcana
            ['Lorcana Challenge : Shimmering Skies',   'Disney Lorcana',              '2026-07-28 19:00:00', 16, 6.00,  'Tournoi construit Lorcana. Promos de participation pour tous les joueurs.'],
            ['Lorcana Inklands Cup',                   'Disney Lorcana',              '2026-08-09 15:00:00', 24, 8.00,  'Coupe officielle Lorcana. Cartes promos brillantes exclusives pour le Top 8.'],
            
            // Riftbound TCG
            ['Riftbound TCG - Championship Cup',       'Riftbound TCG',                  '2026-07-31 15:00:00', 24, 8.00,  'Grand tournoi officiel Riftbound TCG au shop ! Venez vous affronter sur le nouveau jeu sensation.'],
            ['Riftbound TCG - Night Showdown',         'Riftbound TCG',                  '2026-08-03 20:00:00', 16, 6.00,  'Tournoi nocturne Riftbound TCG avec boosters promos exclusifs pour le classement.'],
            
            // Dragon Ball Super CG
            ['Dragon Ball Super CG - Regionals Qualifier', 'Dragon Ball Super Card Game', '2026-08-01 10:00:00', 32, 10.00, 'Qualificatif régional Dragon Ball Super Card Game. Format construit. Tapis de jeu exclusif pour le Top 8.'],
            ['Dragon Ball Super CG - Local Cup',         'Dragon Ball Super Card Game', '2026-08-10 18:00:00', 16, 6.00,  'Tournoi local convivial Dragon Ball Super. Boosters promo et cartes holographiques.']
        ];

        const tournamentIds = [];
        for (const t of tournaments) {
            const [res] = await conn.execute(
                'INSERT INTO tournaments (name, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
                t
            );
            tournamentIds.push(res.insertId);
        }
        console.log(`✅ ${tournaments.length} tournois insérés (2 par TCG).`);

        // ─── 4. Événements pour TOUS les TCG (2 événements par TCG = 14 événements) ───
        const events = [
            // Magic: The Gathering
            ['Draft MTG : Horizons Modern 3',          'draft', 'Magic: The Gathering',           '2026-07-24 14:00:00', 24, 15.00, 'Draft compétitif Horizons Modern 3. 3 boosters par joueur fournis + dotations.'],
            ['Avant-Première MTG : Bloomburrow',       'avant_premiere', 'Magic: The Gathering',  '2026-08-05 12:00:00', 32, 25.00, 'Avant-Première Bloomburrow ! Recevez votre kit de pré-release et découvrez la nouvelle extension.'],
            
            // Pokémon TCG
            ['Draft Pokémon : Faille Paradoxe',        'draft', 'Pokémon TCG',                    '2026-07-25 14:30:00', 16, 12.00, 'Soirée Draft Pokémon TCG avec des boosters Faille Paradoxe. Découvrez le format limité !'],
            ['Initiation Pokémon TCG Académie',        'initiation', 'Pokémon TCG',               '2026-08-06 11:00:00', 16, 0.00,  'Atelier d\'initiation gratuit pour apprendre les règles de Pokémon TCG avec nos professeurs.'],
            
            // One Piece Card Game
            ['Draft One Piece : OP-09',                'draft', 'One Piece Card Game',            '2026-07-26 18:00:00', 16, 12.00, 'Draft One Piece Card Game avec 6 boosters OP-09 par joueur. Format sealed.'],
            ['Initiation One Piece Card Game',         'initiation', 'One Piece Card Game',       '2026-08-07 14:00:00', 16, 0.00,  'Découvrez le jeu de cartes One Piece ! Decks d\'initiation offerts aux participants.'],
            
            // Yu-Gi-Oh!
            ['Draft Yu-Gi-Oh! : Battle Pack 3',        'draft', 'Yu-Gi-Oh!',                      '2026-07-27 14:00:00', 16, 10.00, 'Soirée Draft Yu-Gi-Oh avec Battle Pack 3. Construisez votre deck à partir de boosters !'],
            ['Initiation Yu-Gi-Oh! Duelist Academy',   'initiation', 'Yu-Gi-Oh!',                 '2026-08-08 11:00:00', 16, 0.00,  'Apprenez les invocations synchro, xyz et link lors de notre atelier gratuit.'],
            
            // Disney Lorcana
            ['Draft Lorcana : Ciel Scintillant',       'draft', 'Disney Lorcana',                 '2026-07-28 14:00:00', 12, 15.00, 'Draft Lorcana avec 6 boosters Ciel Scintillant par joueur. Idéal pour les collectionneurs.'],
            ['Initiation Disney Lorcana',              'initiation', 'Disney Lorcana',            '2026-08-09 11:00:00', 16, 0.00,  'Atelier découverte Lorcana ouvert à tous. Decks de prêt fournis par la boutique.'],
            
            // Riftbound TCG
            ['Initiation Riftbound TCG',               'initiation', 'Riftbound TCG',             '2026-07-31 11:00:00', 20, 0.00,  'Séance découverte gratuite du jeu Riftbound TCG. Decks de prêt fournis par le magasin.'],
            ['Draft Riftbound TCG : Extension Premier', 'draft', 'Riftbound TCG',                '2026-08-02 14:00:00', 16, 14.00, 'Draft officiel Riftbound TCG. 4 boosters par duelliste et boosters promos d\'extension.'],
            
            // Dragon Ball Super CG
            ['Draft Dragon Ball Super CG',             'draft', 'Dragon Ball Super Card Game',    '2026-08-01 14:00:00', 16, 12.00, 'Draft Dragon Ball Super Card Game avec des boosters de la dernière extension.'],
            ['Initiation Dragon Ball Super CG',        'initiation', 'Dragon Ball Super Card Game','2026-08-10 11:00:00', 16, 0.00,  'Atelier d\'initiation gratuit au jeu de cartes Dragon Ball Super avec nos animateurs.']
        ];

        const eventIds = [];
        for (const e of events) {
            const [res] = await conn.execute(
                'INSERT INTO events (name, type, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                e
            );
            eventIds.push(res.insertId);
        }
        console.log(`✅ ${events.length} événements insérés (2 par TCG).`);

        // ─── 5. Inscriptions aux Tournois (Réparties sur les 8 profils) ───
        const tournamentRegistrations = [
            [tournamentIds[0], userIds[0]], [tournamentIds[1], userIds[0]], [tournamentIds[10], userIds[0]],
            [tournamentIds[2], userIds[1]], [tournamentIds[3], userIds[1]], [tournamentIds[11], userIds[1]],
            [tournamentIds[4], userIds[2]], [tournamentIds[5], userIds[2]], [tournamentIds[12], userIds[2]],
            [tournamentIds[6], userIds[3]], [tournamentIds[7], userIds[3]], [tournamentIds[10], userIds[3]],
            [tournamentIds[8], userIds[4]], [tournamentIds[9], userIds[4]], [tournamentIds[13], userIds[4]],
            [tournamentIds[10], userIds[5]], [tournamentIds[11], userIds[5]], [tournamentIds[0], userIds[5]],
            [tournamentIds[2], userIds[6]], [tournamentIds[8], userIds[6]], [tournamentIds[10], userIds[6]],
            [tournamentIds[4], userIds[7]], [tournamentIds[6], userIds[7]], [tournamentIds[10], userIds[7]],
        ];
        for (const tr of tournamentRegistrations) {
            await conn.execute('INSERT INTO tournament_registrations (tournament_id, user_id) VALUES (?, ?)', tr);
        }
        console.log(`✅ ${tournamentRegistrations.length} inscriptions aux tournois générées.`);

        // ─── 6. Inscriptions aux Événements (Réparties sur les 8 profils) ───
        const eventRegistrations = [
            [eventIds[0], userIds[0]], [eventIds[1], userIds[0]], [eventIds[10], userIds[0]],
            [eventIds[2], userIds[1]], [eventIds[3], userIds[1]], [eventIds[11], userIds[1]],
            [eventIds[4], userIds[2]], [eventIds[5], userIds[2]], [eventIds[12], userIds[2]],
            [eventIds[6], userIds[3]], [eventIds[7], userIds[3]], [eventIds[10], userIds[3]],
            [eventIds[8], userIds[4]], [eventIds[9], userIds[4]], [eventIds[13], userIds[4]],
            [eventIds[10], userIds[5]], [eventIds[11], userIds[5]], [eventIds[0], userIds[5]],
            [eventIds[2], userIds[6]], [eventIds[8], userIds[6]], [eventIds[10], userIds[6]],
            [eventIds[4], userIds[7]], [eventIds[6], userIds[7]], [eventIds[11], userIds[7]],
        ];
        for (const er of eventRegistrations) {
            await conn.execute('INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)', er);
        }
        console.log(`✅ ${eventRegistrations.length} inscriptions aux événements générées.`);

        // ─── 7. Réservations de Tables pour tous les TCGs ───
        const [rooms] = await conn.execute('SELECT id FROM rooms');
        if (rooms.length >= 4) {
            const reservationList = [
                { userId: userIds[0], gameType: 'MTG', gameName: 'Magic: The Gathering', date: '2026-07-24', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[0], gameType: 'POKEMON', gameName: 'Pokémon TCG', date: '2026-07-25', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[1], gameType: 'ONE_PIECE', gameName: 'One Piece Card Game', date: '2026-07-24', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[1], gameType: 'YUGIOH', gameName: 'Yu-Gi-Oh!', date: '2026-07-25', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[2], gameType: 'LORCANA', gameName: 'Disney Lorcana', date: '2026-07-25', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[3], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-07-27', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[4], gameType: 'DBS', gameName: 'Dragon Ball Super Card Game', date: '2026-07-27', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[5], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-07-30', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[6], gameType: 'LORCANA', gameName: 'Disney Lorcana', date: '2026-07-30', time: '18:00', roomOffset: 2, players: 4 },
                { userId: userIds[7], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-08-01', time: '16:00', roomOffset: 1, players: 2 },
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
            console.log(`✅ ${reservationList.length} réservations de tables créées.`);
        }

        console.log('\n🎉 Seeding complet des tournois et événements pour TOUS les TCGs terminé avec succès !');
    } catch (err) {
        console.error('❌ Erreur lors du seeding :', err);
    } finally {
        conn.release();
        await pool.end();
    }
}

seed();
