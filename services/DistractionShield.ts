import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface BlockedApp {
  id: string;
  name: string;
  packageName: string;
}

interface BlockedWebsite {
  id: string;
  url: string;
  category: string;
}

interface ShieldSettings {
  isEnabled: boolean;
  blockedApps: BlockedApp[];
  blockedWebsites: BlockedWebsite[];
  notificationSettings: {
    allowImportant: boolean;
    allowCalls: boolean;
    allowMessages: boolean;
  };
}

class DistractionShield {
  private static instance: DistractionShield;
  private settings: ShieldSettings = {
    isEnabled: false,
    blockedApps: [],
    blockedWebsites: [],
    notificationSettings: {
      allowImportant: true,
      allowCalls: true,
      allowMessages: true,
    },
  };

  private constructor() {}

  public static getInstance(): DistractionShield {
    if (!DistractionShield.instance) {
      DistractionShield.instance = new DistractionShield();
    }
    return DistractionShield.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const savedSettings = await AsyncStorage.getItem('shieldSettings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
      await this.setupNotifications();
    } catch (error) {
      console.error('Failed to initialize DistractionShield:', error);
    }
  }

  private async setupNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }

      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true
        }),
      });
    } catch (error) {
      console.error('Failed to setup notifications:', error);
    }
  }

  public async enableShield(): Promise<void> {
    try {
      this.settings.isEnabled = true;
      await this.saveSettings();
      await this.blockNotifications();
      await this.showShieldActivatedNotification();
    } catch (error) {
      console.error('Failed to enable shield:', error);
      throw error;
    }
  }

  public async disableShield(): Promise<void> {
    try {
      this.settings.isEnabled = false;
      await this.saveSettings();
      await this.unblockNotifications();
      await this.showShieldDeactivatedNotification();
    } catch (error) {
      console.error('Failed to disable shield:', error);
      throw error;
    }
  }

  public async addBlockedApp(app: BlockedApp): Promise<void> {
    try {
      this.settings.blockedApps.push(app);
      await this.saveSettings();
    } catch (error) {
      console.error('Failed to add blocked app:', error);
      throw error;
    }
  }

  public async removeBlockedApp(appId: string): Promise<void> {
    try {
      this.settings.blockedApps = this.settings.blockedApps.filter(
        (app) => app.id !== appId
      );
      await this.saveSettings();
    } catch (error) {
      console.error('Failed to remove blocked app:', error);
      throw error;
    }
  }

  public async addBlockedWebsite(website: BlockedWebsite): Promise<void> {
    try {
      this.settings.blockedWebsites.push(website);
      await this.saveSettings();
    } catch (error) {
      console.error('Failed to add blocked website:', error);
      throw error;
    }
  }

  public async removeBlockedWebsite(websiteId: string): Promise<void> {
    try {
      this.settings.blockedWebsites = this.settings.blockedWebsites.filter(
        (website) => website.id !== websiteId
      );
      await this.saveSettings();
    } catch (error) {
      console.error('Failed to remove blocked website:', error);
      throw error;
    }
  }

  public async updateNotificationSettings(
    settings: ShieldSettings['notificationSettings']
  ): Promise<void> {
    try {
      this.settings.notificationSettings = settings;
      await this.saveSettings();
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem('shieldSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save shield settings:', error);
      throw error;
    }
  }

  private async blockNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      // Implement platform-specific notification blocking
      // This is a placeholder for actual implementation
      console.log('Blocking notifications...');
    } catch (error) {
      console.error('Failed to block notifications:', error);
      throw error;
    }
  }

  private async unblockNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      // Implement platform-specific notification unblocking
      // This is a placeholder for actual implementation
      console.log('Unblocking notifications...');
    } catch (error) {
      console.error('Failed to unblock notifications:', error);
      throw error;
    }
  }

  private async showShieldActivatedNotification(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Distraction Shield Activated',
          body: 'Your focus time is now protected. Stay focused!',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Failed to show shield activated notification:', error);
    }
  }

  private async showShieldDeactivatedNotification(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Distraction Shield Deactivated',
          body: 'You can now access all apps and notifications.',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Failed to show shield deactivated notification:', error);
    }
  }

  public getSettings(): ShieldSettings {
    return { ...this.settings };
  }

  public isShieldEnabled(): boolean {
    return this.settings.isEnabled;
  }
}

export default DistractionShield.getInstance(); 