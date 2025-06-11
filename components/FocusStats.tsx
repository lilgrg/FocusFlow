import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface FocusStatsProps {
  totalFocusTime: number; // in minutes
  completedSessions: number;
  streak: number;
  averageSessionLength: number; // in minutes
}

export const FocusStats: React.FC<FocusStatsProps> = ({
  totalFocusTime,
  completedSessions,
  streak,
  averageSessionLength,
}) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="time-outline" size={24} color="#0A7EA4" />
          </View>
          <Text style={styles.statValue}>{formatTime(totalFocusTime)}</Text>
          <Text style={styles.statLabel}>Total Focus Time</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{completedSessions}</Text>
          <Text style={styles.statLabel}>Completed Sessions</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="flame-outline" size={24} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="analytics-outline" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.statValue}>{formatTime(averageSessionLength)}</Text>
          <Text style={styles.statLabel}>Avg. Session</Text>
        </View>
      </View>

      <View style={styles.achievementContainer}>
        <Text style={styles.achievementTitle}>Recent Achievements</Text>
        <View style={styles.achievementItem}>
          <Ionicons name="trophy-outline" size={20} color="#FFD700" />
          <Text style={styles.achievementText}>
            Completed 5 focus sessions in one day
          </Text>
        </View>
        <View style={styles.achievementItem}>
          <Ionicons name="star-outline" size={20} color="#FFD700" />
          <Text style={styles.achievementText}>
            Maintained a 3-day focus streak
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 