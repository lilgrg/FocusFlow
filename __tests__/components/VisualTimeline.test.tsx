import { TimelineItem, VisualTimeline } from '@/components/VisualTimeline';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

// Mock Haptics and Platform
jest.mock('@/utils/Haptics', () => ({
  Haptics: {
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: {
      Light: 'light',
    },
  },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Platform.OS = 'ios';
  return RN;
});

describe('VisualTimeline', () => {
  const mockItems: TimelineItem[] = [
    {
      id: '1',
      time: '9:00 AM',
      title: 'Task 1',
      icon: 'checkmark-circle',
      color: '#000',
      status: 'completed',
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Task 2',
      icon: 'time',
      color: '#FFF',
      status: 'current',
    },
    {
      id: '3',
      time: '11:00 AM',
      title: 'Task 3',
      icon: 'calendar',
      color: '#CCC',
      status: 'upcoming',
    },
  ];

  const mockProps = {
    items: mockItems,
    onItemPress: jest.fn(),
    onTimePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProps.onItemPress.mockClear();
    mockProps.onTimePress.mockClear();
  });

  it('renders correctly', () => {
    const { getByText } = render(<VisualTimeline {...mockProps} />);
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
    expect(getByText('Task 3')).toBeTruthy();
  });

  it('calls onItemPress when item icon/title is pressed', async () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const itemTouchable = getByTestId('timeline-item-touchable-1');
    await act(async () => {
      fireEvent.press(itemTouchable);
    });
    expect(mockProps.onItemPress).toHaveBeenCalledWith(mockItems[1]);
  });

  it('calls onTimePress when time is pressed', async () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const timeButton = getByTestId('timeline-time-button-1');
    await act(async () => {
      fireEvent.press(timeButton);
    });
    expect(mockProps.onTimePress).toHaveBeenCalledWith('10:00 AM');
  });

  it('shows completed state correctly', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const completedConnector = getByTestId('connector-0');
    const style = completedConnector.props.style;
    const backgroundColor = Array.isArray(style)
      ? style.reduce((acc, s) => s.backgroundColor || acc, undefined)
      : style.backgroundColor;
    expect(backgroundColor).toBe('#4CAF50');
  });

  it('shows current state correctly', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const currentConnector = getByTestId('connector-1');
    const style = currentConnector.props.style;
    const backgroundColor = Array.isArray(style)
      ? style.reduce((acc, s) => s.backgroundColor || acc, undefined)
      : style.backgroundColor;
    expect(backgroundColor).toBe('#0A7EA4');
    expect(getByTestId('current-indicator')).toBeTruthy();
  });

  it('shows upcoming state correctly', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const upcomingConnector = getByTestId('connector-2');
    const style = upcomingConnector.props.style;
    const backgroundColor = Array.isArray(style)
      ? style.reduce((acc, s) => s.backgroundColor || acc, undefined)
      : style.backgroundColor;
    expect(backgroundColor).toBe('#E0E0E0');
  });

  it('shows connector lines between items', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    expect(getByTestId('connector-line-0')).toBeTruthy();
    expect(getByTestId('connector-line-1')).toBeTruthy();
  });

  it('applies correct colors to items', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    const item1Button = getByTestId('timeline-item-touchable-0');
    const item2Button = getByTestId('timeline-item-touchable-1');
    const style1 = item1Button.props.style;
    const style2 = item2Button.props.style;
    const backgroundColor1 = Array.isArray(style1)
      ? style1.reduce((acc, s) => s.backgroundColor || acc, undefined)
      : style1.backgroundColor;
    const backgroundColor2 = Array.isArray(style2)
      ? style2.reduce((acc, s) => s.backgroundColor || acc, undefined)
      : style2.backgroundColor;
    expect(backgroundColor1).toBe('#00010');
    expect(backgroundColor2).toBe('#FFF10');
  });

  it('shows icons correctly', () => {
    const { getByTestId } = render(<VisualTimeline {...mockProps} />);
    expect(getByTestId('icon-0')).toBeTruthy();
    expect(getByTestId('icon-1')).toBeTruthy();
    expect(getByTestId('icon-2')).toBeTruthy();
  });
}); 