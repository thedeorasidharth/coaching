import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of the correct option
  marks: { type: Number, default: 1 },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  duration: { type: Number, required: true }, // In minutes
  totalMarks: { type: Number, required: true },
  published: { type: Boolean, default: false },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);
