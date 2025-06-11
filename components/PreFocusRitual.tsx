import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PreFocusRitualProps {
  onComplete: () => void;
  onSkip: () => void;
}

const PreFocusRitual: React.FC<PreFocusRitualProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingProgress] = useState(new Animated.Value(0));

  const steps = [
    {
      title: 'Deep Breathing',
      description: 'Take 3 deep breaths to center yourself',
      icon: 'leaf-outline',
      duration: 15000, // 15 seconds
    },
    {
      title: 'Set Your Intention',
      description: 'What do you want to accomplish in this session?',
      icon: 'bulb-outline',
      duration: 10000, // 10 seconds
    },
    {
      title: 'Clear Your Space',
      description: 'Remove any distractions from your environment',
      icon: 'trash-outline',
      duration: 10000, // 10 seconds
    },
  ];

  const startBreathingAnimation = () => {
    Animated.sequence([
      Animated.timing(breathingProgress, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(breathingProgress, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pre-Focus Ritual</Text>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={currentStepData.icon as any} size={48} color="#007AFF" />
        </View>

        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <Text style={styles.stepDescription}>{currentStepData.description}</Text>

        {currentStep === 0 && (
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [
                  {
                    scale: breathingProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
                    }),
                  },
                ],
                opacity: breathingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ]}
          />
        )}
      </View>

      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.activeProgressDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {currentStep === steps.length - 1 ? 'Start Focus Session' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E3F2FD',
    position: 'absolute',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: '#007AFF',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreFocusRitual; 