import { TimedRoutineItem } from '@/types/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskItemProps = {
  task: TimedRoutineItem;
  onStart: (task: TimedRoutineItem) => void;
  onComplete: (task: TimedRoutineItem) => void;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onStart, onComplete }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskName}>{task.title}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.time}>{task.time}</Text>
          <Text style={styles.duration}>{formatDuration(task.duration)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => onStart(task)}
      >
        <Text style={styles.startButtonText}>Start Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 