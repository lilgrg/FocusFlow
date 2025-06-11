import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TimelineItem = {
  id: string;
  time: string;
  title: string;
  icon: string;
  color: string;
  status: 'upcoming' | 'current' | 'completed';
};

type VisualTimelineProps = {
  items: TimelineItem[];
  onItemPress: (item: TimelineItem) => void;
  onTimePress: (time: string) => void;
};

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  items,
  onItemPress,
  onTimePress,
}) => {
  const handleItemPress = useCallback(async (item: TimelineItem) => {
    console.log('handleItemPress called with item:', item);
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onItemPress(item);
  }, [onItemPress]);

  const handleTimePress = useCallback(async (time: string) => {
    console.log('handleTimePress called with time:', time);
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onTimePress(time);
  }, [onTimePress]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.timelineItem} testID={`timeline-item-${index}`}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimePress(item.time)}
              testID={`timeline-time-button-${index}`}>
              <Text
                style={[
                  styles.timeText,
                  item.status === 'current' && styles.currentTimeText,
                  item.status === 'completed' && styles.completedTimeText,
                ]}
                testID={`timeline-time-${index}`}>
                {item.time}
              </Text>
            </TouchableOpacity>

            <View style={styles.connectorContainer}>
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor:
                      item.status === 'completed'
                        ? '#4CAF50'
                        : item.status === 'current'
                        ? '#0A7EA4'
                        : '#E0E0E0',
                  },
                ]}
                testID={`connector-${index}`}
              />
              {index < items.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    {
                      backgroundColor:
                        item.status === 'completed'
                          ? '#4CAF50'
                          : item.status === 'current'
                          ? '#0A7EA4'
                          : '#E0E0E0',
                    },
                  ]}
                  testID={`connector-line-${index}`}
                />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.itemButton,
                {
                  backgroundColor: item.color + '10',
                  borderColor: item.color + '30',
                },
              ]}
              onPress={() => handleItemPress(item)}
              testID={`timeline-item-touchable-${index}`}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]} testID={`icon-${index}`}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text
                style={[
                  styles.itemTitle,
                  item.status === 'current' && styles.currentItemTitle,
                  item.status === 'completed' && styles.completedItemTitle,
                ]}>
                {item.title}
              </Text>
              {item.status === 'current' && (
                <View style={styles.currentIndicator} testID="current-indicator">
                  <Text style={styles.currentIndicatorText}>Now</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  timeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  currentTimeText: {
    color: '#0A7EA4',
    fontWeight: '600',
  },
  completedTimeText: {
    color: '#4CAF50',
  },
  connectorContainer: {
    alignItems: 'center',
    height: 40,
  },
  connector: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  connectorLine: {
    width: 2,
    height: 24,
  },
  itemButton: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    width: 120,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  currentItemTitle: {
    color: '#0A7EA4',
    fontWeight: '600',
  },
  completedItemTitle: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  currentIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#0A7EA4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 