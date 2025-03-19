import express from 'express';
import { sequelize } from '../database.js';
import collectibleModel from '../models/collectible.js';

const router = express.Router();
const Collectible = collectibleModel(sequelize);

// Obtener todos los coleccionables
router.get('/', async (req, res) => {
    try {
        const collectibles = await Collectible.findAll();
        res.json(collectibles);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo coleccionables', details: error.message });
    }
});

// Obtener un coleccionable por ID
router.get('/:id', async (req, res) => {
    try {
        const collectible = await Collectible.findByPk(req.params.id);
        if (!collectible) {
            return res.status(404).json({ error: 'Coleccionable no encontrado' });
        }
        res.json(collectible);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo coleccionable', details: error.message });
    }
});

// Crear un nuevo coleccionable
router.post('/', async (req, res) => {
    try {
        const { name, type, sprite } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Nombre y tipo son obligatorios' });
        }

        const newCollectible = await Collectible.create({ name, type, sprite });
        res.status(201).json(newCollectible);
    } catch (error) {
        res.status(500).json({ error: 'Error creando coleccionable', details: error.message });
    }
});

// Actualizar un coleccionable
router.put('/:id', async (req, res) => {
    try {
        const { name, type, sprite } = req.body;
        const collectible = await Collectible.findByPk(req.params.id);

        if (!collectible) {
            return res.status(404).json({ error: 'Coleccionable no encontrado' });
        }

        await collectible.update({ name, type, sprite });
        res.json(collectible);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando coleccionable', details: error.message });
    }
});

// Eliminar un coleccionable
router.delete('/:id', async (req, res) => {
    try {
        const collectible = await Collectible.findByPk(req.params.id);

        if (!collectible) {
            return res.status(404).json({ error: 'Coleccionable no encontrado' });
        }

        await collectible.destroy();
        res.json({ message: 'Coleccionable eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando coleccionable', details: error.message });
    }
});

export default router;
