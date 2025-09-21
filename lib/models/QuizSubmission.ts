import mongoose, { Document, Schema } from 'mongoose';

// Interface for QuizSubmission document
interface IQuizSubmission extends Document {
  quizId: string;
  quizCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  answers: Map<string, string>;
  score: number;
  timeSpent: number;
  submittedAt: Date;
}

// Schema for QuizSubmission
const QuizSubmissionSchema = new Schema({
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
  answers: {
    type: Map,
    of: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create and export the model
export default mongoose.models.QuizSubmission || mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema); 