import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  getColor: (lightColor: string, darkColor?: string) => string;
  getTextStyle: (size: number) => { fontSize: number };
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FFC107',
};

const darkTheme: ThemeColors = {
  background: '#121212',
  text: '#FFFFFF',
  primary: '#81C784',
  secondary: '#64B5F6',
  accent: '#FFD54F',
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const systemColorScheme = useColorScheme();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getColor = (lightColor: string, darkColor?: string) => {
    return isDark ? (darkColor || lightColor) : lightColor;
  };

  const getTextStyle = (size: number) => ({
    fontSize: size,
  });

  const theme: Theme = {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
    toggleTheme,
    getColor,
    getTextStyle,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 