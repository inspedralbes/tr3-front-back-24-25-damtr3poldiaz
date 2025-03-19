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
    const LevelConfig = sequelize.models.levelConfig;
    
    return { GameConfig, User, Skin, MusicSetting, LevelConfig };
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
    const { GameConfig, Skin, MusicSetting, LevelConfig } = await getModels();
    const userId = req.user.userId;
    
    // Buscar la configuración existente del usuario
    let config = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: LevelConfig, as: 'level' }
      ]
    });

    // Si no existe configuración, devolver un objeto vacío
    if (!config) {
      return res.json({
        userId,
        skinId: null,
        musicId: null,
        levelId: null,
        skin: null,
        music: null,
        level: null
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
    const { GameConfig, Skin, MusicSetting, LevelConfig } = await getModels();
    const userId = req.user.userId;
    const { skinId, musicId, levelId } = req.body;

    // Verificar si ya existe una configuración para este usuario
    let config = await GameConfig.findOne({ where: { userId } });

    if (config) {
      // Actualizar configuración existente
      await config.update({
        skinId,
        musicId,
        levelId,
        updated_at: new Date()
      });
    } else {
      // Crear nueva configuración
      config = await GameConfig.create({
        userId,
        skinId,
        musicId,
        levelId
      });
    }

    // Obtener la configuración completa con relaciones
    const updatedConfig = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: LevelConfig, as: 'level' }
      ]
    });

    res.status(201).json(updatedConfig);
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para Unity (sin autenticación, con userId en la ruta)
router.get('/unity/:userId', async (req, res) => {
  try {
    const { GameConfig, Skin, MusicSetting, LevelConfig } = await getModels();
    const { userId } = req.params;
    
    // Buscar la configuración existente del usuario
    let config = await GameConfig.findOne({
      where: { userId },
      include: [
        { model: Skin, as: 'skin' },
        { model: MusicSetting, as: 'music' },
        { model: LevelConfig, as: 'level' }
      ]
    });

    // Si no existe configuración, intentamos crear una predeterminada
    if (!config) {
      try {
        // Verificar si el usuario existe
        const User = sequelize.models.user;
        const userExists = await User.findByPk(userId);
        
        if (!userExists) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Obtener valores predeterminados para crear una configuración básica
        const defaultSkin = await Skin.findOne();
        const defaultMusic = await MusicSetting.findOne();
        const defaultLevel = await LevelConfig.findOne();
        
        // Crear una configuración predeterminada
        if (defaultSkin || defaultMusic || defaultLevel) {
          config = await GameConfig.create({
            userId,
            skinId: defaultSkin ? defaultSkin.id : null,
            musicId: defaultMusic ? defaultMusic.id : null,
            levelId: defaultLevel ? defaultLevel.id : null
          });
          
          // Recargar la configuración con las relaciones
          config = await GameConfig.findOne({
            where: { userId },
            include: [
              { model: Skin, as: 'skin' },
              { model: MusicSetting, as: 'music' },
              { model: LevelConfig, as: 'level' }
            ]
          });
        } else {
          return res.status(404).json({ message: 'No hay opciones predeterminadas disponibles' });
        }
      } catch (createError) {
        console.error('Error al crear configuración predeterminada:', createError);
        return res.status(404).json({ message: 'Configuración no encontrada y no se pudo crear una predeterminada' });
      }
    }
    
    // Si aún no hay configuración, enviar el error 404
    if (!config) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    // Formatear la respuesta para Unity
    const unityResponse = {
      userId: parseInt(userId),
      skin: config.skin ? {
        id: config.skin.id,
        name: config.skin.name,
        sprite: config.skin.sprite
      } : null,
      music: config.music ? {
        id: config.music.id,
        scene: config.music.scene,
        track_path: config.music.track_path
      } : null,
      level: config.level ? {
        id: config.level.id,
        name: config.level.name,
        difficulty: config.level.difficulty
      } : null
    };

    res.json(unityResponse);
  } catch (error) {
    console.error('Error al obtener configuración para Unity:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
