import { Sequelize } from 'sequelize';

// Crea una nueva instancia de Sequelize para conectar con la base de datos
export const sequelize = new Sequelize('my_database', 'user', 'password', {
    host: '192.168.16.43',
    dialect: 'mysql',
    logging: false, // Opcional: Puedes desactivar el logging para no ver las consultas SQL en consola
});
