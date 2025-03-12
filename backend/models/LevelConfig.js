import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('LevelConfig', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    level_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wave: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enemy_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'monstruos', // Nombre de la tabla referenciada
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    enemy_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'level_config',
    timestamps: false,
  });
};
