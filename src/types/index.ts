export interface FacultyMember {
  _id: string;
  name: string;
  qualifications: string[];
  experience: string;
  subject: string;
  imageUrl: string;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category?: string;
  targetClass?: string;
  isImportant?: boolean;
  attachmentUrl?: string;
  createdAt: string;
}

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export type TestType = 'Full Test' | 'Chapter Test' | 'Subject Test' | 'Practice Test';
export type ExamType = 'NEET' | 'JEE' | 'Foundation';
export type TargetClass = 'Class 11' | 'Class 12' | 'Dropper';
export type QuestionStatus = 'notVisited' | 'notAnswered' | 'answered' | 'markedForReview' | 'answeredAndMarkedForReview';

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  negativeMarks?: number;
  subject?: string;
  chapter?: string;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  class?: string;
  duration: number;
  totalMarks?: number;
  totalQuestions?: number;
  published?: boolean;
  isPublished?: boolean;
  category?: string;
  testType?: TestType;
  examType?: ExamType;
  targetClass?: TargetClass;
  startDate?: string;
  endDate?: string;
  questions: Question[];
  createdBy?: string | { _id: string; name?: string };
  createdAt?: string;
  updatedAt?: string;
}

export type Test = Quiz;

export interface Result {
  _id: string;
  studentId: string | { _id: string; fullName?: string; phone?: string; profileImage?: string };
  quizId: string | Quiz;
  answers: number[];
  score: number;
  percentage: number;
  timeTaken: number;
  correctCount?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
  negativeMarksDeducted?: number;
  questionStatus?: QuestionStatus[];
  subjectScores?: Record<string, number>;
  submittedAt?: string;
  createdAt?: string;
}

export interface StudyNote {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
}
