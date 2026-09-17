import express from 'express';
import { 
  uploadQuestionImage, 
  deleteQuestionImage 
} from '../controllers/quizController';
import { protect, adminOnly } from '../middleware/auth';
import { handleImageUpload } from '../middleware/upload';

const router = express.Router();

// Question image upload & removal endpoints
// POST /api/questions/:id/image
router.post('/:id/image', protect, adminOnly, handleImageUpload, uploadQuestionImage);

// DELETE /api/questions/:id/image
router.delete('/:id/image', protect, adminOnly, deleteQuestionImage);

export default router;
