import { RoutineItem } from '@/services/DataManager';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableRoutineItem from './DraggableRoutineItem';

interface WeeklyRoutineViewProps {
  routines: { [key: string]: RoutineItem[] };
  onRoutineUpdate: (day: string, routines: RoutineItem[]) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyRoutineView: React.FC<WeeklyRoutineViewProps> = ({
  routines,
  onRoutineUpdate,
}) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [draggedItem, setDraggedItem] = useState<RoutineItem | null>(null);

  const handleDragStart = (item: RoutineItem) => {
    setDraggedItem(item);
  };

  const handleDragEnd = (day: string, newIndex: number) => {
    if (draggedItem) {
      const updatedRoutines = [...(routines[day] || [])];
      const oldIndex = updatedRoutines.findIndex(item => item.id === draggedItem.id);
      
      if (oldIndex !== -1) {
        updatedRoutines.splice(oldIndex, 1);
      }
      
      updatedRoutines.splice(newIndex, 0, draggedItem);
      onRoutineUpdate(day, updatedRoutines);
      setDraggedItem(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDay,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day && styles.selectedDayText,
                ]}
              >
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.routineList}>
        {(routines[selectedDay] || []).map((item, index) => (
          <DraggableRoutineItem
            key={item.id}
            item={item}
            index={index}
            isActive={draggedItem?.id === item.id}
            onDragStart={() => handleDragStart(item)}
            onDragEnd={(newIndex) => handleDragEnd(selectedDay, newIndex)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  daySelector: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  routineList: {
    flex: 1,
    padding: 16,
  },
});

export default WeeklyRoutineView; 