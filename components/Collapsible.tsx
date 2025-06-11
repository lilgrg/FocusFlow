import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  initiallyExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Adjust this value based on your content
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name={expanded ? 'chevron-down' : 'chevron-forward'}
            size={24}
            color="#666"
          />
          <View style={styles.title}>{title}</View>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.content, { height: contentHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  content: {
    overflow: 'hidden',
  },
});

export default Collapsible;
