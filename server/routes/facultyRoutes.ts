import express from 'express';
import { 
  getFaculty, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty 
} from '../controllers/facultyController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getFaculty); // Publicly accessible
router.post('/', protect, adminOnly, createFaculty);
router.patch('/:id', protect, adminOnly, updateFaculty);
router.delete('/:id', protect, adminOnly, deleteFaculty);

export default router;
