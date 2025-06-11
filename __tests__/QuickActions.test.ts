import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import DataManager from '../services/DataManager';
import QuickActions from '../services/QuickActions';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
}));

jest.mock('../services/DataManager', () => ({
  getUserPreferences: jest.fn(),
}));

describe('QuickActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getActions', () => {
    it('should return all actions', () => {
      const actions = QuickActions.getActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0]).toHaveProperty('id');
      expect(actions[0]).toHaveProperty('title');
      expect(actions[0]).toHaveProperty('icon');
      expect(actions[0]).toHaveProperty('color');
      expect(actions[0]).toHaveProperty('action');
    });
  });

  describe('getActionById', () => {
    it('should return action by id', () => {
      const action = QuickActions.getActionById('start-focus');
      expect(action).toBeDefined();
      expect(action?.id).toBe('start-focus');
    });

    it('should return undefined for non-existent id', () => {
      const action = QuickActions.getActionById('non-existent');
      expect(action).toBeUndefined();
    });
  });

  describe('executeAction', () => {
    it('should execute action by id', async () => {
      const mockAction = {
        id: 'test-action',
        title: 'Test Action',
        icon: 'test',
        color: '#000',
        action: jest.fn(),
      };
      QuickActions.addAction(mockAction);
      await QuickActions.executeAction('test-action');
      expect(mockAction.action).toHaveBeenCalled();
    });

    it('should not execute non-existent action', async () => {
      await QuickActions.executeAction('non-existent');
      // Should not throw error
    });
  });

  describe('addAction', () => {
    it('should add new action', () => {
      const newAction = {
        id: 'new-action',
        title: 'New Action',
        icon: 'new',
        color: '#000',
        action: async () => {},
      };
      QuickActions.addAction(newAction);
      const action = QuickActions.getActionById('new-action');
      expect(action).toBeDefined();
      expect(action?.id).toBe('new-action');
    });
  });

  describe('removeAction', () => {
    it('should remove action by id', () => {
      const actionId = 'start-focus';
      QuickActions.removeAction(actionId);
      const action = QuickActions.getActionById(actionId);
      expect(action).toBeUndefined();
    });
  });

  describe('updateAction', () => {
    it('should update action properties', () => {
      const actionId = 'start-focus';
      const updates = {
        title: 'Updated Title',
        color: '#FFF',
      };
      QuickActions.updateAction(actionId, updates);
      const action = QuickActions.getActionById(actionId);
      expect(action?.title).toBe(updates.title);
      expect(action?.color).toBe(updates.color);
    });
  });

  describe('getShortcuts', () => {
    it('should return shortcuts map', () => {
      const shortcuts = QuickActions.getShortcuts();
      expect(Object.keys(shortcuts).length).toBeGreaterThan(0);
      expect(shortcuts[Platform.OS === 'ios' ? '⌘F' : 'Ctrl+F']).toBe('start-focus');
    });
  });

  describe('handleHapticFeedback', () => {
    it('should trigger haptic feedback on iOS when enabled', async () => {
      Platform.OS = 'ios';
      (DataManager.getUserPreferences as jest.Mock).mockResolvedValue({
        hapticEnabled: true,
      });
      const action = QuickActions.getActionById('start-focus');
      await action?.action();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('should not trigger haptic feedback when disabled', async () => {
      Platform.OS = 'ios';
      (DataManager.getUserPreferences as jest.Mock).mockResolvedValue({
        hapticEnabled: false,
      });
      const action = QuickActions.getActionById('start-focus');
      await action?.action();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('should not trigger haptic feedback on Android', async () => {
      Platform.OS = 'android';
      const action = QuickActions.getActionById('start-focus');
      await action?.action();
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });
}); 