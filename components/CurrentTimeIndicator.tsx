import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

type CurrentTimeIndicatorProps = {
  containerHeight: number;
};

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({
  containerHeight,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Start pulse animation
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    return () => clearInterval(interval);
  }, []);

  const getCurrentPosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    const totalHours = endHour - startHour;
    const minutesInDay = totalHours * 60;
    
    // Calculate position as a percentage
    const position = ((totalMinutes - startHour * 60) / minutesInDay) * containerHeight;
    return Math.max(0, Math.min(position, containerHeight));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          top: getCurrentPosition(),
        },
      ]}>
      <Animated.View style={[styles.indicator, animatedStyle]}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </Animated.View>
      <View style={styles.timeContainer}>
        <View style={styles.timeBubble}>
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 1000,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#FF6B6B',
    opacity: 0.5,
  },
  timeContainer: {
    position: 'absolute',
    left: 20,
    top: -20,
  },
  timeBubble: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
}); 