import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskCardProps = {
  task: {
    id: string;
    time: string;
    title: string;
    description?: string;
    icon: string;
    color: string;
    completed: boolean;
    status: 'upcoming' | 'current' | 'completed';
    habits?: Array<{
      id: string;
      name: string;
      icon: string;
      completed: boolean;
    }>;
  };
  onStatusChange: (status: string) => void;
  onStartFocus: () => void;
  onExpand: () => void;
};

export const EnhancedTaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onStartFocus,
  onExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const expandAnim = new Animated.Value(0);

  const handlePress = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsExpanded(!isExpanded);
    onExpand();
    
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
      tension: 40,
      friction: 7,
    }).start();
  }, [isExpanded, onExpand]);

  const handleStatusChange = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onStatusChange(task.id);
  }, [onStatusChange, task.id]);

  const handleStartFocus = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onStartFocus();
  }, [onStartFocus]);

  const cardHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 200],
  });

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: cardHeight,
          backgroundColor: task.color + '10',
          borderColor: task.color + '30',
        },
      ]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={handlePress}
        activeOpacity={0.7}>
        <View style={styles.timeContainer}>
          <Text
            style={[
              styles.time,
              task.status === 'current' && styles.currentTime,
              task.completed && styles.completedTime,
            ]}>
            {task.time}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: task.color + '20' }]}>
              <Ionicons name={task.icon as any} size={24} color={task.color} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.title,
                  task.status === 'current' && styles.currentTitle,
                  task.completed && styles.completedTitle,
                ]}>
                {task.title}
              </Text>
              {task.status === 'current' && (
                <Text style={styles.statusText}>Current Task</Text>
              )}
            </View>
          </View>

          <View style={styles.actionContainer}>
            {task.completed ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : task.status === 'current' ? (
              <TouchableOpacity
                onPress={handleStartFocus}
                style={[styles.focusButton, { backgroundColor: task.color + '20' }]}>
                <Ionicons name="timer-outline" size={24} color={task.color} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleStatusChange}
                style={styles.upcomingButton}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#666"
                  style={styles.upcomingIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.expandedContent,
          {
            opacity: contentOpacity,
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 120],
            }),
          },
        ]}>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}

        {task.habits && task.habits.length > 0 && (
          <View style={styles.habitsContainer}>
            <Text style={styles.habitsTitle}>Associated Habits:</Text>
            {task.habits.map((habit) => (
              <View key={habit.id} style={styles.habitItem}>
                <Ionicons
                  name={habit.icon as any}
                  size={16}
                  color={habit.completed ? '#4CAF50' : '#666'}
                />
                <Text
                  style={[
                    styles.habitText,
                    habit.completed && styles.completedHabitText,
                  ]}>
                  {habit.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    overflow: 'hidden',
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
  mainContent: {
    flexDirection: 'row',
    padding: 16,
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  actionContainer: {
    width: 40,
    alignItems: 'center',
  },
  focusButton: {
    padding: 8,
    borderRadius: 20,
  },
  upcomingButton: {
    padding: 8,
  },
  upcomingIcon: {
    opacity: 0.5,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  habitsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  habitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  completedHabitText: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
}); 