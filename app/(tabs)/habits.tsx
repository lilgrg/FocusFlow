import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

type Habit = {
  id: string;
  name: string;
  icon: string;
  streak: number;
  frequency: 'daily' | 'weekly';
  goal: number;
  completed: boolean;
  stackedOn?: string;
  progress: number;
};

const MOTIVATIONAL_QUOTES = [
  "Small steps lead to big changes!",
  "Every day is a fresh start!",
  "You're building something amazing!",
  "Consistency is key!",
  "You've got this!",
];

export default function HabitsScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      icon: '🧘',
      streak: 7,
      frequency: 'daily',
      goal: 1,
      completed: false,
      progress: 5,
    },
    {
      id: '2',
      name: 'Drink Water',
      icon: '💧',
      streak: 3,
      frequency: 'daily',
      goal: 8,
      completed: true,
      progress: 3,
    },
    {
      id: '3',
      name: 'Read',
      icon: '📚',
      streak: 12,
      frequency: 'daily',
      goal: 1,
      completed: false,
      stackedOn: 'After Morning Coffee',
      progress: 1,
    },
  ]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: '',
    icon: '🎯',
    frequency: 'daily',
    goal: 1,
  });

  const handleCompleteHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          completed: true,
          streak: habit.streak + 1,
        };
      }
      return habit;
    }));
    // TODO: Trigger dopamine boost mini-game
  };

  const handleAddHabit = () => {
    if (newHabit.name) {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          name: newHabit.name,
          icon: newHabit.icon || '🎯',
          streak: 0,
          frequency: newHabit.frequency || 'daily',
          goal: newHabit.goal || 1,
          completed: false,
          progress: 0,
        },
      ]);
      setIsAddModalVisible(false);
      setNewHabit({
        name: '',
        icon: '🎯',
        frequency: 'daily',
        goal: 1,
      });
    }
  };

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progress = (completedToday / totalHabits) * 100;

  const longestStreak = Math.max(...habits.map(h => h.streak));
  const longestStreakHabit = habits.find(h => h.streak === longestStreak);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text
          accessible={true}
          accessibilityLabel="My Habits"
          accessibilityRole="header"
          style={styles.headerTitle}
        >
          My Habits
        </Text>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Add new habit"
          accessibilityRole="button"
          accessibilityHint="Opens the add habit modal"
          style={styles.headerAddButton}
          onPress={() => setIsAddModalVisible(true)}>
          <Ionicons name="add" size={24} color="#0A7EA4" />
        </TouchableOpacity>
      </View>

      {/* Overview Section */}
      <ThemedView style={styles.overviewContainer}>
        <View style={styles.streakContainer}>
          <Text style={styles.streakTitle}>Longest Streak Ever!</Text>
          <Text style={styles.streakValue}>
            🔥 {longestStreak} Days! {longestStreakHabit?.name}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Today's Progress: {completedToday}/{totalHabits} Habits
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.quote}>
          {MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]}
        </Text>
      </ThemedView>

      {/* Habits List */}
      <ScrollView style={styles.habitsList}>
        {habits.map((habit) => (
          <ThemedView key={habit.id} style={styles.habitCard}>
            <View style={styles.habitHeader}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.stackedOn && (
                  <Text style={styles.stackedOn}>Stacked on: {habit.stackedOn}</Text>
                )}
              </View>
              <TouchableOpacity
                style={[styles.completeButton, habit.completed && styles.completedButton]}
                onPress={() => handleCompleteHabit(habit.id)}>
                <Ionicons
                  name={habit.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={32}
                  color={habit.completed ? '#4CAF50' : '#666'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.habitDetails}>
              <Text style={styles.streakText}>
                {habit.streak > 0 ? `${habit.streak} Days 🔥` : 'Start your streak!'}
              </Text>
              <Text style={styles.frequencyText}>
                {habit.frequency === 'daily' ? 'Daily' : `${habit.goal}x per week`}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(habit.progress / habit.goal) * 100}%`,
                    backgroundColor: habit.completed ? '#4CAF50' : '#0A7EA4',
                  },
                ]}
              />
            </View>
          </ThemedView>
        ))}
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Habit</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Habit Name"
              value={newHabit.name}
              onChangeText={(text) => setNewHabit({ ...newHabit, name: text })}
            />

            <View style={styles.frequencyContainer}>
              <Text style={styles.label}>Frequency:</Text>
              <View style={styles.frequencyButtons}>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    newHabit.frequency === 'daily' && styles.selectedFrequency,
                  ]}
                  onPress={() => setNewHabit({ ...newHabit, frequency: 'daily' })}>
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      newHabit.frequency === 'daily' && styles.selectedFrequencyText,
                    ]}>
                    Daily
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.frequencyButton,
                    newHabit.frequency === 'weekly' && styles.selectedFrequency,
                  ]}
                  onPress={() => setNewHabit({ ...newHabit, frequency: 'weekly' })}>
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      newHabit.frequency === 'weekly' && styles.selectedFrequencyText,
                    ]}>
                    Weekly
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {newHabit.frequency === 'weekly' && (
              <View style={styles.goalContainer}>
                <Text style={styles.label}>Times per week:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={newHabit.goal?.toString()}
                  onChangeText={(text) => setNewHabit({ ...newHabit, goal: parseInt(text) || 1 })}
                />
              </View>
            )}

            <TouchableOpacity style={styles.addHabitButton} onPress={handleAddHabit}>
              <Text style={styles.addButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerAddButton: {
    padding: 8,
  },
  overviewContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  streakContainer: {
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0A7EA4',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  habitsList: {
    flex: 1,
    padding: 16,
  },
  habitCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '500',
  },
  stackedOn: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  completeButton: {
    padding: 8,
  },
  completedButton: {
    opacity: 0.8,
  },
  habitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#0A7EA4',
    fontWeight: '500',
  },
  frequencyText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  frequencyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: '#0A7EA4',
    borderColor: '#0A7EA4',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedFrequencyText: {
    color: '#FFF',
  },
  goalContainer: {
    marginBottom: 16,
  },
  addHabitButton: {
    backgroundColor: '#0A7EA4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 