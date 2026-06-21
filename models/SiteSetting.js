import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SiteSetting = sequelize.define('SiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

export default SiteSetting;
