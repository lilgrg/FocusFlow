import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Static imports for sound files
import completeSound from '../assets/sounds/complete.mp3';
import errorSound from '../assets/sounds/error.mp3';
import notificationSound from '../assets/sounds/notification.mp3';
import startSound from '../assets/sounds/start.mp3';
import stopSound from '../assets/sounds/stop.mp3';

// Sound effects
const SOUNDS = {
  complete: completeSound,
  click: notificationSound,
  water: startSound,
  break: stopSound,
  success: errorSound,
} as const;

type SoundType = keyof typeof SOUNDS;

// Haptic feedback types
const IMPACT_HAPTICS = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const;

const NOTIFICATION_HAPTICS = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
} as const;

type ImpactHapticType = keyof typeof IMPACT_HAPTICS;
type NotificationHapticType = keyof typeof NOTIFICATION_HAPTICS;

// Animation types
const ANIMATIONS = {
  bounce: {
    scale: [1, 1.2, 1],
    duration: 300,
  },
  pulse: {
    scale: [1, 1.1, 1],
    duration: 200,
  },
  shake: {
    translateX: [0, -10, 10, -10, 10, 0],
    duration: 400,
  },
  scale: {
    scale: [1, 1.1, 1],
    duration: 200,
  },
} as const;

type AnimationType = keyof typeof ANIMATIONS;

interface FeedbackOptions {
  sound?: SoundType;
  haptic?: {
    type: 'impact' | 'notification';
    style: ImpactHapticType | NotificationHapticType;
  };
  animation?: keyof typeof ANIMATIONS;
}

class FeedbackManager {
  private static instance: FeedbackManager;
  private sound: Audio.Sound | null = null;

  private constructor() {}

  public static getInstance(): FeedbackManager {
    if (!FeedbackManager.instance) {
      FeedbackManager.instance = new FeedbackManager();
    }
    return FeedbackManager.instance;
  }

  async playSound(type: SoundType): Promise<void> {
    try {
      if (Platform.OS === 'web') return;

      const soundFile = SOUNDS[type];

      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      this.sound = sound;
      await this.sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async vibrate(type: ImpactHapticType): Promise<void> {
    try {
      if (Platform.OS === 'web') return;

      const hapticType = IMPACT_HAPTICS[type];
      await Haptics.impactAsync(hapticType);
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  public async preloadSounds(): Promise<void> {
    try {
      for (const [key, sound] of Object.entries(SOUNDS)) {
        try {
          const { sound: audioSound } = await Audio.Sound.createAsync(sound, { shouldPlay: false });
          this.sound = audioSound;
        } catch (error) {
          console.warn(`Could not load sound file: ${key}`);
        }
      }
    } catch (error) {
      console.warn('Error preloading sounds:', error);
    }
  }

  public async provideFeedback(options: FeedbackOptions): Promise<void> {
    try {
      // Play sound if specified and available
      if (options.sound && this.sound) {
        try {
          await this.sound.replayAsync();
        } catch (error) {
          console.warn(`Error playing sound ${options.sound}:`, error);
        }
      }

      // Trigger haptic feedback if specified
      if (options.haptic) {
        try {
          if (options.haptic.type === 'impact') {
            await this.vibrate(options.haptic.style as ImpactHapticType);
          } else {
            await Haptics.notificationAsync(NOTIFICATION_HAPTICS[options.haptic.style as NotificationHapticType]);
          }
        } catch (error) {
          console.warn(`Error triggering haptic feedback:`, error);
        }
      }
    } catch (error) {
      console.warn('Error triggering feedback:', error);
    }
  }

  public cleanup(): void {
    // Unload all sounds
    this.sound?.unloadAsync();
    this.sound = null;
  }
}

export default FeedbackManager.getInstance(); 