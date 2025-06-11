import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform,
    Animated as RNAnimated,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

type QuickAddButtonProps = {
  onPress: () => void;
  onLongPress?: () => void;
};

export function QuickAddButton({ onPress, onLongPress }: QuickAddButtonProps) {
  const [scale] = useState(new RNAnimated.Value(1));

  const handlePressIn = () => {
    RNAnimated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    RNAnimated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <RNAnimated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1000,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0A7EA4',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
}); 