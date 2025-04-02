import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { useSurvey } from '@/context/SurveyContext';
import { sendImagesToOpenAIWithBase64 } from '@/services/openaiService';
import { SubmitModal } from '@/components/SubmitModal';
import { saveReport } from '@/services/storageService';  // Moved to top

const { width } = Dimensions.get('window');

const DOT_COLORS = {
  INACTIVE: '#E0E0E0',
  ACTIVE: '#FF5A00',
  COMPLETED: '#023866'
};

export default function CaptureScreen() {
  // Grab the route param (e.g., ?location=Entrance) and fall back to "Entrance" if none is provided
  const { location } = useLocalSearchParams();
  const locationFilterValue =
      typeof location === 'string'
          ? location
          : Array.isArray(location)
              ? location[0]
              : 'Entrance';

  // Get the full question list from context
  const {
    questions,
    addImageToQuestion,
    markQuestionAsCompleted,
    setAnswerForQuestion,
    userName,
    surveyDate,
    surveyStatus,
    surveyDescription
  } = useSurvey();

  // Filter only those questions that match our selected location
  const locationQuestions = questions.filter(
      q => q.location?.toLowerCase() === locationFilterValue.toLowerCase()
  );

  // Local question index for the currently displayed question
  const [localQuestionIndex, setLocalQuestionIndex] = useState(0);

  // Whenever locationFilterValue changes, reset to 0
  useEffect(() => {
    setLocalQuestionIndex(0);
  }, [locationFilterValue]);

  // Local state for analyzing images, feedback, etc.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pull out the question we’re displaying now
  const currentDisplayText =
      locationQuestions[localQuestionIndex]?.displayText ||
      locationQuestions[localQuestionIndex]?.text ||
      '';
  const currentSubtext =
      locationQuestions[localQuestionIndex]?.subtext || '';
  const currentAnalyticalQuestion =
      locationQuestions[localQuestionIndex]?.analyticalQuestion ||
      locationQuestions[localQuestionIndex]?.text ||
      '';
  const currentImages = locationQuestions[localQuestionIndex]?.images || [];

  // Keep dot styles in sync with localQuestionIndex
  const [dotStyles, setDotStyles] = useState(() =>
      Array(locationQuestions.length)
          .fill(0)
          .map((_, i) => ({
            scale: i === 0 ? 1.3 : 1,
            color: i === 0 ? DOT_COLORS.ACTIVE : DOT_COLORS.INACTIVE
          }))
  );


useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  // Animate progress bar when analyzing
  useEffect(() => {
    if (isAnalyzing) {
      progressAnim.setValue(0);
      setAnalysisProgress(0);

      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 6000,
        useNativeDriver: false
      }).start();

      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 90) {
            return prev + 5;
          }
          clearInterval(interval);
          return prev;
        });
      }, 300);

      return () => clearInterval(interval);
    } else if (analysisProgress > 0) {
      // Snap to 100%, then hide
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start(() => {
        setTimeout(() => {
          setAnalysisProgress(0);
        }, 500);
      });
      setAnalysisProgress(100);
    }
  }, [isAnalyzing]);

  const updateDotStyles = (newIndex: number) => {
    setDotStyles(prev =>
        prev.map((style, i) => {
          if (i === newIndex) {
            return { scale: 1.3, color: DOT_COLORS.ACTIVE };
          } else if (i < newIndex) {
            return { scale: 1, color: DOT_COLORS.COMPLETED };
          } else {
            return { scale: 1, color: DOT_COLORS.INACTIVE };
          }
        })
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      // Use the localQuestionIndex to find the correct question
      addImageToQuestion(locationQuestions[localQuestionIndex].id, imageUri);
      setFeedbackMessage(null);
    }
  };

  const handleNext = async () => {
    const currentImgs = locationQuestions[localQuestionIndex]?.images || [];

    if (currentImgs.length === 0) {
      Alert.alert(
          'No Images',
          'Please take at least one photo before proceeding.',
          [{ text: 'OK' }]
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await sendImagesToOpenAIWithBase64(
          currentImgs,
          currentAnalyticalQuestion
      );

      if (response) {
        setAnswerForQuestion(locationQuestions[localQuestionIndex].id, response.answer);

        if (response.isComplete) {
          markQuestionAsCompleted(locationQuestions[localQuestionIndex].id);
          setFeedbackMessage(null);

          // If it's the last question in this location => show submit modal
          if (localQuestionIndex === locationQuestions.length - 1) {
            setShowSubmitModal(true);
          } else {
            navigateToQuestion(localQuestionIndex + 1);
          }
        } else {
          setFeedbackMessage(
              response.suggestedAction || 'Please take more detailed photos.'
          );
        }
      } else {
        Alert.alert(
            'Analysis Failed',
            'There was a problem analyzing your images. Please try again.',
            [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sending images to OpenAI:', error);
      Alert.alert(
          'Error',
          'An error occurred while analyzing your images. Please try again.',
          [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevious = () => {
    // Navigate backward through the local questions
    if (localQuestionIndex === 0) return;

    const prevIndex = localQuestionIndex - 1;
    navigateToQuestion(prevIndex);
  };

  const navigateToQuestion = (newIndex: number) => {
    const isForward =
        newIndex > localQuestionIndex ||
        (localQuestionIndex === locationQuestions.length - 1 && newIndex === 0);

    const startValue = isForward ? width : -width;
    const endValue = isForward ? -width : width;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: endValue,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsAnalyzing(false);
      setFeedbackMessage(null);

      setLocalQuestionIndex(newIndex);
      updateDotStyles(newIndex);

      slideAnim.setValue(startValue);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    });
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    try {
      const reportId = `report-${Date.now()}`;
      await saveReport({
        id: reportId,
        scope: 'Building Inspection',
        date: surveyDate,
        status: surveyStatus,
        userName,
        description: surveyDescription,
        questions: locationQuestions.map(q => ({
          id: q.id,
          text: q.text,
          displayText: q.displayText || q.text,
          subtext: q.subtext || "",
          analyticalQuestion: q.analyticalQuestion || q.text,
          answer: q.answer || '',
          images: q.images,
          completed: q.completed
        }))
      });

      console.log('Survey saved successfully');
      router.push('/home/final-report');
    } catch (error) {
      console.error('Error saving survey:', error);
      Alert.alert('Error', 'There was a problem saving your survey. Please try again.', [
        { text: 'OK' }
      ]);
    }
  };

  const renderSmallPlaceholders = () => {
    if (currentImages.length === 0) return null;

    // Show up to 5 images, one big plus up to 4 small, etc.
    const remainingPlaceholders = Math.min(5 - currentImages.length, 1);

    return (
        <View style={styles.smallPlaceholdersContainer}>
          {currentImages.slice(1).map((img, index) => (
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

  const renderAnalysisOverlay = () => {
    if (!isAnalyzing && analysisProgress === 0) return null;

    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color="#FF5A00" />
            <ThemedText style={styles.overlayText}>Analyzing images...</ThemedText>

            <View style={styles.progressBarContainer}>
              <Animated.View
                  style={[
                    styles.progressBar,
                    { width: progressWidth }
                  ]}
              />
            </View>

            <ThemedText style={styles.progressText}>{analysisProgress}%</ThemedText>
          </View>
        </View>
    );
  };

  return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <SubmitModal
              visible={showSubmitModal}
              onCancel={() => setShowSubmitModal(false)}
              onSubmit={handleSubmit}
          />

          {renderAnalysisOverlay()}

          <Animated.View
              style={[
                styles.contentContainer,
                {
                  transform: [{ translateX: slideAnim }],
                  opacity: fadeAnim
                }
              ]}
          >
            <View style={styles.header}>
              <ThemedText style={styles.headerText}>{currentDisplayText}</ThemedText>
            </View>
            {currentSubtext ? (
                <View style={styles.subtextContainer}>
                  <ThemedText style={styles.subtextText}>{currentSubtext}</ThemedText>
                </View>
            ) : null}

            <TouchableOpacity
                style={styles.imagePlaceholder}
                onPress={currentImages.length === 0 ? takePhoto : undefined}
            >
              {currentImages.length > 0 ? (
                  <Image source={{ uri: currentImages[0] }} style={styles.image} />
              ) : (
                  <IconSymbol name="camera" size={100} color="grey" />
              )}
            </TouchableOpacity>

            {renderSmallPlaceholders()}

            {feedbackMessage && (
                <View style={styles.feedbackContainer}>
                  <IconSymbol name="exclamationmark.triangle" size={24} color="#FF5A00" />
                  <ThemedText style={styles.feedbackText}>{feedbackMessage}</ThemedText>
                </View>
            )}

            <View style={styles.progressContainer}>
              <View style={styles.progressDotsContainer}>
                {/* Previous */}
                <TouchableOpacity
                    style={[
                      styles.backButton,
                      localQuestionIndex === 0 && styles.disabledButton
                    ]}
                    onPress={handlePrevious}
                    disabled={localQuestionIndex === 0}
                >
                  <IconSymbol
                      name="chevron.left"
                      size={24}
                      color={
                        localQuestionIndex === 0
                            ? 'rgba(255, 255, 255, 0.5)'
                            : '#FFFFFF'
                      }
                  />
                </TouchableOpacity>

                {/* Dots */}
                {locationQuestions.map((_, index) => (
                    <View
                        key={index}
                        style={[
                          styles.progressDot,
                          {
                            transform: [{ scale: dotStyles[index]?.scale || 1 }],
                            backgroundColor: dotStyles[index]?.color || DOT_COLORS.INACTIVE
                          }
                        ]}
                    />
                ))}

                {/* Next */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleNext}
                    disabled={isAnalyzing}
                >
                  <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden'
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  progressContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 100,
    gap: 8
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '100',
    textAlign: 'center'
  },
  subtextContainer: {
    marginBottom: 12,
    paddingHorizontal: 16
  },
  subtextText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  imagePlaceholder: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  smallPlaceholdersContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8
  },
  smallImageContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  backButton: {
    backgroundColor: '#023866',
    width: 'auto',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    backgroundColor: 'rgba(2, 56, 102, 0.5)'
  },
  progressDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF5A00'
  },
  progressText: {
    marginTop: 8,
    fontSize: 14
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#FF5A00',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    width: '100%'
  },
  feedbackText: {
    color: '#FF5A00',
    marginLeft: 8,
    flex: 1
  }
});
