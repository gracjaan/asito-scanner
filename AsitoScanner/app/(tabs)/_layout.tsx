import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

type RootParamList = {
  index: { hasPhotos?: boolean };
  reports: undefined;
};

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
        name="index"
        options={({ route }: { route: { params?: { hasPhotos?: boolean } } }) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 16 }}
              onPress={() => {
                console.log('next button pressed');
              }}
              disabled={!route.params?.hasPhotos}
            >
              <ThemedText 
                style={{ 
                  opacity: route.params?.hasPhotos ? 1 : 0.5 
                }}
              >
                Next
              </ThemedText>
            </TouchableOpacity>
          ),
        })}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
