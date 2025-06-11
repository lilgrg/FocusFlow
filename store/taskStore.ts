import { create } from 'zustand';
import { TimedRoutineItem } from '../types/core';

interface TaskStore {
  tasks: TimedRoutineItem[];
  addTask: (task: TimedRoutineItem) => void;
  updateTask: (id: string, task: Partial<TimedRoutineItem>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
})); 