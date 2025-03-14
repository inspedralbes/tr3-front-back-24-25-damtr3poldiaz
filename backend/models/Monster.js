import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Monster', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    health: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sprite: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  }, {
    tableName: 'monstruos',
    timestamps: false,
  });
};
