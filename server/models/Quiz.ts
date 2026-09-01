import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of the correct option
  marks: { type: Number, default: 4 },
  negativeMarks: { type: Number, default: 1 },
  subject: { type: String, default: '' },
  chapter: { type: String, default: '' },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  duration: { type: Number, required: true }, // In minutes
  totalMarks: { type: Number, required: true },
  published: { type: Boolean, default: false },
  testType: { 
    type: String, 
    enum: ['Full Test', 'Chapter Test', 'Subject Test', 'Practice Test'], 
    default: 'Full Test' 
  },
  examType: { 
    type: String, 
    enum: ['NEET', 'JEE', 'Foundation'], 
    default: 'JEE' 
  },
  targetClass: { 
    type: String, 
    enum: ['Class 11', 'Class 12', 'Dropper'], 
    default: 'Class 12' 
  },
  startDate: { type: Date },
  endDate: { type: Date },
  totalQuestions: { type: Number },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);
