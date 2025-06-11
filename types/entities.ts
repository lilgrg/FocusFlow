/**
 * Represents a time period for a routine or activity
 */
export type TimePeriod = {
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Represents the status of a routine
 */
export type RoutineStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Represents a category for routines
 */
export type RoutineCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';

/**
 * Represents a notification preference
 */
export type NotificationPreference = {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  reminderTime: number; // minutes before the routine
};

/**
 * Represents a user's statistics
 */
export type UserStats = {
  totalRoutines: number;
  completedRoutines: number;
  totalFocusTime: number; // in minutes
  streakDays: number;
  lastActive: string; // ISO date string
};

/**
 * Represents a routine with all its properties
 */
export interface Routine {
  id: string;
  title: string;
  description?: string;
  category: RoutineCategory;
  duration: TimePeriod;
  status: RoutineStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notificationPreferences: NotificationPreference;
  tags?: string[];
  priority: 1 | 2 | 3; // 1: High, 2: Medium, 3: Low
}

/**
 * Represents a user's settings
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreference;
  soundEnabled: boolean;
  hapticFeedback: boolean;
  autoStartRoutines: boolean;
  defaultRoutineDuration: TimePeriod;
}

/**
 * Represents an error response from the API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Represents a successful API response
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
} 