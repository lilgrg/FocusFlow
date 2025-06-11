import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PersonalizedHeader } from '../../components/PersonalizedHeader';

// Mock Haptics
jest.mock('@/utils/Haptics', () => ({
  Haptics: {
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: { Light: 'Light' },
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('PersonalizedHeader', () => {
  const mockProps = {
    userName: 'John',
    onMenuPress: jest.fn(),
    onProfilePress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<PersonalizedHeader {...mockProps} />);
    expect(getByText('Welcome, John!')).toBeTruthy();
  });

  it('calls onMenuPress when menu button is pressed', async () => {
    const { getByTestId } = render(<PersonalizedHeader {...mockProps} />);
    const menuButton = getByTestId('menu-icon');
    
    await act(async () => {
      fireEvent.press(menuButton);
    });
    
    expect(mockProps.onMenuPress).toHaveBeenCalled();
  });

  it('calls onProfilePress when profile button is pressed', async () => {
    const { getByTestId } = render(<PersonalizedHeader {...mockProps} />);
    const profileButton = getByTestId('profile-icon');
    
    await act(async () => {
      fireEvent.press(profileButton);
    });
    
    expect(mockProps.onProfilePress).toHaveBeenCalled();
  });

  it('shows date picker when date is pressed', async () => {
    const { getByTestId } = render(<PersonalizedHeader {...mockProps} />);
    const dateButton = getByTestId('date-icon');
    
    await act(async () => {
      fireEvent.press(dateButton);
    });
    
    expect(getByTestId('close-button')).toBeTruthy();
  });
}); 