import express from 'express';
import { sequelize } from '../database.js';
import gameConfigModel from '../models/GameConfig.js';
import monsterModel from '../models/Monster.js';
import skinModel from '../models/Skin.js';
import musicSettingModel from '../models/MusicSetting.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Modelos
const GameConfig = gameConfigModel(sequelize);
const Monster = monsterModel(sequelize);
const Skin = skinModel(sequelize);
const MusicSetting = musicSettingModel(sequelize);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEBUG_FILE_PATH = path.join(__dirname, '../debug.json');
router.post('/config', async (req, res) => {
    try {
        const { monsterId, skinId, musicId } = req.body;

        if (!monsterId || !skinId || !musicId) {
            return res.status(400).json({ success: false, error: 'Missing parameters' });
        }

        // Recuperar los detalles del monstruo con todos los atributos necesarios
        const [monster, skin, music] = await Promise.all([
            Monster.findByPk(monsterId, {  
                attributes: ['id', 'name', 'strength', 'speed', 'health', 'sprite'] // Incluimos todos los atributos necesarios
            }),
            Skin.findByPk(skinId),
            MusicSetting.findByPk(musicId)
        ]);

        if (!monster || !skin || !music) {
            return res.status(400).json({ success: false, error: 'Invalid selection' });
        }

        const [config, created] = await GameConfig.upsert({
            monsterId,
            skinId,
            musicId
        }, { returning: true });

        // Guardar la configuración en un archivo JSON con los detalles completos del monstruo
        const debugData = {
            monster: {
                id: monster.id,
                name: monster.name,
                strength: monster.strength,
                speed: monster.speed,
                health: monster.health,
                sprite: monster.sprite || 'No sprite available'  // Si no hay sprite, mostramos un mensaje por defecto
            },
            skin: skin.name,
            music: music.name,
            timestamp: new Date().toISOString()
        };

        console.log('Configuración guardada, guardando en archivo debug...');
        fs.writeFileSync(DEBUG_FILE_PATH, JSON.stringify(debugData, null, 2), 'utf-8');
        console.log('Archivo debug guardado correctamente.');

        return res.json({ success: true, config: debugData, created });x    
    } catch (error) {
        console.error('Error saving game config:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


router.get('/debug', async (req, res) => {
    try {
        if (!fs.existsSync(DEBUG_FILE_PATH)) {
            return res.status(404).json({ success: false, error: 'No debug info found' });
        }

        const fileContent = fs.readFileSync(DEBUG_FILE_PATH, 'utf-8');

        if (!fileContent.trim()) {  
            return res.status(500).json({ success: false, error: 'Debug file is empty' });
        }

        const debugData = JSON.parse(fileContent);
        return res.json(debugData);
    } catch (error) {
        console.error('Error fetching debug info:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



export default router;