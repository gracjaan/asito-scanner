import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { useSurvey } from '@/context/SurveyContext';
import {sendImagesToOpenAIWithBase64} from '@/services/openaiService';
import {SubmitModal} from "@/components/SubmitModal";


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
    setAnswerForQuestion
  } = useSurvey();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex]?.text || '';
  
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

  // simulate AI analysis progress
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const newProgress = prev + 0.1;
          if (newProgress >= 1) {
            clearInterval(interval);
            setIsAnalyzing(false);
            setAnalysisComplete(true);
            return 1;
          }
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

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
      setIsAnalyzing(true);
    }
  };

  const handleNext = async () => {

    markQuestionAsCompleted(questions[currentQuestionIndex].id);

    const currentImages = questions[currentQuestionIndex]?.images || [];

    if (currentImages.length > 0) {

      try {
        await sendImagesToOpenAIWithBase64(currentImages);

      } catch (error) {
        console.error("Error sending images to OpenAI:", error);
      }
    } else {
      console.log("No images found for this question.");
    }

    // Move to the next question
    if (currentQuestionIndex === questions.length - 1) {
      setShowSubmitModal(true);
      return;
    }

    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    navigateToQuestion(nextIndex);
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
      setAnalysisProgress(0);
      setAnalysisComplete(false);
      setIsAnalyzing(false);

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

  const handleSubmit = () => {
    setShowSubmitModal(false);
    router.push('/home/final-report');
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <SubmitModal 
          visible={showSubmitModal}
          onCancel={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />

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
            <ThemedText style={styles.headerText}>{currentQuestion}</ThemedText>
          </View>

          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={currentImages.length === 0 ? takePhoto : undefined}
            disabled={isAnalyzing}
          >
            {currentImages.length > 0 ? (
              <Image source={{ uri: currentImages[0] }} style={styles.image} />
            ) : (
              <IconSymbol name="camera" size={100} color="grey" />
            )}

            {isAnalyzing && (
              <View style={styles.analysisOverlay}>
                <ActivityIndicator size="large" color="#FF5A00" animating={true} />
                <ThemedText style={styles.analysisText}>Analyzing image...</ThemedText>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${analysisProgress * 100}%` }]} />
                </View>
              </View>
            )}
          </TouchableOpacity>

          {renderSmallPlaceholders()}

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
    position: 'relative',
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
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  analysisText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF5A00',
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
});
