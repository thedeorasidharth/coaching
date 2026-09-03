import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { Quiz } from '../models/Quiz';

export const submitResult = async (req: any, res: Response) => {
  const { quizId, answers, timeTaken, questionStatus: clientQuestionStatus } = req.body;
  const studentId = req.user.id;

  try {
    // 1. Fetch target test
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // 2. Validate student role & access window
    if (req.user?.role !== 'admin') {
      if (!quiz.published) {
        console.warn(`[submitResult] Submission rejected: Quiz ${quiz._id} is not published.`);
        return res.status(403).json({ message: 'This test is not published or available for submission.' });
      }

      const now = new Date();
      if (quiz.startDate && now < new Date(quiz.startDate)) {
        console.warn(`[submitResult] Submission rejected: Quiz ${quiz._id} start date is in the future.`);
        return res.status(400).json({ message: `This assessment will be available starting ${new Date(quiz.startDate).toLocaleString()}` });
      }
      if (quiz.endDate && now > new Date(quiz.endDate)) {
        console.warn(`[submitResult] Submission rejected: Quiz ${quiz._id} availability window closed at ${quiz.endDate}.`);
        return res.status(400).json({ message: `This assessment closed on ${new Date(quiz.endDate).toLocaleString()}. Submissions are no longer accepted.` });
      }
    }

    // 3. Duplicate attempt protection
    const existingResult = await Result.findOne({ studentId, quizId });
    if (existingResult) {
      console.warn(`[submitResult] Submission rejected: Student ${studentId} already submitted quiz ${quizId}.`);
      return res.status(409).json({ message: 'You have already submitted this assessment.' });
    }

    // 4. Payload validation
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ 
        message: `Answer count (${answers?.length}) does not match test question count (${quiz.questions.length}).` 
      });
    }

    // 5. Server-side score evaluation with +4 / -1 negative marking & dynamic subject breakdown
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let negativeMarksDeducted = 0;
    const questionStatus: string[] = [];
    const subjectScores: Record<string, { score: number; correct: number; incorrect: number; unattempted: number; totalQuestions: number }> = {};

    quiz.questions.forEach((q: any, idx: number) => {
      const studentAns = answers[idx];
      const posMarks = typeof q.marks === 'number' ? q.marks : 4;
      const negMarks = typeof q.negativeMarks === 'number' ? q.negativeMarks : 1;
      const subjName = q.subject && q.subject.trim() !== '' ? q.subject.trim() : (quiz.subject || 'General');

      if (!subjectScores[subjName]) {
        subjectScores[subjName] = { score: 0, correct: 0, incorrect: 0, unattempted: 0, totalQuestions: 0 };
      }
      subjectScores[subjName].totalQuestions += 1;

      // Status classification
      let status = 'notVisited';
      if (clientQuestionStatus && Array.isArray(clientQuestionStatus) && clientQuestionStatus[idx]) {
        status = clientQuestionStatus[idx];
      } else if (studentAns === -1 || studentAns === null || studentAns === undefined) {
        status = 'notAnswered';
      } else {
        status = 'answered';
      }
      questionStatus.push(status);

      // Scoring
      if (studentAns === q.correctAnswer) {
        score += posMarks;
        correctCount += 1;
        subjectScores[subjName].correct += 1;
        subjectScores[subjName].score += posMarks;
      } else if (studentAns !== -1 && studentAns !== null && studentAns !== undefined && studentAns >= 0) {
        score -= negMarks;
        negativeMarksDeducted += negMarks;
        incorrectCount += 1;
        subjectScores[subjName].incorrect += 1;
        subjectScores[subjName].score -= negMarks;
      } else {
        unattemptedCount += 1;
        subjectScores[subjName].unattempted += 1;
      }
    });

    const totalPossibleMarks = quiz.totalMarks || quiz.questions.reduce((acc: number, q: any) => acc + (q.marks || 4), 0);
    const rawPercentage = totalPossibleMarks > 0 ? (score / totalPossibleMarks) * 100 : 0;
    const percentage = parseFloat(Math.max(0, rawPercentage).toFixed(2));

    // Sanitize timeTaken (allow 5-minute buffer over duration)
    const maxAllowedTime = (quiz.duration * 60) + 300;
    const safeTimeTaken = (typeof timeTaken === 'number' && timeTaken >= 0 && timeTaken <= maxAllowedTime) 
      ? Math.floor(timeTaken) 
      : (quiz.duration * 60);

    const result = new Result({
      studentId,
      quizId,
      answers,
      score,
      percentage,
      timeTaken: safeTimeTaken,
      correctCount,
      incorrectCount,
      unattemptedCount,
      negativeMarksDeducted,
      questionStatus,
      subjectScores,
      submittedAt: new Date()
    });

    await result.save();
    res.status(201).json(result);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already submitted this assessment.' });
    }
    console.error("Result submission error:", error);
    res.status(500).json({ message: 'Server error during submission' });
  }
};

export const getStudentResults = async (req: any, res: Response) => {
  try {
    const results = await Result.find({ studentId: req.user.id })
      .populate('quizId', 'title subject totalMarks duration examType testType')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getResultById = async (req: any, res: Response) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title subject totalMarks duration questions examType testType')
      .populate('studentId', 'fullName phone profileImage');

    if (!result) return res.status(404).json({ message: 'Result not found' });

    // Security Check: Students can only access their own results
    if (req.user?.role !== 'admin' && result.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to result record.' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentResultForQuiz = async (req: any, res: Response) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    const result = await Result.findOne({ studentId, quizId })
      .populate('quizId', 'title subject totalMarks duration questions examType testType')
      .populate('studentId', 'fullName phone profileImage');

    if (!result) {
      return res.status(404).json({ message: 'No submission found for this quiz.' });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching student result for quiz:", error);
    res.status(500).json({ message: 'Server error fetching quiz result' });
  }
};

export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const results = await Result.find({ quizId: req.params.id })
      .populate('studentId', 'fullName phone username profileImage')
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
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
