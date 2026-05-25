import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ type: Number }], // List of chosen option indices
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // In seconds
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Result = mongoose.model('Result', resultSchema);
