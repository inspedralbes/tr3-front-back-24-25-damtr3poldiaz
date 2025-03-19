import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('gameConfig', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Cada usuario tiene una única configuración
      references: {
        model: 'users',
        key: 'id'
      }
    },
    skinId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'skins',
        key: 'id'
      }
    },
    musicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'music_settings',
        key: 'id'
      }
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'level_config', 
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  }, {
    tableName: 'game_configs',
    timestamps: false
  });
};
