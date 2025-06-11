import { SystemBoundaries } from '@/types/core';
import { Platform } from 'react-native';

// Get the project root directory
export const getProjectRoot = (): string => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return process.cwd();
};

// Get the current environment
export const getEnvironment = (): SystemBoundaries['environment'] => {
  if (__DEV__) {
    return 'development';
  }
  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }
  return 'production';
};

// Get the current platform
export const getPlatform = (): SystemBoundaries['platform'] => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  if (Platform.OS === 'android') {
    return 'android';
  }
  return 'web';
};

// Get available features based on platform and environment
export const getAvailableFeatures = (): SystemBoundaries['features'] => {
  const platform = getPlatform();
  const environment = getEnvironment();

  return {
    notifications: platform !== 'web',
    sound: true, // Sound is available on all platforms
    haptics: platform !== 'web',
  };
};

// Get the complete system boundaries
export const getSystemBoundaries = (): SystemBoundaries => {
  return {
    environment: getEnvironment(),
    platform: getPlatform(),
    features: getAvailableFeatures(),
  };
};

// Check if a feature is available
export const isFeatureAvailable = (feature: keyof SystemBoundaries['features']): boolean => {
  return getAvailableFeatures()[feature];
};

// Get the appropriate file path separator
export const getPathSeparator = (): string => {
  return Platform.OS === 'windows' ? '\\' : '/';
};

// Get the appropriate assets directory
export const getAssetsDirectory = (): string => {
  const root = getProjectRoot();
  return `${root}${getPathSeparator()}assets`;
};

// Get the appropriate sounds directory
export const getSoundsDirectory = (): string => {
  return `${getAssetsDirectory()}${getPathSeparator()}sounds`;
}; 