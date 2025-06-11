import DistractionShield from '@/services/DistractionShield';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-notifications');

describe('DistractionShield', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default settings', async () => {
    await DistractionShield.initialize();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('shieldSettings');
  });

  it('enables shield successfully', async () => {
    await DistractionShield.enableShield();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Distraction Shield Activated',
        }),
      })
    );
  });

  it('disables shield successfully', async () => {
    await DistractionShield.disableShield();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Distraction Shield Deactivated',
        }),
      })
    );
  });

  it('adds blocked app successfully', async () => {
    const mockApp = {
      id: '1',
      name: 'Test App',
      packageName: 'com.test.app',
    };

    await DistractionShield.addBlockedApp(mockApp);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('removes blocked app successfully', async () => {
    await DistractionShield.removeBlockedApp('1');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('updates notification settings successfully', async () => {
    const mockSettings = {
      allowImportant: true,
      allowCalls: true,
      allowMessages: true,
    };

    await DistractionShield.updateNotificationSettings(mockSettings);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
    
    await expect(DistractionShield.enableShield()).rejects.toThrow('Storage error');
  });
}); 