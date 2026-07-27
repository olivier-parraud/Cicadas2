import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'cicados',
    port: process.env.DB_PORT || 8889,
    waitForConnections: true,
    connectionLimit: 10
});

function getValidDate(year, month, day, time) {
    const maxDays = new Date(year, month, 0).getDate();
    const validDay = Math.min(day, maxDays);
    const dayStr = String(validDay).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr} ${time}`;
}

async function seedData() {
    const conn = await pool.getConnection();
    try {
        console.log('🔗 Connecté à MySQL. Génération des tournois et événements jusqu\'à juillet 2027...');

        // ─── 1. Nettoyage préliminaire ───
        await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
        await conn.execute('TRUNCATE TABLE event_registrations');
        await conn.execute('TRUNCATE TABLE tournament_registrations');
        await conn.execute('TRUNCATE TABLE reservations');
        await conn.execute('TRUNCATE TABLE events');
        await conn.execute('TRUNCATE TABLE tournaments');
        await conn.execute('TRUNCATE TABLE rooms');
        await conn.execute('TRUNCATE TABLE users');
        await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🗑️  Anciennes données nettoyées.');

        // ─── 2. Insertion des Salles ───
        const rooms = [
            ['Table 1 - Standard', 4, 'Table de jeu standard en bois 4 places'],
            ['Table 2 - Standard', 4, 'Table de jeu standard en bois 4 places'],
            ['Table 3 - Premium TCG', 6, 'Grande table de jeu avec tapis en feutrine pour TCG'],
            ['Table 4 - Premium TCG', 6, 'Grande table de jeu avec tapis en feutrine pour TCG']
        ];
        for (const r of rooms) {
            await conn.execute('INSERT INTO rooms (name, capacity, description) VALUES (?, ?, ?)', r);
        }
        console.log('✅ 4 tables de jeu insérées.');

        // ─── 3. Insertion des Utilisateurs ───
        const hashedPassword = await bcrypt.hash('password123', 10);
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

        // ─── 4. Génération des Tournois et Événements de Juillet 2026 jusqu'à Juillet 2027 ───
        const months = [
            { year: 2026, month: 7 },
            { year: 2026, month: 8 },
            { year: 2026, month: 9 },
            { year: 2026, month: 10 },
            { year: 2026, month: 11 },
            { year: 2026, month: 12 },
            { year: 2027, month: 1 },
            { year: 2027, month: 2 },
            { year: 2027, month: 3 },
            { year: 2027, month: 4 },
            { year: 2027, month: 5 },
            { year: 2027, month: 6 },
            { year: 2027, month: 7 }
        ];

        const tournamentTemplates = [
            { game: 'Magic: The Gathering', name: 'Friday Night Magic - Modern', day: 4, time: '19:30:00', cap: 16, price: 5.00, desc: 'FNM traditionnel hebdomadaire ! Format Modern, 3 rondes suisses avec boosters promo.' },
            { game: 'Magic: The Gathering', name: 'MTG Commander Showdown', day: 12, time: '18:30:00', cap: 20, price: 4.00, desc: 'Soirée Commander EDH à 4 joueurs par table. Cartes promos et ambiance conviviale.' },
            { game: 'Pokémon TCG', name: 'Pokémon TCG League Cup', day: 6, time: '10:00:00', cap: 32, price: 7.50, desc: 'Tournoi officiel Pokémon League Cup. Format Standard. Decklist obligatoire.' },
            { game: 'Pokémon TCG', name: 'Pokémon League Challenge', day: 18, time: '14:00:00', cap: 24, price: 6.00, desc: 'Tournoi officiel de classement League Challenge avec dotations en boosters.' },
            { game: 'One Piece Card Game', name: 'One Piece Store Tournament', day: 8, time: '14:00:00', cap: 24, price: 8.00, desc: 'Tournoi construit One Piece Card Game. Format standard avec dotations officielles Bandai.' },
            { game: 'One Piece Card Game', name: 'One Piece Local Cup', day: 22, time: '19:00:00', cap: 16, price: 7.00, desc: 'Tournoi local One Piece. Tapis de jeu promo et cartes alternatives pour le Top 3.' },
            { game: 'Yu-Gi-Oh!', name: 'Yu-Gi-Oh! Local - Advanced', day: 10, time: '18:00:00', cap: 32, price: 5.00, desc: 'Tournoi local Yu-Gi-Oh format Advanced. 4 rondes suisses + Top 8. OTS Packs en dotation.' },
            { game: 'Yu-Gi-Oh!', name: 'Yu-Gi-Oh! OTS Championship', day: 24, time: '17:00:00', cap: 24, price: 6.00, desc: 'Tournoi officiel Yu-Gi-Oh en boutique. Packs promo OTS et tapis de duelliste.' },
            { game: 'Disney Lorcana', name: 'Lorcana Challenge Masters', day: 14, time: '19:00:00', cap: 20, price: 6.00, desc: 'Tournoi construit Lorcana. Promos de participation exclusives pour tous les duellistes.' },
            { game: 'Disney Lorcana', name: 'Lorcana Inklands Cup', day: 26, time: '15:00:00', cap: 24, price: 8.00, desc: 'Coupe officielle Lorcana. Cartes promos brillantes exclusives pour le Top 8.' },
            { game: 'Riftbound TCG', name: 'Riftbound TCG - Championship Cup', day: 16, time: '15:00:00', cap: 24, price: 8.00, desc: 'Grand tournoi officiel Riftbound TCG au shop ! Venez vous affronter sur le nouveau jeu sensation.' },
            { game: 'Riftbound TCG', name: 'Riftbound TCG - Night Showdown', day: 28, time: '20:00:00', cap: 16, price: 6.00, desc: 'Tournoi nocturne Riftbound TCG avec boosters promos exclusifs pour le classement.' }
        ];

        const eventTemplates = [
            { game: 'Magic: The Gathering', type: 'draft', name: 'Draft MTG : Saison Spéciale', day: 5, time: '14:00:00', cap: 24, price: 15.00, desc: 'Draft compétitif Magic. 3 boosters par joueur fournis + dotations.' },
            { game: 'Magic: The Gathering', type: 'avant_premiere', name: 'Avant-Première MTG : Extension', day: 19, time: '12:00:00', cap: 32, price: 25.00, desc: 'Avant-Première officielle ! Recevez votre kit de pré-release et découvrez la nouvelle extension.' },
            { game: 'Pokémon TCG', type: 'draft', name: 'Draft Pokémon : Faille Paradoxe', day: 7, time: '14:30:00', cap: 16, price: 12.00, desc: 'Soirée Draft Pokémon TCG. Découvrez le format limité avec des boosters scellés.' },
            { game: 'Pokémon TCG', type: 'initiation', name: 'Initiation Pokémon TCG Académie', day: 21, time: '11:00:00', cap: 16, price: 0.00, desc: 'Atelier d\'initiation gratuit pour apprendre les règles de Pokémon TCG avec nos animateurs.' },
            { game: 'One Piece Card Game', type: 'draft', name: 'Draft One Piece Card Game', day: 9, time: '18:00:00', cap: 16, price: 12.00, desc: 'Draft One Piece Card Game avec 6 boosters par joueur. Format sealed.' },
            { game: 'One Piece Card Game', type: 'initiation', name: 'Initiation One Piece Card Game', day: 23, time: '14:00:00', cap: 16, price: 0.00, desc: 'Découvrez le jeu de cartes One Piece ! Decks d\'initiation offerts aux participants.' },
            { game: 'Yu-Gi-Oh!', type: 'draft', name: 'Draft Yu-Gi-Oh! Battle Pack', day: 11, time: '14:00:00', cap: 16, price: 10.00, desc: 'Soirée Draft Yu-Gi-Oh. Construisez votre deck à partir de boosters !' },
            { game: 'Yu-Gi-Oh!', type: 'initiation', name: 'Initiation Yu-Gi-Oh! Duelist Academy', day: 25, time: '11:00:00', cap: 16, price: 0.00, desc: 'Apprenez les invocations synchro, xyz et link lors de notre atelier gratuit.' },
            { game: 'Disney Lorcana', type: 'draft', name: 'Draft Disney Lorcana', day: 13, time: '14:00:00', cap: 12, price: 15.00, desc: 'Draft Lorcana avec 6 boosters par joueur. Idéal pour les collectionneurs.' },
            { game: 'Disney Lorcana', type: 'initiation', name: 'Initiation Disney Lorcana', day: 27, time: '11:00:00', cap: 16, price: 0.00, desc: 'Atelier découverte Lorcana ouvert à tous. Decks de prêt fournis par la boutique.' },
            { game: 'Riftbound TCG', type: 'initiation', name: 'Initiation Riftbound TCG', day: 15, time: '11:00:00', cap: 20, price: 0.00, desc: 'Séance découverte gratuite du jeu Riftbound TCG. Decks de prêt fournis par le magasin.' },
            { game: 'Riftbound TCG', type: 'draft', name: 'Draft Riftbound TCG Premier', day: 28, time: '14:00:00', cap: 16, price: 14.00, desc: 'Draft officiel Riftbound TCG. 4 boosters par duelliste et boosters promos d\'extension.' }
        ];

        const tournamentIds = [];
        const eventIds = [];

        for (const m of months) {
            // Insert tournaments for this month
            for (const t of tournamentTemplates) {
                const dateStr = getValidDate(m.year, m.month, t.day, t.time);
                const [res] = await conn.execute(
                    'INSERT INTO tournaments (name, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?)',
                    [t.name, t.game, dateStr, t.cap, t.price, t.desc]
                );
                tournamentIds.push(res.insertId);
            }

            // Insert events for this month
            for (const e of eventTemplates) {
                const dateStr = getValidDate(m.year, m.month, e.day, e.time);
                const [res] = await conn.execute(
                    'INSERT INTO events (name, type, game, date, capacity, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [e.name, e.type, e.game, dateStr, e.cap, e.price, e.desc]
                );
                eventIds.push(res.insertId);
            }
        }

        console.log(`✅ ${tournamentIds.length} tournois insérés de juillet 2026 à juillet 2027 (${months.length} mois x 12 tournois).`);
        console.log(`✅ ${eventIds.length} événements insérés de juillet 2026 à juillet 2027 (${months.length} mois x 12 événements).`);

        // ─── 5. Inscriptions Réparties aux Tournois et Événements ───
        let tRegCount = 0;
        let eRegCount = 0;

        for (let i = 0; i < tournamentIds.length; i++) {
            const count = (i % 3) + 2; 
            for (let j = 0; j < count; j++) {
                const uId = userIds[(i + j) % userIds.length];
                await conn.execute(
                    'INSERT IGNORE INTO tournament_registrations (tournament_id, user_id) VALUES (?, ?)',
                    [tournamentIds[i], uId]
                );
                tRegCount++;
            }
        }

        for (let i = 0; i < eventIds.length; i++) {
            const count = (i % 3) + 2;
            for (let j = 0; j < count; j++) {
                const uId = userIds[(i + j) % userIds.length];
                await conn.execute(
                    'INSERT IGNORE INTO event_registrations (event_id, user_id) VALUES (?, ?)',
                    [eventIds[i], uId]
                );
                eRegCount++;
            }
        }

        console.log(`✅ ${tRegCount} inscriptions aux tournois créées sur l'ensemble de la période.`);
        console.log(`✅ ${eRegCount} inscriptions aux événements créées sur l'ensemble de la période.`);

        // ─── 6. Réservations de Tables pour tous les TCGs ───
        const [roomRows] = await conn.execute('SELECT id FROM rooms');
        if (roomRows.length >= 4) {
            const reservationList = [
                { userId: userIds[0], gameType: 'MTG', gameName: 'Magic: The Gathering', date: '2026-07-24', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[0], gameType: 'POKEMON', gameName: 'Pokémon TCG', date: '2026-07-25', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[1], gameType: 'ONE_PIECE', gameName: 'One Piece Card Game', date: '2026-07-24', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[1], gameType: 'YUGIOH', gameName: 'Yu-Gi-Oh!', date: '2026-07-25', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[2], gameType: 'LORCANA', gameName: 'Disney Lorcana', date: '2026-07-25', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[3], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-07-27', time: '16:00', roomOffset: 1, players: 2 },
                { userId: userIds[4], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-07-27', time: '18:00', roomOffset: 2, players: 2 },
                { userId: userIds[5], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-07-30', time: '14:00', roomOffset: 0, players: 2 },
                { userId: userIds[6], gameType: 'LORCANA', gameName: 'Disney Lorcana', date: '2026-07-30', time: '18:00', roomOffset: 2, players: 4 },
                { userId: userIds[7], gameType: 'RIFTBOUND', gameName: 'Riftbound TCG', date: '2026-08-01', time: '16:00', roomOffset: 1, players: 2 }
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

                const roomId = roomRows[res.roomOffset % roomRows.length].id;

                await conn.execute(
                    "INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count) VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)",
                    [res.userId, roomId, startTime, endTime, res.gameType, res.gameName, res.players]
                );
            }
            console.log(`✅ ${reservationList.length} réservations de tables créées.`);
        }

        console.log('\n🎉 Seeding complet des tournois et événements jusqu\'à JUILLET 2027 terminé avec succès !');
    } catch (err) {
        console.error('❌ Erreur lors du seeding :', err);
    } finally {
        conn.release();
        await pool.end();
    }
}

seedData();
