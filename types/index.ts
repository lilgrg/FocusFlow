export * from './api';
export * from './entities';
export * from './navigation';

export interface RoutineItem {
  id: string;
  title: string;
  duration: number;
  icon: string;
  isActive: boolean;
  time?: string;
  status?: 'upcoming' | 'current' | 'completed' | 'overdue';
  category?: TaskCategory;
  completed?: boolean;
}

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  completed: boolean;
  status: 'upcoming' | 'current' | 'completed';
  habits?: {
    id: string;
    name: string;
    icon: string;
    completed: boolean;
  }[];
}

// Re-export from core.ts
export { FocusStats, UserPreferences } from './core';
