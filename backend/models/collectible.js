import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('collectible', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('weapon', 'power-up'),
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
    tableName: 'collectibles',
    timestamps: false,
  });
};
