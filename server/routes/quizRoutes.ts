import express from 'express';
import { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz,
  togglePublish,
  uploadQuestionImage,
  deleteQuestionImage,
  uploadStandaloneImage,
  deleteStandaloneImage
} from '../controllers/quizController';
import { protect, adminOnly } from '../middleware/auth';
import { handleImageUpload } from '../middleware/upload';

const router = express.Router();

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);

// Admin only routes
router.post('/create', protect, adminOnly, createQuiz);
router.post('/upload-image', protect, adminOnly, handleImageUpload, uploadStandaloneImage);
router.delete('/delete-image', protect, adminOnly, deleteStandaloneImage);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);
router.patch('/:id/publish', protect, adminOnly, togglePublish);

// Question image upload & management routes for existing tests
router.post('/:quizId/questions/:questionId/image', protect, adminOnly, handleImageUpload, uploadQuestionImage);
router.delete('/:quizId/questions/:questionId/image', protect, adminOnly, deleteQuestionImage);

export default router;
