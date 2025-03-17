import { Sequelize } from 'sequelize';

// Crea una nueva instancia de Sequelize para conectar con la base de datos
export const sequelize = new Sequelize('my_database', 'user', 'password', {
    host: '192.168.17.1',
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
