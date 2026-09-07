import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { Quiz } from '../models/Quiz';
import { Student } from '../models/Student';
import { Notice } from '../models/Notice';
import mongoose from 'mongoose';

const buildFilterMatch = async (query: any) => {
  const { className, class: classFilter, course, subject, timeRange } = query;
  const targetClass = classFilter || className;

  const matchConditions: any = {};
  const studentQuery: any = {};
  const quizQuery: any = {};

  // 1. Time range filter
  if (timeRange && timeRange !== 'all') {
    const now = new Date();
    let days = 0;
    if (timeRange === '7d') days = 7;
    else if (timeRange === '30d') days = 30;
    else if (timeRange === '90d') days = 90;

    if (days > 0) {
      matchConditions.createdAt = { $gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) };
    }
  }

  // 2. Student query (class, course)
  let hasStudentFilter = false;
  if (targetClass && targetClass !== 'All Classes' && targetClass !== 'all') {
    studentQuery.class = targetClass;
    hasStudentFilter = true;
  }
  if (course && course !== 'All Courses' && course !== 'all') {
    studentQuery.course = course;
    hasStudentFilter = true;
  }

  // 3. Quiz query (subject, examType, class)
  let hasQuizFilter = false;
  if (subject && subject !== 'All Subjects' && subject !== 'all') {
    quizQuery.subject = subject;
    hasQuizFilter = true;
  }
  if (course && course !== 'All Courses' && course !== 'all') {
    quizQuery.examType = course;
    hasQuizFilter = true;
  }
  if (targetClass && targetClass !== 'All Classes' && targetClass !== 'all') {
    quizQuery.$or = [{ class: targetClass }, { targetClass: targetClass }];
    hasQuizFilter = true;
  }

  if (hasStudentFilter) {
    const matchingStudentIds = await Student.find(studentQuery).distinct('_id');
    matchConditions.studentId = { $in: matchingStudentIds };
  }

  if (hasQuizFilter) {
    const matchingQuizIds = await Quiz.find(quizQuery).distinct('_id');
    matchConditions.quizId = { $in: matchingQuizIds };
  }

  return { matchConditions, studentQuery, quizQuery, targetClass, course, subject };
};

export const getOverviewAnalytics = async (req: Request, res: Response) => {
  try {
    const { matchConditions, studentQuery, quizQuery, targetClass } = await buildFilterMatch(req.query);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const noticeQuery: any = {};
    if (targetClass && targetClass !== 'All Classes' && targetClass !== 'all') {
      noticeQuery.targetClass = { $in: [targetClass, 'All Classes'] };
    }

    const [
      totalStudents,
      totalTests,
      totalResults,
      totalNotices,
      overallStats,
      activeToday
    ] = await Promise.all([
      Student.countDocuments(studentQuery),
      Quiz.countDocuments(quizQuery),
      Result.countDocuments(matchConditions),
      Notice.countDocuments(noticeQuery),
      Result.aggregate([
        ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
        {
          $group: {
            _id: null,
            avgPercentage: { $avg: '$percentage' },
            highestScore: { $max: '$score' },
            totalMarks: { $sum: 1 }
          }
        }
      ]),
      Result.countDocuments({
        ...matchConditions,
        createdAt: { $gte: todayStart }
      })
    ]);

    res.json({
      totalStudents,
      totalTests,
      totalResults,
      totalNotices,
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
    const { matchConditions } = await buildFilterMatch(req.query);

    const pipeline: any[] = [];
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push(
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
    );

    const leaderboard = await Result.aggregate(pipeline);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubjectAnalytics = async (req: Request, res: Response) => {
  try {
    const queryWithoutSubject = { ...req.query };
    delete queryWithoutSubject.subject;
    const { matchConditions } = await buildFilterMatch(queryWithoutSubject);

    const pipeline: any[] = [];
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push(
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
    );

    const subjects = await Result.aggregate(pipeline);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPerformanceTrend = async (req: Request, res: Response) => {
  try {
    const { matchConditions } = await buildFilterMatch(req.query);

    const pipeline: any[] = [];
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgPercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    );

    const trend = await Result.aggregate(pipeline);
    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeakStudents = async (req: Request, res: Response) => {
  try {
    const { matchConditions } = await buildFilterMatch(req.query);

    const pipeline: any[] = [];
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push(
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
    );

    const weakStudents = await Result.aggregate(pipeline);
    res.json(weakStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAuditReport = async (req: Request, res: Response) => {
  try {
    const { matchConditions, studentQuery, quizQuery } = await buildFilterMatch(req.query);

    const [overviewData, leaderboardData, weakData, results] = await Promise.all([
      Result.aggregate([
        ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
        {
          $group: {
            _id: null,
            avgPercentage: { $avg: '$percentage' },
            highestScore: { $max: '$score' },
            totalAttempts: { $sum: 1 }
          }
        }
      ]),
      Result.aggregate([
        ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
        {
          $group: {
            _id: '$studentId',
            avgPercentage: { $avg: '$percentage' },
            totalTests: { $sum: 1 },
            highestScore: { $max: '$score' }
          }
        },
        { $lookup: { from: 'students', localField: '_id', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $sort: { avgPercentage: -1 } },
        { $limit: 50 }
      ]),
      Result.aggregate([
        ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
        {
          $group: {
            _id: '$studentId',
            avgPercentage: { $avg: '$percentage' },
            totalTests: { $sum: 1 }
          }
        },
        { $match: { avgPercentage: { $lt: 40 } } },
        { $lookup: { from: 'students', localField: '_id', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $sort: { avgPercentage: 1 } },
        { $limit: 50 }
      ]),
      Result.find(matchConditions)
        .populate('studentId', 'fullName phone class course username')
        .populate('quizId', 'title subject class examType totalMarks')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean()
    ]);

    const totalStudents = await Student.countDocuments(studentQuery);
    const totalTests = await Quiz.countDocuments(quizQuery);

    res.json({
      filters: {
        class: req.query.class || req.query.className || 'All Classes',
        course: req.query.course || 'All Courses',
        subject: req.query.subject || 'All Subjects',
        timeRange: req.query.timeRange || 'All Time',
        generatedAt: new Date().toISOString()
      },
      summary: {
        totalStudents,
        totalTests,
        totalAttempts: overviewData[0]?.totalAttempts || 0,
        avgPercentage: overviewData[0]?.avgPercentage ? Math.round(overviewData[0].avgPercentage) : 0,
        highestScore: overviewData[0]?.highestScore || 0
      },
      leaderboard: leaderboardData.map(item => ({
        studentName: item.student?.fullName || 'N/A',
        phone: item.student?.phone || 'N/A',
        class: item.student?.class || 'N/A',
        course: item.student?.course || 'N/A',
        avgPercentage: Math.round(item.avgPercentage),
        totalTests: item.totalTests,
        highestScore: item.highestScore
      })),
      weakStudents: weakData.map(item => ({
        studentName: item.student?.fullName || 'N/A',
        phone: item.student?.phone || 'N/A',
        class: item.student?.class || 'N/A',
        course: item.student?.course || 'N/A',
        avgPercentage: Math.round(item.avgPercentage),
        totalTests: item.totalTests
      })),
      detailedResults: results.map((r: any) => ({
        date: r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : 'N/A',
        studentName: r.studentId?.fullName || 'N/A',
        phone: r.studentId?.phone || 'N/A',
        class: r.studentId?.class || r.quizId?.class || 'N/A',
        course: r.studentId?.course || r.quizId?.examType || 'N/A',
        quizTitle: r.quizId?.title || 'N/A',
        subject: r.quizId?.subject || 'N/A',
        score: r.score,
        totalMarks: r.quizId?.totalMarks || 'N/A',
        percentage: `${Math.round(r.percentage)}%`,
        timeTakenMinutes: r.timeTaken ? Math.round(r.timeTaken / 60) : 'N/A',
        correctCount: r.correctCount || 0,
        incorrectCount: r.incorrectCount || 0,
        unattemptedCount: r.unattemptedCount || 0
      }))
    });
  } catch (error) {
    console.error('Audit report error:', error);
    res.status(500).json({ message: 'Server error generating audit report' });
  }
};
