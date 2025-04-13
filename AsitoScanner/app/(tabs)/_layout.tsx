import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageModal } from '@/components/LanguageModal';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { t } = useLanguage();
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

    const desiredHeaderHeight = 100;
    const desiredLogoHeight = 45;
    const desiredLogoWidth = 100;

    const openLanguageModal = () => {
        setIsLanguageModalVisible(true);
    };

    const closeLanguageModal = () => {
        setIsLanguageModalVisible(false);
    };

    return (
        <>
            <LanguageModal 
                visible={isLanguageModalVisible} 
                onClose={closeLanguageModal} 
            />
            
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#FF5A00',
                    headerShown: true,
                    headerTitle: () => (
                        <Image
                            source={require('@/assets/images/asito-logo.png')}
                            style={{
                                height: desiredLogoHeight,
                                width: desiredLogoWidth,
                                resizeMode: 'contain',
                            }}
                        />
                    ),
                    headerStyle: {
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        borderBottomWidth: 1.5,
                        borderBottomColor: '#FF5A00',
                        height: desiredHeaderHeight,
                    },
                    headerTitleAlign: 'center',
                    headerRight: () => (
                        <TouchableOpacity 
                            style={styles.languageButton}
                            onPress={openLanguageModal}
                        >
                            <IconSymbol 
                                name="globe" 
                                size={24} 
                                color="#FF5A00" 
                            />
                        </TouchableOpacity>
                    ),
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
                        title: t('home'),
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t('report'),
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
                    }}
                />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    languageButton: {
        marginRight: 16,
        padding: 8,
    }
});