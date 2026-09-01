import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }], // List of chosen option indices (-1 for unattempted)
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // In seconds
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  unattemptedCount: { type: Number, default: 0 },
  negativeMarksDeducted: { type: Number, default: 0 },
  questionStatus: [{ 
    type: String, 
    enum: ['notVisited', 'notAnswered', 'answered', 'markedForReview', 'answeredAndMarkedForReview'] 
  }],
  subjectScores: { type: mongoose.Schema.Types.Mixed, default: {} },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

resultSchema.index({ studentId: 1, quizId: 1 }, { unique: true });

export const Result = mongoose.model('Result', resultSchema);
