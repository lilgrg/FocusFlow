import { storage } from '@/utils/storage';
import { BaseManager } from './BaseManager';
import DataManager, { RoutineItem } from './DataManager';

interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  taskTitle: string;
  sessionType: string;
  completed: boolean;
  notes?: string;
}

const STORAGE_KEY = '@focusflow_focus_sessions';

class FocusManager extends BaseManager {
  private static instance: FocusManager;

  private constructor() {
    super();
  }

  public static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  public async startSession(taskTitle: string, sessionType: string, duration: number): Promise<FocusSession> {
    try {
      const session: FocusSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        duration,
        taskTitle,
        sessionType,
        completed: false,
      };

      const sessions = await this.loadSessions();
      sessions.push(session);
      await this.saveSessions(sessions);

      return session;
    } catch (error) {
      await this.handleError(error, 'starting focus session');
      throw error;
    }
  }

  public async completeSession(sessionId: string, notes?: string): Promise<void> {
    try {
      const sessions = await this.loadSessions();
      const sessionToUpdate = sessions.find(s => s.id === sessionId);
      
      if (!sessionToUpdate) {
        throw new Error('Session not found');
      }

      const updatedSessions = sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            endTime: new Date().toISOString(),
            completed: true,
            notes,
          };
        }
        return session;
      });

      await this.saveSessions(updatedSessions);

      // Update the task status in DataManager if it exists
      const routineItems = await DataManager.loadRoutineItems();
      const taskItem = routineItems.find((item: RoutineItem) => item.title === sessionToUpdate.taskTitle);
      
      if (taskItem) {
        const updatedItems = routineItems.map((item: RoutineItem) => {
          if (item.id === taskItem.id) {
            return {
              ...item,
              status: 'completed' as import('./DataManager').TaskStatus,
              completed: true,
              completedAt: new Date().toISOString(),
            } as RoutineItem;
          }
          return item;
        });
        await DataManager.saveRoutineItems(updatedItems);
      }
    } catch (error) {
      await this.handleError(error, 'completing focus session');
      throw error;
    }
  }

  public async loadSessions(): Promise<FocusSession[]> {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading focus sessions:', error);
      return [];
    }
  }

  private async saveSessions(sessions: FocusSession[]): Promise<void> {
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving focus sessions:', error);
      throw error; // Re-throw to handle in calling function
    }
  }

  public async getTodaySessions(): Promise<FocusSession[]> {
    try {
      const sessions = await this.loadSessions();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      });
    } catch (error) {
      await this.handleError(error, 'getting today\'s sessions');
      return [];
    }
  }

  public async getSessionStats(): Promise<{
    totalSessions: number;
    totalFocusTime: number;
    averageSessionLength: number;
    completionRate: number;
  }> {
    try {
      const sessions = await this.loadSessions();
      const completedSessions = sessions.filter(session => session.completed);
      
      const totalFocusTime = completedSessions.reduce((total, session) => {
        if (session.endTime) {
          const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
          return total + duration;
        }
        return total;
      }, 0);

      const totalMinutes = Math.floor(totalFocusTime / (1000 * 60));
      const averageMinutes = sessions.length > 0 ? Math.floor(totalMinutes / sessions.length) : 0;

      return {
        totalSessions: sessions.length,
        totalFocusTime: totalMinutes,
        averageSessionLength: averageMinutes,
        completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
      };
    } catch (error) {
      await this.handleError(error, 'getting session stats');
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageSessionLength: 0,
        completionRate: 0,
      };
    }
  }
}

export default FocusManager.getInstance(); 