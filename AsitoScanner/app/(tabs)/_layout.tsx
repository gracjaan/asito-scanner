import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5A00',
        headerShown: true,
        headerTitle: () => (
          <Image
            source={require('@/assets/images/asito-logo.png')}
            style={{
              height: 120,
              width: 120,
              resizeMode: 'contain',
              padding: 10,
            }}
          />
        ),
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderBottomWidth: 2,
          borderBottomColor: '#FF5A00',
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: 2,
            borderTopColor: '#FF5A00',
          },
          default: {
            borderTopWidth: 2,
            borderTopColor: '#FF5A00',
          },
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
