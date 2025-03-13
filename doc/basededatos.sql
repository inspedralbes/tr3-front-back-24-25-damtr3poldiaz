-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de enemigos
CREATE TABLE monstruos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    strength INT NOT NULL,
    speed INT NOT NULL,
    health INT NOT NULL,
    sprite VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de objetos recolectables
CREATE TABLE collectibles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('weapon', 'power-up') NOT NULL,
    sprite VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de skins
CREATE TABLE skins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    sprite VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de configuración de niveles
CREATE TABLE level_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL,
    wave INT NOT NULL,
    enemy_type INT,
    enemy_count INT NOT NULL,
    FOREIGN KEY (enemy_type) REFERENCES monstruos(id) ON DELETE SET NULL
);

-- Tabla de configuración de música
CREATE TABLE music_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scene VARCHAR(50) NOT NULL,
    track_path VARCHAR(255) NOT NULL,
    is_looping BOOLEAN DEFAULT TRUE
);

-- Tabla de microservicios
CREATE TABLE microservices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'inactive'
);