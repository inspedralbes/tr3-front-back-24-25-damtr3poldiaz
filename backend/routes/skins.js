import express from 'express';
import { sequelize } from '../database.js';
import skinModel from '../models/Skin.js';

const router = express.Router();
const Skin = skinModel(sequelize);

// Obtener todas las skins
router.get('/', async (req, res) => {
    try {
        const skins = await Skin.findAll();
        res.json(skins);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo skins', details: error.message });
    }
});

// Obtener una skin por ID
router.get('/:id', async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);
        if (!skin) {
            return res.status(404).json({ error: 'Skin no encontrada' });
        }
        res.json(skin);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo skin', details: error.message });
    }
});

// Crear una nueva skin
router.post('/', async (req, res) => {
    try {
        const { name, description, sprite } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const newSkin = await Skin.create({ name, description, sprite });
        res.status(201).json(newSkin);
    } catch (error) {
        res.status(500).json({ error: 'Error creando skin', details: error.message });
    }
});

// Actualizar una skin
router.put('/:id', async (req, res) => {
    try {
        const { name, description, sprite } = req.body;
        const skin = await Skin.findByPk(req.params.id);

        if (!skin) {
            return res.status(404).json({ error: 'Skin no encontrada' });
        }

        await skin.update({ name, description, sprite });
        res.json(skin);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando skin', details: error.message });
    }
});

// Eliminar una skin
router.delete('/:id', async (req, res) => {
    try {
        const skin = await Skin.findByPk(req.params.id);

        if (!skin) {
            return res.status(404).json({ error: 'Skin no encontrada' });
        }

        await skin.destroy();
        res.json({ message: 'Skin eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando skin', details: error.message });
    }
});

export default router;
