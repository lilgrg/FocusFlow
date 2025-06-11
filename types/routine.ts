import { RoutineCategory } from './entities';

export interface AssociatedHabit {
  id: string;
  name: string;
  icon: string;
  status: 'pending' | 'completed';
}

export interface Prompt {
  type: 'water' | 'movement' | 'meditation';
  icon: string;
  status: 'pending' | 'completed';
}

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  icon: string;
  color: string;
  status: 'upcoming' | 'current' | 'completed';
  associatedHabits?: AssociatedHabit[];
  prompts?: Prompt[];
  duration?: number;
  notes?: string;
  category: RoutineCategory;
} 