import express from 'express';
import { sequelize } from '../database.js';
import musicSettingModel from '../models/MusicSetting.js';

const router = express.Router();
const MusicSetting = musicSettingModel(sequelize);

// Obtener todas las configuraciones de música
router.get('/', async (req, res) => {
    try {
        const settings = await MusicSetting.findAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo configuraciones de música', details: error.message });
    }
});

// Obtener una configuración de música por ID
router.get('/:id', async (req, res) => {
    try {
        const setting = await MusicSetting.findByPk(req.params.id);
        if (!setting) {
            return res.status(404).json({ error: 'Configuración de música no encontrada' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo configuración de música', details: error.message });
    }
});

// Crear una nueva configuración de música
router.post('/', async (req, res) => {
    try {
        const { scene, track_path, is_looping } = req.body;

        if (!scene || !track_path) {
            return res.status(400).json({ error: 'Escena y ruta de la pista son obligatorios' });
        }

        const newSetting = await MusicSetting.create({ scene, track_path, is_looping });
        res.status(201).json(newSetting);
    } catch (error) {
        res.status(500).json({ error: 'Error creando configuración de música', details: error.message });
    }
});

// Actualizar una configuración de música
router.put('/:id', async (req, res) => {
    try {
        const { scene, track_path, is_looping } = req.body;
        const setting = await MusicSetting.findByPk(req.params.id);

        if (!setting) {
            return res.status(404).json({ error: 'Configuración de música no encontrada' });
        }

        await setting.update({ scene, track_path, is_looping });
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando configuración de música', details: error.message });
    }
});

// Eliminar una configuración de música
router.delete('/:id', async (req, res) => {
    try {
        const setting = await MusicSetting.findByPk(req.params.id);

        if (!setting) {
            return res.status(404).json({ error: 'Configuración de música no encontrada' });
        }

        await setting.destroy();
        res.json({ message: 'Configuración de música eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando configuración de música', details: error.message });
    }
});

export default router;
