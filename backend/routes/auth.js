import express from 'express';
import bcrypt from 'bcryptjs';
import { sequelize } from '../database.js'; // Importa la conexión a la base de datos
import UserModel from '../models/user.js'; // Asegúrate de tener la ruta correcta al modelo

const router = express.Router();

// Define el modelo de usuario usando Sequelize
const User = UserModel(sequelize);

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Usa Sequelize para insertar un nuevo usuario
        const user = await User.create({
            username,
            email,
            password_hash: hashedPassword,
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Error registrando el usuario', details: error.message });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        // Usa Sequelize para buscar el usuario
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: 'Login exitoso', user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: 'Error en el login', details: error.message });
    }
});

// Logout de usuario
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error cerrando sesión' });
        }
        res.json({ message: 'Sesión cerrada correctamente' });
    });
});

// Verificar sesión
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

export default router;
