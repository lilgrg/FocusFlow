import { Haptics } from '@/utils/Haptics';
import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ConfettiEffect } from './ConfettiEffect';
import { ParticleEffect } from './ParticleEffect';

export const DopamineBoost: React.FC = () => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start animations
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset animations after completion
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}>
      <ParticleEffect />
      <ConfettiEffect />
      <View style={styles.celebrationContainer}>
        <Animated.Text
          style={[
            styles.celebrationText,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.8, 1.2, 1],
                  }),
                },
              ],
            },
          ]}>
          🎉 Great job! 🎉
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  celebrationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A7EA4',
    textAlign: 'center',
  },
}); 