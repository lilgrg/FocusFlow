import RoutineItem from '@/components/RoutineItem';
import { TimedRoutineItem } from '@/types/core';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock DataManager methods
jest.mock('@/services/DataManager', () => ({
  __esModule: true,
  default: {
    loadRoutineItems: jest.fn(() => Promise.resolve([])),
    saveRoutineItems: jest.fn(() => Promise.resolve()),
  },
}));

describe('RoutineItem', () => {
  const mockRoutine: TimedRoutineItem = {
    id: '1',
    title: 'Morning Routine',
    duration: 30,
    icon: 'sunny-outline',
    isActive: true,
    time: '09:00',
    status: 'upcoming',
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <RoutineItem
        routine={mockRoutine}
        onStatusChange={() => {}}
      />
    );

    expect(getByText('Morning Routine')).toBeTruthy();
    expect(getByText('30 minutes')).toBeTruthy();
  });

  it('calls onStatusChange when Start button is pressed', async () => {
    const onStatusChange = jest.fn();
    const { getByText } = render(
      <RoutineItem
        routine={mockRoutine}
        onStatusChange={onStatusChange}
      />
    );
    await act(async () => {
      fireEvent.press(getByText('Start'));
    });
    expect(onStatusChange).toHaveBeenCalledWith('current');
  });
}); 