import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
  toggleHapticFeedback: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: true,
      soundEnabled: true,
      hapticFeedback: true,

      setTheme: (theme) => set({ theme }),
      
      toggleNotifications: () => set((state) => ({
        notifications: !state.notifications,
      })),
      
      toggleSound: () => set((state) => ({
        soundEnabled: !state.soundEnabled,
      })),
      
      toggleHapticFeedback: () => set((state) => ({
        hapticFeedback: !state.hapticFeedback,
      })),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 