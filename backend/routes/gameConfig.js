import express from 'express';
import { sequelize } from '../database.js';

const router = express.Router();

// Importamos los modelos
const getModels = async () => {
  try {
    // Aseguramos que los modelos estén cargados
    const GameConfig = sequelize.models.gameConfig;
    const User = sequelize.models.user;
    const Skin = sequelize.models.skin;
    const MusicSetting = sequelize.models.musicSetting;
    const Monster = sequelize.models.monster;
    
    return { GameConfig, User, Skin, MusicSetting, Monster };
  } catch (error) {
    console.error('Error cargando modelos:', error);
    throw error;
  }
};

// Middleware para verificar sesión y agregar req.user
const authenticateSession = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = {
      userId: req.session.user.id
    };
    next();
  } else {
    res.status(401).json({ message: 'No hay sesión de usuario activa' });
  }
};

// Obtener configuración del juego para un usuario
router.get('/', authenticateSession, async (req, res) => {
  try {
    const { GameConfig, Skin, MusicSetting, Monster } = await getModels();
    const userId = req.user.userId;
    
    // Buscar la configuración existente del usuario
    let config = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: Monster, as: 'monster' }
      ]
    });

    // Si no existe configuración, devolver un objeto vacío
    if (!config) {
      return res.json({
        userId,
        skinId: null,
        musicId: null,
        monsterId: null,
        skin: null,
        music: null,
        monster: null
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear o actualizar configuración del juego
router.post('/', authenticateSession, async (req, res) => {
  try {
    const { GameConfig, Skin, MusicSetting, Monster } = await getModels();
    const userId = req.user.userId;
    const { skinId, musicId, monsterId } = req.body;

    // Verificar si ya existe una configuración para este usuario
    let config = await GameConfig.findOne({ where: { userId } });

    if (config) {
      // Actualizar configuración existente
      await config.update({
        skinId,
        musicId,
        monsterId,
        updated_at: new Date()
      });
    } else {
      // Crear nueva configuración
      config = await GameConfig.create({
        userId,
        skinId,
        musicId,
        monsterId
      });
    }

    // Obtener la configuración completa con relaciones
    const updatedConfig = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: Monster, as: 'monster' }
      ]
    });

    res.json(updatedConfig);
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para Unity - obtener configuración por userId
router.get('/unity/:userId', async (req, res) => {
  try {
    const { GameConfig, Skin, MusicSetting, Monster } = await getModels();
    const { userId } = req.params;
    
    const config = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: Monster, as: 'monster' }
      ]
    });
    
    if (!config) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    res.json({
      userId: config.userId,
      skin: config.skin,
      music: config.music,
      monster: config.monster
    });
  } catch (error) {
    console.error('Error al obtener configuración para Unity:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
