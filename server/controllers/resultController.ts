import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { Quiz } from '../models/Quiz';

export const submitResult = async (req: any, res: Response) => {
  const { quizId, answers, timeTaken } = req.body;
  const studentId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Evaluate on server side for security
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const percentage = (score / quiz.totalMarks) * 100;

    const result = new Result({
      studentId,
      quizId,
      answers,
      score,
      percentage,
      timeTaken
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentResults = async (req: any, res: Response) => {
  try {
    const results = await Result.find({ studentId: req.user.id })
      .populate('quizId', 'title subject totalMarks')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const results = await Result.find({ quizId: req.params.id })
      .populate('studentId', 'fullName username profileImage')
      .sort('-score');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizAnalytics = async (req: Request, res: Response) => {
  try {
    const results = await Result.find({ quizId: req.params.id });
    if (results.length === 0) return res.json({ count: 0 });

    const totalScores = results.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = totalScores / results.length;
    const highestScore = Math.max(...results.map(r => r.score));
    
    res.json({
      count: results.length,
      avgScore,
      highestScore,
      // More analytics could be added here (e.g. topper, etc)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
