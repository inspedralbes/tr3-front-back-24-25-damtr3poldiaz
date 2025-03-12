import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  }, {
    tableName: 'users',
    timestamps: false,
  });
};
