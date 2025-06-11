import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

type BreakTimerProps = {
  duration: number; // in minutes
  onComplete: () => void;
  onSkip: () => void;
};

export const BreakTimer: React.FC<BreakTimerProps> = ({
  duration,
  onComplete,
  onSkip,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Load break sound
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/notification.mp3')
      );
      setSound(sound);
    };
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const handleComplete = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (sound) {
      await sound.playAsync();
    }
    onComplete();
  }, [onComplete, sound]);

  const handleSkip = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSkip();
  }, [onSkip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Break Time</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.timerContainer, animatedStyle]}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.breakMessage}>Time to recharge!</Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>

        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Quick Break Activities:</Text>
          <View style={styles.suggestionItem}>
            <Ionicons name="water-outline" size={20} color="#0A7EA4" />
            <Text style={styles.suggestionText}>Drink some water</Text>
          </View>
          <View style={styles.suggestionItem}>
            <Ionicons name="walk-outline" size={20} color="#0A7EA4" />
            <Text style={styles.suggestionText}>Take a short walk</Text>
          </View>
          <View style={styles.suggestionItem}>
            <Ionicons name="eye-outline" size={20} color="#0A7EA4" />
            <Text style={styles.suggestionText}>Rest your eyes</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4CAF50',
    fontVariant: ['tabular-nums'],
  },
  breakMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  suggestions: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 