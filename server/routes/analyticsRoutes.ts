import express from 'express';
import { 
  getOverviewAnalytics, 
  getLeaderboard, 
  getSubjectAnalytics,
  getPerformanceTrend,
  getWeakStudents
} from '../controllers/analyticsController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard); // Accessible to all authenticated users

router.get('/overview', protect, adminOnly, getOverviewAnalytics);
router.get('/subjects', protect, adminOnly, getSubjectAnalytics);
router.get('/trend', protect, adminOnly, getPerformanceTrend);
router.get('/weak-students', protect, adminOnly, getWeakStudents);

export default router;
