import { TimeBlock } from '@/services/RoutineService';
import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HOUR_HEIGHT = 60;
const TIMELINE_START = 6; // 6 AM
const TIMELINE_END = 22; // 10 PM

type BlockItemProps = {
  block: TimeBlock;
  isSelected: boolean;
  onPress: (block: TimeBlock) => void;
  translateY: Animated.SharedValue<number>;
};

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  isSelected,
  onPress,
  translateY,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: isSelected ? translateY.value : 0 },
      { scale: withSpring(isSelected ? 1.02 : 1) },
    ],
  }));

  return (
    <Animated.View style={[styles.blockContainer, animatedStyle]}>
      <TouchableOpacity
        style={[styles.block, { backgroundColor: block.color }]}
        onPress={() => onPress(block)}
        activeOpacity={0.7}>
        <View style={styles.blockContent}>
          <View style={styles.blockHeader}>
            <Ionicons name={block.icon as any} size={24} color="#FFF" />
            <Text style={styles.blockTitle}>{block.title}</Text>
          </View>
          <Text style={styles.blockTime}>
            {block.startTime} - {block.endTime}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

type RoutineTimelineProps = {
  blocks: TimeBlock[];
  selectedBlock: string | null;
  onBlockSelect: (block: TimeBlock) => void;
};

export const RoutineTimeline: React.FC<RoutineTimelineProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
}) => {
  const translateY = useSharedValue(0);

  const handleBlockPress = (block: TimeBlock) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onBlockSelect(block);
  };

  // Generate time markers
  const timeMarkers = Array.from(
    { length: TIMELINE_END - TIMELINE_START + 1 },
    (_, i) => {
      const hour = TIMELINE_START + i;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        label: hour < 12 ? `${hour} AM` : `${hour - 12} PM`,
      };
    }
  );

  // Calculate block position and height
  const getBlockStyle = (block: TimeBlock) => {
    const [startHour, startMinute] = block.startTime.split(':').map(Number);
    const [endHour, endMinute] = block.endTime.split(':').map(Number);
    
    const startPosition = ((startHour - TIMELINE_START) * 60 + startMinute) * (HOUR_HEIGHT / 60);
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = duration * (HOUR_HEIGHT / 60);

    return {
      top: startPosition,
      height,
    };
  };

  // Gesture handling for block movement
  const panGesture = useCallback(
    (block: TimeBlock) =>
      Gesture.Pan()
        .onStart(() => {
          translateY.value = 0;
        })
        .onUpdate((e) => {
          translateY.value = e.translationY;
        })
        .onEnd((e) => {
          const newPosition = getBlockStyle(block).top + e.translationY;
          const newHour = Math.floor(newPosition / HOUR_HEIGHT) + TIMELINE_START;
          const newMinute = Math.floor((newPosition % HOUR_HEIGHT) / (HOUR_HEIGHT / 60));
          const newTime = `${newHour.toString().padStart(2, '0')}:${newMinute
            .toString()
            .padStart(2, '0')}`;
          
          onBlockSelect({ ...block, startTime: newTime });
          translateY.value = withSpring(0);
        }),
    [onBlockSelect]
  );

  return (
    <View style={styles.container}>
      {/* Time markers */}
      <View style={styles.timeMarkers}>
        {timeMarkers.map((marker) => (
          <View key={marker.time} style={styles.timeMarker}>
            <Text style={styles.timeText}>{marker.label}</Text>
            <View style={styles.timeLine} />
          </View>
        ))}
      </View>

      {/* Time blocks */}
      <View style={styles.blocksContainer}>
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            isSelected={selectedBlock === block.id}
            onPress={handleBlockPress}
            translateY={translateY}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  timeMarkers: {
    width: 80,
    paddingRight: 8,
  },
  timeMarker: {
    height: HOUR_HEIGHT,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeLine: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  blocksContainer: {
    flex: 1,
    position: 'relative',
  },
  blockContainer: {
    marginBottom: 12,
  },
  block: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blockContent: {
    gap: 8,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  blockTime: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
}); 