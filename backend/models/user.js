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
      allowNull: false,
      unique: 'username_unique'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'email_unique'
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
    timestamps: false
  });
};
