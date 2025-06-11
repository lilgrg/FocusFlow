import { ROUTINE_ICONS, TIME_SLOTS } from '@/constants/RoutineConstants';
import type { RoutineItem } from '@/types/RoutineTypes';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RoutineModalProps = {
  visible: boolean;
  mode: 'add' | 'edit' | null;
  editingItem: RoutineItem | null;
  newItemTitle: string;
  selectedTime: string;
  selectedIcon: string;
  selectedPriority: string;
  selectedCategory: string;
  selectedDuration: number;
  taskDescription: string;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (text: string) => void;
  onTimeSelect: (time: string) => void;
  onIconSelect: (icon: string) => void;
  onPrioritySelect: (priority: string) => void;
  onCategorySelect: (category: string) => void;
  onDurationSelect: (duration: number) => void;
  onDescriptionChange: (text: string) => void;
};

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high', color: '#FF6B6B' },
  { label: 'Medium', value: 'medium', color: '#FFD93D' },
  { label: 'Low', value: 'low', color: '#4ECDC4' },
];

const CATEGORY_OPTIONS = [
  { label: 'Work', value: 'work', icon: '💼' },
  { label: 'Personal', value: 'personal', icon: '👤' },
  { label: 'Health', value: 'health', icon: '❤️' },
  { label: 'Learning', value: 'learning', icon: '📚' },
  { label: 'Social', value: 'social', icon: '👥' },
];

const DURATION_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

export const RoutineModal: React.FC<RoutineModalProps> = ({
  visible,
  mode,
  editingItem,
  newItemTitle,
  selectedTime,
  selectedIcon,
  selectedPriority,
  selectedCategory,
  selectedDuration,
  taskDescription,
  onClose,
  onSave,
  onTitleChange,
  onTimeSelect,
  onIconSelect,
  onPrioritySelect,
  onCategorySelect,
  onDurationSelect,
  onDescriptionChange,
}) => {
  const renderTimeSlotSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotContainer}>
      {TIME_SLOTS.map((time) => (
        <TouchableOpacity
          key={time}
          style={[
            styles.timeSlot,
            selectedTime === time && styles.selectedTimeSlot,
          ]}
          onPress={() => onTimeSelect(time)}
        >
          <Text style={[
            styles.timeSlotText,
            selectedTime === time && styles.selectedTimeSlotText,
          ]}>
            {time}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderIconSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
      {ROUTINE_ICONS.map((icon) => (
        <TouchableOpacity
          key={icon}
          style={[
            styles.iconOption,
            selectedIcon === icon && styles.selectedIcon,
          ]}
          onPress={() => onIconSelect(icon)}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPrioritySelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
      {PRIORITY_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.priorityOption,
            { backgroundColor: option.color + '20' },
            selectedPriority === option.value && { borderColor: option.color, borderWidth: 2 }
          ]}
          onPress={() => onPrioritySelect(option.value)}
        >
          <Text style={[styles.optionText, { color: option.color }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderCategorySelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
      {CATEGORY_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.categoryOption,
            selectedCategory === option.value && styles.selectedOption
          ]}
          onPress={() => onCategorySelect(option.value)}
        >
          <Text style={styles.categoryIcon}>{option.icon}</Text>
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDurationSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
      {DURATION_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.durationOption,
            selectedDuration === option.value && styles.selectedOption
          ]}
          onPress={() => onDurationSelect(option.value)}
        >
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Add New Task' : 'Edit Task'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newItemTitle}
              onChangeText={onTitleChange}
            />
            <Text style={styles.sectionTitle}>Time</Text>
            {renderTimeSlotSelector()}
            <Text style={styles.sectionTitle}>Priority</Text>
            {renderPrioritySelector()}
            <Text style={styles.sectionTitle}>Category</Text>
            {renderCategorySelector()}
            <Text style={styles.sectionTitle}>Duration</Text>
            {renderDurationSelector()}
            <Text style={styles.sectionTitle}>Icon</Text>
            {renderIconSelector()}
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add task description..."
              value={taskDescription}
              onChangeText={onDescriptionChange}
              multiline
              numberOfLines={4}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={onSave}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  selectorContainer: {
    marginBottom: 15,
  },
  timeSlotContainer: {
    marginBottom: 15,
  },
  timeSlot: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  selectedTimeSlot: {
    backgroundColor: '#4ECDC4',
  },
  timeSlotText: {
    color: '#666',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  iconSelector: {
    marginBottom: 15,
  },
  iconOption: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  selectedIcon: {
    backgroundColor: '#4ECDC4',
  },
  iconText: {
    fontSize: 20,
  },
  priorityOption: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryOption: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  durationOption: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  selectedOption: {
    backgroundColor: '#4ECDC4',
  },
  optionText: {
    fontSize: 14,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 