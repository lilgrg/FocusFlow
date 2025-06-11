import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import DataManager from './DataManager';

export type QuickAction = {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: () => Promise<void>;
  shortcut?: string;
};

class QuickActions {
  private static instance: QuickActions;
  private actions: QuickAction[] = [];

  private constructor() {
    this.initializeActions();
  }

  static getInstance(): QuickActions {
    if (!QuickActions.instance) {
      QuickActions.instance = new QuickActions();
    }
    return QuickActions.instance;
  }

  private initializeActions() {
    this.actions = [
      {
        id: 'start-focus',
        title: 'Start Focus Session',
        icon: 'timer-outline',
        color: '#4CAF50',
        action: async () => {
          await this.handleHapticFeedback();
          // Implement focus session start logic
        },
        shortcut: Platform.OS === 'ios' ? '⌘F' : 'Ctrl+F',
      },
      {
        id: 'take-break',
        title: 'Take a Break',
        icon: 'cafe-outline',
        color: '#FF9800',
        action: async () => {
          await this.handleHapticFeedback();
          // Implement break logic
        },
        shortcut: Platform.OS === 'ios' ? '⌘B' : 'Ctrl+B',
      },
      {
        id: 'drink-water',
        title: 'Drink Water',
        icon: 'water-outline',
        color: '#2196F3',
        action: async () => {
          await this.handleHapticFeedback();
          // Implement water intake logic
        },
        shortcut: Platform.OS === 'ios' ? '⌘W' : 'Ctrl+W',
      },
      {
        id: 'add-task',
        title: 'Add Task',
        icon: 'add-circle-outline',
        color: '#9C27B0',
        action: async () => {
          await this.handleHapticFeedback();
          // Implement add task logic
        },
        shortcut: Platform.OS === 'ios' ? '⌘N' : 'Ctrl+N',
      },
    ];
  }

  private async handleHapticFeedback() {
    if (Platform.OS === 'ios') {
      const prefs = await DataManager.getUserPreferences();
      if (prefs?.hapticEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }

  getActions(): QuickAction[] {
    return this.actions;
  }

  getActionById(id: string): QuickAction | undefined {
    return this.actions.find((action) => action.id === id);
  }

  async executeAction(id: string): Promise<void> {
    const action = this.getActionById(id);
    if (action) {
      await action.action();
    }
  }

  addAction(action: QuickAction): void {
    this.actions.push(action);
  }

  removeAction(id: string): void {
    this.actions = this.actions.filter((action) => action.id !== id);
  }

  updateAction(id: string, updates: Partial<QuickAction>): void {
    const index = this.actions.findIndex((action) => action.id === id);
    if (index !== -1) {
      this.actions[index] = { ...this.actions[index], ...updates };
    }
  }

  getShortcuts(): { [key: string]: string } {
    return this.actions.reduce((acc, action) => {
      if (action.shortcut) {
        acc[action.shortcut] = action.id;
      }
      return acc;
    }, {} as { [key: string]: string });
  }
}

export default QuickActions.getInstance(); 