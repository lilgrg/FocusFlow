import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

type TabBarIconProps = {
  color: string;
  size: number;
};

type ColorScheme = 'light' | 'dark';

export default function TabLayout() {
  const colorScheme = useColorScheme() as ColorScheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopColor: Colors[colorScheme].border,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }: TabBarIconProps) => <Ionicons name="today" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }: TabBarIconProps) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: TabBarIconProps) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
