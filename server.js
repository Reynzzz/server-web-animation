import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import apiRoutes from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',       // FE Local 1 (misal: fe-user lokal)
    'http://localhost:3001',       // FE Local 2 (misal: fe-admin lokal)
    'http://103.150.92.197:3000',   // FE User di VPS (sesuaikan portnya nanti jika beda)
    'http://103.150.92.197:3001',
    'http://103.150.92.197'   // FE Admin di VPS (sesuaikan portnya nanti jika beda)
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
}

startServer();
