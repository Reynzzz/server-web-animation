import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.STRING,
  },
  client: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  heroImage: {
    type: DataTypes.TEXT,
  },
  gallery: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

export default Project;
