import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';

type RoutineItemProps = {
  routine: {
    id: string;
    time: string;
    title: string;
    icon: string;
    completed: boolean;
    status: 'upcoming' | 'current' | 'completed';
  };
  onStatusChange: (status: string) => void;
  onStartFocus: () => void;
  style?: any;
};

export const RoutineItemComponent: React.FC<RoutineItemProps> = ({
  routine,
  onStatusChange,
  onStartFocus,
  style,
}) => {
  const isCurrent = routine.status === 'current';
  const isCompleted = routine.completed;

  const handlePress = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onStatusChange(routine.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isCurrent ? 1.02 : 1, {
          damping: 15,
          stiffness: 100,
        }),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        isCurrent && styles.currentContainer,
        isCompleted && styles.completedContainer,
        animatedStyle,
        style,
      ]}>
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.7}>
        <View style={styles.timeContainer}>
          <Text
            style={[
              styles.time,
              isCurrent && styles.currentTime,
              isCompleted && styles.completedTime,
            ]}>
            {routine.time}
          </Text>
        </View>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={routine.icon as any}
              size={24}
              color={isCompleted ? '#666' : '#000'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                isCurrent && styles.currentTitle,
                isCompleted && styles.completedTitle,
              ]}>
              {routine.title}
            </Text>
            {isCurrent && (
              <Text style={styles.statusText}>Current Task</Text>
            )}
          </View>
        </View>
        <View style={styles.statusContainer}>
          {isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : isCurrent ? (
            <TouchableOpacity
              onPress={onStartFocus}
              style={styles.focusButton}>
              <Ionicons name="timer-outline" size={24} color="#0A7EA4" />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color="#666"
              style={styles.upcomingIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  currentContainer: {
    backgroundColor: '#F0F7FA',
    borderWidth: 2,
    borderColor: '#0A7EA4',
  },
  completedContainer: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  currentTime: {
    color: '#0A7EA4',
    fontWeight: '600',
  },
  completedTime: {
    color: '#4CAF50',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  currentTitle: {
    color: '#0A7EA4',
  },
  completedTitle: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  statusText: {
    fontSize: 12,
    color: '#0A7EA4',
    marginTop: 4,
  },
  statusContainer: {
    width: 40,
    alignItems: 'center',
  },
  currentIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A7EA4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  upcomingIcon: {
    opacity: 0.5,
  },
  focusButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F7FA',
  },
}); 