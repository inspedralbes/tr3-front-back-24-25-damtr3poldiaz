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
import gameConfigModel from './models/GameConfig.js'; // Modelo de configuración de juego
import authRoutes from './routes/auth.js'; // Rutas de autenticación
import monsterRoutes from './routes/monsters.js'; // Rutas de monstruos
import collectibleRoutes from './routes/collectibles.js'; // Rutas de objetos recolectables
import skinRoutes from './routes/skins.js'; // Rutas de skins
import levelRoutes from './routes/levels.js'; // Rutas de niveles
import musicRoutes from './routes/music.js'; // Rutas de música
import gameConfigRoutes from './routes/gameConfig.js'; // Rutas de configuración de juego
import cors from 'cors';
import session from 'express-session';
import SequelizeStorePkg from 'connect-session-sequelize';

const SequelizeStore = SequelizeStorePkg(session.Store);
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

// Configuración de sesiones a nivel de aplicación
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_seguro',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

sessionStore.sync(); // Sincroniza el almacenamiento de sesiones

// Definimos los modelos con Sequelize
const User = userModel(sequelize);
const Monster = monsterModel(sequelize);
const Collectible = collectibleModel(sequelize);
const Skin = skinModel(sequelize);
const LevelConfig = levelConfigModel(sequelize);
const MusicSetting = musicSettingModel(sequelize);
const GameConfig = gameConfigModel(sequelize);

// Establecemos las relaciones entre modelos
GameConfig.belongsTo(User, { foreignKey: 'userId', as: 'user' });
GameConfig.belongsTo(Skin, { foreignKey: 'skinId', as: 'skin' });
GameConfig.belongsTo(MusicSetting, { foreignKey: 'musicId', as: 'music' });
GameConfig.belongsTo(LevelConfig, { foreignKey: 'levelId', as: 'level' });

// Exponemos los modelos globalmente para usar en las rutas
sequelize.models.user = User;
sequelize.models.monster = Monster;
sequelize.models.collectible = Collectible;
sequelize.models.skin = Skin;
sequelize.models.levelConfig = LevelConfig;
sequelize.models.musicSetting = MusicSetting;
sequelize.models.gameConfig = GameConfig;

// Usamos las rutas
app.use('/auth', authRoutes);
app.use('/monsters', monsterRoutes);
app.use('/collectibles', collectibleRoutes);
app.use('/skins', skinRoutes);
app.use('/levels', levelRoutes);
app.use('/music', musicRoutes);
app.use('/game-config', gameConfigRoutes);

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

    // Luego sincronizamos los modelos uno por uno
    await User.sync();
    await Monster.sync();
    await Collectible.sync();
    await Skin.sync();
    await LevelConfig.sync();
    await MusicSetting.sync();
    await GameConfig.sync();
    
    console.log('Modelos sincronizados correctamente.');

    // Finalmente, iniciamos el servidor
    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
};

initializeServer();
