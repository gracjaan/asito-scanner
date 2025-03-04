import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Image, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { sendImageToOpenAI } from '@/services/openaiService'; // Import OpenAI API request function

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { hasPhotos, images } = useGlobalSearchParams(); // Retrieve image list from index.tsx
  const [latestImage, setLatestImage] = useState<string | null>(null);

  // Get the latest captured image
  useEffect(() => {
    if (images && images.length > 0) {
      setLatestImage(images[images.length - 1]);
    }
  }, [images]);

  const handleNextPress = async () => {
    if (!latestImage) {
      console.log("No image to send.");
      return;
    }

    //OpenAI
    console.log("Sending last captured image to OpenAI:", latestImage);
    const response = await sendImageToOpenAI(latestImage);
    console.log("OpenAI Response:", response);
  };

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
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={handleNextPress} // Send image to OpenAI on press
              disabled={!hasPhotos}
            >
              <ThemedText
                style={{
                  opacity: hasPhotos ? 1 : 0.5
                }}
              >
                Next
              </ThemedText>
            </TouchableOpacity>
          ),
        }}
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
