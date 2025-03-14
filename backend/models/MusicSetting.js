import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('MusicSetting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    scene: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    track_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_looping: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'music_settings',
    timestamps: false,
  });
};
