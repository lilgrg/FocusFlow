import { TaskService } from '@/services/TaskService';
import { TimedRoutineItem } from '@/types/RoutineTypes';
import { useCallback, useEffect, useState } from 'react';

export function useTaskManager() {
  const [tasks, setTasks] = useState<TimedRoutineItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TimedRoutineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const taskService = TaskService.getInstance();

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [activeTasks, completed] = await Promise.all([
        taskService.getTasks(),
        taskService.getCompletedTasks()
      ]);
      setTasks(activeTasks);
      setCompletedTasks(completed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback(async (taskData: Partial<TimedRoutineItem>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add task'));
      throw err;
    }
  }, []);

  const completeTask = useCallback(async (taskId: string) => {
    try {
      await taskService.completeTask(taskId);
      await loadTasks(); // Reload to ensure consistency
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete task'));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'));
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<TimedRoutineItem>) => {
    try {
      await taskService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'));
      throw err;
    }
  }, []);

  return {
    tasks,
    completedTasks,
    loading,
    error,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
    refreshTasks: loadTasks
  };
} 