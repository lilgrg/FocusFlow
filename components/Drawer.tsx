import { createBoxShadow } from '@/utils/styles';
import { useEffect } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const translateX = new Animated.Value(-400);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    ...createBoxShadow('#000', { width: 0, height: 2 }, 0.25, 3.84),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 