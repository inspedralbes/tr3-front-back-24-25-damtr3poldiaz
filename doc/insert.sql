-- Inserts para la tabla Sessions
INSERT INTO `Sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('abc123', '2025-03-18 12:00:00', '{"user_id": 1}', NOW(), NOW()),
('def456', '2025-03-18 13:00:00', '{"user_id": 2}', NOW(), NOW());

-- Inserts para la tabla collectibles
INSERT INTO `collectibles` (`name`, `type`, `sprite`, `created_at`) VALUES
('Sword of Doom', 'weapon', 'sword.png', NOW()),
('Health Potion', 'power-up', 'potion.png', NOW());

-- Inserts para la tabla microservices
INSERT INTO `microservices` (`name`, `status`) VALUES
('AuthService', 'active'),
('InventoryService', 'inactive');

-- Inserts para la tabla monstruos
INSERT INTO `monstruos` (`name`, `strength`, `speed`, `health`, `sprite`, `created_at`) VALUES
('Dino1', 10, 5, 20, 'dino.png', NOW()),
('dino2', 20, 3, 50, 'dino2.png', NOW());

-- Inserts para la tabla music_settings
INSERT INTO `music_settings` (`scene`, `track_path`, `is_looping`) VALUES
('Main Menu', 'music/menu_theme.mp3', 1),
('Battle Scene', 'music/battle_theme.mp3', 1);

-- Inserts para la tabla skins
INSERT INTO `skins` (`name`, `description`, `sprite`, `created_at`) VALUES
('Golden Armor', 'A shiny golden armor.', 'golden_armor.png', NOW()),
('Shadow Cloak', 'A mysterious black cloak.', 'shadow_cloak.png', NOW());


-- Inserts para la tabla level_config
INSERT INTO `level_config` (`level_number`, `wave`, `enemy_type`, `enemy_count`) VALUES
(1, 1, 1, 5),
(1, 2, 2, 3),
(2, 1, 2, 6);
