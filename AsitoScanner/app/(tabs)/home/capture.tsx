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
import { saveReport } from '@/services/storageService';

const { width, height } = Dimensions.get('window');

const DOT_COLORS = {
  INACTIVE: '#E0E0E0',
  ACTIVE: '#FF5A00',
  COMPLETED: '#023866'
};

const IMAGE_AREA_HEIGHT = height * 0.35;

export default function CaptureScreen() {
  const { location } = useLocalSearchParams();
  const locationFilterValue =
      typeof location === 'string'
          ? location
          : Array.isArray(location)
              ? location[0]
              : 'Entrance';

  const {
    questions,
    addImageToQuestion,
    removeImageFromQuestion,
    markQuestionAsCompleted,
    setAnswerForQuestion,
    updateQuestionImages,
    userName,
    surveyDate,
    surveyStatus,
    surveyDescription
  } = useSurvey();

  const locationQuestions = questions.filter(
      q => q.location?.toLowerCase() === locationFilterValue.toLowerCase()
  );

  const [localQuestionIndex, setLocalQuestionIndex] = useState(0);

  useEffect(() => {
    setLocalQuestionIndex(0);
    const newLocationQuestions = questions.filter(
        q => q.location?.toLowerCase() === locationFilterValue.toLowerCase()
    );
    const initialDotStyles = Array(newLocationQuestions.length)
        .fill(0)
        .map((_, i) => ({
          scale: i === 0 ? 1.3 : 1,
          color: i === 0 ? DOT_COLORS.ACTIVE : DOT_COLORS.INACTIVE
        }));
    setDotStyles(initialDotStyles);

  }, [locationFilterValue, questions]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
  const currentQuestionId = locationQuestions[localQuestionIndex]?.id || '';

  const [dotStyles, setDotStyles] = useState(() =>
      Array(locationQuestions.length)
          .fill(0)
          .map((_, i) => ({
            scale: i === 0 ? 1.3 : 1,
            color: i === 0 ? DOT_COLORS.ACTIVE : DOT_COLORS.INACTIVE
          }))
  );


  useEffect(() => {
    slideAnim.setValue(width);
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

    updateDotStyles(localQuestionIndex);

  }, [localQuestionIndex, currentQuestionId]);


  // Animate progress bar when analyzing
  // Animate progress bar when analyzing
  useEffect(() => {
    let progressTimerRef: Animated.CompositeAnimation | null = null; // Use a local ref for the timer instance within this effect run
    let intervalId: NodeJS.Timeout | null = null;

    if (isAnalyzing) {
      progressAnim.setValue(0);
      setAnalysisProgress(0); // Reset progress when starting

      // Start the fake progress animation
      // Assign to the local ref
      progressTimerRef = Animated.timing(progressAnim, {
        toValue: 0.9, // Animate to 90%
        duration: 6000, // Over 6 seconds
        useNativeDriver: false
      });
      progressTimerRef.start();

      // Update the percentage text
      intervalId = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 90) {
            return prev + 5; // Increment progress text
          }
          // Use type assertion for clearInterval if needed, or check if it's Node/Browser specific
          if (intervalId) clearInterval(intervalId as any); // Stop interval at 90%
          return prev;
        });
      }, 300);

    } else {
      // If analysis stopped (either success or failure), handle visual snapping
      // No need to stop the timer here; the cleanup function handles it.

      // Snap the progress bar to 100% visually *if* it had started
      if (analysisProgress > 0) {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 200, // Quick snap animation
          useNativeDriver: false
        }).start(() => {
          setAnalysisProgress(100); // Set text to 100% after snap
          // Optionally reset progress after a short delay if needed,
          // although it will reset when isAnalyzing becomes true again.
          // setTimeout(() => {
          //     progressAnim.setValue(0);
          //     setAnalysisProgress(0);
          // }, 500); // Reset after 500ms delay
        });
      } else {
        // If analysis was stopped before it even started visually, reset progress immediately
        progressAnim.setValue(0);
        setAnalysisProgress(0);
      }
    }

    // Cleanup function: Runs when isAnalyzing changes or component unmounts
    return () => {
      // Stop the timer *associated with this specific effect run* if it exists
      if (progressTimerRef) {
        progressTimerRef.stop();
      }
      // Clear the interval associated with this specific effect run if it exists
      if (intervalId) {
        clearInterval(intervalId as any); // Use type assertion if needed
      }
    };
  }, [isAnalyzing, progressAnim]); // progressAnim added as dependency


  const skipQuestion = () => {
    if (localQuestionIndex === locationQuestions.length - 1) {
      setShowSubmitModal(true);
    } else {
      navigateToQuestion(localQuestionIndex + 1);
    }
  };

  const updateDotStyles = (newIndex: number) => {
    const requiredLength = locationQuestions.length;
    if (requiredLength === 0) return;

    setDotStyles(currentStyles => {
      const adjustedStyles = currentStyles.length === requiredLength
          ? currentStyles
          : Array(requiredLength).fill({ scale: 1, color: DOT_COLORS.INACTIVE });

      return adjustedStyles.map((_, i) => {
        const question = locationQuestions[i];
        if (i === newIndex) {
          return { scale: 1.3, color: DOT_COLORS.ACTIVE };
        } else if (question?.completed) {
          return { scale: 1, color: DOT_COLORS.COMPLETED };
        } else if (i < newIndex && (question?.images?.length > 0 || question?.answer)) {
          return { scale: 1, color: DOT_COLORS.COMPLETED };
        } else {
          return { scale: 1, color: DOT_COLORS.INACTIVE };
        }
      });
    });
  };

  const takePhoto = async () => {
    if (currentImages.length >= 5) {
      Alert.alert('Limit Reached', 'You can add a maximum of 5 images per question.');
      return;
    }
    if (isAnalyzing) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        if (currentQuestionId) {
          addImageToQuestion(currentQuestionId, imageUri);
          setFeedbackMessage(null);
        }
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert('Camera Error', 'Could not launch the camera.');
    }
  };

  const deleteImage = (imageIndex: number) => {
    if (isAnalyzing) return;

    Alert.alert(
        'Delete Image',
        'Are you sure you want to delete this image?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              if (currentQuestionId) {
                removeImageFromQuestion(currentQuestionId, imageIndex);
              }
            }
          }
        ],
        { cancelable: true }
    );
  };

  const swapImageWithMain = (tappedSmallImageIndexInSlice: number) => {
    if (!currentQuestionId || !currentImages || currentImages.length <= 1 || isAnalyzing) {
      return;
    }

    const actualIndexInFullArray = tappedSmallImageIndexInSlice + 1;

    if (actualIndexInFullArray <= 0 || actualIndexInFullArray >= currentImages.length) {
      console.warn("Invalid index for image swap:", actualIndexInFullArray);
      return;
    }

    const updatedImages = [...currentImages];
    [updatedImages[0], updatedImages[actualIndexInFullArray]] = [updatedImages[actualIndexInFullArray], updatedImages[0]];
    updateQuestionImages(currentQuestionId, updatedImages);
  };

  const handleNext = async () => {
    if (isAnalyzing) return;

    if (currentImages.length === 0) {
      Alert.alert('No Images', 'Please take at least one photo before proceeding.', [{ text: 'OK' }]);
      return;
    }

    setIsAnalyzing(true); // <-- Start analyzing, triggers useEffect for progress bar
    setFeedbackMessage(null);

    try {
      const response = await sendImagesToOpenAIWithBase64(currentImages, currentAnalyticalQuestion);

      // --- Analysis complete ---
      setIsAnalyzing(false); // <-- Stop analyzing *before* navigation/modal logic

      if (response) {
        setAnswerForQuestion(currentQuestionId, response.answer);

        if (response.isComplete) {
          markQuestionAsCompleted(currentQuestionId);
          setFeedbackMessage(null); // Clear any potential pending feedback

          // Navigate or show submit modal *after* setting isAnalyzing to false
          if (localQuestionIndex === locationQuestions.length - 1) {
            setShowSubmitModal(true);
          } else {
            navigateToQuestion(localQuestionIndex + 1);
          }
        } else {
          // Analysis incomplete, show feedback
          setFeedbackMessage(response.suggestedAction || 'Please take more detailed photos.');
        }
      } else {
        // Handle unexpected response (still stop analyzing)
        Alert.alert('Analysis Failed', 'Received an unexpected response from the analysis service.', [{ text: 'OK' }]);
      }
    } catch (error: any) {
      setIsAnalyzing(false); // <-- Ensure analyzing stops on error
      console.error('Error sending images to OpenAI:', error);
      Alert.alert('Analysis Error', `An error occurred: ${error.message || 'Please try again.'}`, [{ text: 'OK' }]);
    }
  };


  const handlePrevious = () => {
    if (localQuestionIndex === 0 || isAnalyzing) return;
    navigateToQuestion(localQuestionIndex - 1);
  };

  const navigateToQuestion = (newIndex: number) => {
    // Do not allow navigation *while* analyzing
    if (newIndex === localQuestionIndex || isAnalyzing) return;

    const isForward = newIndex > localQuestionIndex;
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
      // Reset state *after* animation completes
      // setIsAnalyzing(false); // This should already be false before calling navigate
      setFeedbackMessage(null);
      // Reset progress *after* navigation is complete and state is updated
      setAnalysisProgress(0);
      progressAnim.setValue(0);

      setLocalQuestionIndex(newIndex);
      // Prepare for next slide-in animation
      slideAnim.setValue(startValue);

      // Start the slide-in animation for the new content
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
      const questionsForReport = questions
          .filter(q => q.location?.toLowerCase() === locationFilterValue.toLowerCase())
          .map(q => ({
            id: q.id,
            text: q.text,
            displayText: q.displayText || q.text,
            subtext: q.subtext || "",
            analyticalQuestion: q.analyticalQuestion || q.text,
            answer: q.answer || '',
            images: q.images || [],
            completed: q.completed || false
          }));

      if (questionsForReport.length === 0) {
        console.warn("Attempting to save report for a location with no questions:", locationFilterValue);
      }

      await saveReport({
        id: reportId,
        scope: 'Building Inspection',
        date: surveyDate,
        status: 'completed',
        userName,
        description: surveyDescription,
        questions: questionsForReport
      });

      console.log('Survey for location saved successfully');
      router.push('/home/final-report');
    } catch (error) {
      console.error('Error saving survey:', error);
      Alert.alert('Save Error', 'There was a problem saving your survey. Please try again.', [{ text: 'OK' }]);
    }
  };

  const renderSmallPlaceholders = () => {
    const canAddMore = currentImages.length < 5;
    const smallImagesToDisplay = currentImages.slice(1, 5);

    return (
        <View style={styles.smallPlaceholdersContainer}>
          {smallImagesToDisplay.map((img, index) => (
              <TouchableOpacity
                  key={`small-img-${index}`}
                  onPress={() => swapImageWithMain(index)}
                  disabled={isAnalyzing}
              >
                <View style={styles.smallImageContainer}>
                  <Image source={{ uri: img }} style={styles.smallImage} />
                  <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteImage(index + 1);
                      }}
                      disabled={isAnalyzing}
                  >
                    <IconSymbol name="xmark.circle.fill" size={24} color="#FF5A00" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          ))}
          {canAddMore && (
              <TouchableOpacity
                  key="placeholder-add"
                  style={styles.smallImageContainer}
                  onPress={takePhoto}
                  disabled={isAnalyzing}
              >
                <IconSymbol name="camera" size={30} color="grey" />
              </TouchableOpacity>
          )}
          {/* Optional empty placeholders */}
          {/* {Array(Math.max(0, 4 - smallImagesToDisplay.length - (canAddMore ? 1 : 0))).fill(0).map((_, i) => (
            <View key={`empty-${i}`} style={styles.smallImageContainer} />
          ))} */}
        </View>
    );
  };


  const renderAnalysisOverlay = () => {
    // Only show the overlay if isAnalyzing is true
    if (!isAnalyzing) return null;

    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp'
    });

    return (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color="#FF5A00" />
            <ThemedText style={styles.overlayText}>Analyzing images...</ThemedText>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <ThemedText style={styles.progressText}>{Math.round(analysisProgress)}%</ThemedText>
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

          {/* Render overlay based on isAnalyzing state */}
          {renderAnalysisOverlay()}

          {/* Animated content block */}
          <Animated.View
              style={[
                styles.contentContainer,
                {
                  transform: [{ translateX: slideAnim }],
                  opacity: fadeAnim
                }
              ]}
          >
            {/* Wrap main content to push progress bar down */}
            <View style={styles.mainContent}>
              <View style={styles.header}>
                <ThemedText style={styles.headerText}>{currentDisplayText}</ThemedText>
                {currentSubtext ? (
                    <View style={styles.subtextContainer}>
                      <ThemedText style={styles.subtextText}>{currentSubtext}</ThemedText>
                    </View>
                ) : null}
              </View>

              <View style={styles.imageRowContainer}>
                <TouchableOpacity
                    style={styles.imagePlaceholder}
                    onPress={currentImages.length === 0 ? takePhoto : undefined}
                    disabled={isAnalyzing || currentImages.length > 0}
                >
                  {currentImages.length > 0 ? (
                      <View style={styles.mainImageContainer}>
                        <Image source={{ uri: currentImages[0] }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.deleteImageButton}
                            onPress={() => deleteImage(0)}
                            disabled={isAnalyzing}
                        >
                          <IconSymbol name="xmark.circle.fill" size={24} color="#FF5A00" />
                        </TouchableOpacity>
                      </View>
                  ) : (
                      <IconSymbol name="camera" size={80} color="grey" />
                  )}
                </TouchableOpacity>
                {renderSmallPlaceholders()}
              </View>


              {feedbackMessage && (
                  <View style={styles.feedbackContainer}>
                    <IconSymbol name="exclamationmark.triangle" size={24} color="#FF5A00" />
                    <ThemedText style={styles.feedbackText}>{feedbackMessage}</ThemedText>
                  </View>
              )}

              <TouchableOpacity
                  style={styles.skipButton}
                  onPress={skipQuestion}
                  disabled={isAnalyzing}
              >
                <ThemedText style={styles.skipButtonText}>Skip Question</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDotsContainer}>
                <TouchableOpacity
                    style={[
                      styles.backButton,
                      localQuestionIndex === 0 && styles.disabledButton
                    ]}
                    onPress={handlePrevious}
                    disabled={localQuestionIndex === 0 || isAnalyzing}
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

                {locationQuestions.map((_, index) => (
                    <Animated.View
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

                <TouchableOpacity
                    style={[
                      styles.backButton,
                      isAnalyzing && styles.disabledButton // Disable next button while analyzing
                    ]}
                    onPress={handleNext}
                    disabled={isAnalyzing} // Also disable touchable opacity
                >
                  <IconSymbol
                      name="chevron.right"
                      size={24}
                      color={ isAnalyzing ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF' }
                  />
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
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '100',
    textAlign: 'center'
  },
  subtextContainer: {
    marginTop: 2,
    paddingHorizontal: 10
  },
  subtextText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  imageRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: IMAGE_AREA_HEIGHT,
    marginBottom: 16,
    gap: 16,
  },
  imagePlaceholder: {
    width: '70%', // Keep aspect ratio consistent
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  mainImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  smallPlaceholdersContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
    width: 90,
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
    position: 'relative',
    overflow: 'hidden',
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
  },
  skipButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6, // Adjusted padding for better touch area
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10, // Adjusted margin
    alignSelf: 'center'
  },
  skipButtonText: {
    color: '#666',
    fontWeight: '500'
  },
  progressContainer: {
    width: '100%',
    paddingVertical: 10,
    // marginTop: 'auto', // Pushes to the bottom within the flex container
  },
  progressDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  backButton: {
    backgroundColor: '#023866',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  disabledButton: {
    backgroundColor: 'rgba(2, 56, 102, 0.5)'
  },
  overlayContainer: {
    // Position absolutely to cover the entire screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10, // Ensure it's above other content
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
});