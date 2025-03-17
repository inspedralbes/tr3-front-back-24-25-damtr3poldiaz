import express from 'express';
import { sequelize } from '../database.js';
import monsterModel from '../models/Monster.js';

const router = express.Router();
const Monster = monsterModel(sequelize);

// Obtener todos los monstruos
router.get('/', async (req, res) => {
    try {
        const monsters = await Monster.findAll();
        res.json(monsters);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo monstruos', details: error.message });
    }
});

// Obtener un monstruo por ID
router.get('/:id', async (req, res) => {
    try {
        const monster = await Monster.findByPk(req.params.id);
        if (!monster) {
            return res.status(404).json({ error: 'Monstruo no encontrado' });
        }
        res.json(monster);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo monstruo', details: error.message });
    }
});

// Crear un nuevo monstruo
router.post('/', async (req, res) => {
    try {
        const { name, strength, speed, health, sprite } = req.body;

        if (!name || !strength || !speed || !health) {
            return res.status(400).json({ error: 'Todos los campos excepto sprite son obligatorios' });
        }

        const newMonster = await Monster.create({ name, strength, speed, health, sprite });
        res.status(201).json(newMonster);
    } catch (error) {
        res.status(500).json({ error: 'Error creando monstruo', details: error.message });
    }
});

// Actualizar un monstruo
router.put('/:id', async (req, res) => {
    try {
        const { name, strength, speed, health, sprite } = req.body;
        const monster = await Monster.findByPk(req.params.id);

        if (!monster) {
            return res.status(404).json({ error: 'Monstruo no encontrado' });
        }

        await monster.update({ name, strength, speed, health, sprite });
        res.json(monster);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando monstruo', details: error.message });
    }
});

// Eliminar un monstruo
router.delete('/:id', async (req, res) => {
    try {
        const monster = await Monster.findByPk(req.params.id);

        if (!monster) {
            return res.status(404).json({ error: 'Monstruo no encontrado' });
        }

        await monster.destroy();
        res.json({ message: 'Monstruo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando monstruo', details: error.message });
    }
});

export default router;
