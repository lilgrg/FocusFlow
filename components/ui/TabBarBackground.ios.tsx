import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

function useDynamicTabBarHeight() {
  const [tabBarHeight, setTabBarHeight] = useState(0);
  useEffect(() => {
    (async () => {
      const mod = await import('@react-navigation/bottom-tabs');
      setTabBarHeight(mod.useBottomTabBarHeight());
    })();
  }, []);
  return tabBarHeight;
}

export default function BlurTabBarBackground() {
  const tabBarHeight = useDynamicTabBarHeight();
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={[StyleSheet.absoluteFill, { height: tabBarHeight }]}
    />
  );
}

export function useBottomTabOverflow() {
  return useDynamicTabBarHeight();
}
