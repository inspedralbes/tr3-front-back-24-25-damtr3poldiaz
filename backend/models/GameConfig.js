// En el modelo de GameConfig (por ejemplo, en 'gameConfigModel.js')
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('GameConfig', {
    monsterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    skinId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    musicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false // Desactivamos el manejo automático de createdAt y updatedAt
  });
};
