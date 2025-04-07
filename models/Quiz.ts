import mongoose, { Document, Schema } from 'mongoose';

// Interface for Question
interface IQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'numerical' | 'short-answer';
  text: string;
  options: string[];
  correctAnswer: string;
}

// Interface for Quiz document
interface IQuiz extends Document {
  title: string;
  description?: string;
  code: string;
  timeLimit: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions: IQuestion[];
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Question (as a sub-document)
const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'numerical', 'short-answer'],
    required: true
  },
  text: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true }
});

// Schema for Quiz
const QuizSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  code: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  timeLimit: { 
    type: Number,
    required: true,
    min: 1,
    default: 10 
  },
  shuffleQuestions: { 
    type: Boolean,
    default: false 
  },
  shuffleOptions: { 
    type: Boolean,
    default: false 
  },
  questions: [QuestionSchema],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema); 