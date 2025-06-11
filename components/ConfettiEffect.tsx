import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Confetti {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

const COLORS = ['#0A7EA4', '#FFD700', '#FF6B6B', '#4CAF50', '#9C27B0'];

export const ConfettiEffect: React.FC = () => {
  const confetti: Confetti[] = [];

  useEffect(() => {
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      confetti.push({
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(-20),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    // Animate confetti
    confetti.forEach((piece, index) => {
      const delay = index * 50;
      const duration = 2000 + Math.random() * 1000;
      const distance = 300 + Math.random() * 200;
      const angle = Math.random() * Math.PI * 2;

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(piece.x, {
            toValue: Math.cos(angle) * distance,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.y, {
            toValue: Math.sin(angle) * distance + 400,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() * 360,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: duration - 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });
  }, []);

  return (
    <View style={styles.container}>
      {confetti.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                { rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }) },
                { scale: piece.scale },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
}); 