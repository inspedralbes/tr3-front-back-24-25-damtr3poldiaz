import { Sequelize } from 'sequelize';

// Crea una nueva instancia de Sequelize para conectar con la base de datos
export const sequelize = new Sequelize('my_database', 'user', 'password', {
    host: '192.168.1.238',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    }
});

// Importar modelos
import defineUser from './models/user.js';
import defineGameConfig from './models/GameConfig.js';
import defineSkin from './models/Skin.js';
import defineMusicSetting from './models/MusicSetting.js';
import defineMonster from './models/Monster.js';

// Definir modelos
const User = defineUser(sequelize);
const GameConfig = defineGameConfig(sequelize);
const Skin = defineSkin(sequelize);
const MusicSetting = defineMusicSetting(sequelize);
const Monster = defineMonster(sequelize);

// Definir asociaciones
User.hasOne(GameConfig, { foreignKey: 'userId' });
GameConfig.belongsTo(User, { foreignKey: 'userId' });

Skin.hasMany(GameConfig, { foreignKey: 'skinId' });
GameConfig.belongsTo(Skin, { as: 'skin', foreignKey: 'skinId' });

MusicSetting.hasMany(GameConfig, { foreignKey: 'musicId' });
GameConfig.belongsTo(MusicSetting, { as: 'music', foreignKey: 'musicId' });

Monster.hasMany(GameConfig, { foreignKey: 'monsterId' });
GameConfig.belongsTo(Monster, { as: 'monster', foreignKey: 'monsterId' });

// Exportar modelos
export const models = {
    User,
    GameConfig,
    Skin,
    MusicSetting,
    Monster
};

// Función para sincronizar la base de datos
export const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada correctamente');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};