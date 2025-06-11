import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AssociatedHabit {
  id: string;
  name: string;
  icon: string;
  status: 'pending' | 'completed';
}

interface HabitIndicatorProps {
  habit: AssociatedHabit;
  onPress?: () => void;
}

export const HabitIndicator: React.FC<HabitIndicatorProps> = ({ habit, onPress }) => {
  const isCompleted = habit.status === 'completed';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <Ionicons
        name={habit.icon as any}
        size={16}
        color={isCompleted ? '#4CAF50' : '#666'}
      />
      <Text
        style={[
          styles.name,
          isCompleted && styles.completedText,
        ]}>
        {habit.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  completedContainer: {
    backgroundColor: '#E8F5E9',
  },
  name: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  completedText: {
    color: '#4CAF50',
  },
}); 