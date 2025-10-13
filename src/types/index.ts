export type QuestionType = 'radio' | 'checkbox' | 'number' | 'text' | 'select';

export interface Question {
  key: string;
  question: string;
  hint: string;
  dependsOn?: Array<{
    key: string;
    value: any;
  }>;
}

export interface QuestionOption {
  label: string;
  value: string | number | boolean;
}

export interface NavigationDirection {
  direction: 'next' | 'back';
}

export interface FormState {
  currentQuestionIndex: number;
  isCurrentQuestionAnswered: boolean;
  submitted: boolean;
}

export interface SchedulerMatch {
  isMatch: boolean;
  totalMatch: number;
  unknownCount: number;
  unknownFeatures: string[];
}
