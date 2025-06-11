import { TimedRoutineItem } from '@/types/core';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import DraggableRoutineItem from '../../components/DraggableRoutineItem';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  State: {
    BEGAN: 1,
    ACTIVE: 2,
    END: 3,
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    useAnimatedGestureHandler: (handlers: any) => ({
      onStart: handlers.onStart,
      onActive: handlers.onActive,
      onEnd: handlers.onEnd,
    }),
    useAnimatedStyle: (style: () => any) => style(),
    useSharedValue: (value: any) => ({ value }),
    withSpring: (value: any) => value,
    withTiming: (value: any) => value,
    runOnJS: (fn: () => void) => fn,
    View: View,
  };
});

describe('DraggableRoutineItem', () => {
  const mockProps = {
    item: {
      id: '1',
      name: 'Morning Routine',
      duration: 30,
      isCompleted: false,
      time: '09:00',
      status: 'current',
      color: '#4CAF50',
      title: 'Morning Routine',
      icon: 'sunny-outline',
      isActive: true,
    } as TimedRoutineItem,
    index: 0,
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    isActive: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    console.log('Starting DraggableRoutineItem test');
    const { getByText } = render(<DraggableRoutineItem {...mockProps} />);
    console.log('Component rendered successfully');
    
    const nameElement = getByText('Morning Routine');
    console.log('Found name element:', !!nameElement);
    
    const durationElement = getByText('30 minutes');
    console.log('Found duration element:', !!durationElement);
  });

  it('calls onDragStart when drag starts', async () => {
    console.log('\nTesting drag start behavior');
    const { getByTestId } = render(<DraggableRoutineItem {...mockProps} />);
    const panGestureHandler = getByTestId('pan-gesture-handler');
    
    await act(async () => {
      const handler = panGestureHandler.props.onGestureEvent;
      if (handler && handler.onStart) {
        handler.onStart({ state: 1, translationY: 0 });
      }
    });
    
    console.log('Test Results:');
    console.log('- onDragStart called:', mockProps.onDragStart.mock.calls.length > 0);
    expect(mockProps.onDragStart).toHaveBeenCalled();
  });

  it('calls onDragEnd with the correct index when drag ends', async () => {
    console.log('\nTesting drag end behavior');
    const { getByTestId } = render(<DraggableRoutineItem {...mockProps} />);
    const panGestureHandler = getByTestId('pan-gesture-handler');
    
    await act(async () => {
      const handler = panGestureHandler.props.onGestureEvent;
      if (handler && handler.onStart && handler.onEnd) {
        handler.onStart({ state: 1, translationY: 0 });
        handler.onEnd({ state: 3, translationY: 100 });
      }
    });
    
    console.log('Test Results:');
    console.log('- onDragEnd called:', mockProps.onDragEnd.mock.calls.length > 0);
    expect(mockProps.onDragEnd).toHaveBeenCalledWith(mockProps.index);
  });

  it('applies active styles when isActive is true', () => {
    console.log('\nTesting active styles');
    const { getByTestId } = render(<DraggableRoutineItem {...mockProps} isActive={true} />);
    const item = getByTestId('draggable-item');
    
    console.log('Test Results:');
    console.log('- Item found:', !!item);
    const flatStyle = StyleSheet.flatten(item.props.style);
    console.log('- Item styles:', flatStyle);
    
    expect(flatStyle.opacity).toBe(0.8);
  });
}); 