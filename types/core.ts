// Core data structures
export interface CoreRoutineItem {
  id: string;
  title: string;
  duration: number;
  icon: string;
  isActive: boolean;
}

export interface TimedRoutineItem {
  id: string;
  title: string;
  description?: string;
  duration: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
  time?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: 'work' | 'personal' | 'health' | 'learning' | 'social';
  color?: string;
  isActive?: boolean;
  status?: 'upcoming' | 'in-progress' | 'completed';
}

export interface CategorizedRoutineItem extends CoreRoutineItem {
  category: TaskCategory;
}

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';

// System boundaries
export interface SystemBoundaries {
  environment: 'development' | 'test' | 'production';
  platform: 'ios' | 'android' | 'web';
  features: {
    notifications: boolean;
    sound: boolean;
    haptics: boolean;
  };
}

// Service contracts
export interface DataManager {
  loadRoutineItems(): Promise<TimedRoutineItem[]>;
  saveRoutineItems(items: TimedRoutineItem[]): Promise<void>;
  loadUserPreferences(): Promise<UserPreferences>;
  saveUserPreferences(prefs: UserPreferences): Promise<void>;
  loadFocusStats(): Promise<FocusStats>;
  saveFocusStats(stats: FocusStats): Promise<void>;
}

export interface NotificationManager {
  scheduleNotification(options: NotificationOptions): Promise<string>;
  cancelNotification(id: string): Promise<void>;
  setNotificationHandler(handler: NotificationHandler): void;
}

export interface SoundManager {
  loadSound(name: string): Promise<void>;
  playSound(name: string): Promise<void>;
  stopSound(name: string): Promise<void>;
}

// User preferences and stats
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  userName?: string;
}

export interface FocusStats {
  totalFocusTime: number;
  completedSessions: number;
  streak: number;
  lastSessionDate?: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

// Notification types
export interface NotificationOptions {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: NotificationTrigger;
}

export interface NotificationHandler {
  handleNotification: (notification: Notification) => Promise<NotificationBehavior>;
}

export interface NotificationBehavior {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
  shouldShowBanner: boolean;
  shouldShowList: boolean;
}

export type NotificationTrigger = {
  seconds?: number;
  channelId?: string;
} | null;

// Add canonical MovementBreak interface
export interface MovementBreak {
  id: string;
  timestamp: string;
  duration: number;
}
