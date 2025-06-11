import { useTaskManager } from '@/hooks/useTaskManager';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FABMenu } from '../../components/FABMenu';
import { RoutineModal } from '../../components/RoutineModal';
import { TaskList } from '../../components/TaskList';
import { ThemedView } from '../../components/ThemedView';
import { useRoutineTasks } from '../../hooks/useRoutineTasks';
import { routineService } from '../../services/RoutineService';
import { useFocusStore } from '../../store/focusStore';
import { TimedRoutineItem } from '../../types/RoutineTypes';

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const CATEGORY_OPTIONS = [
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Health', value: 'health' },
  { label: 'Learning', value: 'learning' },
  { label: 'Social', value: 'social' },
];

const DURATION_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
];

type FABAction = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  color: string;
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { routineItems, completedTasks, addTask, completeTask, removeTask, setRoutineItems } = useRoutineTasks();
  const { startFocusSession } = useFocusStore();
  const [isRoutineModalVisible, setIsRoutineModalVisible] = useState(false);
  const [routineModalMode, setRoutineModalMode] = useState<'add'>('add');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedIcon, setSelectedIcon] = useState('calendar');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [taskDescription, setTaskDescription] = useState('');
  const [isFABOpen, setIsFABOpen] = useState(false);

  const {
    tasks,
    completedTasks: taskManagerCompletedTasks,
    loading,
    error,
    addTask: taskManagerAddTask,
    completeTask: taskManagerCompleteTask,
    deleteTask,
    refreshTasks
  } = useTaskManager();

  // Combine routine and non-routine tasks, ensuring no duplicates
  const allTasks = useMemo(() => {
    // Create a Map to store unique tasks by ID
    const taskMap = new Map<string, TimedRoutineItem>();
    
    // Add routine tasks first
    routineItems.forEach(task => {
      taskMap.set(task.id, task);
    });
    
    // Add non-routine tasks, only if they don't already exist
    tasks.forEach(task => {
      if (!taskMap.has(task.id)) {
        taskMap.set(task.id, task);
      }
    });
    
    // Convert Map values back to array
    return Array.from(taskMap.values());
  }, [routineItems, tasks]);

  // Load routine tasks for today
  useEffect(() => {
    const loadRoutineTasks = async () => {
      try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const routineBlocks = await routineService.getRoutine(dateString);
        
        // Convert routine blocks to timed routine items
        const newRoutineItems = routineBlocks.map(block => ({
          id: block.id,
          title: block.title,
          description: '',
          duration: getDuration(block.startTime, block.endTime),
          completed: block.completed || false,
          completedAt: block.completedAt ? new Date(block.completedAt) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: block.icon,
          time: block.startTime,
          priority: 'medium' as const,
          category: 'personal' as const,
          color: block.color || '#0A7EA4',
          isActive: false,
          status: block.completed ? 'completed' as const : 'upcoming' as const,
          isRoutine: true
        }));

        // Update the task list with routine items, avoiding duplicates
        const uniqueNewItems = newRoutineItems.filter(newItem => 
          !routineItems.some(existing => existing.id === newItem.id)
        );
        
        if (uniqueNewItems.length > 0) {
          uniqueNewItems.forEach(item => addTask(item));
        }
      } catch (error) {
        console.error('Error loading routine tasks:', error);
      }
    };

    loadRoutineTasks();
  }, [addTask]); // Remove routineItems from dependencies to prevent infinite loop

  const getDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    return (endHour - startHour) * 60 + (endMinute - startMinute);
  };

  const handleStartTask = useCallback((task: TimedRoutineItem) => {
    startFocusSession(task);
    router.push('/focus');
  }, [startFocusSession, router]);

  const handleCompleteTask = useCallback(async (task: TimedRoutineItem) => {
    try {
      if (task.isRoutine) {
        await completeTask(task.id);
      } else {
        await taskManagerCompleteTask(task.id);
      }
      await refreshTasks();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  }, [completeTask, taskManagerCompleteTask, refreshTasks]);

  const handleDeleteTask = useCallback(async (task: TimedRoutineItem) => {
    console.log('HomeScreen: Attempting to delete task:', task.id, task.title);
    try {
      if (task.isRoutine) {
        // Remove from routine service
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const routineBlocks = await routineService.getRoutine(dateString);
        const updatedBlocks = routineBlocks.filter(block => block.id !== task.id);
        await routineService.saveRoutine(dateString, updatedBlocks);
        console.log('HomeScreen: Removed from routine blocks');
        
        // Update local state
        setRoutineItems(prev => prev.filter(item => item.id !== task.id));
      } else {
        // Delete from task manager
        await deleteTask(task.id);
        console.log('HomeScreen: Task deleted from task manager');
      }

      // Refresh tasks
      await refreshTasks();
      console.log('HomeScreen: Tasks refreshed');
    } catch (error) {
      console.error('HomeScreen: Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  }, [deleteTask, refreshTasks, setRoutineItems]);

  const handleSaveTask = useCallback(async () => {
    try {
      console.log('HomeScreen: Starting task creation...');
      
      // Create task data
      const taskData: Partial<TimedRoutineItem> = {
        title: newItemTitle,
        description: taskDescription,
        time: selectedTime,
        icon: selectedIcon,
        priority: selectedPriority as 'high' | 'medium' | 'low',
        category: selectedCategory as 'work' | 'personal' | 'health' | 'learning' | 'social',
        duration: selectedDuration,
        isRoutine: false  // This is a non-routine task
      };

      console.log('HomeScreen: Task data prepared:', taskData);

      // Add to task manager
      const newTask = await taskManagerAddTask(taskData);
      console.log('HomeScreen: Task added to task manager:', newTask);

      // Reset form
      setNewItemTitle('');
      setTaskDescription('');
      setSelectedTime('09:00');
      setSelectedIcon('calendar');
      setSelectedPriority('medium');
      setSelectedCategory('personal');
      setSelectedDuration(60);
      setIsRoutineModalVisible(false);

      // Refresh tasks
      await refreshTasks();
      console.log('HomeScreen: Tasks refreshed after creation');
    } catch (error) {
      console.error('HomeScreen: Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  }, [
    newItemTitle,
    taskDescription,
    selectedTime,
    selectedIcon,
    selectedPriority,
    selectedCategory,
    selectedDuration,
    taskManagerAddTask,
    refreshTasks
  ]);

  const handleFABPress = useCallback(() => {
    setIsFABOpen(prev => !prev);
  }, []);

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleActionPress = useCallback((action: FABAction) => {
    setIsFABOpen(false);
    if (action.id === 'add') {
      setIsRoutineModalVisible(true);
    } else if (action.id === 'clear') {
      Alert.alert(
        'Clear All Tasks',
        'Are you sure you want to clear all tasks?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              // Implement clear all tasks
            }
          }
        ]
      );
    }
  }, []);

  const handleReorderTasks = useCallback(async (fromIndex: number, toIndex: number) => {
    try {
      const newTasks = [...allTasks];
      const [movedTask] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, movedTask);
      
      // Update the time of the moved task to match its new position
      const updatedTasks = newTasks.map((task, index) => {
        if (index === toIndex) {
          const prevTask = newTasks[index - 1];
          const nextTask = newTasks[index + 1];
          let newTime = task.time;
          
          if (prevTask && nextTask) {
            // Calculate midpoint between previous and next task times
            const prevTime = prevTask.time.split(':').map(Number);
            const nextTime = nextTask.time.split(':').map(Number);
            const prevMinutes = prevTime[0] * 60 + prevTime[1];
            const nextMinutes = nextTime[0] * 60 + nextTime[1];
            const midMinutes = Math.floor((prevMinutes + nextMinutes) / 2);
            newTime = `${Math.floor(midMinutes / 60).toString().padStart(2, '0')}:${(midMinutes % 60).toString().padStart(2, '0')}`;
          } else if (prevTask) {
            // If it's the last task, add 30 minutes to the previous task's time
            const prevTime = prevTask.time.split(':').map(Number);
            const newMinutes = (prevTime[0] * 60 + prevTime[1] + 30) % (24 * 60);
            newTime = `${Math.floor(newMinutes / 60).toString().padStart(2, '0')}:${(newMinutes % 60).toString().padStart(2, '0')}`;
          } else if (nextTask) {
            // If it's the first task, subtract 30 minutes from the next task's time
            const nextTime = nextTask.time.split(':').map(Number);
            const newMinutes = (nextTime[0] * 60 + nextTime[1] - 30 + 24 * 60) % (24 * 60);
            newTime = `${Math.floor(newMinutes / 60).toString().padStart(2, '0')}:${(newMinutes % 60).toString().padStart(2, '0')}`;
          }
          
          return { ...task, time: newTime };
        }
        return task;
      });

      // Save to routine service
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const routineBlocks = updatedTasks.map(task => ({
        id: task.id,
        title: task.title,
        startTime: task.time,
        endTime: calculateEndTime(task.time, task.duration),
        icon: task.icon,
        color: task.color || '#0A7EA4',
        completed: task.completed,
        completedAt: task.completedAt?.toISOString()
      }));
      await routineService.saveRoutine(dateString, routineBlocks);
    } catch (error) {
      console.error('Error reordering tasks:', error);
      Alert.alert('Error', 'Failed to reorder tasks');
    }
  }, [allTasks]);

  const fabActions = useMemo(() => [
    {
      id: 'add',
      title: 'Add Task',
      icon: 'add' as keyof typeof Ionicons.glyphMap,
      action: () => handleActionPress({ id: 'add', title: '', icon: 'add', action: () => {}, color: '#0A7EA4' }),
      color: '#0A7EA4'
    },
    {
      id: 'clear',
      title: 'Clear All Tasks',
      icon: 'trash' as keyof typeof Ionicons.glyphMap,
      action: () => handleActionPress({ id: 'clear', title: '', icon: 'trash', action: () => {}, color: '#FF6B6B' }),
      color: '#FF6B6B'
    }
  ], [handleActionPress]);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Tasks</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TaskList
          tasks={allTasks}
          completedTasks={taskManagerCompletedTasks}
          onStartTask={handleStartTask}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
          loading={loading}
        />
      </ThemedView>
      <FABMenu
        isOpen={isFABOpen}
        onFABPress={handleFABPress}
        onActionPress={handleActionPress}
        actions={fabActions}
      />
      <RoutineModal
        visible={isRoutineModalVisible}
        mode={routineModalMode}
        editingItem={null}
        newItemTitle={newItemTitle}
        selectedTime={selectedTime}
        selectedIcon={selectedIcon}
        selectedPriority={selectedPriority}
        selectedCategory={selectedCategory}
        selectedDuration={selectedDuration}
        taskDescription={taskDescription}
        onClose={() => setIsRoutineModalVisible(false)}
        onSave={handleSaveTask}
        onTitleChange={setNewItemTitle}
        onTimeSelect={setSelectedTime}
        onIconSelect={setSelectedIcon}
        onPrioritySelect={setSelectedPriority}
        onCategorySelect={setSelectedCategory}
        onDurationSelect={setSelectedDuration}
        onDescriptionChange={setTaskDescription}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A7EA4',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  affirmation: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    color: '#0A7EA4',
  },
}); 