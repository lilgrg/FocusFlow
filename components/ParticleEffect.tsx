import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
}

export const ParticleEffect: React.FC = () => {
  const particles: Particle[] = [];

  useEffect(() => {
    // Create particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        rotation: new Animated.Value(0),
      });
    }

    // Animate particles
    particles.forEach((particle, index) => {
      const angle = (index / particles.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;

      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: Math.sin(angle) * distance,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: Math.random() * 360,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
                { rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }) },
              ],
              opacity: particle.opacity,
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
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A7EA4',
  },
}); 