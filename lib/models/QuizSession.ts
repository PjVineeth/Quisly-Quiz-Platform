import mongoose, { Document, Schema } from 'mongoose';

// Interface for QuizSession document
interface IQuizSession extends Document {
  quizId: string;
  quizCode: string;
  studentId: string; // Required - authenticated student ID
  studentName: string;
  studentEmail: string;
  status: 'active' | 'completed' | 'abandoned';
  currentQuestion: number;
  totalQuestions: number;
  progress: number; // percentage
  answers: Map<string, string>;
  startTime: Date;
  lastActivity: Date;
  completedAt?: Date;
  score?: number;
  timeSpent?: number;
}

// Schema for QuizSession
const QuizSessionSchema = new Schema({
  quizId: {
    type: String,
    required: true
  },
  quizCode: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  answers: {
    type: Map,
    of: String,
    default: new Map()
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  score: {
    type: Number,
    default: null
  },
  timeSpent: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Create and export the model
export default mongoose.models.QuizSession || mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema);
