import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz';
import { uploadImageStream, deleteImage } from '../config/cloudinary';

const parseDateInput = (val: any): Date | undefined => {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      const dateWithOffset = new Date(`${trimmed.length === 16 ? trimmed + ':00' : trimmed}+05:30`);
      if (!isNaN(dateWithOffset.getTime())) return dateWithOffset;
    }
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

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

  const parsedStartDate = parseDateInput(startDate);
  const parsedEndDate = parseDateInput(endDate);

  if (parsedStartDate && parsedEndDate && parsedEndDate <= parsedStartDate) {
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

    let questionImage: any = undefined;
    if (q.questionImage && typeof q.questionImage === 'object' && q.questionImage.url) {
      questionImage = {
        url: String(q.questionImage.url).trim(),
        publicId: String(q.questionImage.publicId || '').trim()
      };
    }

    const marks = !isNaN(Number(q.marks)) && Number(q.marks) >= 0 ? Number(q.marks) : 4;
    const negativeMarks = !isNaN(Number(q.negativeMarks)) && Number(q.negativeMarks) >= 0 ? Number(q.negativeMarks) : 1;

    return {
      ...(q._id && mongoose.Types.ObjectId.isValid(q._id) ? { _id: q._id } : {}),
      question: q.question.trim(),
      options: q.options.map((o: any) => String(o).trim()),
      correctAnswer: cAns,
      marks,
      negativeMarks,
      subject: q.subject ? String(q.subject).trim() : '',
      chapter: q.chapter ? String(q.chapter).trim() : '',
      explanation: q.explanation ? String(q.explanation).trim() : '',
      ...(questionImage ? { questionImage } : {})
    };
  });

  const totalQuestions = sanitizedQuestions.length;
  const totalMarks = sanitizedQuestions.reduce((sum: number, q: any) => sum + (q.marks || 4), 0);

  const finalSubject = typeof body.subject === 'string' && body.subject.trim() !== ''
    ? body.subject.trim()
    : (sanitizedQuestions[0]?.subject || 'Physics');

  const validTargetClasses = ['Class 11', 'Class 12', 'Dropper'];
  const targetClass = validTargetClasses.includes(body.targetClass)
    ? body.targetClass
    : (validTargetClasses.includes(body.class) ? body.class : 'Class 12');

  const finalClass = typeof body.class === 'string' && body.class.trim() !== ''
    ? body.class.trim()
    : targetClass;

  const validExamTypes = ['NEET', 'JEE', 'Foundation'];
  const examType = validExamTypes.includes(body.examType) ? body.examType : 'JEE';

  const validTestTypes = ['Full Test', 'Chapter Test', 'Subject Test', 'Practice Test'];
  const testType = validTestTypes.includes(body.testType) ? body.testType : 'Full Test';

  return {
    ...body,
    title: title.trim(),
    subject: finalSubject,
    class: finalClass,
    targetClass,
    examType,
    testType,
    duration: Number(duration),
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    totalQuestions,
    totalMarks,
    questions: sanitizedQuestions
  };
};

export const createQuiz = async (req: any, res: Response) => {
  try {
    console.log('[createQuiz] Received body:', JSON.stringify(req.body, null, 2));
    const preparedPayload = validateAndPrepareQuizPayload(req.body);
    console.log('[createQuiz] Prepared payload:', JSON.stringify(preparedPayload, null, 2));

    const quiz = new Quiz({
      ...preparedPayload,
      createdBy: req.user.id
    });
    await quiz.save();
    console.log('[createQuiz] Successfully created quiz id:', quiz._id);
    res.status(201).json(quiz);
  } catch (error: any) {
    console.error('[createQuiz] Validation/Creation error:', error);
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
    if (!quiz) {
      console.warn(`[getQuizById] Quiz not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // For non-admin (student) requests: validate schedule & strip answer keys
    if (req.user?.role !== 'admin') {
      if (!quiz.published) {
        console.warn(`[getQuizById] Access denied: Quiz ${quiz.title} (${quiz._id}) is not published.`);
        return res.status(403).json({ message: 'This assessment is currently unavailable.' });
      }

      const now = new Date();
      const startDateObj = quiz.startDate ? new Date(quiz.startDate) : null;
      if (startDateObj && !isNaN(startDateObj.getTime()) && now < startDateObj) {
        console.warn(`[getQuizById] Access denied: Quiz ${quiz.title} starts at ${quiz.startDate}. Current time: ${now}`);
        const formattedStart = startDateObj.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        return res.status(400).json({ 
          message: `This assessment will be available starting ${formattedStart}` 
        });
      }

      const isExpired = quiz.endDate ? now > new Date(quiz.endDate) : false;
      if (isExpired) {
        console.log(`[getQuizById] Expired test accessed in read-only mode: ${quiz.title} (${quiz._id}) ended at ${quiz.endDate}`);
      }

      const sanitizedQuiz: any = quiz.toObject();
      sanitizedQuiz.isExpired = isExpired;
      sanitizedQuiz.questions = (sanitizedQuiz.questions || []).map((q: any) => {
        if (isExpired) {
          // For expired read-only mode, include correctAnswer so student can see the correct answer key
          const { explanation, ...expiredSafeQ } = q;
          return expiredSafeQ;
        } else {
          // For live test, strip correctAnswer and explanation to prevent answer leaks
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        }
      });
      return res.json(sanitizedQuiz);
    }

    res.json(quiz);
  } catch (error: any) {
    if (error.name === 'CastError') {
      console.warn(`[getQuizById] Invalid quiz ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }
    console.error(`[getQuizById] Server error fetching quiz ${req.params.id}:`, error);
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
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Collect any Cloudinary publicIds attached to this quiz
    const publicIdsToDelete: string[] = [];
    if (Array.isArray(quiz.questions)) {
      quiz.questions.forEach((q: any) => {
        if (q.questionImage && q.questionImage.publicId) {
          publicIdsToDelete.push(q.questionImage.publicId);
        }
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    // Delete associated Cloudinary assets asynchronously
    if (publicIdsToDelete.length > 0) {
      Promise.all(publicIdsToDelete.map(pid => deleteImage(pid))).catch(err => {
        console.error('Error cleaning up Cloudinary images for deleted quiz:', err);
      });
    }

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

/**
 * Upload an image directly to a specific question subdocument
 * Route: POST /api/questions/:id/image or POST /api/quizzes/:quizId/questions/:questionId/image
 */
export const uploadQuestionImage = async (req: Request, res: Response) => {
  const rawId = req.params.questionId || req.params.id;
  const questionId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!questionId || typeof questionId !== 'string' || !mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid question ID format.' });
  }

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  try {
    // 1. Find Quiz containing this question
    const query = req.params.quizId
      ? { _id: req.params.quizId, 'questions._id': questionId }
      : { 'questions._id': questionId };

    const quiz = await Quiz.findOne(query);
    if (!quiz) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const question = (quiz.questions as any).id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found in quiz.' });
    }

    // 2. Note existing image publicId for cleanup after successful DB update
    const oldPublicId = question.questionImage?.publicId;

    // 3. Upload new image to Cloudinary
    const folder = `eduspark/questions/${questionId}`;
    const { secure_url, public_id } = await uploadImageStream(req.file.buffer, folder);

    // 4. Update MongoDB
    question.questionImage = {
      url: secure_url,
      publicId: public_id
    };

    try {
      await quiz.save();
    } catch (dbError) {
      // If DB update fails, clean up the newly uploaded Cloudinary image
      await deleteImage(public_id).catch(() => {});
      throw dbError;
    }

    // 5. If replacement succeeded, delete old Cloudinary image
    if (oldPublicId && oldPublicId !== public_id) {
      deleteImage(oldPublicId).catch((err) => {
        console.error(`Failed to delete replaced Cloudinary image ${oldPublicId}:`, err);
      });
    }

    return res.status(200).json({
      message: 'Question image uploaded successfully.',
      questionImage: question.questionImage,
      question
    });
  } catch (error: any) {
    console.error('Question image upload error:', error);
    return res.status(500).json({ message: error.message || 'Error uploading question image.' });
  }
};

/**
 * Remove an image from a specific question subdocument
 * Route: DELETE /api/questions/:id/image or DELETE /api/quizzes/:quizId/questions/:questionId/image
 */
export const deleteQuestionImage = async (req: Request, res: Response) => {
  const rawId = req.params.questionId || req.params.id;
  const questionId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!questionId || typeof questionId !== 'string' || !mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid question ID format.' });
  }

  try {
    const query = req.params.quizId
      ? { _id: req.params.quizId, 'questions._id': questionId }
      : { 'questions._id': questionId };

    const quiz = await Quiz.findOne(query);
    if (!quiz) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const question = (quiz.questions as any).id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found in quiz.' });
    }

    const publicId = question.questionImage?.publicId;
    if (!publicId && !question.questionImage?.url) {
      return res.status(400).json({ message: 'Question does not have an image to remove.' });
    }

    // 1. Remove from MongoDB
    question.questionImage = undefined;
    await quiz.save();

    // 2. Delete from Cloudinary after successful DB update
    if (publicId) {
      deleteImage(publicId).catch((err) => {
        console.error(`Failed to delete removed Cloudinary image ${publicId}:`, err);
      });
    }

    return res.status(200).json({
      message: 'Question image removed successfully.',
      question
    });
  } catch (error: any) {
    console.error('Question image delete error:', error);
    return res.status(500).json({ message: error.message || 'Error deleting question image.' });
  }
};

/**
 * Standalone image upload (e.g. for questions in builder not yet saved to DB)
 * Route: POST /api/quizzes/upload-image
 */
export const uploadStandaloneImage = async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  try {
    const folder = 'eduspark/questions';
    const { secure_url, public_id } = await uploadImageStream(req.file.buffer, folder);

    return res.status(200).json({
      message: 'Image uploaded successfully.',
      url: secure_url,
      publicId: public_id,
      questionImage: {
        url: secure_url,
        publicId: public_id
      }
    });
  } catch (error: any) {
    console.error('Standalone image upload error:', error);
    return res.status(500).json({ message: error.message || 'Error uploading image.' });
  }
};

/**
 * Standalone image deletion (e.g. for cancelling an uploaded unsaved image)
 * Route: DELETE /api/quizzes/delete-image
 */
export const deleteStandaloneImage = async (req: Request, res: Response) => {
  const { publicId } = req.body;

  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ message: 'publicId is required.' });
  }

  // Security guard: Ensure publicId is in the eduspark/questions path
  if (!publicId.startsWith('eduspark/questions')) {
    return res.status(403).json({ message: 'Unauthorized asset deletion path.' });
  }

  try {
    await deleteImage(publicId);
    return res.status(200).json({ message: 'Image deleted from Cloudinary.' });
  } catch (error: any) {
    console.error('Standalone image delete error:', error);
    return res.status(500).json({ message: error.message || 'Error deleting image.' });
  }
};

