import { View, ViewProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { getColor } = useTheme();
  const backgroundColor = getColor(lightColor || '#F8F9FA');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
