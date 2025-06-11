import { routineService, TimeBlock } from '@/services/RoutineService';
import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

type TemplateManagementModalProps = {
  visible: boolean;
  onClose: () => void;
  onTemplateSelect?: (templateId: string) => void;
};

export const TemplateManagementModal: React.FC<TemplateManagementModalProps> = ({
  visible,
  onClose,
  onTemplateSelect,
}) => {
  const [templates, setTemplates] = useState<Array<{
    id: string;
    name: string;
    blocks: TimeBlock[];
    createdAt: string;
    updatedAt: string;
  }>>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      loadTemplates();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const loadTemplates = async () => {
    try {
      const templates = await routineService.getTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load templates');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    try {
      // Get current blocks from the routine
      const date = new Date();
      const dateString = date.toISOString().split('T')[0];
      const blocks = await routineService.getRoutine(dateString);

      if (blocks.length === 0) {
        Alert.alert('Error', 'No blocks to save as template');
        return;
      }

      // Create new template
      await routineService.saveTemplate({
        name: newTemplateName.trim(),
        blocks: blocks.map(block => ({
          ...block,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          completed: false,
          completedAt: undefined,
        })),
      });

      // Reset and reload
      setNewTemplateName('');
      setIsCreating(false);
      await loadTemplates();

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      Alert.alert('Error', 'Failed to create template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await routineService.deleteTemplate(templateId);
              await loadTemplates();

              if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
      onClose();
    } else {
      setSelectedTemplate(templateId);
    }
  };

  const renderTemplate = (template: typeof templates[0], index: number) => {
    const cardStyle = {
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
      opacity: fadeAnim,
    };

    return (
      <Animated.View
        key={template.id}
        style={[
          styles.templateCard,
          selectedTemplate === template.id && styles.selectedTemplate,
          cardStyle,
        ]}>
        <TouchableOpacity
          style={styles.templateContent}
          onPress={() => handleTemplateSelect(template.id)}
          activeOpacity={0.7}>
          <View style={styles.templateHeader}>
            <View style={styles.templateTitleContainer}>
              <Ionicons name="copy-outline" size={20} color="#0A7EA4" />
              <Text style={styles.templateName}>{template.name}</Text>
            </View>
            <Text style={styles.templateDate}>
              {new Date(template.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.templateBlocks}>
            {template.blocks.slice(0, 3).map(block => (
              <View key={block.id} style={styles.blockPreview}>
                <View style={[styles.iconContainer, { backgroundColor: block.color + '20' }]}>
                  <Ionicons name={block.icon as any} size={16} color={block.color} />
                </View>
                <Text style={styles.blockTitle} numberOfLines={1}>
                  {block.title}
                </Text>
              </View>
            ))}
            {template.blocks.length > 3 && (
              <View style={styles.moreBlocksContainer}>
                <Text style={styles.moreBlocks}>
                  +{template.blocks.length - 3} more
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTemplate(template.id)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Routine Templates</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {isCreating ? (
            <Animated.View
              style={[
                styles.createContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <TextInput
                style={styles.input}
                placeholder="Enter template name"
                value={newTemplateName}
                onChangeText={setNewTemplateName}
                autoFocus
                placeholderTextColor="#999"
              />
              <View style={styles.createActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsCreating(false);
                    setNewTemplateName('');
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.createButton]}
                  onPress={handleCreateTemplate}>
                  <Text style={[styles.buttonText, styles.createButtonText]}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={styles.createTemplateButton}
              onPress={() => {
                setIsCreating(true);
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}>
              <Ionicons name="add-circle-outline" size={24} color="#0A7EA4" />
              <Text style={styles.createTemplateText}>Create New Template</Text>
            </TouchableOpacity>
          )}

          <ScrollView
            style={styles.templatesList}
            showsVerticalScrollIndicator={false}>
            {templates.map((template, index) => renderTemplate(template, index))}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  createContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
  },
  createButton: {
    backgroundColor: '#0A7EA4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#FFF',
  },
  createTemplateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  createTemplateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0A7EA4',
    fontWeight: '500',
  },
  templatesList: {
    maxHeight: 400,
  },
  templateCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTemplate: {
    borderWidth: 2,
    borderColor: '#0A7EA4',
    backgroundColor: '#F0F7FA',
  },
  templateContent: {
    padding: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  templateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  templateDate: {
    fontSize: 12,
    color: '#666',
  },
  templateBlocks: {
    gap: 8,
  },
  blockPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockTitle: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  moreBlocksContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  moreBlocks: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
}); 