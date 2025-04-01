import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js';
import userModel from './models/user.js';
import monsterModel from './models/Monster.js';
import collectibleModel from './models/collectible.js';
import skinModel from './models/Skin.js';
import musicSettingModel from './models/MusicSetting.js';
import gameConfigModel from './models/GameConfig.js';
import authRoutes from './routes/auth.js';
import monsterRoutes from './routes/monsters.js';
import collectibleRoutes from './routes/collectibles.js';
import skinRoutes from './routes/skins.js';
import musicRoutes from './routes/music.js';
import gameConfigRoutes from './routes/gameConfig.js';
import cors from 'cors';
import session from 'express-session';
import SequelizeStorePkg from 'connect-session-sequelize';

const SequelizeStore = SequelizeStorePkg(session.Store);
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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

sessionStore.sync();

const User = userModel(sequelize);
const Monster = monsterModel(sequelize);
const Collectible = collectibleModel(sequelize);
const Skin = skinModel(sequelize);
const MusicSetting = musicSettingModel(sequelize);
const GameConfig = gameConfigModel(sequelize);

// Definir asociaciones
GameConfig.belongsTo(User, { foreignKey: 'userId', as: 'user' });
GameConfig.belongsTo(Skin, { foreignKey: 'skinId', as: 'skin' });
GameConfig.belongsTo(MusicSetting, { foreignKey: 'musicId', as: 'music' });
GameConfig.belongsTo(Monster, { foreignKey: 'monsterId', as: 'monster' });

// Registrar modelos en sequelize
sequelize.models.user = User;
sequelize.models.monster = Monster;
sequelize.models.collectible = Collectible;
sequelize.models.skin = Skin;
sequelize.models.musicSetting = MusicSetting;
sequelize.models.gameConfig = GameConfig;

// Registrar rutas
app.use('/auth', authRoutes);
app.use('/monsters', monsterRoutes);
app.use('/collectibles', collectibleRoutes);
app.use('/skins', skinRoutes);
app.use('/music', musicRoutes);
app.use('/game-config', gameConfigRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al backend' });
});

const initializeServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await User.sync();
    await Monster.sync();
    await Collectible.sync();
    await Skin.sync();
    await MusicSetting.sync();
    await GameConfig.sync();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
  }
};

initializeServer();
