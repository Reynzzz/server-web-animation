import express from 'express';
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'heroImageFile', maxCount: 1 },
  { name: 'galleryFiles', maxCount: 10 }
]);

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', authMiddleware, uploadFields, createProject);
router.put('/:id', authMiddleware, uploadFields, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
