import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { Quiz } from '../models/Quiz';
import { Student } from '../models/Student';
import mongoose from 'mongoose';

export const getOverviewAnalytics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTests = await Quiz.countDocuments();
    const totalResults = await Result.countDocuments();
    
    const overallStats = await Result.aggregate([
      {
        $group: {
          _id: null,
          avgPercentage: { $avg: '$percentage' },
          highestScore: { $max: '$score' },
          totalMarks: { $sum: 1 } // placeholder for something else if needed
        }
      }
    ]);

    const activeToday = await Result.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
      totalStudents,
      totalTests,
      totalResults,
      avgMarks: overallStats[0]?.avgPercentage || 0,
      highestScore: overallStats[0]?.highestScore || 0,
      activeToday
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$studentId',
          avgPercentage: { $avg: '$percentage' },
          totalTests: { $sum: 1 },
          highestScore: { $max: '$score' }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      { $sort: { avgPercentage: -1 } },
      { $limit: 10 },
      {
        $project: {
          'student.password': 0,
          'student.role': 0
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubjectAnalytics = async (req: Request, res: Response) => {
  try {
    const subjects = await Result.aggregate([
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      { $unwind: '$quiz' },
      {
        $group: {
          _id: '$quiz.subject',
          avgPercentage: { $avg: '$percentage' },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPerformanceTrend = async (req: Request, res: Response) => {
  try {
    const trend = await Result.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgPercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeakStudents = async (req: Request, res: Response) => {
  try {
    const weakStudents = await Result.aggregate([
      {
        $group: {
          _id: '$studentId',
          avgPercentage: { $avg: '$percentage' },
          totalTests: { $sum: 1 }
        }
      },
      { $match: { avgPercentage: { $lt: 40 } } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      { $sort: { avgPercentage: 1 } },
      { $limit: 10 }
    ]);

    res.json(weakStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
