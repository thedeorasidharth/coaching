import { Request, Response } from 'express';
import { Quiz } from '../models/Quiz';

const validateAndPrepareQuizPayload = (body: any) => {
  const { title, duration, startDate, endDate, questions } = body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Test Title is required.');
  }

  if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
    throw new Error('Test Duration must be a positive number of minutes.');
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Test must contain at least one question.');
  }

  if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
    throw new Error('End Date & Time must be strictly after Start Date & Time.');
  }

  const sanitizedQuestions = questions.map((q: any, idx: number) => {
    if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
      throw new Error(`Question #${idx + 1} text is required.`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o: any) => !o || String(o).trim() === '')) {
      throw new Error(`Question #${idx + 1} must contain 4 valid options.`);
    }
    const cAns = Number(q.correctAnswer);
    if (isNaN(cAns) || cAns < 0 || cAns > 3) {
      throw new Error(`Question #${idx + 1} correct answer must be selected (Option A, B, C, or D).`);
    }

    return {
      question: q.question.trim(),
      options: q.options.map((o: any) => String(o).trim()),
      correctAnswer: cAns,
      marks: typeof q.marks === 'number' && q.marks >= 0 ? q.marks : 4,
      negativeMarks: typeof q.negativeMarks === 'number' && q.negativeMarks >= 0 ? q.negativeMarks : 1,
      subject: q.subject ? String(q.subject).trim() : '',
      chapter: q.chapter ? String(q.chapter).trim() : '',
      explanation: q.explanation ? String(q.explanation).trim() : ''
    };
  });

  const totalQuestions = sanitizedQuestions.length;
  const totalMarks = sanitizedQuestions.reduce((sum: number, q: any) => sum + (q.marks || 4), 0);

  return {
    ...body,
    title: title.trim(),
    duration: Number(duration),
    totalQuestions,
    totalMarks,
    questions: sanitizedQuestions
  };
};

export const createQuiz = async (req: any, res: Response) => {
  try {
    const preparedPayload = validateAndPrepareQuizPayload(req.body);

    const quiz = new Quiz({
      ...preparedPayload,
      createdBy: req.user.id
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error creating test' });
  }
};

export const getQuizzes = async (req: any, res: Response) => {
  try {
    const { published, examType, testType, targetClass, search } = req.query;
    let query: any = {};

    if (published === 'true' || req.user?.role !== 'admin') {
      query.published = true;
    } else if (published === 'false') {
      query.published = false;
    }

    if (examType && examType !== 'all' && examType !== 'All Exams') query.examType = examType;
    if (testType && testType !== 'all' && testType !== 'All Test Types') query.testType = testType;
    if (targetClass && targetClass !== 'all' && targetClass !== 'All Classes') query.targetClass = targetClass;
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const quizzes = await Quiz.find(query).sort('-createdAt');

    // For student/non-admin requests, strip answer keys and explanations
    if (req.user?.role !== 'admin') {
      const sanitizedQuizzes = quizzes.map((qDoc: any) => {
        const qObj: any = qDoc.toObject();
        qObj.questions = (qObj.questions || []).map((q: any) => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        });
        return qObj;
      });
      return res.json(sanitizedQuizzes);
    }

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req: any, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // For non-admin (student) requests: validate schedule & strip answer keys
    if (req.user?.role !== 'admin') {
      if (!quiz.published) {
        return res.status(403).json({ message: 'This assessment is currently unavailable.' });
      }

      const now = new Date();
      if (quiz.startDate && now < new Date(quiz.startDate)) {
        return res.status(400).json({ 
          message: `This assessment will be available starting ${new Date(quiz.startDate).toLocaleString()}` 
        });
      }
      if (quiz.endDate && now > new Date(quiz.endDate)) {
        return res.status(400).json({ 
          message: `This assessment closed on ${new Date(quiz.endDate).toLocaleString()}` 
        });
      }

      const sanitizedQuiz: any = quiz.toObject();
      sanitizedQuiz.questions = (sanitizedQuiz.questions || []).map((q: any) => {
        const { correctAnswer, explanation, ...safeQ } = q;
        return safeQ;
      });
      return res.json(sanitizedQuiz);
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const preparedPayload = validateAndPrepareQuizPayload(req.body);

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, preparedPayload, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error updating test' });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    quiz.published = !quiz.published;
    await quiz.save();
    res.json({ message: 'Status updated', published: quiz.published });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
