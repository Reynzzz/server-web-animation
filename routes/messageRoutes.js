import express from 'express';
import { submitMessage, getAllMessages, deleteMessage } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitMessage);
router.get('/', authMiddleware, getAllMessages);
router.delete('/:id', authMiddleware, deleteMessage);

export default router;
