import { useRoutineStore } from '../../store/routineStore';
import { Routine } from '../../types';

describe('Routine Store', () => {
  beforeEach(() => {
    const store = useRoutineStore.getState();
    store.routines = [];
  });

  it('should add a new routine', () => {
    const store = useRoutineStore.getState();
    const newRoutine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Test Routine',
      description: 'Test Description',
      category: 'work',
      duration: {
        hours: 1,
        minutes: 30,
        seconds: 0,
      },
      status: 'pending',
      notificationPreferences: {
        enabled: true,
        sound: true,
        vibration: true,
        reminderTime: 5,
      },
      priority: 1,
    };

    store.addRoutine(newRoutine);
    expect(store.routines).toHaveLength(1);
    expect(store.routines[0].title).toBe('Test Routine');
  });

  it('should update a routine', () => {
    const store = useRoutineStore.getState();
    const routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Test Routine',
      description: 'Test Description',
      category: 'work',
      duration: {
        hours: 1,
        minutes: 30,
        seconds: 0,
      },
      status: 'pending',
      notificationPreferences: {
        enabled: true,
        sound: true,
        vibration: true,
        reminderTime: 5,
      },
      priority: 1,
    };

    store.addRoutine(routine);
    const addedRoutine = store.routines[0];

    store.updateRoutine(addedRoutine.id, { title: 'Updated Title' });
    expect(store.routines[0].title).toBe('Updated Title');
  });

  it('should delete a routine', () => {
    const store = useRoutineStore.getState();
    const routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Test Routine',
      description: 'Test Description',
      category: 'work',
      duration: {
        hours: 1,
        minutes: 30,
        seconds: 0,
      },
      status: 'pending',
      notificationPreferences: {
        enabled: true,
        sound: true,
        vibration: true,
        reminderTime: 5,
      },
      priority: 1,
    };

    store.addRoutine(routine);
    const addedRoutine = store.routines[0];

    store.deleteRoutine(addedRoutine.id);
    expect(store.routines).toHaveLength(0);
  });

  it('should handle loading state', () => {
    const store = useRoutineStore.getState();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it('should handle error state', () => {
    const store = useRoutineStore.getState();
    const errorMessage = 'Test error';
    store.setError(errorMessage);
    expect(store.error).toBe(errorMessage);
    store.setError(null);
    expect(store.error).toBe(null);
  });
}); 