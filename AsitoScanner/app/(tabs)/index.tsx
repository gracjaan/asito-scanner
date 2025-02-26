import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import type { TabNavigationState } from '@react-navigation/native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const [images, setImages] = useState<string[]>([]);
  const navigation = useNavigation<{
    setParams(params: { hasPhotos: boolean }): void;
  }>();

  useEffect(() => {
    navigation.setParams({ hasPhotos: images.length > 0 });
  }, [images]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const renderSmallPlaceholders = () => {
    if (images.length === 0) return null;

    const remainingPlaceholders = Math.min(5 - images.length, 1);
    return (
      <View style={styles.smallPlaceholdersContainer}>
        {images.slice(1).map((img, index) => (
          <View key={index} style={styles.smallImageContainer}>
            <Image source={{ uri: img }} style={styles.smallImage} />
          </View>
        ))}
        {[...Array(remainingPlaceholders)].map((_, index) => (
          <TouchableOpacity
            key={`placeholder-${index}`}
            style={styles.smallImageContainer}
            onPress={takePhoto}
          >
            <IconSymbol name="camera" size={30} color="grey" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>take a photo of the staircase and main enterance</ThemedText>
      </View>
      <TouchableOpacity 
        style={styles.imagePlaceholder} 
        onPress={images.length === 0 ? takePhoto : undefined}
      >
        {images.length > 0 ? (
          <Image source={{ uri: images[0] }} style={styles.image} />
        ) : (
          <IconSymbol name="camera" size={100} color="grey" />
        )}
      </TouchableOpacity>
      {renderSmallPlaceholders()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '100',
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  smallPlaceholdersContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  smallImageContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
