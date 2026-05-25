import { Request, Response } from 'express';
import { Quiz } from '../models/Quiz';

export const createQuiz = async (req: any, res: Response) => {
  try {
    console.log("POST /api/quizzes/create - Request Body:", JSON.stringify(req.body, null, 2));
    const quiz = new Quiz({
      ...req.body,
      createdBy: req.user.id
    });
    await quiz.save();
    console.log("Quiz created successfully:", quiz._id);
    res.status(201).json(quiz);
  } catch (error: any) {
    console.error("Quiz creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    let query: any = {};
    if (published === 'true') query.published = true;
    
    const quizzes = await Quiz.find(query).sort('-createdAt');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
