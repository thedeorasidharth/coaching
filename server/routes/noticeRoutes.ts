import express from 'express';
import { createNotice, getNotices, deleteNotice, updateNotice } from '../controllers/contentController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getNotices);
router.post('/', protect, adminOnly, createNotice);
router.patch('/:id', protect, adminOnly, updateNotice);
router.delete('/:id', protect, adminOnly, deleteNotice);

export default router;
