import { NotificationBehavior } from '@/types/core';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { BaseManager } from './BaseManager';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const behavior: NotificationBehavior = {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
    return behavior;
  },
});

class NotificationManager extends BaseManager {
  private static instance: NotificationManager;

  private constructor() {
    super();
    this.configureNotifications();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async configureNotifications(): Promise<void> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        await this.handleError('Failed to get push token for push notification!', 'Permission denied');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      await this.handleError('Error configuring notifications', error instanceof Error ? error.message : String(error));
    }
  }

  public async scheduleReminder(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const options: Notifications.NotificationRequestInput = {
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      };
      return await Notifications.scheduleNotificationAsync(options);
    } catch (error) {
      await this.handleError('Error scheduling reminder', error instanceof Error ? error.message : String(error));
      return '';
    }
  }

  public async scheduleTaskReminder(
    taskId: string,
    title: string,
    body: string,
    date: Date
  ): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { taskId },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: 'timeInterval',
          seconds: Math.floor((date.getTime() - Date.now()) / 1000),
          repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
      });
    } catch (error) {
      await this.handleError('Error scheduling task reminder', error instanceof Error ? error.message : String(error));
      return '';
    }
  }

  public async scheduleMovementReminder(
    title: string,
    body: string,
    hour: number,
    minute: number
  ): Promise<string> {
    try {
      const now = new Date();
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hour, minute, 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: 'timeInterval',
          seconds: Math.floor((scheduledTime.getTime() - now.getTime()) / 1000),
          repeats: true,
        } as Notifications.TimeIntervalTriggerInput,
      });
    } catch (error) {
      await this.handleError('Error scheduling movement reminder', error instanceof Error ? error.message : String(error));
      return '';
    }
  }

  public async scheduleWaterReminder(
    title: string,
    body: string,
    intervalSeconds: number
  ): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: 'timeInterval',
          seconds: intervalSeconds,
          repeats: true,
        } as Notifications.TimeIntervalTriggerInput,
      });
    } catch (error) {
      await this.handleError('Error scheduling water reminder', error instanceof Error ? error.message : String(error));
      return '';
    }
  }

  public async cancelReminder(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      await this.handleError('Error canceling reminder', error instanceof Error ? error.message : String(error));
    }
  }

  public async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      await this.handleError('Error canceling all reminders', error instanceof Error ? error.message : String(error));
    }
  }
}

export default NotificationManager.getInstance(); 