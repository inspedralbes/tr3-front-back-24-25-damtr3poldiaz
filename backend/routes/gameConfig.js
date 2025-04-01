import express from 'express';
import { sequelize } from '../database.js';
import gameConfigModel from '../models/GameConfig.js';
import monsterModel from '../models/Monster.js';
import skinModel from '../models/Skin.js';
import musicSettingModel from '../models/MusicSetting.js';

const router = express.Router();

// Modelos
const GameConfig = gameConfigModel(sequelize);
const Monster = monsterModel(sequelize);
const Skin = skinModel(sequelize);
const MusicSetting = musicSettingModel(sequelize);

// 📌 Guardar Configuración del Juego
router.post('/config', async (req, res) => {
    try {
        const { monsterId, skinId, musicId } = req.body;

        if (!monsterId || !skinId || !musicId) {
            return res.status(400).json({ success: false, error: 'Missing parameters' });
        }

        // Validar si los elementos seleccionados existen
        const [monster, skin, music] = await Promise.all([ 
            Monster.findByPk(monsterId), 
            Skin.findByPk(skinId), 
            MusicSetting.findByPk(musicId)
        ]);

        if (!monster || !skin || !music) {
            return res.status(400).json({ success: false, error: 'Invalid selection' });
        }

        // Crear o actualizar la configuración del juego sin las columnas createdAt y updatedAt
        const [config, created] = await GameConfig.upsert({
            monsterId,
            skinId,
            musicId
        }, {
            // Especifica que no necesitas las columnas createdAt y updatedAt
            returning: true  // Esto te devuelve el objeto actualizado
        });

        return res.json({ success: true, config, created });
    } catch (error) {
        console.error('Error saving game config:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// 📌 Obtener la configuración guardada (Debug Info)
router.get('/debug', async (req, res) => {
    try {
        const config = await GameConfig.findOne({
            include: [
                { model: Monster, as: 'monster' },
                { model: Skin, as: 'skin' },
                { model: MusicSetting, as: 'music' }
            ]
        });

        if (!config) {
            return res.status(404).json({ success: false, error: 'No configuration found' });
        }

        return res.json(config);
    } catch (error) {
        console.error('Error fetching debug info:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;
