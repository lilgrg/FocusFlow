import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Prompt {
  type: 'water' | 'movement' | 'meditation';
  icon: string;
  status: 'pending' | 'completed';
}

interface PromptIndicatorProps {
  prompt: Prompt;
  onPress?: () => void;
}

const getPromptColor = (type: Prompt['type']) => {
  switch (type) {
    case 'water':
      return '#0A7EA4';
    case 'movement':
      return '#4CAF50';
    case 'meditation':
      return '#9C27B0';
    default:
      return '#666';
  }
};

export const PromptIndicator: React.FC<PromptIndicatorProps> = ({ prompt, onPress }) => {
  const isCompleted = prompt.status === 'completed';
  const color = getPromptColor(prompt.type);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: color + '10',
          borderColor: color + '30',
        },
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <Ionicons
        name={prompt.icon as any}
        size={16}
        color={isCompleted ? color : color + '80'}
      />
      <Text
        style={[
          styles.text,
          {
            color: isCompleted ? color : color + '80',
          },
        ]}>
        {prompt.type.charAt(0).toUpperCase() + prompt.type.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
  },
  completedContainer: {
    opacity: 0.7,
  },
  text: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
}); 