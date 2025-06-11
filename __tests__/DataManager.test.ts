import { FocusStats, TimedRoutineItem, UserPreferences } from '@/types/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataManager from '../services/DataManager';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('DataManager', () => {
  let dataManager: DataManager;

  beforeEach(() => {
    jest.clearAllMocks();
    dataManager = DataManager.getInstance();
  });

  describe('initialize', () => {
    it('should initialize with default data if not exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await dataManager.initialize();
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('routine_items', JSON.stringify([]));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_preferences', expect.any(String));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('focus_stats', expect.any(String));
    });

    it('should not initialize if already initialized', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({}));
      await dataManager.initialize();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Routine Items', () => {
    const mockRoutineItem: TimedRoutineItem = {
      id: '1',
      title: 'Morning Routine',
      time: '09:00',
      duration: 30,
      icon: 'sunny-outline',
      status: 'upcoming',
      isActive: true,
      color: '#4CAF50',
    };

    it('should save and load routine items', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockRoutineItem]));
      await dataManager.saveRoutineItems([mockRoutineItem]);
      const items = await dataManager.loadRoutineItems();
      expect(items).toEqual([mockRoutineItem]);
    });

    it('should handle empty routine items', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const items = await dataManager.loadRoutineItems();
      expect(items).toEqual([]);
    });

    it('should get all routine items', async () => {
      const mockItems = [mockRoutineItem];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));
      const items = await dataManager.loadRoutineItems();
      expect(items).toEqual(mockItems);
    });

    it('should get routine item by id', async () => {
      const mockItems = [mockRoutineItem];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));
      const items = await dataManager.loadRoutineItems();
      const item = items.find(i => i.id === '1');
      expect(item).toEqual(mockRoutineItem);
    });

    it('should update routine item', async () => {
      const mockItems = [mockRoutineItem];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));
      const updatedItem = { ...mockRoutineItem, title: 'Updated Routine' };
      await dataManager.updateRoutineItem(updatedItem);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'routine_items',
        JSON.stringify([updatedItem])
      );
    });

    it('should delete routine item', async () => {
      const mockItems = [mockRoutineItem];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));
      await dataManager.deleteRoutineItem('1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'routine_items',
        JSON.stringify([])
      );
    });
  });

  describe('User Preferences', () => {
    const mockPreferences: UserPreferences = {
      theme: 'dark',
      notifications: true,
      soundEnabled: true,
      hapticEnabled: true,
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
    };

    it('should save and load user preferences', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockPreferences));
      await dataManager.saveUserPreferences(mockPreferences);
      const prefs = await dataManager.loadUserPreferences();
      expect(prefs).toEqual(mockPreferences);
    });

    it('should handle default preferences', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const prefs = await dataManager.loadUserPreferences();
      expect(prefs).toEqual({
        theme: 'system',
        notifications: true,
        soundEnabled: true,
        hapticEnabled: true,
        focusDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
      });
    });
  });

  describe('Focus Stats', () => {
    const mockStats: FocusStats = {
      totalFocusTime: 120,
      completedSessions: 4,
      streak: 2,
      weeklyGoal: 300,
      weeklyProgress: 120,
      monthlyGoal: 1200,
      monthlyProgress: 480,
    };

    it('should save and load focus stats', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockStats));
      await dataManager.saveFocusStats(mockStats);
      const stats = await dataManager.loadFocusStats();
      expect(stats).toEqual(mockStats);
    });

    it('should handle default stats', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const stats = await dataManager.loadFocusStats();
      expect(stats).toEqual({
        totalFocusTime: 0,
        completedSessions: 0,
        streak: 0,
        weeklyGoal: 300,
        weeklyProgress: 0,
        monthlyGoal: 1200,
        monthlyProgress: 0,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      // Mock AsyncStorage to throw an error
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));
      
      await expect(dataManager.saveRoutineItems([])).rejects.toThrow('Storage error');
    });
  });

  describe('Backup and Restore', () => {
    it('should backup data', async () => {
      const mockData = {
        routineItems: [],
        userPreferences: {
          theme: 'system',
          notifications: true,
          soundEnabled: true,
          hapticEnabled: true,
          focusDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4,
        },
        focusStats: {
          totalFocusTime: 0,
          completedSessions: 0,
          streak: 0,
          weeklyGoal: 300,
          weeklyProgress: 0,
          monthlyGoal: 1200,
          monthlyProgress: 0,
        },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const backup = await dataManager.backupData();
      expect(backup).toBe(JSON.stringify(mockData));
    });

    it('should restore data', async () => {
      const mockData = {
        routineItems: [],
        userPreferences: {
          theme: 'system',
          notifications: true,
          soundEnabled: true,
          hapticEnabled: true,
          focusDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4,
        },
        focusStats: {
          totalFocusTime: 0,
          completedSessions: 0,
          streak: 0,
          weeklyGoal: 300,
          weeklyProgress: 0,
          monthlyGoal: 1200,
          monthlyProgress: 0,
        },
      };
      await dataManager.restoreData(JSON.stringify(mockData));
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('Clear Data', () => {
    it('should clear all data', async () => {
      await dataManager.clearAllData();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
}); 