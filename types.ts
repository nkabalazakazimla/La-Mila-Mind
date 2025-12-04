export type Grade = '4' | '5' | '6';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'Multiple Choice' | 'Short Answer' | 'Fill-in-the-blank';
export type Subject = 'English FAL' | 'Fill-in-the-missing-words' | 'Mathematics' | 'Life Skills';

export interface AppSettings {
  grade: Grade;
  difficulty: Difficulty;
  questionType: QuestionType;
  subject: Subject;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  simpleMode: boolean; // Reduces animations and visual clutter
  audioEnabled: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'fill-blank';
  options?: string[]; // Only for multiple choice
  correctAnswer: string;
  hint: string; // The "Help Me Understand" content
  culturalContext?: string; // e.g., "At the tuckshop", "On the taxi"
}

export interface UserStats {
  score: number;
  questionsAnswered: number;
  streak: number;
  badges: string[];
  history: { day: string; score: number }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  criteria: string;
  color: string;
}
