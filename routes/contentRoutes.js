import express from 'express';
import {
  getAllContent,
  getSettingByKey,
  updateSetting,
  getContentItems,
  createContentItem,
  updateContentItem,
  deleteContentItem,
} from '../controllers/contentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/settings/:key', getSettingByKey);
router.put('/settings/:key', authMiddleware, upload.single('imageFile'), updateSetting);

router.get('/items', getContentItems);
router.post('/items', authMiddleware, upload.single('imageFile'), createContentItem);
router.put('/items/:id', authMiddleware, upload.single('imageFile'), updateContentItem);
router.delete('/items/:id', authMiddleware, deleteContentItem);

export default router;
