import express from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import messageRoutes from './messageRoutes.js';
import contentRoutes from './contentRoutes.js';
import serviceRoutes from './serviceRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/content', contentRoutes);
router.use('/services', serviceRoutes);

export default router;
