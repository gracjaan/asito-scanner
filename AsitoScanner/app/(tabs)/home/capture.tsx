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

const { width } = Dimensions.get('window');

const DOT_COLORS = {
  INACTIVE: '#E0E0E0',
  ACTIVE: '#FF5A00',
  COMPLETED: '#023866'
};

export default function CaptureScreen() {
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
    removeImageFromQuestion,
    markQuestionAsCompleted,
    setAnswerForQuestion,
    updateQuestionImages,
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

  // Local state for analyzing images, feedback, etc.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pull out the question we're displaying now
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
    slideAnim.setValue(width); // Start off-screen right
    fadeAnim.setValue(0);      // Start invisible

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

    // Update dots when the question visually changes
    updateDotStyles(localQuestionIndex);

  }, [localQuestionIndex, currentQuestionId]);

  // Animate progress bar when analyzing
  useEffect(() => {
    let progressTimer: Animated.CompositeAnimation | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    if (isAnalyzing) {
      progressAnim.setValue(0);
      setAnalysisProgress(0);

      progressTimer = Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 6000,
        useNativeDriver: false
      });
      progressTimer.start();


      intervalId = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 90) {
            return prev + 5;
          }
          if (intervalId) clearInterval(intervalId);
          return prev;
        });
      }, 300);

    } else if (analysisProgress > 0 && analysisProgress < 100) {
      // Snap to 100% if analysis stopped prematurely but was running
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start(() => {
        setAnalysisProgress(100);
      });
    }

    // Cleanup function
    return () => {
      if (progressTimer) progressTimer.stop();
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnalyzing]);

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
      // Make sure currentStyles has the correct length before mapping
      const adjustedStyles = currentStyles.length === requiredLength
          ? currentStyles
          : Array(requiredLength).fill({ scale: 1, color: DOT_COLORS.INACTIVE });

      return adjustedStyles.map((_, i) => {
        const question = locationQuestions[i];
        if (i === newIndex) {
          return { scale: 1.3, color: DOT_COLORS.ACTIVE };
        } else if (question?.completed) { // Check if actually completed first
          return { scale: 1, color: DOT_COLORS.COMPLETED };
        } else if (i < newIndex && (question?.images?.length > 0 || question?.answer)) { // Visited/partially done
          return { scale: 1, color: DOT_COLORS.COMPLETED }; // Mark as completed if navigated past with data
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
    // Prevent taking photo if analyzing
    if (isAnalyzing) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Or false if you don't want editing
        aspect: [4, 3],      // Or your preferred aspect ratio
        quality: 0.8,        // Adjust quality (0 to 1)
        base64: false,       // Don't need base64 here
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        if (currentQuestionId) {
          addImageToQuestion(currentQuestionId, imageUri);
          setFeedbackMessage(null); // Clear feedback on new image
        }
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert('Camera Error', 'Could not launch the camera.');
    }
  };

  const deleteImage = (imageIndex: number) => {
    // Prevent deletion if analyzing
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
                // Call the context function to remove the image
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
      // Cannot swap if no ID, <= 1 image, or currently analyzing
      return;
    }

    const actualIndexInFullArray = tappedSmallImageIndexInSlice + 1;

    if (actualIndexInFullArray <= 0 || actualIndexInFullArray >= currentImages.length) {
      console.warn("Invalid index for image swap:", actualIndexInFullArray);
      return; // Index out of bounds or trying to swap the main image with itself
    }

    const updatedImages = [...currentImages]; // Create a mutable copy

    // Simple swap using array destructuring
    [updatedImages[0], updatedImages[actualIndexInFullArray]] = [updatedImages[actualIndexInFullArray], updatedImages[0]];

    // Update the state via context
    updateQuestionImages(currentQuestionId, updatedImages);
  };

  const handleNext = async () => {
    if (isAnalyzing) return; // Prevent multiple clicks

    if (currentImages.length === 0) {
      Alert.alert('No Images', 'Please take at least one photo before proceeding.', [{ text: 'OK' }]);
      return;
    }

    setIsAnalyzing(true);
    setFeedbackMessage(null); // Clear previous feedback

    try {
      const response = await sendImagesToOpenAIWithBase64(currentImages, currentAnalyticalQuestion);

      if (response) {
        setAnswerForQuestion(currentQuestionId, response.answer);

        if (response.isComplete) {
          markQuestionAsCompleted(currentQuestionId);
          setFeedbackMessage(null);
          setIsAnalyzing(false);

          // Navigate or show submit modal
          if (localQuestionIndex === locationQuestions.length - 1) {
            setShowSubmitModal(true);
          } else {
            navigateToQuestion(localQuestionIndex + 1);
          }
        } else {
          // Analysis incomplete, show feedback
          setFeedbackMessage(response.suggestedAction || 'Please take more detailed photos.');
          setIsAnalyzing(false); // Stop indicator after showing feedback
        }
      } else {
        setIsAnalyzing(false); // Stop indicator
        Alert.alert('Analysis Failed', 'Received an unexpected response from the analysis service.', [{ text: 'OK' }]);
      }
    } catch (error: any) {
      setIsAnalyzing(false); // Ensure loading stops on error
      console.error('Error sending images to OpenAI:', error);
      Alert.alert('Analysis Error', `An error occurred: ${error.message || 'Please try again.'}`, [{ text: 'OK' }]);
    }
  };

  const handlePrevious = () => {
    if (localQuestionIndex === 0 || isAnalyzing) return;
    navigateToQuestion(localQuestionIndex - 1);
  };

  const navigateToQuestion = (newIndex: number) => {
    if (newIndex === localQuestionIndex || isAnalyzing) return; // Don't navigate if index same or analyzing

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
        duration: 200, // Fade out faster
        useNativeDriver: true
      })
    ]).start(() => {

      setIsAnalyzing(false);
      setFeedbackMessage(null);
      setAnalysisProgress(0);
      progressAnim.setValue(0);

      setLocalQuestionIndex(newIndex);

      slideAnim.setValue(startValue);

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
      router.push('/home/final-report'); // Navigate to report screen
    } catch (error) {
      console.error('Error saving survey:', error);
      Alert.alert('Save Error', 'There was a problem saving your survey. Please try again.', [{ text: 'OK' }]);
    }
  };

  const renderSmallPlaceholders = () => {
    if (!currentImages || currentImages.length <= 1) {
      // If there's exactly one image, show the "add" button if needed
      if (currentImages.length === 1 && currentImages.length < 5) {
        return (
            <View style={styles.smallPlaceholdersContainer}>
              <TouchableOpacity
                  key="placeholder-add-only"
                  style={styles.smallImageContainer}
                  onPress={takePhoto}
                  disabled={isAnalyzing}
              >
                <IconSymbol name="camera" size={30} color="grey" />
              </TouchableOpacity>
            </View>
        );
      }
      return null;
    }


    const smallImagesToDisplay = currentImages.slice(1, 5);
    const canAddMore = currentImages.length < 5;

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
        </View>
    );
  };

  const renderAnalysisOverlay = () => {
    if (!isAnalyzing && analysisProgress < 100) return null;

    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp' // Prevent extrapolation beyond 100%
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
            {/* Moved header up, outside of the scroll view */}
            <View style={styles.header}>
              <ThemedText style={styles.headerText}>{currentDisplayText}</ThemedText>
              {currentSubtext ? (
                  <View style={styles.subtextContainer}>
                    <ThemedText style={styles.subtextText}>{currentSubtext}</ThemedText>
                  </View>
              ) : null}
            </View>

            {/* Main Image Area */}
            <TouchableOpacity
                style={styles.imagePlaceholder}

                onPress={currentImages.length === 0 ? takePhoto : undefined}
                disabled={isAnalyzing || currentImages.length > 0} // Disable if analyzing or if images exist (no action needed on main image press)
            >
              {currentImages.length > 0 ? (
                  <View style={styles.mainImageContainer}>
                    <Image source={{ uri: currentImages[0] }} style={styles.image} />
                    {/* Delete button for the main image */}
                    <TouchableOpacity
                        style={styles.deleteImageButton}
                        onPress={() => deleteImage(0)} // Delete image at index 0
                        disabled={isAnalyzing} // Disable delete while analyzing
                    >
                      <IconSymbol name="xmark.circle.fill" size={24} color="#FF5A00" />
                    </TouchableOpacity>
                  </View>
              ) : (
                  // Placeholder shown only when currentImages.length === 0
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

            {/* Skip button */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={skipQuestion}
                disabled={isAnalyzing}
            >
              <ThemedText style={styles.skipButtonText}>Skip Question</ThemedText>
            </TouchableOpacity>

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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 30,
    gap: 5,
    marginTop: 'auto',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  header: {
    width: '100%',
    marginTop: -15,
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
    marginTop: -3,
    paddingHorizontal: 16
  },
  subtextText: {
    fontSize: 14,
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
  mainImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
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
    justifyContent: 'center',
    position: 'relative'
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  deleteImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
  },
  skipButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: 'center'
  },
  skipButtonText: {
    color: '#666',
    fontWeight: '500'
  }
});