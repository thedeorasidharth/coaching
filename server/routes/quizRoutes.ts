import express from 'express';
import { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz,
  togglePublish
} from '../controllers/quizController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);

// Admin only routes
router.post('/create', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);
router.patch('/:id/publish', protect, adminOnly, togglePublish);

export default router;
