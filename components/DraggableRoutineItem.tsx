import { TimedRoutineItem } from '@/types/core';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface DraggableRoutineItemProps {
  item: TimedRoutineItem;
  onDragStart: () => void;
  onDragEnd: (newIndex: number) => void;
  index: number;
  isActive: boolean;
}

const DraggableRoutineItem: React.FC<DraggableRoutineItemProps> = ({
  item,
  onDragStart,
  onDragEnd,
  index,
  isActive,
}) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      isDragging.value = true;
      onDragStart();
    },
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      isDragging.value = false;
      translateY.value = withSpring(0);
      onDragEnd(index);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isDragging.value ? 1 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDragging.value ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
    opacity: isActive ? 0.8 : 1,
  }));

  console.log('Rendering DraggableRoutineItem with Animated.View');

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} testID="pan-gesture-handler">
      <Animated.View style={[styles.container, animatedStyle]} testID="draggable-item">
        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: item.color },
            isActive && styles.activeItem,
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={item.icon as keyof typeof Ionicons.glyphMap} 
              size={24} 
              color="#fff" 
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.duration}>{item.duration} minutes</Text>
          </View>
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  activeItem: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dragHandle: {
    padding: 8,
  },
});

export default DraggableRoutineItem; 