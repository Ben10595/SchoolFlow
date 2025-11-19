export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Homework {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface Exam {
  id: string;
  subject: string;
  topic: string;
  date: string;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
}

export type ViewState = 'dashboard' | 'homework' | 'exams' | 'study';

export type Theme = 'light' | 'dark';