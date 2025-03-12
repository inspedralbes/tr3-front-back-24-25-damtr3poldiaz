import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Microservice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive',
    },
  }, {
    tableName: 'microservices',
    timestamps: false,
  });
};
