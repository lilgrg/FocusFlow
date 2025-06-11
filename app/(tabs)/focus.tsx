import FocusTimer from '@/components/FocusTimer';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRoutineTasks } from '@/hooks/useRoutineTasks';
import { useFocusStore } from '@/store/focusStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  taskTitle: string;
  sessionType: string;
  completed: boolean;
  notes?: string;
}

type FocusState = 'idle' | 'running' | 'paused' | 'break' | 'completed';

interface FocusStatsProps {
  totalFocusTime: number;
  completedSessions: number;
  streak: number;
  averageSessionLength: number;
}

export default function FocusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const { routineItems } = useRoutineTasks();
  const { focusSession, startFocusSession, endFocusSession } = useFocusStore();

  useEffect(() => {
    console.log('Task ID:', taskId);
    console.log('Routine Items:', routineItems);
  }, [taskId, routineItems]);

  const selectedTask = routineItems.find(task => task.id === taskId);

  useEffect(() => {
    console.log('Selected Task:', selectedTask);
  }, [selectedTask]);

  if (!taskId) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No task selected</ThemedText>
      </ThemedView>
    );
  }

  if (!selectedTask) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Task not found. Task ID: {taskId}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FocusTimer
        task={selectedTask}
        onComplete={() => {
          endFocusSession();
          router.back();
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
}); 