import * as Haptics from 'expo-haptics';
import React from 'react';

const { PlatformPressable } = require('@react-navigation/elements');
const { BottomTabBarButtonProps } = require('@react-navigation/bottom-tabs');

export function HapticTab(props: typeof BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev: any) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
