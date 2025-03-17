import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js'; // Importamos la conexión a Sequelize
import userModel from './models/user.js'; // Modelo de usuarios
import monsterModel from './models/Monster.js'; // Modelo de monstruos
import collectibleModel from './models/collectible.js'; // Modelo de objetos recolectables
import skinModel from './models/Skin.js'; // Modelo de skins
import levelConfigModel from './models/levelConfig.js'; // Modelo de configuración de niveles
import musicSettingModel from './models/MusicSetting.js'; // Modelo de configuración de música
import authRoutes from './routes/auth.js'; // Rutas de autenticación
import monsterRoutes from './routes/monsters.js'; // Rutas de monstruos
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rutas y vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:5000', // Permitir solicitudes solo desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true // Permite el envío de cookies si usas sesiones
}));

// Usamos las rutas de autenticación
app.use('/auth', authRoutes);

// Usamos las rutas de monstruos
app.use('/monsters', monsterRoutes);

// Definimos los modelos con Sequelize
const User = userModel(sequelize);
const Monster = monsterModel(sequelize);
const Collectible = collectibleModel(sequelize);
const Skin = skinModel(sequelize);
const LevelConfig = levelConfigModel(sequelize);
const MusicSetting = musicSettingModel(sequelize);

// Rutas de modelos (aunque no las uses, estas rutas se refieren a los modelos)
app.use('/user', (req, res) => {
  res.json({ message: 'User model is working' });
});
app.use('/Monster', (req, res) => {
  res.json({ message: 'Monster model is working' });
});
app.use('/collectible', (req, res) => {
  res.json({ message: 'Collectible model is working' });
});
app.use('/Skin', (req, res) => {
  res.json({ message: 'Skin model is working' });
});
app.use('/level-config', (req, res) => {
  res.json({ message: 'LevelConfig model is working' });
});
app.use('/music-settings', (req, res) => {
  res.json({ message: 'MusicSetting model is working' });
});

// Página de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al backend' });
});

// Inicialización del servidor y base de datos
const initializeServer = async () => {
  try {
    // Primero, autenticamos la conexión
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Forzamos la recreación de todas las tablas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Base de datos reinicializada correctamente.');

    // Iniciamos el servidor
    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
};

initializeServer();
