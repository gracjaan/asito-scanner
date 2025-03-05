import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useNavigation, useRouter, useRootNavigationState } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { sendImageToOpenAI } from '../../services/openaiService';

export default function HomeScreen() {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Fix: Ensure navigation is mounted

  useEffect(() => {
    if (navigationState?.key) {
      // Only update params when navigation is ready
      router.setParams({ hasPhotos: images.length > 0, images });
    }
  }, [images, navigationState?.key]); // Ensure it only runs when navigation is ready

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
      // Grab the first image URI from result
      const photoUri = result.assets[0].uri;

      // Update your images state
      const newImages = [...images, photoUri];
      setImages(newImages);

      // Update navigation params if needed
      if (navigationState?.key) {
        router.setParams({ hasPhotos: newImages.length > 0, images: newImages });
      }

      // Send the captured image to OpenAI
      try {
        const openAIResponse = await sendImageToOpenAI(photoUri);
        console.log('OpenAI Response:', openAIResponse);
      } catch (error) {
        console.error('Error processing image with OpenAI:', error);
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>Take a photo of the staircase and main entrance</ThemedText>
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
});
