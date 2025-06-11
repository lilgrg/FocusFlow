import { Platform } from 'react-native';

export const createBoxShadow = (
  color: string = '#000',
  offset: { width: number; height: number } = { width: 0, height: 2 },
  opacity: number = 0.25,
  radius: number = 4
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    };
  }
  
  // Android uses elevation
  return {
    elevation: radius,
  };
}; 