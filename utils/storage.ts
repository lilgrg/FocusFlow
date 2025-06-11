import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class Storage {
  private static instance: Storage;
  private isWeb: boolean;

  private constructor() {
    this.isWeb = Platform.OS === 'web';
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isWeb) {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.debug('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.debug('Storage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.debug('Storage removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.clear();
        }
        return;
      }
      await AsyncStorage.clear();
    } catch (error) {
      console.debug('Storage clear error:', error);
    }
  }
}

export const storage = Storage.getInstance(); 