import express from 'express';
import { 
  createStudent, 
  getStudents, 
  getStudentById,
  updateStudent,
  deleteStudent,
  resetPassword,
  toggleStatus
} from '../controllers/studentController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// All routes here are protected and admin only
router.use(protect);
router.use(adminOnly);

router.post('/create', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id/reset-password', resetPassword);
router.patch('/:id/status', toggleStatus);

export default router;
