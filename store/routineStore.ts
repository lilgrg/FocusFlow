import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Routine as RoutineType } from '../types';

export type Routine = RoutineType;

interface RoutineState {
  routines: Routine[];
  isLoading: boolean;
  error: string | null;
  // Actions
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: [],
      isLoading: false,
      error: null,

      addRoutine: (routine) => set((state) => ({
        routines: [
          ...state.routines,
          {
            ...routine,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),

      updateRoutine: (id, routine) => set((state) => ({
        routines: state.routines.map((r) =>
          r.id === id
            ? { ...r, ...routine, updatedAt: new Date().toISOString() }
            : r
        ),
      })),

      deleteRoutine: (id) => set((state) => ({
        routines: state.routines.filter((r) => r.id !== id),
      })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'routine-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 