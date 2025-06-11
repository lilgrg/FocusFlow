import { CreateTaskModal } from '@/components/CreateTaskModal';
import { QuickAddButton } from '@/components/QuickAddButton';
import { RewardsModal } from '@/components/RewardsModal';
import { RoutineTimeline } from '@/components/RoutineTimeline';
import { TemplateManagementModal } from '@/components/TemplateManagementModal';
import { WeeklyView } from '@/components/WeeklyView';
import { rewardsService } from '@/services/RewardsService';
import { routineService, TimeBlock } from '@/services/RoutineService';
import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DataManager from '../../services/DataManager';
import type { TimedRoutineItem } from '../../types/RoutineTypes';

const DAYS = ['Today', 'Tomorrow', 'Next Day'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function RoutineBuilderScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isRewardsModalVisible, setIsRewardsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'timeline'>('daily');
  const [points, setPoints] = useState(0);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedWeekdays, setSelectedWeekdays] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [isWeeklyView, setIsWeeklyView] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<string | null>(null);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

  // Load routine for the selected day
  useEffect(() => {
    const loadRoutine = async () => {
      try {
        setIsLoading(true);
        const date = new Date();
        date.setDate(date.getDate() + selectedDay);
        const dateString = date.toISOString().split('T')[0];
        const routineBlocks = await routineService.getRoutine(dateString);
        setBlocks(routineBlocks);
      } catch (error) {
        console.error('Error loading routine:', error);
        Alert.alert('Error', 'Failed to load routine');
      } finally {
        setIsLoading(false);
      }
    };

    if (viewMode === 'daily') {
      loadRoutine();
    }
  }, [selectedDay, viewMode]);

  // Load points
  useEffect(() => {
    const loadPoints = async () => {
      const points = await rewardsService.getPoints();
      setPoints(points);
    };
    loadPoints();
  }, []);

  const handleBlockPress = useCallback((block: TimeBlock) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleBlockMove = useCallback(async (blockId: string, newStartTime: string) => {
    setBlocks(currentBlocks => 
      currentBlocks.map(block => 
        block.id === blockId
          ? {
              ...block,
              startTime: newStartTime,
              endTime: calculateEndTime(newStartTime, getDuration(block.startTime, block.endTime)),
            }
          : block
      )
    );
  }, []);

  const handleBlockComplete = useCallback(async (blockId: string) => {
    try {
      const updatedBlocks = blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              completed: !block.completed,
              completedAt: !block.completed ? new Date().toISOString() : undefined,
            }
          : block
      );

      setBlocks(updatedBlocks);

      // Update streak and points
      const streak = await rewardsService.updateStreak(updatedBlocks);
      const newPoints = await rewardsService.getPoints();
      setPoints(newPoints);

      // Synchronize completion status with main task list
      const existingItems = await DataManager.getInstance().loadRoutineItems();
      const updatedItems = existingItems.map(item => {
        if (item.id === blockId) {
          return {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date() : undefined,
            status: !item.completed ? 'completed' as const : 'upcoming' as const
          };
        }
        return item;
      });
      await DataManager.getInstance().saveRoutineItems(updatedItems);

      // Show streak notification
      if (streak.currentStreak > 1) {
        Alert.alert(
          '🔥 Streak!',
          `You're on a ${streak.currentStreak} day streak! Keep it up!`
        );
      }

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
      Alert.alert('Error', 'Failed to update task completion status');
    }
  }, [blocks]);

  const handleCreateTask = useCallback(async (task: {
    name: string;
    duration: number;
    icon: string;
    color: string;
  }) => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title: task.name,
      startTime: '09:00', // Default start time
      endTime: calculateEndTime('09:00', task.duration),
      color: task.color,
      icon: task.icon,
      completed: false,
    };

    setBlocks(currentBlocks => [...currentBlocks, newBlock]);
  }, []);

  const convertTimeBlockToRoutineItem = (block: TimeBlock): TimedRoutineItem => {
    const duration = getDuration(block.startTime, block.endTime);
    return {
      id: block.id,
      title: block.title,
      description: '',
      duration: duration,
      completed: block.completed || false,
      completedAt: block.completedAt ? new Date(block.completedAt) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: block.icon,
      time: block.startTime,
      priority: 'medium',
      category: 'personal',
      color: block.color,
      isActive: false,
      status: block.completed ? 'completed' as const : 'upcoming' as const
    };
  };

  const handleWeekdayToggle = (index: number) => {
    const newSelectedWeekdays = [...selectedWeekdays];
    newSelectedWeekdays[index] = !newSelectedWeekdays[index];
    setSelectedWeekdays(newSelectedWeekdays);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      
      if (isWeeklyView) {
        // Save routine for each selected weekday
        for (let i = 0; i < WEEKDAYS.length; i++) {
          if (selectedWeekdays[i]) {
            const date = new Date();
            // Adjust date to next occurrence of this weekday
            const currentDay = date.getDay();
            let daysUntilTarget = (i + 1) - currentDay;
            if (daysUntilTarget < 0) daysUntilTarget += 7;
            date.setDate(date.getDate() + daysUntilTarget);
            
            const dateString = date.toISOString().split('T')[0];
            await routineService.saveRoutine(dateString, blocks);
            
            // Convert and save to main task list
            const routineItems = blocks.map(block => ({
              ...convertTimeBlockToRoutineItem(block),
              weekday: WEEKDAYS[i]
            }));
            
            const existingItems = await DataManager.getInstance().loadRoutineItems();
            const filteredItems = existingItems.filter(item => {
              const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
              return itemDate !== dateString;
            });
            
            await DataManager.getInstance().saveRoutineItems([...filteredItems, ...routineItems]);
          }
        }
      } else {
        // Original daily save logic
        const date = new Date();
        date.setDate(date.getDate() + selectedDay);
        const dateString = date.toISOString().split('T')[0];
        
        await routineService.saveRoutine(dateString, blocks);
        
        const routineItems = blocks.map(convertTimeBlockToRoutineItem);
        const existingItems = await DataManager.getInstance().loadRoutineItems();
        const filteredItems = existingItems.filter(item => {
          const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
          return itemDate !== dateString;
        });
        
        await DataManager.getInstance().saveRoutineItems([...filteredItems, ...routineItems]);
      }

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        'Success',
        isWeeklyView 
          ? 'Your weekly routine has been saved!'
          : 'Your daily routine has been saved!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert(
        'Error',
        'Failed to save routine. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  }, [blocks, selectedDay, selectedWeekdays, isWeeklyView, router]);

  const handleTemplateSelect = useCallback(async (templateId: string) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() + selectedDay);
      const dateString = date.toISOString().split('T')[0];
      
      await routineService.applyTemplate(templateId, dateString);
      const routineBlocks = await routineService.getRoutine(dateString);
      setBlocks(routineBlocks);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error applying template:', error);
      Alert.alert('Error', 'Failed to apply template');
    }
  }, [selectedDay]);

  const toggleViewMode = useCallback(() => {
    setViewMode(current => current === 'daily' ? 'weekly' : current === 'weekly' ? 'timeline' : 'daily');
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const createTestRoutine = async () => {
    const testBlocks: TimeBlock[] = [
      {
        id: '1',
        title: 'Morning Meditation',
        startTime: '07:00',
        endTime: '07:30',
        color: '#4CAF50',
        icon: 'leaf',
        completed: false,
      },
      {
        id: '2',
        title: 'Breakfast',
        startTime: '07:30',
        endTime: '08:00',
        color: '#FF9800',
        icon: 'cafe',
        completed: false,
      },
      {
        id: '3',
        title: 'Work Session',
        startTime: '09:00',
        endTime: '12:00',
        color: '#2196F3',
        icon: 'briefcase',
        completed: false,
      },
      {
        id: '4',
        title: 'Lunch Break',
        startTime: '12:00',
        endTime: '13:00',
        color: '#E91E63',
        icon: 'restaurant',
        completed: false,
      },
    ];

    try {
      const date = new Date();
      const dateString = date.toISOString().split('T')[0];
      await routineService.saveRoutine(dateString, testBlocks);
      setBlocks(testBlocks);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error creating test routine:', error);
      Alert.alert('Error', 'Failed to create test routine');
    }
  };

  const handleBlockSelect = (block: TimeBlock) => {
    setSelectedBlock(block.id);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTimeSelect = (block: TimeBlock, startTime: string, endTime: string) => {
    const updatedBlocks = blocks.map(b => 
      b.id === block.id 
        ? { ...b, startTime, endTime }
        : b
    );
    setBlocks(updatedBlocks);
    setIsTimeModalVisible(false);
    setEditingBlock(null);
  };

  const handleAddBlock = () => {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title: 'New Task',
      startTime: '09:00',
      endTime: '10:00',
      color: '#0A7EA4',
      icon: 'time-outline',
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleEditBlock = (block: TimeBlock) => {
    setEditingBlock(block);
    setIsTimeModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Your Routine</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setIsWeeklyView(!isWeeklyView)}
            style={styles.headerButton}>
            <Ionicons 
              name={isWeeklyView ? "calendar" : "calendar-outline"} 
              size={24} 
              color="#0A7EA4" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsRewardsModalVisible(true)}
            style={styles.pointsButton}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.pointsText}>{points}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsTemplateModalVisible(true)}
            style={styles.headerButton}>
            <Ionicons name="copy-outline" size={24} color="#0A7EA4" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleViewMode}
            style={styles.headerButton}>
            <Ionicons
              name={viewMode === 'daily' ? 'calendar' : viewMode === 'weekly' ? 'today' : 'list'}
              size={24}
              color="#0A7EA4"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerButton, isSaving && styles.savingButton]}
            disabled={isSaving}>
            <Text style={[styles.saveButton, isSaving && styles.savingText]}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday Selector */}
      {isWeeklyView && (
        <View style={styles.weekdaySelector}>
          {WEEKDAYS.map((day, index) => (
            <TouchableOpacity
              key={day}
              onPress={() => {
                setSelectedWeekday(day);
                handleWeekdayToggle(index);
              }}
              style={[
                styles.weekdayButton,
                selectedWeekdays[index] && styles.weekdayButtonSelected
              ]}>
              <Text style={[
                styles.weekdayText,
                selectedWeekdays[index] && styles.weekdayTextSelected
              ]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Day Selector */}
      {!isWeeklyView && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(index)}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonSelected,
              ]}>
              <Text
                style={[
                  styles.dayText,
                  selectedDay === index && styles.dayTextSelected,
                ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <RoutineTimeline
          blocks={blocks}
          selectedBlock={selectedBlock}
          onBlockSelect={handleBlockSelect}
        />
      ) : viewMode === 'weekly' ? (
        <WeeklyView
          selectedDay={selectedDay}
          onDayPress={setSelectedDay}
          onBlockSelect={handleBlockSelect}
        />
      ) : (
        <>
          {/* Blocks List */}
          <ScrollView style={styles.blocksList}>
            {blocks.map((block) => (
              <View key={block.id} style={styles.blockItem}>
                <View style={[styles.blockColor, { backgroundColor: block.color }]} />
                <View style={styles.blockContent}>
                  <Text style={styles.blockTitle}>{block.title}</Text>
                  <View style={styles.timeContainer}>
                    <TouchableOpacity 
                      onPress={() => handleEditBlock(block)}
                      style={styles.timeButton}>
                      <Ionicons name="time-outline" size={20} color="#666" />
                      <Text style={styles.timeText}>
                        {block.startTime} - {block.endTime}
                      </Text>
                      <Text style={styles.durationText}>
                        ({getDuration(block.startTime, block.endTime)} min)
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {isWeeklyView && selectedWeekday && (
                    <Text style={styles.weekdayText}>
                      {selectedWeekday}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleBlockComplete(block.id)}
                  style={[
                    styles.completeButton,
                    block.completed && styles.completedButton,
                  ]}>
                  <Ionicons
                    name={block.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={24}
                    color={block.completed ? '#4CAF50' : '#666'}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Quick Add Button */}
      <QuickAddButton
        onPress={() => setIsCreateModalVisible(true)}
        onLongPress={() => setIsTemplateModalVisible(true)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={handleCreateTask}
      />

      {/* Rewards Modal */}
      <RewardsModal
        visible={isRewardsModalVisible}
        onClose={() => setIsRewardsModalVisible(false)}
      />

      {/* Template Management Modal */}
      <TemplateManagementModal
        visible={isTemplateModalVisible}
        onClose={() => setIsTemplateModalVisible(false)}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Time Selection Modal */}
      <Modal
        visible={isTimeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsTimeModalVisible(false);
          setEditingBlock(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Time</Text>
            {editingBlock && (
              <View style={styles.timeInputContainer}>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <TextInput
                    style={styles.timeTextInput}
                    value={editingBlock.startTime}
                    onChangeText={(text) => {
                      setEditingBlock({
                        ...editingBlock,
                        startTime: text
                      });
                    }}
                    placeholder="HH:MM"
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={styles.timeLabel}>End Time</Text>
                  <TextInput
                    style={styles.timeTextInput}
                    value={editingBlock.endTime}
                    onChangeText={(text) => {
                      setEditingBlock({
                        ...editingBlock,
                        endTime: text
                      });
                    }}
                    placeholder="HH:MM"
                  />
                </View>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsTimeModalVisible(false);
                  setEditingBlock(null);
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  if (editingBlock) {
                    handleTimeSelect(
                      editingBlock,
                      editingBlock.startTime,
                      editingBlock.endTime
                    );
                  }
                }}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddBlock}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Helper functions
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

const getDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  return (endHours - startHours) * 60 + (endMinutes - startMinutes);
};

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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#0A7EA4',
    fontWeight: '600',
  },
  daySelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  dayButtonSelected: {
    backgroundColor: '#0A7EA4',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  weeklyContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blocksList: {
    flex: 1,
  },
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  blockColor: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 16,
  },
  blockContent: {
    flex: 1,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  weekdayText: {
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    padding: 8,
  },
  completedButton: {
    backgroundColor: '#f5f5f5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#0A7EA4',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0A7EA4',
    padding: 16,
    borderRadius: 32,
  },
  savingButton: {
    opacity: 0.7,
  },
  savingText: {
    color: '#666',
  },
  weekdaySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekdayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  weekdayButtonSelected: {
    backgroundColor: '#0A7EA4',
  },
  weekdayText: {
    fontSize: 14,
    color: '#666',
  },
  weekdayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
}); 