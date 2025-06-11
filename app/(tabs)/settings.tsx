import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AccessibilitySettings, useTheme } from '@/contexts/ThemeContext';
import DataManager from '@/services/DataManager';
import { storage } from '@/utils/storage';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const TEXT_SIZES = [
  { label: 'Small', value: 0.8 },
  { label: 'Medium', value: 1 },
  { label: 'Large', value: 1.2 },
  { label: 'Extra Large', value: 1.4 },
];

const COLOR_BLIND_MODES = [
  { label: 'None', value: 'none' as const },
  { label: 'Protanopia', value: 'protanopia' as const },
  { label: 'Deuteranopia', value: 'deuteranopia' as const },
  { label: 'Tritanopia', value: 'tritanopia' as const },
];

export default function SettingsScreen() {
  const {
    highContrast,
    textSize,
    colorBlindMode,
    setHighContrast,
    setTextSize,
    setColorBlindMode,
    setAccessibilitySettings,
  } = useTheme();

  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await storage.setItem('accessibilitySettings', JSON.stringify(newSettings));
      setAccessibilitySettings(newSettings);
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will remove all tasks, completed tasks, and statistics.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Cache', 
          style: 'destructive',
          onPress: async () => {
            try {
              await DataManager.getInstance().clearAllData();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('Error', 'Failed to clear cache. Please try again.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    saveSettings({ highContrast, textSize, colorBlindMode });
  }, [highContrast, textSize, colorBlindMode]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText size={24} style={styles.title}>
        Accessibility Settings
      </ThemedText>

      <View style={styles.section}>
        <ThemedText size={18} style={styles.sectionTitle}>
          High Contrast Mode
        </ThemedText>
        <Switch
          value={highContrast}
          onValueChange={setHighContrast}
          accessibilityLabel="Toggle high contrast mode"
          accessibilityHint="Enables high contrast colors for better visibility"
        />
      </View>

      <View style={styles.section}>
        <ThemedText size={18} style={styles.sectionTitle}>
          Text Size
        </ThemedText>
        <View style={styles.optionsContainer}>
          {TEXT_SIZES.map((size) => (
            <TouchableOpacity
              key={size.label}
              style={[
                styles.optionButton,
                textSize === size.value && styles.selectedOption,
              ]}
              onPress={() => setTextSize(size.value)}
              accessibilityLabel={`Set text size to ${size.label}`}
              accessibilityHint={`Changes the text size to ${size.label}`}
            >
              <ThemedText
                size={16}
                style={[
                  styles.optionText,
                  textSize === size.value ? { color: '#FFFFFF' } : { color: '#000000' },
                ]}
              >
                {size.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText size={18} style={styles.sectionTitle}>
          Color Blind Mode
        </ThemedText>
        <View style={styles.optionsContainer}>
          {COLOR_BLIND_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.label}
              style={[
                styles.optionButton,
                colorBlindMode === mode.value && styles.selectedOption,
              ]}
              onPress={() => setColorBlindMode(mode.value)}
              accessibilityLabel={`Set color blind mode to ${mode.label}`}
              accessibilityHint={`Changes the color scheme for ${mode.label}`}
            >
              <ThemedText
                size={16}
                style={[
                  styles.optionText,
                  colorBlindMode === mode.value ? { color: '#FFFFFF' } : { color: '#000000' },
                ]}
              >
                {mode.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText size={18} style={styles.sectionTitle}>
          Data Management
        </ThemedText>
        <TouchableOpacity
          style={styles.clearCacheButton}
          onPress={handleClearCache}
          accessibilityLabel="Clear Cache"
          accessibilityHint="Clears all cached data including tasks and statistics"
        >
          <Text style={styles.clearCacheButtonText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A7EA4',
  },
  selectedOption: {
    backgroundColor: '#0A7EA4',
  },
  optionText: {
    textAlign: 'center',
  },
  clearCacheButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearCacheButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 