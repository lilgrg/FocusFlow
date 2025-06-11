import DataManager from '@/services/DataManager';
import { CompletedTask, TimedRoutineItem } from '@/types/RoutineTypes';
import { useCallback, useEffect, useState } from 'react';

export function useRoutineTasks() {
  const [routineItems, setRoutineItems] = useState<TimedRoutineItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

  useEffect(() => {
    (async () => {
      const data = await DataManager.getInstance().loadAppData();
      setRoutineItems(data.routineItems);
      setCompletedTasks(data.completedTasks);
    })();
  }, []);

  const addTask = useCallback(async (task: TimedRoutineItem) => {
    const updated = [...routineItems, task];
    setRoutineItems(updated);
    await DataManager.getInstance().saveRoutineItems(updated);
  }, [routineItems]);

  const updateTask = useCallback(async (taskId: string, task: TimedRoutineItem) => {
    const updated = routineItems.map(item => 
      item.id === taskId ? { ...task, id: taskId } : item
    );
    setRoutineItems(updated);
    await DataManager.getInstance().saveRoutineItems(updated);
  }, [routineItems]);

  const completeTask = useCallback(async (taskId: string) => {
    try {
      // Use DataManager to handle task completion
      await DataManager.getInstance().completeTask(taskId);
      
      // Reload data to ensure consistency
      const data = await DataManager.getInstance().loadAppData();
      setRoutineItems(data.routineItems);
      setCompletedTasks(data.completedTasks);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }, []);

  const removeTask = useCallback(async (taskId: string) => {
    const updated = routineItems.filter(t => t.id !== taskId);
    setRoutineItems(updated);
    await DataManager.getInstance().saveRoutineItems(updated);
  }, [routineItems]);

  return {
    routineItems,
    completedTasks,
    addTask,
    updateTask,
    completeTask,
    removeTask,
    setRoutineItems,
    setCompletedTasks,
  };
} 