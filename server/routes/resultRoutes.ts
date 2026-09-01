import express from 'express';
import { 
  submitResult, 
  getStudentResults, 
  getResultById,
  getQuizResults,
  getQuizAnalytics
} from '../controllers/resultController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.post('/submit', protect, submitResult);
router.get('/student', protect, getStudentResults);
router.get('/detail/:id', protect, getResultById);
router.get('/quiz/:id', protect, adminOnly, getQuizResults);
router.get('/analytics/:id', protect, adminOnly, getQuizAnalytics);

export default router;
