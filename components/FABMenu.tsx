import { createBoxShadow } from '@/utils/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

type IconName = keyof typeof Ionicons.glyphMap;

type FABAction = {
  id: string;
  title: string;
  icon: IconName;
  action: () => void;
  color: string;
};

type FABMenuProps = {
  isOpen: boolean;
  actions: FABAction[];
  onActionPress: (action: FABAction) => void;
  onFABPress: () => void;
};

export const FABMenu: React.FC<FABMenuProps> = ({
  isOpen,
  actions,
  onActionPress,
  onFABPress,
}) => {
  const fabMenuStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    transform: [
      { scale: withSpring(isOpen ? 1 : 0.8) }
    ]
  }));

  const fabMenuItemStyles = actions.map((_, index) => 
    useAnimatedStyle(() => ({
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
      transform: [
        { translateY: withSpring(isOpen ? 0 : 20, { damping: 15 }) }
      ]
    }))
  );

  return (
    <View style={styles.fabContainer}>
      {isOpen && (
        <Animated.View style={[styles.fabMenu, fabMenuStyle]}>
          {actions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={[styles.fabMenuItem, fabMenuItemStyles[index]]}
            >
              <TouchableOpacity
                style={[styles.fabMenuItem, { backgroundColor: action.color }]}
                onPress={() => onActionPress(action)}
              >
                <Ionicons name={action.icon} size={24} color="#FFF" />
                <Text style={styles.fabMenuLabel}>{action.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Open quick actions"
        accessibilityRole="button"
        accessibilityHint="Opens quick action menu"
        style={styles.fab}
        onPress={onFABPress}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fabMenu: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    backgroundColor: 'transparent',
    ...createBoxShadow('#000', { width: 0, height: 2 }, 0.25, 4),
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    marginBottom: 8,
    ...createBoxShadow('#000', { width: 0, height: 2 }, 0.25, 4),
  },
  fabMenuLabel: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    ...createBoxShadow('#000', { width: 0, height: 2 }, 0.25, 4),
  },
}); 