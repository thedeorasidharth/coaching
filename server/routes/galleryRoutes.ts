import express from 'express';
import { 
  getGallery, 
  uploadImage, 
  deleteImage 
} from '../controllers/galleryController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getGallery); // Publicly accessible
router.post('/', protect, adminOnly, uploadImage);
router.delete('/:id', protect, adminOnly, deleteImage);

export default router;
