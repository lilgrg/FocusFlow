import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type TextType = 'title' | 'defaultSemiBold' | 'link' | 'default';

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  size?: number;
  style?: TextStyle | TextStyle[];
  type?: TextType;
}

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, size = 16, type = 'default', ...otherProps } = props;
  const { getColor, getTextStyle } = useTheme();
  const color = getColor(lightColor || '#000000');
  const textStyle = getTextStyle(size);

  const typeStyles: Record<TextType, TextStyle> = {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    defaultSemiBold: {
      fontSize: size,
      fontWeight: '600',
    },
    link: {
      fontSize: size,
      color: '#007AFF',
      textDecorationLine: 'underline',
    },
    default: {
      fontSize: size,
    },
  };

  return <Text style={[{ color, ...textStyle, ...typeStyles[type] }, style]} {...otherProps} />;
}
