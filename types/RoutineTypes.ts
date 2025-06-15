export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'social';
export type TaskStatus = 'upcoming' | 'in-progress' | 'completed';

type RecurrenceFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Annually';

interface RecurringTaskDetails {
  frequency: RecurrenceFrequency;
  endDate?: Date;
}

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
  isRecurring?: boolean;
  recurrence?: RecurringTaskDetails;
  completedAt?: Date;
}

export interface CompletedTask extends TimedRoutineItem {
  completedAt: Date;
  status: 'completed';
}
