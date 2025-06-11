import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';

type DailySnapshotProps = {
  waterIntake: number;
  timeSinceLastMovement: number;
  currentAffirmation: string;
  onWaterIntake: () => void;
  onMovementBreak: () => void;
  onFocusPress: () => void;
};

export const DailySnapshot: React.FC<DailySnapshotProps> = ({
  waterIntake,
  timeSinceLastMovement,
  currentAffirmation,
  onWaterIntake,
  onMovementBreak,
  onFocusPress,
}) => {
  return (
    <ThemedView style={styles.snapshotContainer}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Your Day: 3/7 Tasks Completed</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '43%' }]} />
        </View>
      </View>
      <View style={styles.healthPrompts}>
        <TouchableOpacity style={styles.healthItem} onPress={onWaterIntake}>
          <Text style={styles.healthIcon}>💧</Text>
          <Text style={styles.healthText}>{waterIntake}/8 Glasses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.healthItem} onPress={onMovementBreak}>
          <Text style={styles.healthIcon}>🏃</Text>
          <Text style={styles.healthText}>
            {timeSinceLastMovement > 0 
              ? `Quick Stretch? (${timeSinceLastMovement} mins since last movement)`
              : 'Movement break taken!'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.affirmation}>{currentAffirmation}</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  snapshotContainer: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  focusStatus: {
    backgroundColor: '#4ECDC4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  focusStatusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  healthPrompts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  healthItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  healthIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  healthText: {
    fontSize: 12,
  },
  affirmation: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
}); 