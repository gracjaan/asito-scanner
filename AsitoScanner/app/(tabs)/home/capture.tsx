import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
  Pressable,
  Text, // Added Text temporarily if needed for debugging
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { LocalizedText } from '@/components/LocalizedText';
import { useSurvey } from '@/context/SurveyContext';
import { useLanguage } from '@/context/LanguageContext';
import { sendImagesToOpenAIWithBase64 } from '@/services/openaiService';
import { SubmitModal } from '@/components/SubmitModal';
import { ManualQuestionsModal } from '@/components/ManualQuestionsModal';
import { saveReport } from '@/services/storageService';
import { ManualQuestion } from '@/context/SurveyContext';

const { width, height } = Dimensions.get('window');

const DOT_COLORS = {
  INACTIVE: '#E0E0E0',
  ACTIVE: '#FF5A00',
  COMPLETED: '#023866'
};

const IMAGE_AREA_HEIGHT = height * 0.35;

// Building parts order - update to match the context source exactly
const BUILDING_PARTS = [
  'Entrance',
  'Break/Chill-Out Area',
  'Corridor/Hall Area',
  'Food&Drink',
  'Workplaces',
  'Toilet Area',
  'Exterior',
  'General Interior',
  'Users',
  'Cleaning Staff'
];

// Define manual-only sections that don't require photo capture
const MANUAL_ONLY_SECTIONS = [
  'Exterior',
  'General Interior',
  'Users',
  'Cleaning Staff'
];

// Define location types
type LocationType = 'Entrance' | 'Break/Chill-Out Area' | 'Corridor/Hall Area' | 'Food&Drink' | 'Workplaces' | 'Toilet Area' | 'Exterior' | 'General Interior' | 'Users' | 'Cleaning Staff';
type BuildingPartType = 'Entrance' | 'Break/Chill-Out Area' | 'Corridor' | 'Food&Drink Area' | 'Workplaces' | 'Toilets' | 'Exterior' | 'General Interior' | 'Users' | 'Cleaning Staff';

// Define a function to normalize location values
const normalizeBuildingPart = (location: string): string => {
  const mappings: Record<string, string> = {
    'Entrance': 'Entrance',
    'Break/Chill-Out Area': 'Break/Chill-Out Area', 
    'Corridor/Hall Area': 'Corridor',
    'Corridor': 'Corridor',
    'Food&Drink': 'Food&Drink Area',
    'Food&Drink Area': 'Food&Drink Area',
    'Workplaces': 'Workplaces',
    'Toilet Area': 'Toilets',
    'Toilets': 'Toilets',
    'Exterior': 'Exterior',
    'General Interior': 'General Interior',
    'Users': 'Users',
    'Cleaning Staff': 'Cleaning Staff'
  };
  
  // Log the mapping process
  console.log(`Normalizing location: "${location}" → "${mappings[location] || location}"`);
  return mappings[location] || location;
};

// Mapping from location name (in questions) to building part name (in manual questions)
const LOCATION_TO_BUILDING_PART: Record<LocationType, BuildingPartType> = {
  'Entrance': 'Entrance',
  'Break/Chill-Out Area': 'Break/Chill-Out Area',
  'Corridor/Hall Area': 'Corridor',
  'Food&Drink': 'Food&Drink Area',
  'Workplaces': 'Workplaces',
  'Toilet Area': 'Toilets',
  'Exterior': 'Exterior',
  'General Interior': 'General Interior',
  'Users': 'Users',
  'Cleaning Staff': 'Cleaning Staff'
};

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
    surveyDescription,
    surveyDateTime,
    setManualQuestions,
    manualQuestions
  } = useSurvey();

  const isManualOnlySection = MANUAL_ONLY_SECTIONS.includes(locationFilterValue);

  const locationQuestions = questions.filter(
      q => q.location?.toLowerCase() === locationFilterValue.toLowerCase()
  );

  const [localQuestionIndex, setLocalQuestionIndex] = useState(0);
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  const [currentManualQuestions, setCurrentManualQuestions] = useState<ManualQuestion[]>([]);
  const [allManualQuestions, setAllManualQuestions] = useState<ManualQuestion[]>([]);

  useEffect(() => {
    setLocalQuestionIndex(0);
  }, [locationFilterValue]);

  useEffect(() => {
    const newLocationQuestions = questions.filter(
        q => q.location?.toLowerCase() === locationFilterValue.toLowerCase(),
    );
    const initialDotStyles = Array(newLocationQuestions.length)
        .fill(0)
        .map((_, i) => ({
          scale: i === 0 ? 1.3 : 1,
          color: i === 0 ? DOT_COLORS.ACTIVE : DOT_COLORS.INACTIVE,
        }));
    setDotStyles(initialDotStyles);
  }, [locationFilterValue, questions]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showManualQuestionsModal, setShowManualQuestionsModal] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  const { language, t } = useLanguage();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = locationQuestions[localQuestionIndex];
  const currentDisplayText = currentQuestion?.displayText || currentQuestion?.text || '';
  const currentSubtext = currentQuestion?.subtext || '';
  const currentAnalyticalQuestion = currentQuestion?.analyticalQuestion || currentQuestion?.text || '';
  const currentImages = currentQuestion?.images || [];
  const currentQuestionId = currentQuestion?.id || '';

  const [dotStyles, setDotStyles] = useState(() =>
      Array(locationQuestions.length)
          .fill(0)
          .map((_, i) => ({
            scale: i === 0 ? 1.3 : 1,
            color: i === 0 ? DOT_COLORS.ACTIVE : DOT_COLORS.INACTIVE
          }))
  );

  // Function to get next building part
  const getNextBuildingPart = () => {
    const currentIndex = BUILDING_PARTS.indexOf(locationFilterValue);
    console.log(`Current location: "${locationFilterValue}", index in BUILDING_PARTS: ${currentIndex}`);
    console.log(`All building parts: ${JSON.stringify(BUILDING_PARTS)}`);
    
    if (currentIndex < BUILDING_PARTS.length - 1) {
      const nextPart = BUILDING_PARTS[currentIndex + 1];
      console.log(`Next building part will be: ${nextPart}`);
      return nextPart;
    }
    console.log("No next building part found - this is the last one");
    return null;
  };

  useEffect(() => {
    if (locationQuestions.length === 0) return;

    slideAnim.setValue(width);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();

    updateDotStyles(localQuestionIndex);

  }, [localQuestionIndex, currentQuestionId]);

  useEffect(() => {
    let progressTimerRef: Animated.CompositeAnimation | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    if (isAnalyzing) {
      progressAnim.setValue(0);
      setAnalysisProgress(0);

      progressTimerRef = Animated.timing(progressAnim, { toValue: 0.9, duration: 6000, useNativeDriver: false });
      progressTimerRef.start();

      intervalId = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 90) return prev + 5;
          if (intervalId) clearInterval(intervalId);
          return prev;
        });
      }, 300);

    } else {
      if (analysisProgress > 0 && analysisProgress < 100) {
        Animated.timing(progressAnim, { toValue: 1, duration: 200, useNativeDriver: false })
            .start(() => setAnalysisProgress(100));
      } else {
        progressAnim.setValue(0);
        setAnalysisProgress(0);
      }
    }

    return () => {
      if (progressTimerRef) progressTimerRef.stop();
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnalyzing, progressAnim]);


  const skipQuestion = () => {
    if (localQuestionIndex === locationQuestions.length - 1) {
      showManualQuestionsForCurrentPart();
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

      return adjustedStyles.map((style, i) => {
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
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        addImageToQuestion(currentQuestionId, result.assets[0].uri);
        setFeedbackMessage(null);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert('Camera Error', 'Could not launch the camera.');
    }
  };

  const deleteImage = (imageIndex: number) => {
    if (isAnalyzing) return;

    Alert.alert(
        'Delete Image', 'Are you sure you want to delete this image?',
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeImageFromQuestion(currentQuestionId, imageIndex) }],
        { cancelable: true }
    );
  };

  const swapImageWithMain = (tappedSmallImageIndexInSlice: number) => {
    if (!currentQuestionId || !currentImages || currentImages.length <= 1 || isAnalyzing) return;
    const actualIndexInFullArray = tappedSmallImageIndexInSlice + 1;
    if (actualIndexInFullArray <= 0 || actualIndexInFullArray >= currentImages.length) return;

    const updatedImages = [...currentImages];
    [updatedImages[0], updatedImages[actualIndexInFullArray]] = [updatedImages[actualIndexInFullArray], updatedImages[0]];
    updateQuestionImages(currentQuestionId, updatedImages);
  };

  const showManualQuestionsForCurrentPart = () => {
    // Get the correct building part name for storage
    const buildingPartForManualQuestions = normalizeBuildingPart(locationFilterValue);
    
    console.log(`Current location filter value: "${locationFilterValue}"`);
    console.log(`Mapped to building part: "${buildingPartForManualQuestions}"`);
    console.log(`Is this a manual-only section: ${isManualOnlySection}`);
    
    // Filter manual questions just for current building part
    const partQuestions = manualQuestions.filter(q => 
      q.buildingPart === buildingPartForManualQuestions
    );
    
    console.log(`Found ${partQuestions.length} manual questions for this part`);
    
    setCurrentManualQuestions(partQuestions);
    setShowManualQuestionsModal(true);
  };

  const handleNext = async () => {
    if (isAnalyzing) return;
    if (currentImages.length === 0) {
      const noImagesTitle = language === 'nl' ? 'Geen Afbeeldingen' : 'No Images';
      const noImagesMessage = language === 'nl' 
        ? 'Neem ten minste één foto voordat je verder gaat.'
        : 'Please take at least one photo before proceeding.';
      Alert.alert(noImagesTitle, noImagesMessage, [{ text: 'OK' }]);
      return;
    }

    setIsAnalyzing(true);
    setFeedbackMessage(null);

    try {
      // Get the translation key for the analytical question
      const analyticalQuestionKey = getAnalyticalQuestionTranslationKey(currentQuestionId);
      
      // Try to get the translated question if available
      let translatedQuestion = currentAnalyticalQuestion;
      if (analyticalQuestionKey) {
        const translatedValue = t(analyticalQuestionKey as any);
        // Only use the translated value if it's not the same as the key (which happens when no translation exists)
        if (translatedValue !== analyticalQuestionKey) {
          translatedQuestion = translatedValue;
        }
      }
      
      const response = await sendImagesToOpenAIWithBase64(currentImages, translatedQuestion, language);
      setIsAnalyzing(false);

      if (response) {
        setAnswerForQuestion(currentQuestionId, response.answer);

        if (response.isComplete) {
          markQuestionAsCompleted(currentQuestionId);
          setFeedbackMessage(null);
          if (localQuestionIndex === locationQuestions.length - 1) {
            showManualQuestionsForCurrentPart();
          } else {
            navigateToQuestion(localQuestionIndex + 1);
          }
        } else {
          // Use a fallback translated message if no suggestedAction is provided
          const fallbackMessage = language === 'nl' 
            ? 'Neem gedetailleerdere foto\'s voor een betere analyse.' 
            : 'Please take more detailed photos.';
          setFeedbackMessage(response.suggestedAction || fallbackMessage);
        }
      } else {
        Alert.alert(t('error'), t('unexpectedError'), [{ text: 'OK' }]);
      }
    } catch (error: any) {
      setIsAnalyzing(false);
      console.error('Error sending images to OpenAI:', error);
      Alert.alert(t('error'), `${t('unexpectedError')} ${error.message || ''}`, [{ text: 'OK' }]);
    }
  };

  const handlePrevious = () => {
    if (localQuestionIndex === 0 || isAnalyzing) return;
    navigateToQuestion(localQuestionIndex - 1);
  };

  const navigateToQuestion = (newIndex: number) => {
    if (newIndex === localQuestionIndex || isAnalyzing) return;

    const isForward = newIndex > localQuestionIndex;
    const startValue = isForward ? width : -width;
    const endValue = isForward ? -width : width;

    Animated.parallel([
      Animated.timing(slideAnim, { toValue: endValue, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start(() => {
      setFeedbackMessage(null);
      setAnalysisProgress(0);
      progressAnim.setValue(0);
      setLocalQuestionIndex(newIndex);
      slideAnim.setValue(startValue);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
    });
  };

  const moveToNextBuildingPart = () => {
    const nextPart = getNextBuildingPart();
    console.log(`moveToNextBuildingPart - Current: ${locationFilterValue}, Next: ${nextPart}`);
    
    if (nextPart) {
      // Add current part to completed parts
      setCompletedParts([...completedParts, locationFilterValue]);
      
      // Navigate to next building part
      console.log(`Navigating to next part: ${nextPart}`);
      router.push(`/home/capture?location=${encodeURIComponent(nextPart)}`);
    } else {
      // All parts are completed, generate final report
      console.log("All parts completed, generating final report");
      generateFinalReport();
    }
  };

  const handleManualQuestionsSubmit = (answers: ManualQuestion[]) => {
    setShowManualQuestionsModal(false);
    
    // Add answers to allManualQuestions
    const updatedAllQuestions = [...allManualQuestions];
    
    // Get the correct building part name for storage
    const buildingPartForManualQuestions = normalizeBuildingPart(locationFilterValue);
    
    // Remove any existing questions for this building part
    const filteredQuestions = updatedAllQuestions.filter(q => 
      q.buildingPart !== buildingPartForManualQuestions
    );
    
    // Add the new answers
    const combinedQuestions = [...filteredQuestions, ...answers];
    
    setAllManualQuestions(combinedQuestions);
    setManualQuestions(combinedQuestions);
    
    // Move to next building part or generate final report
    moveToNextBuildingPart();
  };

  const handleManualQuestionsCancel = () => {
    // For manual-only sections, we need special handling
    if (isManualOnlySection) {
      // If we canceled a manual-only section, we should go back to the previous part
      const currentIndex = BUILDING_PARTS.indexOf(locationFilterValue);
      
      if (currentIndex > 0) {
        // Go back to the previous section
        const previousPart = BUILDING_PARTS[currentIndex - 1];
        console.log(`Manual-only section canceled, returning to previous part: ${previousPart}`);
        router.push(`/home/capture?location=${encodeURIComponent(previousPart)}`);
      } else {
        // If this is the first section (shouldn't happen), just close the modal
        setShowManualQuestionsModal(false);
      }
    } else {
      // For regular sections, just close the modal
      setShowManualQuestionsModal(false);
    }
  };

  const generateFinalReport = async () => {
    try {
      const reportId = `report-${Date.now()}`;
      
      // Include all questions from all building parts
      const allCompletedQuestions = questions
        .filter(q => q.completed)
        .map(q => ({
          id: q.id,
          text: q.text,
          displayText: q.displayText || q.text,
          subtext: q.subtext || "",
          analyticalQuestion: q.analyticalQuestion || q.text,
          answer: q.answer || '',
          images: q.images || [],
          completed: q.completed || false,
          location: q.location || ''
        }));

      await saveReport({
        id: reportId,
        scope: 'Building Inspection',
        date: surveyDate,
        dateTime: surveyDateTime,
        status: 'completed',
        userName,
        description: surveyDescription,
        questions: allCompletedQuestions,
        manualQuestions: allManualQuestions
      });

      console.log('Complete building survey saved successfully');
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
              <TouchableOpacity key={`small-img-${index}`} onPress={() => swapImageWithMain(index)} disabled={isAnalyzing}>
                <View style={styles.smallImageContainer}>
                  <Image source={{ uri: img }} style={styles.smallImage} />
                  <TouchableOpacity style={styles.deleteImageButton} onPress={(e) => { e.stopPropagation(); deleteImage(index + 1); }} disabled={isAnalyzing}>
                    <IconSymbol name="xmark.circle.fill" size={24} color="#FF5A00" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
          ))}
          {canAddMore && (
              <TouchableOpacity key="placeholder-add" style={[styles.smallImageContainer, styles.addPlaceholder]} onPress={takePhoto} disabled={isAnalyzing}>
                <IconSymbol name="camera" size={30} color="grey" />
              </TouchableOpacity>
          )}
          {Array.from({ length: Math.max(0, 4 - smallImagesToDisplay.length - (canAddMore ? 1 : 0)) }).map((_, emptyIndex) => (
              <View key={`empty-placeholder-${emptyIndex}`} style={[styles.smallImageContainer, styles.emptyPlaceholder]} />
          ))}
        </View>
    );
  };

  const renderAnalysisOverlay = () => {
    if (!isAnalyzing) return null;
    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'], extrapolate: 'clamp' });

    return (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color="#FF5A00" />
            <LocalizedText style={styles.overlayText} textKey="analyzingImages" fallback="Analyzing images..." />
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <ThemedText style={styles.progressText}>{Math.round(analysisProgress)}%</ThemedText>
          </View>
        </View>
    );
  };

  const renderInfoModal = () => (
      <Modal
          animationType="fade"
          transparent={true}
          visible={isInfoModalVisible}
          onRequestClose={() => setIsInfoModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsInfoModalVisible(false)}>
          <Pressable style={styles.modalContentContainer} onPress={(e) => e.stopPropagation()}>
            <ScrollView contentContainerStyle={styles.modalScrollView}>
              <View style={styles.modalHeader}>
                <LocalizedText style={styles.modalTitle} textKey="photoTakingTips" fallback="Photo Taking Tips" />
                <TouchableOpacity onPress={() => setIsInfoModalVisible(false)} style={styles.modalCloseButtonIcon}>
                  <IconSymbol name="xmark.circle.fill" size={28} color="#666" />
                </TouchableOpacity>
              </View>
              <LocalizedText style={styles.modalTextIntro} textKey="photoTipsIntro" fallback="To help the AI analyze the images effectively, please follow these tips:">
              </LocalizedText>
              <View style={styles.tipItem}>
                <IconSymbol name="lightbulb.fill" size={18} color="#FF5A00" style={styles.tipIcon}/>
                <LocalizedText style={styles.modalText}>
                  <LocalizedText textKey="photoTipLightingLabel" style={styles.boldText} useThemedText={false} />
                  {' '}
                  <LocalizedText textKey="photoTipLighting" useThemedText={false} />
                </LocalizedText>
              </View>
              <View style={styles.tipItem}>
                <IconSymbol name="camera.metering.center.weighted" size={18} color="#FF5A00" style={styles.tipIcon}/>
                <LocalizedText style={styles.modalText}>
                  <LocalizedText textKey="photoTipFocusLabel" style={styles.boldText} useThemedText={false} />
                  {' '}
                  <LocalizedText textKey="photoTipFocus" useThemedText={false} />
                </LocalizedText>
              </View>
              <View style={styles.tipItem}>
                <IconSymbol name="arrow.up.left.and.down.right.magnifyingglass" size={18} color="#FF5A00" style={styles.tipIcon}/>
                <LocalizedText style={styles.modalText}>
                  <LocalizedText textKey="photoTipFramingLabel" style={styles.boldText} useThemedText={false} />
                  {' '}
                  <LocalizedText textKey="photoTipFraming" useThemedText={false} />
                </LocalizedText>
              </View>
              <View style={styles.tipItem}>
                <IconSymbol name="rectangle.stack" size={18} color="#FF5A00" style={styles.tipIcon}/>
                <LocalizedText style={styles.modalText}>
                  <LocalizedText textKey="photoTipAnglesLabel" style={styles.boldText} useThemedText={false} />
                  {' '}
                  <LocalizedText textKey="photoTipAngles" useThemedText={false} />
                </LocalizedText>
              </View>
              <View style={styles.tipItem}>
                <IconSymbol name="photo.on.rectangle" size={18} color="#FF5A00" style={styles.tipIcon}/>
                <LocalizedText style={styles.modalText}>
                  <LocalizedText textKey="photoTipMainImageLabel" style={styles.boldText} useThemedText={false} />
                  {' '}
                  <LocalizedText textKey="photoTipMainImage" useThemedText={false} />
                </LocalizedText>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsInfoModalVisible(false)}>
                <LocalizedText style={styles.modalCloseButtonText} textKey="gotIt" fallback="Got it!" />
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
  );

  // Helper function to get translation key for question text based on question ID
  const getTranslationKeyForQuestion = (questionId: string): string | undefined => {
    if (!questionId) return undefined;
    
    // Remove the location prefix (e.g., "entrance-" from "entrance-doors")
    const parts = questionId.split('-');
    if (parts.length < 2) return undefined;
    
    // Convert to camelCase for translation keys
    const location = parts[0];
    const questionType = parts.slice(1).join('-');
    
    // Special cases for specific question types
    if (questionType === 'as-a-whole') {
      return `${location}AsAWholeText`;
    }
    
    if (location === 'toilet' && questionType === 'supplies-harmony') {
      return 'toiletSuppliesHarmonyText';
    }
    
    return `${location}${questionType.charAt(0).toUpperCase() + questionType.slice(1)}`;
  };
  
  // Helper function to get translation key for question subtext
  const getSubtextTranslationKey = (questionId: string): string | undefined => {
    const parts = questionId.split('-');
    if (parts.length < 2) return undefined;
    
    const location = parts[0];
    const questionType = parts.slice(1).join('-');
    
    // Special cases for specific question types
    if (questionType === 'as-a-whole') {
      return `${location}AsAWholeSubtext`;
    }
    
    if (location === 'toilet' && questionType === 'supplies-harmony') {
      return 'toiletSuppliesHarmonySubtext';
    }
    
    const textKey = getTranslationKeyForQuestion(questionId);
    return textKey ? `${textKey}Subtext` : undefined;
  };
  
  // Helper function to get translation key for analytical questions
  const getAnalyticalQuestionTranslationKey = (questionId: string): string | undefined => {
    if (!questionId) return undefined;
    
    // Remove the location prefix (e.g., "entrance-" from "entrance-doors")
    const parts = questionId.split('-');
    if (parts.length < 2) return undefined;
    
    // Convert to camelCase for translation keys
    const location = parts[0];
    const questionType = parts.slice(1).join('-');
    
    // Special cases for specific question types
    if (questionType === 'as-a-whole') {
      return `${location}AsAWholeAnalytical`;
    }
    
    if (location === 'toilet' && questionType === 'supplies-harmony') {
      return 'toiletSuppliesHarmonyAnalytical';
    }
    
    const baseKey = getTranslationKeyForQuestion(questionId);
    return baseKey ? `${baseKey}Analytical` : undefined;
  };
  
  useEffect(() => {
    // If this is a manual-only section, directly show the manual questions
    if (isManualOnlySection) {
      showManualQuestionsForCurrentPart();
    } else if (locationQuestions.length === 0) {
      // If there are no questions for this section, automatically move to the next one
      console.log(`No questions found for ${locationFilterValue}, skipping to next section`);
      moveToNextBuildingPart();
    }
  }, [locationFilterValue, isManualOnlySection, locationQuestions.length]);

  return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.container}>

          {/* Skip Icon Button */}
          <TouchableOpacity
              style={styles.skipIconButton}
              onPress={skipQuestion}
              disabled={isAnalyzing || isManualOnlySection}
          >
            <IconSymbol name="forward.fill" size={28} color={(isAnalyzing || isManualOnlySection) ? '#ccc' : '#666'} />
          </TouchableOpacity>

          {/* Info Button */}
          <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setIsInfoModalVisible(true)}
              disabled={isAnalyzing || isManualOnlySection}
          >
            <IconSymbol name="info.circle" size={28} color={(isAnalyzing || isManualOnlySection) ? '#ccc' : '#023866'} />
          </TouchableOpacity>

          <SubmitModal 
            visible={showSubmitModal} 
            onCancel={() => setShowSubmitModal(false)} 
            onSubmit={() => showManualQuestionsForCurrentPart()}
            onContinueToManualQuestions={() => showManualQuestionsForCurrentPart()} 
          />
          
          <ManualQuestionsModal
            visible={showManualQuestionsModal}
            onCancel={handleManualQuestionsCancel}
            onSubmit={handleManualQuestionsSubmit}
            buildingPart={locationFilterValue}
          />
          
          {renderInfoModal()}
          {renderAnalysisOverlay()}

          <Animated.View
              style={[ styles.contentContainer, { transform: [{ translateX: slideAnim }], opacity: fadeAnim } ]}
          >
            {isManualOnlySection ? (
              <View style={styles.manualOnlySectionContainer}>
                <View style={styles.buildingPartHeader}>
                  <LocalizedText 
                    style={styles.buildingPartTitle} 
                    textKey={locationFilterValue.toLowerCase().replace(/\//g, '').replace(/ /g, '') as any}
                    fallback={locationFilterValue}
                  />
                </View>
                <View style={styles.manualOnlyContent}>
                  <IconSymbol name="clipboard.fill" size={80} color="#023866" />
                  <LocalizedText 
                    style={styles.manualOnlyText} 
                    textKey="manualQuestionsOnly"
                    fallback="This section contains only manual questions."
                  />
                  <LocalizedText 
                    style={styles.manualOnlySubtext} 
                    textKey="manualQuestionsLoading"
                    fallback="Manual questions are loading..."
                  />
                </View>
              </View>
            ) : locationQuestions.length > 0 ? (
                <>
                  <View style={styles.buildingPartHeader}>
                    <LocalizedText 
                      style={styles.buildingPartTitle} 
                      textKey={locationFilterValue.toLowerCase().replace(/\//g, '').replace(/ /g, '') as any}
                      fallback={locationFilterValue}
                    />
                  </View>
                  
                  <View style={styles.mainContent}>
                    <View style={styles.header}>
                      <LocalizedText 
                        style={styles.headerText} 
                        textKey={getTranslationKeyForQuestion(currentQuestionId) as any}
                        fallback={currentDisplayText}
                      />
                      {currentSubtext ? (
                          <View style={styles.subtextContainer}>
                            <LocalizedText 
                              style={styles.subtextText} 
                              textKey={getSubtextTranslationKey(currentQuestionId) as any}
                              fallback={currentSubtext}
                            />
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
                          <IconSymbol name="exclamationmark.triangle" size={24} color="#FF5A00" style={styles.feedbackIcon} />
                          <ThemedText style={styles.feedbackText}>{feedbackMessage}</ThemedText>
                          <TouchableOpacity style={styles.closeFeedbackButton} onPress={() => setFeedbackMessage(null)}>
                            <IconSymbol name="xmark.circle.fill" size={24} color="#FF5A00" />
                          </TouchableOpacity>
                        </View>
                    )}
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressDotsContainer}>
                      <TouchableOpacity
                          style={[ styles.navButton, localQuestionIndex === 0 && styles.disabledButton ]}
                          onPress={handlePrevious}
                          disabled={localQuestionIndex === 0 || isAnalyzing}
                      >
                        <IconSymbol name="chevron.left" size={24} color={ localQuestionIndex === 0 || isAnalyzing ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF' } />
                      </TouchableOpacity>

                      {locationQuestions.map((_, index) => (
                          <Animated.View
                              key={index}
                              style={[ styles.progressDot, { transform: [{ scale: dotStyles[index]?.scale || 1 }], backgroundColor: dotStyles[index]?.color || DOT_COLORS.INACTIVE } ]}
                          />
                      ))}

                      <TouchableOpacity
                          style={[ styles.navButton, isAnalyzing && styles.disabledButton ]}
                          onPress={handleNext}
                          disabled={isAnalyzing}
                      >
                        <IconSymbol name="chevron.right" size={24} color={ isAnalyzing ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF' } />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
            ) : (
                <View style={styles.noQuestionsContainer}>
                  <LocalizedText style={styles.noQuestionsText} textKey="noQuestionsAvailable" fallback="No questions available for this location." />
                </View>
            )}
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
  skipIconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center', // Adjusted from flex-start potentially
    paddingTop: 15, // Added padding to push content below header/icons
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10, // Reduced margin below header text
  },
  headerText: {
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    color: '#333',
  },
  subtextContainer: {
    marginTop: 1,
    paddingHorizontal: 10,
  },
  subtextText: {
    marginTop: 4, // Keep or adjust spacing below main header text
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  imageRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: IMAGE_AREA_HEIGHT,
    marginTop: 10, // Reduced margin above images
    marginBottom: 5, // Reduced margin below images
    gap: 16,
  },
  imagePlaceholder: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  mainImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  smallPlaceholdersContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: 90,
  },
  smallImageContainer: {
    width: 80,
    height: 70,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  addPlaceholder: {
    borderColor: '#FF5A00',
  },
  emptyPlaceholder: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  smallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF5A00',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 40,
    marginTop: 10,
    width: '100%',
    position: 'relative',
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackText: {
    color: '#B74100',
    flex: 1,
    fontSize: 14,
  },
  closeFeedbackButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  progressContainer: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
  },
  progressDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  navButton: {
    backgroundColor: '#023866',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(2, 56, 102, 0.4)',
  },
  disabledButtonText: { // Still needed if you use text on disabled skip button? No, using icon now. Can be removed if not used elsewhere.
    color: '#999',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 6,
  },
  progressText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingTop: 5,
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollView: {
    paddingBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#023866',
    flex: 1,
    marginRight: 10,
  },
  modalCloseButtonIcon: {
    padding: 5,
  },
  modalTextIntro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 5,
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  boldText: {
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 25,
    backgroundColor: '#023866',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noQuestionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buildingPartHeader: {
    width: '100%',
    paddingVertical: 8,
    marginBottom: 10,
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: '#FF5A00',
  },
  buildingPartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#023866',
  },
  manualOnlySectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  manualOnlyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  manualOnlyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  manualOnlySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});