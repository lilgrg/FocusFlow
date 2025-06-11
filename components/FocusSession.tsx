import DataManager from '@/services/DataManager';
import { TimedRoutineItem } from '@/types/RoutineTypes';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FocusSessionProps {
  task: TimedRoutineItem;
  onClose: () => void;
  onComplete: () => void;
}

export const FocusSession: React.FC<FocusSessionProps> = ({ task, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const dataManager = DataManager.getInstance();

  useEffect(() => {
    if (task) {
      setTimeLeft(task.duration * 60); // Convert minutes to seconds
    }
  }, [task]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!task) return;

    try {
      const currentTasks = await dataManager.loadRoutineItems();
      const currentCompletedTasks = await dataManager.loadCompletedTasks();
      
      const completedTask = {
        ...task,
        completed: true,
        completedAt: new Date()
      };

      const updatedTasks = currentTasks.filter(t => t.id !== task.id);
      const updatedCompletedTasks = [...currentCompletedTasks, completedTask];

      await dataManager.saveRoutineItems(updatedTasks);
      await dataManager.saveCompletedTasks(updatedCompletedTasks);

      // Update focus stats
      const stats = await dataManager.loadFocusStats();
      const focusTime = task.duration;
      await dataManager.saveFocusStats({
        ...stats,
        totalFocusTime: stats.totalFocusTime + focusTime,
        completedSessions: stats.completedSessions + 1,
        weeklyProgress: (stats.totalFocusTime + focusTime) / stats.weeklyGoal,
        monthlyProgress: (stats.totalFocusTime + focusTime) / stats.monthlyGoal,
      });

      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert('Success', 'Task completed successfully!');
      onComplete();
    } catch (error) {
      console.error('Error completing task:', error);
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No task selected</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.timerLabel}>Time Remaining</Text>
      </View>

      <View style={styles.controls}>
        {isActive ? (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Ionicons name="pause" size={24} color="#fff" />
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Ionicons name="checkmark" size={24} color="#fff" />
          <Text style={styles.buttonText}>Complete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  pauseButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});