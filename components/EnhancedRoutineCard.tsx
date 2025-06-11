import { TimedRoutineItem } from '@/types/core';
import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DopamineBoost } from './DopamineBoost';

export interface AssociatedHabit {
  id: string;
  name: string;
  icon: string;
  status: 'pending' | 'completed';
}

export interface Prompt {
  type: 'water' | 'movement' | 'meditation';
  icon: string;
  status: 'pending' | 'completed';
}

interface EnhancedRoutineCardProps {
  item: TimedRoutineItem;
  onComplete: (item: TimedRoutineItem) => Promise<void>;
  onStartFocus: (item: TimedRoutineItem) => void;
  onExpand: (item: TimedRoutineItem) => void;
  onRemove: (taskId: string) => void;
  onEdit: (item: TimedRoutineItem) => void;
}

export const EnhancedRoutineCard: React.FC<EnhancedRoutineCardProps> = ({
  item,
  onComplete,
  onStartFocus,
  onExpand,
  onRemove,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const expandAnim = new Animated.Value(0);
  const boostAnim = new Animated.Value(0);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    onExpand(item);
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const handleStartFocus = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowBoost(true);
    Animated.sequence([
      Animated.timing(boostAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(boostAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowBoost(false);
      onStartFocus(item);
    });
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD93D';
      case 'low':
        return '#4ECDC4';
      default:
        return '#4ECDC4';
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'work':
        return '💼';
      case 'personal':
        return '👤';
      case 'health':
        return '❤️';
      case 'learning':
        return '📚';
      case 'social':
        return '👥';
      default:
        return '📝';
    }
  };

  return (
    <Animated.View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: item.color }]}
        onPress={handlePress}
        activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.metaContainer}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority || 'low') + '20' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(item.priority || 'low') }]}>
                  {(item.priority || 'low').charAt(0).toUpperCase() + (item.priority || 'low').slice(1)}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(item.category || 'personal')}</Text>
                <Text style={styles.categoryText}>
                  {(item.category || 'personal').charAt(0).toUpperCase() + (item.category || 'personal').slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => onEdit(item)}>
              <Ionicons name="pencil" size={20} color="#4ECDC4" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.startNowButton}
              onPress={() => onStartFocus(item)}>
              <Ionicons name="play-circle" size={24} color="#4ECDC4" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemove}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.expandedContent,
            {
              maxHeight: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
              opacity: expandAnim,
            },
          ]}>
          <View style={styles.detailsContainer}>
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.durationText}>{item.duration} minutes</Text>
            </View>
            {item.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {showBoost && (
        <Animated.View
          style={[
            styles.boostContainer,
            {
              opacity: boostAnim,
              transform: [
                {
                  scale: boostAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}>
          <DopamineBoost />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    width: 60,
  },
  time: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F9F8',
  },
  startNowButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
  },
  expandedContent: {
    overflow: 'hidden',
    marginTop: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  boostContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 