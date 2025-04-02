import express from 'express';
import { sequelize } from '../database.js';
import levelConfigModel from '../models/levelConfig.js';

const router = express.Router();
const LevelConfig = levelConfigModel(sequelize);

// Obtener todas las configuraciones de nivel
router.get('/', async (req, res) => {
    try {
        const levels = await LevelConfig.findAll();
        res.json(levels);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo niveles', details: error.message });
    }
});

// Obtener una configuración de nivel por ID
router.get('/:id', async (req, res) => {
    try {
        const level = await LevelConfig.findByPk(req.params.id);
        if (!level) {
            return res.status(404).json({ error: 'Nivel no encontrado' });
        }
        res.json(level);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo nivel', details: error.message });
    }
});

// Crear una nueva configuración de nivel
router.post('/', async (req, res) => {
    try {
        const { level_number, wave, enemy_type, enemy_count } = req.body;

        if (!level_number || !wave || !enemy_count) {
            return res.status(400).json({ error: 'Número de nivel, oleada y cantidad de enemigos son obligatorios' });
        }

        const newLevel = await LevelConfig.create({ level_number, wave, enemy_type, enemy_count });
        res.status(201).json(newLevel);
    } catch (error) {
        res.status(500).json({ error: 'Error creando nivel', details: error.message });
    }
});

// Actualizar una configuración de nivel
router.put('/:id', async (req, res) => {
    try {
        const { level_number, wave, enemy_type, enemy_count } = req.body;
        const level = await LevelConfig.findByPk(req.params.id);

        if (!level) {
            return res.status(404).json({ error: 'Nivel no encontrado' });
        }

        await level.update({ level_number, wave, enemy_type, enemy_count });
        res.json(level);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando nivel', details: error.message });
    }
});

// Eliminar una configuración de nivel
router.delete('/:id', async (req, res) => {
    try {
        const level = await LevelConfig.findByPk(req.params.id);

        if (!level) {
            return res.status(404).json({ error: 'Nivel no encontrado' });
        }

        await level.destroy();
        res.json({ message: 'Nivel eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando nivel', details: error.message });
    }
});

export default router;
