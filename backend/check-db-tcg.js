import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cicados',
        ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {})
    });

    const [tourneys] = await conn.execute('SELECT DISTINCT game FROM tournaments');
    const [events] = await conn.execute('SELECT DISTINCT game FROM events');
    const [reser] = await conn.execute('SELECT DISTINCT game_type, specific_game FROM reservations');

    console.log('--- DB TOURNAMENTS TCG LIST ---');
    console.table(tourneys);

    console.log('--- DB EVENTS TCG LIST ---');
    console.table(events);

    console.log('--- DB RESERVATIONS TCG LIST ---');
    console.table(reser);

    await conn.end();
})();
