CREATE DATABASE IF NOT EXISTS cicados
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cicados;

-- Table des utilisateurs (users)
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    pseudo VARCHAR(100) DEFAULT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Table des salles (rooms / tables physiques de jeu)
CREATE TABLE IF NOT EXISTS rooms (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des réservations (reservations)
CREATE TABLE IF NOT EXISTS reservations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    room_id INT UNSIGNED NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    game_type ENUM('MTG', 'YUGIOH', 'POKEMON', 'LORCANA', 'ONE_PIECE', 'STAR_WARS', 'FINAL_FF', 'ALTERED', 'DBS', 'BOARD_GAME', 'BYOG', 'OTHER') DEFAULT 'OTHER' COMMENT 'Type de jeu: Magic The Gathering, Jeu de société, etc.',
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    specific_game VARCHAR(255) DEFAULT NULL,
    players_count INT UNSIGNED DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_reservation_times (start_time, end_time)
) ENGINE=InnoDB;

-- Table des tournois (tournaments)
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

-- Table des inscriptions aux tournois
CREATE TABLE IF NOT EXISTS tournament_registrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY idx_tourney_user (tournament_id, user_id)
) ENGINE=InnoDB;

-- Table des jeux de société (board_games)
CREATE TABLE IF NOT EXISTS board_games (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    min_players INT UNSIGNED NOT NULL,
    max_players INT UNSIGNED NOT NULL,
    play_time INT UNSIGNED NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) DEFAULT NULL,
    rules_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des événements (avant-premières, drafts, initiations)
CREATE TABLE IF NOT EXISTS events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('avant_premiere', 'draft', 'initiation') NOT NULL,
    game VARCHAR(100) NOT NULL,
    date DATETIME NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des inscriptions aux événements
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY idx_event_user (event_id, user_id)
) ENGINE=InnoDB;

-- Pour exécuter le script : mysql -u root -p < backend/schema.sql