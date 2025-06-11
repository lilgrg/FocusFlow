import { useTheme } from '@/contexts/ThemeContext';
import { TimedRoutineItem } from '@/types/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FocusTimerProps {
  task: TimedRoutineItem;
  onComplete: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ task, onComplete }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(task.duration * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{task.title}</Text>
      <Text style={[styles.timer, { color: theme.colors.primary }]}>
        {formatTime(timeLeft)}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={toggleTimer}
      >
        <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Resume'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FocusTimer; 