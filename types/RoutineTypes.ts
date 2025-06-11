export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'social';
export type TaskStatus = 'upcoming' | 'in-progress' | 'completed';

export interface TimedRoutineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon: string;
  priority: TaskPriority;
  category: TaskCategory;
  duration: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  isActive: boolean;
  status: TaskStatus;
  isRoutine?: boolean;
  completedAt?: Date;
}

export interface CompletedTask extends TimedRoutineItem {
  completedAt: Date;
  status: 'completed';
}
