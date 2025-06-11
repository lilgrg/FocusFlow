import { TimeBlock } from '@/services/RoutineService';
import { Haptics } from '@/utils/Haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WeeklyViewProps = {
  selectedDay: number;
  onDayPress: (day: number) => void;
  onBlockSelect: (block: TimeBlock) => void;
};

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedDay,
  onDayPress,
  onBlockSelect,
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayPress = (day: number) => {
    onDayPress(day);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.selectedDay,
            ]}
            onPress={() => handleDayPress(index)}>
            <Text
              style={[
                styles.dayText,
                selectedDay === index && styles.selectedDayText,
              ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  selectedDay: {
    backgroundColor: '#0A7EA4',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedDayText: {
    color: '#FFF',
  },
}); 