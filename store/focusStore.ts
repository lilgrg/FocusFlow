import { TimedRoutineItem } from '@/types/core';
import { create } from 'zustand';

interface FocusStore {
  focusSession: TimedRoutineItem | null;
  startFocusSession: (task: TimedRoutineItem) => void;
  endFocusSession: () => void;
}

export const useFocusStore = create<FocusStore>((set) => ({
  focusSession: null,
  startFocusSession: (task) => set({ focusSession: task }),
  endFocusSession: () => set({ focusSession: null }),
})); 