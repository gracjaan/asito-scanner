import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { useSurvey } from '@/context/SurveyContext';
import {sendImagesToOpenAIWithBase64, OpenAIAnalysisResponse} from '@/services/openaiService';
import {SubmitModal} from "@/components/SubmitModal";
import { saveReport } from '@/services/storageService';


const { width } = Dimensions.get('window');

const DOT_COLORS = {
  INACTIVE: '#E0E0E0',
  ACTIVE: '#FF5A00',
  COMPLETED: '#023866'
};

export default function CaptureScreen() {
  const { 
    questions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    addImageToQuestion,
    markQuestionAsCompleted,
    setAnswerForQuestion,
    userName,
    surveyDate,
    surveyStatus,
    surveyDescription
  } = useSurvey();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const currentDisplayText = questions[currentQuestionIndex]?.displayText || questions[currentQuestionIndex]?.text || '';
  const currentAnalyticalQuestion = questions[currentQuestionIndex]?.analyticalQuestion || questions[currentQuestionIndex]?.text || '';
  
  const currentImages = questions[currentQuestionIndex]?.images || [];

  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [dotStyles, setDotStyles] = useState(() =>
    Array(questions.length).fill(0).map((_, i) => ({
      scale: i === currentQuestionIndex ? 1.3 : 1,
      color: i === currentQuestionIndex ? DOT_COLORS.ACTIVE : 
             i < currentQuestionIndex ? DOT_COLORS.COMPLETED : DOT_COLORS.INACTIVE
    }))
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Animation for the progress bar
  useEffect(() => {
    if (isAnalyzing) {
      // Reset progress animation
      progressAnim.setValue(0);
      setAnalysisProgress(0);
      
      // Animate to 90% quickly, then slow down
      Animated.timing(progressAnim, {
        toValue: 0.9,
        duration: 6000,
        useNativeDriver: false,
      }).start();
      
      // Update the progress state for display
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
      // Complete the progress animation when analysis is done
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
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
      const imageUri = result.assets[0].uri;
      addImageToQuestion(questions[currentQuestionIndex].id, imageUri);
      // Clear any previous feedback when a new image is added
      setFeedbackMessage(null);
    }
  };

  const handleNext = async () => {
    const currentImages = questions[currentQuestionIndex]?.images || [];

    if (currentImages.length === 0) {
      Alert.alert(
        "No Images",
        "Please take at least one photo before proceeding.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await sendImagesToOpenAIWithBase64(
        currentImages, 
        currentAnalyticalQuestion
      );

      if (response) {
        // Save the answer to the question
        setAnswerForQuestion(questions[currentQuestionIndex].id, response.answer);

        if (response.isComplete) {
          // If the response indicates the images are sufficient, mark as completed and proceed
          markQuestionAsCompleted(questions[currentQuestionIndex].id);
          setFeedbackMessage(null);

          if (currentQuestionIndex === questions.length - 1) {
            setShowSubmitModal(true);
          } else {
            const nextIndex = (currentQuestionIndex + 1) % questions.length;
            navigateToQuestion(nextIndex);
          }
        } else {
          // If more images are needed, show feedback to the user
          setFeedbackMessage(response.suggestedAction || "Please take more detailed photos.");
        }
      } else {
        Alert.alert(
          "Analysis Failed",
          "There was a problem analyzing your images. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error sending images to OpenAI:", error);
      Alert.alert(
        "Error",
        "An error occurred while analyzing your images. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
    navigateToQuestion(prevIndex);
  };

  const navigateToQuestion = (newIndex: number) => {
    // determine animation direction (left or right)
    const isForward = newIndex > currentQuestionIndex || (currentQuestionIndex === questions.length - 1 && newIndex === 0);
    const startValue = isForward ? width : -width;
    const endValue = isForward ? -width : width;
    
    // start slide out animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: endValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsAnalyzing(false);
      setFeedbackMessage(null);

      setCurrentQuestionIndex(newIndex);

      updateDotStyles(newIndex);

      slideAnim.setValue(startValue);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    
    try {
      // Create a unique ID for the report
      const reportId = `report-${Date.now()}`;
      
      // Save the completed survey to localStorage
      await saveReport({
        id: reportId,
        scope: 'Building Inspection', // Default scope, could be customizable
        date: surveyDate,
        status: surveyStatus,
        userName: userName,
        description: surveyDescription,
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          displayText: q.displayText || q.text,
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
      Alert.alert(
        'Error',
        'There was a problem saving your survey. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderSmallPlaceholders = () => {
    if (currentImages.length === 0) return null;

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

  // Render the analysis overlay with progress bar
  const renderAnalysisOverlay = () => {
    if (!isAnalyzing && analysisProgress === 0) return null;
    
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
    
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size="large" color="#FF5A00" />
          <ThemedText style={styles.overlayText}>
            Analyzing images...
          </ThemedText>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>
            {analysisProgress}%
          </ThemedText>
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
              <TouchableOpacity 
                style={[
                  styles.backButton,
                  currentQuestionIndex === 0 && styles.disabledButton
                ]} 
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <IconSymbol 
                  name="chevron.left" 
                  size={24} 
                  color={currentQuestionIndex === 0 ? "rgba(255, 255, 255, 0.5)" : "#FFFFFF"} 
                />
              </TouchableOpacity>
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      transform: [{ scale: dotStyles[index].scale }],
                      backgroundColor: dotStyles[index].color
                    }
                  ]}
                />
              ))}
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
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 100,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  header: {
    width: '100%',
    paddingVertical: 20,
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
    height: '50%',
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
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5A00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '80%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backButton: {
    backgroundColor: '#023866',
    width: 'auto',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(2, 56, 102, 0.5)',
  },
  progressDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  answerContainer: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Overlay styles
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF5A00',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
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
    width: '100%',
  },
  feedbackText: {
    color: '#FF5A00',
    marginLeft: 8,
    flex: 1,
  },
});
