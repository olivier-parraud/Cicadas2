// seed-data.js — Seed tournaments, events (drafts), and reservations for all TCG games
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

        // ─── 1. Tournois pour tous les jeux ───
        const tournaments = [
            ['Friday Night Magic - Modern',       'Magic: The Gathering',           '2026-07-12 19:30:00', 16, 5.00,  'Rejoignez-nous pour le traditionnel FNM hebdomadaire ! Format Modern, 3 rondes suisses. Boosters promo pour le top 4.'],
            ['Pokémon TCG Cup : Standard',         'Pokémon TCG',                    '2026-07-13 10:00:00', 32, 7.50,  'Tournoi officiel Pokémon League Cup. Format Standard. Pensez à apporter votre Decklist imprimée.'],
            ['One Piece Card Game - OP Championship', 'One Piece Card Game',         '2026-07-14 14:00:00', 24, 8.00,  'Tournoi construit One Piece Card Game. Format standard OP-09. Dotations officielles Bandai.'],
            ['Yu-Gi-Oh! Local - Advanced',         'Yu-Gi-Oh!',                      '2026-07-15 18:00:00', 32, 5.00,  'Tournoi local Yu-Gi-Oh format Advanced. 4 rondes suisses + Top 8. OTS Packs en dotation.'],
            ['Lorcana Challenge : Shimmering Skies', 'Disney Lorcana',              '2026-07-16 19:00:00', 16, 6.00,  'Tournoi construite Lorcana. Promos de participation pour tous les joueurs.'],
            ['Star Wars Unlimited - Premier',      'Star Wars Unlimited',            '2026-07-17 14:30:00', 16, 7.00,  'Tournoi construit Star Wars Unlimited. Format Premier. Promos Alt-Art pour le Top 4.'],
            ['Final Fantasy TCG - Crystal Cup',    'Final Fantasy TCG',              '2026-07-18 14:00:00', 16, 6.00,  'Crystal Cup locale Final Fantasy TCG. Format L7, toutes les cartes Opus I à XIV autorisées.'],
            ['Altered TCG - Tournoi Découverte',   'Altered TCG',                    '2026-07-19 15:00:00', 16, 5.00,  'Premier tournoi Altered TCG au shop ! Venez découvrir le nouveau jeu de cartes physique-digital.'],
            ['Dragon Ball Super CG - Regionals Qualifier', 'Dragon Ball Super Card Game', '2026-07-20 10:00:00', 32, 10.00, 'Qualificatif régional Dragon Ball Super Card Game. Format construit. Tapis de jeu exclusif pour le Top 8.'],
        ];

        // Clear existing tournaments (and their registrations via CASCADE)
        await conn.execute('DELETE FROM tournament_registrations');
        await conn.execute('DELETE FROM tournaments');
        console.log('🗑️  Anciens tournois supprimés.');

        for (const t of tournaments) {
            await conn.execute(
                'INSERT INTO tournaments (name, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
                t
            );
        }
        console.log(`✅ ${tournaments.length} tournois insérés.\n`);

        // ─── 2. Événements (Drafts) pour tous les jeux ───
        const events = [
            ['Draft MTG : Horizons Modern 3',          'draft', 'Magic: The Gathering',           '2026-07-12 14:00:00', 24, 15.00, 'Draft compétitif Horizons Modern 3. 3 boosters par joueur fournis + dotations.'],
            ['Draft Pokémon : Faille Paradoxe',        'draft', 'Pokémon TCG',                    '2026-07-13 14:30:00', 16, 12.00, 'Soirée Draft Pokémon TCG avec des boosters Faille Paradoxe. Découvrez le format limité !'],
            ['Draft One Piece : OP-09',                'draft', 'One Piece Card Game',            '2026-07-14 18:00:00', 16, 12.00, 'Draft One Piece Card Game avec 6 boosters OP-09 par joueur. Format sealed.'],
            ['Draft Yu-Gi-Oh! : Battle Pack 3',        'draft', 'Yu-Gi-Oh!',                      '2026-07-15 14:00:00', 16, 10.00, 'Soirée Draft Yu-Gi-Oh avec Battle Pack 3. Construisez votre deck à partir de boosters !'],
            ['Draft Lorcana : Ciel Scintillant',       'draft', 'Disney Lorcana',                 '2026-07-16 14:00:00', 12, 15.00, 'Draft Lorcana avec 6 boosters Ciel Scintillant par joueur. Idéal pour les collectionneurs.'],
            ['Draft Star Wars Unlimited : Ombres',     'draft', 'Star Wars Unlimited',            '2026-07-17 18:30:00', 12, 14.00, 'Draft Star Wars Unlimited extension Ombres de la Galaxie. 6 boosters fournis.'],
            ['Draft Final Fantasy TCG : Opus XV',      'draft', 'Final Fantasy TCG',              '2026-07-18 18:00:00', 12, 13.00, 'Draft Final Fantasy TCG avec 6 boosters Opus XV par joueur.'],
            ['Initiation Altered TCG',                 'initiation', 'Altered TCG',               '2026-07-19 11:00:00', 20, 0.00,  'Séance découverte gratuite du jeu Altered TCG. Decks de prêt fournis par le magasin.'],
            ['Draft Dragon Ball Super CG',             'draft', 'Dragon Ball Super Card Game',    '2026-07-20 14:00:00', 16, 12.00, 'Draft Dragon Ball Super Card Game avec des boosters de la dernière extension.'],
            ['Avant-Première MTG : Bloomburrow',       'avant_premiere', 'Magic: The Gathering',  '2026-07-25 12:00:00', 32, 25.00, 'Avant-Première Bloomburrow ! Recevez votre kit de pré-release et découvrez la nouvelle extension en avant-première.'],
        ];

        await conn.execute('DELETE FROM event_registrations');
        await conn.execute('DELETE FROM events');
        console.log('🗑️  Anciens événements supprimés.');

        for (const e of events) {
            await conn.execute(
                'INSERT INTO events (name, type, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                e
            );
        }
        console.log(`✅ ${events.length} événements insérés.\n`);

        // ─── 3. Réservations de tables pour tous les jeux TCG ───
        // Get the admin user ID
        const [users] = await conn.execute("SELECT id FROM users WHERE email = 'admin@cicados.fr' LIMIT 1");
        if (users.length === 0) {
            console.log('⚠️  Utilisateur admin introuvable, réservations ignorées.');
        } else {
            const adminId = users[0].id;

            // Make sure rooms exist
            const [rooms] = await conn.execute('SELECT id FROM rooms');
            if (rooms.length < 4) {
                console.log('⚠️  Pas assez de tables en base (< 4), réservations ignorées.');
            } else {
                // Clear old reservations
                await conn.execute('DELETE FROM reservations');
                console.log('🗑️  Anciennes réservations supprimées.');

                const gameTypes = ['MTG', 'POKEMON', 'ONE_PIECE', 'YUGIOH', 'LORCANA', 'STAR_WARS', 'FINAL_FF', 'ALTERED', 'DBS'];
                const gameNames = [
                    'Magic: The Gathering',
                    'Pokémon TCG',
                    'One Piece Card Game',
                    'Yu-Gi-Oh!',
                    'Disney Lorcana',
                    'Star Wars Unlimited',
                    'Final Fantasy TCG',
                    'Altered TCG',
                    'Dragon Ball Super Card Game'
                ];

                // Create reservations spread across multiple days with different time slots
                const baseDates = [
                    '2026-07-12', '2026-07-13', '2026-07-14'
                ];
                const timeSlots = ['14:00', '16:00', '18:00'];

                let resCount = 0;
                for (let i = 0; i < gameTypes.length; i++) {
                    const dateIdx = i % baseDates.length;
                    const timeIdx = i % timeSlots.length;
                    const roomIdx = i % rooms.length;
                    const date = baseDates[dateIdx];
                    const time = timeSlots[timeIdx];
                    const startTime = `${date} ${time}:00`;
                    // 2 hour duration
                    const startObj = new Date(startTime);
                    startObj.setHours(startObj.getHours() + 2);
                    const endYear = startObj.getFullYear();
                    const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
                    const endDay = String(startObj.getDate()).padStart(2, '0');
                    const endHour = String(startObj.getHours()).padStart(2, '0');
                    const endMin = String(startObj.getMinutes()).padStart(2, '0');
                    const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

                    await conn.execute(
                        "INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count) VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)",
                        [adminId, rooms[roomIdx].id, startTime, endTime, gameTypes[i], gameNames[i], 2 + (i % 3)]
                    );
                    resCount++;
                }

                // Reserve 4 board games + 1 BYOG (Total of 5)
                const extraGames = [
                    { type: 'BOARD_GAME', name: '7 Wonders', players: 4 },
                    { type: 'BOARD_GAME', name: 'Azul', players: 3 },
                    { type: 'BOARD_GAME', name: 'Carcassonne Big Box 6', players: 2 },
                    { type: 'BOARD_GAME', name: 'Codenames', players: 6 },
                    { type: 'BYOG', name: "J'apporte mon jeu", players: 4 }
                ];

                for (let j = 0; j < extraGames.length; j++) {
                    const game = extraGames[j];
                    const date = '2026-07-15'; // Day after
                    const time = `1${4 + (j % 3)}:00`; // 14:00, 15:00, 16:00
                    const startTime = `${date} ${time}:00`;
                    
                    const startObj = new Date(startTime);
                    startObj.setHours(startObj.getHours() + 2);
                    const endYear = startObj.getFullYear();
                    const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
                    const endDay = String(startObj.getDate()).padStart(2, '0');
                    const endHour = String(startObj.getHours()).padStart(2, '0');
                    const endMin = String(startObj.getMinutes()).padStart(2, '0');
                    const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

                    const roomIdx = (gameTypes.length + j) % rooms.length;

                    await conn.execute(
                        "INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count) VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)",
                        [adminId, rooms[roomIdx].id, startTime, endTime, game.type, game.name, game.players]
                    );
                    resCount++;
                }

                console.log(`✅ ${resCount} réservations de tables insérées (incluant tous les TCG et 5 jeux de société / BYOG).\n`);
            }
        }

        console.log('🎉 Seeding terminé avec succès !');
    } catch (err) {
        console.error('❌ Erreur lors du seeding :', err);
    } finally {
        conn.release();
        await pool.end();
    }
}

seed();
