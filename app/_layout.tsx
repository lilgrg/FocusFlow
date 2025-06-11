import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff3b30',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [themeComponents, setThemeComponents] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadThemeComponents = async () => {
      try {
        const nav = await import('@react-navigation/native');
        setThemeComponents({
          DarkTheme: nav.DarkTheme,
          DefaultTheme: nav.DefaultTheme,
          ThemeProvider: nav.ThemeProvider,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load theme components'));
      }
    };
    loadThemeComponents();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Failed to load app</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!loaded || !themeComponents) {
    // Async font loading only occurs in development.
    return null;
  }

  const { ThemeProvider, DarkTheme, DefaultTheme } = themeComponents;

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <CustomThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </CustomThemeProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
