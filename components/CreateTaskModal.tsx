import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedView } from './ThemedView';

const QUICK_TEMPLATES = [
  {
    name: 'Focus Work',
    duration: 25,
    icon: '🎯',
    color: '#FF6B6B',
  },
  {
    name: 'Break',
    duration: 5,
    icon: '☕',
    color: '#4ECDC4',
  },
  {
    name: 'Exercise',
    duration: 30,
    icon: '💪',
    color: '#45B7D1',
  },
  {
    name: 'Reading',
    duration: 20,
    icon: '📚',
    color: '#96CEB4',
  },
];

const ICON_OPTIONS = [
  '☕️', '📚', '💪', '🧘', '🎯', '🎨', '🎵', '🍽️', '🚶', '💤',
  '📝', '🎮', '🎬', '📱', '💻', '🧠', '🏃', '🚿', '🛏️', '🌅'
];

const COLOR_OPTIONS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
];

type CreateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (task: {
    name: string;
    duration: number;
    icon: string;
    color: string;
  }) => void;
};

export function CreateTaskModal({ visible, onClose, onSave }: CreateTaskModalProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleTemplateSelect = (template: typeof QUICK_TEMPLATES[0]) => {
    setName(template.name);
    setDuration(template.duration.toString());
    setSelectedIcon(template.icon);
    setSelectedColor(template.color);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        duration: parseInt(duration) || 30,
        icon: selectedIcon,
        color: selectedColor,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDuration('30');
    setSelectedIcon(ICON_OPTIONS[0]);
    setSelectedColor(COLOR_OPTIONS[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Task</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Quick Templates */}
            <Text style={styles.sectionTitle}>Quick Templates</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templates}>
              {QUICK_TEMPLATES.map((template) => (
                <TouchableOpacity
                  key={template.name}
                  style={[styles.template, { backgroundColor: template.color }]}
                  onPress={() => handleTemplateSelect(template)}>
                  <Text style={styles.templateIcon}>{template.icon}</Text>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDuration}>{template.duration}m</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Task Name */}
            <Text style={styles.sectionTitle}>Task Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="What do you want to do?"
              placeholderTextColor="#666"
            />

            {/* Duration */}
            <Text style={styles.sectionTitle}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#666"
            />

            {/* Icon Selection */}
            <Text style={styles.sectionTitle}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.selectedIcon,
                  ]}
                  onPress={() => setSelectedIcon(icon)}>
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Color Selection */}
            <Text style={styles.sectionTitle}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSelector}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </ScrollView>
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!name.trim()}>
            <Text style={styles.saveButtonText}>Create Task</Text>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  templates: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  template: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  templateName: {
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  templateDuration: {
    color: '#FFF',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    backgroundColor: '#0A7EA4',
  },
  iconText: {
    fontSize: 24,
  },
  colorSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  saveButton: {
    backgroundColor: '#0A7EA4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 