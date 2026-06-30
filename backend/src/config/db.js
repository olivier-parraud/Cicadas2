// config/db.js
import mysql from 'mysql2/promise';
// Création du pool de connexions
const pool = mysql.createPool({
host: process.env.DB_HOST || 'localhost',
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || '',
database: process.env.DB_NAME || 'cicados',
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
        console.error('Erreur MySQL:', error.message);
        return false;
    }
}
export default pool;