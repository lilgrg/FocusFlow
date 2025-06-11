import { CompletedTask, TimedRoutineItem } from "@/types/RoutineTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ROUTINE_ITEMS: "routine_items",
  COMPLETED_TASKS: "completed_tasks",
  FOCUS_STATS: "focus_stats",
  WATER_INTAKE: "water_intake",
  MOVEMENT_BREAKS: "movement_breaks",
} as const;

interface FocusStats {
  totalFocusTime: number;
  completedSessions: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

const DEFAULT_FOCUS_STATS: FocusStats = {
  totalFocusTime: 0,
  completedSessions: 0,
  streak: 0,
  weeklyGoal: 300,
  weeklyProgress: 0,
  monthlyGoal: 1200,
  monthlyProgress: 0,
};

class DataManager {
  private static instance: DataManager;

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  async saveRoutineItems(items: TimedRoutineItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving routine items:", error);
      throw error;
    }
  }

  async loadRoutineItems(): Promise<TimedRoutineItem[]> {
    try {
      const items = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_ITEMS);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error loading routine items:", error);
      return [];
    }
  }

  async saveCompletedTasks(tasks: CompletedTask[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving completed tasks:", error);
      throw error;
    }
  }

  async loadCompletedTasks(): Promise<CompletedTask[]> {
    try {
      const tasks = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error("Error loading completed tasks:", error);
      return [];
    }
  }

  async clearCompletedTasks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      throw error;
    }
  }

  async loadFocusStats(): Promise<FocusStats> {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.FOCUS_STATS);
      return stats ? JSON.parse(stats) : DEFAULT_FOCUS_STATS;
    } catch (error) {
      console.error("Error loading focus stats:", error);
      return DEFAULT_FOCUS_STATS;
    }
  }

  async saveFocusStats(stats: FocusStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOCUS_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving focus stats:", error);
      throw error;
    }
  }

  async loadWaterIntake(): Promise<number> {
    try {
      const intake = await AsyncStorage.getItem(STORAGE_KEYS.WATER_INTAKE);
      return intake ? JSON.parse(intake) : 0;
    } catch (error) {
      console.error("Error loading water intake:", error);
      return 0;
    }
  }

  async saveWaterIntake(intake: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WATER_INTAKE, JSON.stringify(intake));
    } catch (error) {
      console.error("Error saving water intake:", error);
    }
  }

  async loadMovementBreaks(): Promise<any[]> {
    try {
      const breaks = await AsyncStorage.getItem(STORAGE_KEYS.MOVEMENT_BREAKS);
      return breaks ? JSON.parse(breaks) : [];
    } catch (error) {
      console.error("Error loading movement breaks:", error);
      return [];
    }
  }

  async addMovementBreak(breakData: any): Promise<void> {
    try {
      const breaks = await this.loadMovementBreaks();
      breaks.push(breakData);
      await AsyncStorage.setItem(STORAGE_KEYS.MOVEMENT_BREAKS, JSON.stringify(breaks));
    } catch (error) {
      console.error("Error adding movement break:", error);
    }
  }

  async loadAppData(): Promise<{
    routineItems: TimedRoutineItem[];
    completedTasks: CompletedTask[];
    focusStats: FocusStats;
    waterIntake: number;
    movementBreaks: any[];
  }> {
    try {
      const [routineItems, completedTasks, focusStats, waterIntake, movementBreaks] = await Promise.all([
        this.loadRoutineItems(),
        this.loadCompletedTasks(),
        this.loadFocusStats(),
        this.loadWaterIntake(),
        this.loadMovementBreaks()
      ]);

      return {
        routineItems,
        completedTasks,
        focusStats,
        waterIntake,
        movementBreaks
      };
    } catch (error) {
      console.error("Error loading app data:", error);
      return {
        routineItems: [],
        completedTasks: [],
        focusStats: DEFAULT_FOCUS_STATS,
        waterIntake: 0,
        movementBreaks: []
      };
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      // Reset all state to default values
      await this.saveRoutineItems([]);
      await this.saveCompletedTasks([]);
      await this.saveFocusStats(DEFAULT_FOCUS_STATS);
      await this.saveWaterIntake(0);
      await AsyncStorage.setItem(STORAGE_KEYS.MOVEMENT_BREAKS, JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
    }
  }

  async completeTask(taskId: string): Promise<void> {
    try {
      // Load current state
      const routineItems = await this.loadRoutineItems();
      const completedTasks = await this.loadCompletedTasks();
      const focusStats = await this.loadFocusStats();

      // Find the task to complete
      const taskToComplete = routineItems.find(t => t.id === taskId);
      if (!taskToComplete) {
        throw new Error('Task not found');
      }

      // Create completed task with unique ID and completion time
      const completedTask: CompletedTask = {
        ...taskToComplete,
        id: `completed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        completed: true,
        completedAt: new Date(),
        status: 'completed'
      };

      // Update both lists
      const updatedRoutine = routineItems.filter(t => t.id !== taskId);
      const updatedCompleted = [...completedTasks, completedTask];

      // Update focus stats
      const updatedStats = {
        ...focusStats,
        totalFocusTime: focusStats.totalFocusTime + taskToComplete.duration,
        completedSessions: focusStats.completedSessions + 1,
        weeklyProgress: (focusStats.totalFocusTime + taskToComplete.duration) / focusStats.weeklyGoal,
        monthlyProgress: (focusStats.totalFocusTime + taskToComplete.duration) / focusStats.monthlyGoal,
      };

      // Save all changes
      await this.saveRoutineItems(updatedRoutine);
      await this.saveCompletedTasks(updatedCompleted);
      await this.saveFocusStats(updatedStats);
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  }
}

export default DataManager;