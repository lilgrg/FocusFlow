import { TimedRoutineItem } from '@/types/RoutineTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
  ID_COUNTER: 'id_counter',
};

export class TaskService {
  private static instance: TaskService;
  private storage: typeof AsyncStorage;
  private idCounter: number = 0;

  private constructor() {
    this.storage = AsyncStorage;
    this.loadIdCounter();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  private async loadIdCounter() {
    try {
      const counter = await this.storage.getItem(STORAGE_KEYS.ID_COUNTER);
      this.idCounter = counter ? parseInt(counter, 10) : 0;
      console.log('Loaded ID counter:', this.idCounter);
    } catch (error) {
      console.error('Error loading ID counter:', error);
      this.idCounter = 0;
    }
  }

  private async incrementIdCounter(): Promise<number> {
    this.idCounter++;
    try {
      await this.storage.setItem(STORAGE_KEYS.ID_COUNTER, this.idCounter.toString());
      console.log('Incremented ID counter:', this.idCounter);
    } catch (error) {
      console.error('Error saving ID counter:', error);
    }
    return this.idCounter;
  }

  private generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${random}_${this.idCounter}`;
  }

  private validateTask(task: Partial<TimedRoutineItem>): boolean {
    if (!task.title?.trim()) return false;
    if (!task.time) return false;
    if (!task.duration || task.duration <= 0) return false;
    return true;
  }

  async createTask(taskData: Partial<TimedRoutineItem>): Promise<TimedRoutineItem> {
    if (!this.validateTask(taskData)) {
      throw new Error('Invalid task data');
    }

    const task: TimedRoutineItem = {
      id: this.generateUniqueId(),
      title: taskData.title!,
      description: taskData.description,
      time: taskData.time!,
      icon: taskData.icon || 'calendar',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'personal',
      duration: taskData.duration!,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: taskData.color || '#0A7EA4',
      isActive: false,
      status: 'upcoming',
      isRoutine: taskData.isRoutine || false,
    };

    const tasks = await this.getTasks();
    await this.saveTasks([...tasks, task]);
    return task;
  }

  async getTasks(): Promise<TimedRoutineItem[]> {
    try {
      console.log('Getting tasks from storage...');
      const data = await this.storage.getItem(STORAGE_KEYS.TASKS);
      console.log('Raw tasks data:', data);
      const tasks = data ? (JSON.parse(data) as TimedRoutineItem[]) : [];
      console.log('Parsed tasks:', tasks);
      // Deduplicate tasks based on ID
      const uniqueTasks = Array.from(new Map(tasks.map(task => [task.id, task])).values());
      console.log('Unique tasks:', uniqueTasks);
      return uniqueTasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  async getCompletedTasks(): Promise<TimedRoutineItem[]> {
    try {
      const data = await this.storage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
      const tasks = data ? (JSON.parse(data) as TimedRoutineItem[]) : [];
      // Deduplicate tasks based on ID
      return Array.from(new Map(tasks.map(task => [task.id, task])).values());
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: TimedRoutineItem[]): Promise<void> {
    try {
      console.log('Saving tasks:', tasks);
      const jsonData = JSON.stringify(tasks);
      console.log('JSON data to save:', jsonData);
      await this.storage.setItem(STORAGE_KEYS.TASKS, jsonData);
      console.log('Tasks saved successfully');
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  async saveCompletedTasks(tasks: TimedRoutineItem[]): Promise<void> {
    try {
      await this.storage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving completed tasks:', error);
      throw error;
    }
  }

  async completeTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const completedTasks = await this.getCompletedTasks();
      
      const taskToComplete = tasks.find(t => t.id === taskId);
      if (!taskToComplete) {
        throw new Error('Task not found');
      }

      const completedTask: TimedRoutineItem = {
        ...taskToComplete,
        completed: true,
        completedAt: new Date(),
        status: 'completed',
      };

      const updatedTasks = tasks.filter(t => t.id !== taskId);
      const updatedCompletedTasks = [...completedTasks, completedTask];

      await this.saveTasks(updatedTasks);
      await this.saveCompletedTasks(updatedCompletedTasks);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log('Attempting to delete task:', taskId);
      const tasks = await this.getTasks();
      console.log('Current tasks:', tasks);
      
      const taskToDelete = tasks.find(t => t.id === taskId);
      if (!taskToDelete) {
        console.error('Task not found:', taskId);
        throw new Error('Task not found');
      }
      
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      console.log('Updated tasks after deletion:', updatedTasks);
      
      await this.saveTasks(updatedTasks);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<TimedRoutineItem>): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };

      tasks[taskIndex] = updatedTask;
      await this.saveTasks(tasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
} 