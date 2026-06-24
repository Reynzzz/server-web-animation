import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post('/', authMiddleware, upload.single('imageFile'), createService);
router.put('/:id', authMiddleware, upload.single('imageFile'), updateService);
router.delete('/:id', authMiddleware, deleteService);

export default router;
