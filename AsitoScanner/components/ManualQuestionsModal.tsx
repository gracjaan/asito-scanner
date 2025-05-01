import { StyleSheet, View, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import { ManualQuestion } from '@/context/SurveyContext';
import { LocalizedText } from '@/components/LocalizedText';
import { useLanguage } from '@/context/LanguageContext';

interface ManualQuestionsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (answers: ManualQuestion[]) => void;
  buildingPart?: string; // Add buildingPart prop
}

// Enhanced ManualQuestion type for internal use in this component
interface EnhancedManualQuestion extends ManualQuestion {
  translationKey?: string;
  areaName?: string;
}

export function ManualQuestionsModal({ visible, onCancel, onSubmit, buildingPart = 'Other' }: ManualQuestionsModalProps) {
  const { t, language } = useLanguage();
  
  // Debug the building part we're seeing
  console.log(`ManualQuestionsModal received buildingPart: "${buildingPart}"`);

  // Helper function to get translated question text
  const getLocalizedQuestion = (q: EnhancedManualQuestion): string => {
    // If no translationKey is specified, return the original question
    if (!q.translationKey) return q.question;
    
    try {
      // If the question has an area specified, replace the {area} placeholder
      if (q.areaName) {
        return t(q.translationKey as any).replace('{area}', q.areaName.toLowerCase());
      }
      // Otherwise just use the translation key
      return t(q.translationKey as any);
    } catch (error) {
      console.error(`Error translating question with key: ${q.translationKey}`, error);
      return q.question; // Fallback to original question if translation fails
    }
  };

  // Get translated yes/no values
  const YES = t('yes' as any);
  const NO = t('no' as any);
  
  // All building-part specific questions
  const baseQuestions: EnhancedManualQuestion[] = [
    // Entrance
    {
      id: 'entrance-plants-presence',
      question: 'Are there several plants in the entrance area?',
      translationKey: 'plantsPresence',
      areaName: 'entrance',
      answer: '',
      required: true,
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      translationKey: 'plantsCondition',
      answer: '',
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-plants-real',
      question: 'Are they real?',
      translationKey: 'plantsReal',
      answer: '',
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-plants-height',
      question: 'Are the plants at the entrance on average higher than 1 meter?',
      translationKey: 'plantsHeight',
      areaName: 'entrance',
      answer: '',
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-music',
      question: 'Is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-smell',
      question: 'Does it smell pleasant around the entrance area?',
      translationKey: 'smell',
      areaName: 'entrance',
      answer: '',
      buildingPart: 'Entrance',
      options: [YES, NO]
    },
    {
      id: 'entrance-comments',
      question: 'Please explain some notable findings for the entrance area here:',
      translationKey: 'notableFindings',
      areaName: 'entrance',
      answer: '',
      buildingPart: 'Entrance'
    },
    
    // Break/Chill-Out Area
    {
      id: 'break-plants-presence',
      question: 'Are there several plants in the break/chill-out area?',
      translationKey: 'plantsPresence',
      areaName: 'break/chill-out area',
      answer: '',
      required: true,
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      translationKey: 'plantsCondition',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-plants-real',
      question: 'Are they real?',
      translationKey: 'plantsReal',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO, t('lookReal' as any), t('lookFake' as any)]
    },
    {
      id: 'break-plants-height',
      question: 'Are the plants at the break/chill-out area on average higher than 1 meter?',
      translationKey: 'plantsHeight',
      areaName: 'break/chill-out area',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-music',
      question: 'Is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-smell',
      question: 'Does it smell pleasant around the break/chill-out area?',
      translationKey: 'smell',
      areaName: 'break/chill-out area',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: [YES, NO]
    },
    {
      id: 'break-comments',
      question: 'Please explain some notable findings for the break/chill-out area here:',
      translationKey: 'notableFindings',
      areaName: 'break/chill-out area',
      answer: '',
      buildingPart: 'Break/Chill-Out Area'
    },
    
    // Corridor/Hall Area
    {
      id: 'corridor-plants-presence',
      question: 'Are there several plants in the Corridor/Hall area?',
      translationKey: 'plantsPresence',
      areaName: 'corridor/hall area',
      answer: '',
      required: true,
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      translationKey: 'plantsCondition',
      answer: '',
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-plants-real',
      question: 'Are they real?',
      translationKey: 'plantsReal',
      answer: '',
      buildingPart: 'Corridor',
      options: [YES, NO, t('lookReal' as any), t('lookFake' as any)]
    },
    {
      id: 'corridor-plants-height',
      question: 'Are the plants at the entrance on average higher than 1 meter?',
      translationKey: 'plantsHeight',
      areaName: 'corridor/hall area',
      answer: '',
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-music',
      question: 'Is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-air-quality',
      question: 'Does the air quality feels pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-smell',
      question: 'Does it smell pleasant around the corridor/hall area?',
      translationKey: 'smell',
      areaName: 'corridor/hall area',
      answer: '',
      buildingPart: 'Corridor',
      options: [YES, NO]
    },
    {
      id: 'corridor-comments',
      question: 'Please explain some notable findings for the corridor/hall area here:',
      translationKey: 'notableFindings',
      areaName: 'corridor/hall area',
      answer: '',
      buildingPart: 'Corridor'
    },
    
    // Food&Drink
    {
      id: 'food-plants-presence',
      question: 'Are there several plants in the Food&Drink area?',
      translationKey: 'plantsPresence',
      areaName: 'food&drink area',
      answer: '',
      required: true,
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      translationKey: 'plantsCondition',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-plants-real',
      question: 'Are they real?',
      translationKey: 'plantsReal',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-plants-height',
      question: 'Are the plants at the Food&Drink area on average higher than 1 meter?',
      translationKey: 'plantsHeight',
      areaName: 'food&drink area',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-music',
      question: 'Is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-smell',
      question: 'Does it smell pleasant around the Food&Drink area?',
      translationKey: 'smell',
      areaName: 'food&drink area',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: [YES, NO]
    },
    {
      id: 'food-comments',
      question: 'Please explain some notable findings for the Food&Drink area here:',
      translationKey: 'notableFindings',
      areaName: 'food&drink area',
      answer: '',
      buildingPart: 'Food&Drink Area'
    },
    
    // Workplaces
    {
      id: 'work-plants-presence',
      question: 'Are there several plants in the workplaces area?',
      translationKey: 'plantsPresence',
      areaName: 'workplaces',
      answer: '',
      required: true,
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      translationKey: 'plantsCondition',
      answer: '',
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-plants-real',
      question: 'Are they real?',
      translationKey: 'plantsReal',
      answer: '',
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-plants-height',
      question: 'Are the plants at the workplaces on average higher than 1 meter?',
      translationKey: 'plantsHeight',
      areaName: 'workplaces',
      answer: '',
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-music',
      question: 'Is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-smell',
      question: 'Does it smell pleasant around the workplaces?',
      translationKey: 'smell',
      areaName: 'workplaces',
      answer: '',
      buildingPart: 'Workplaces',
      options: [YES, NO]
    },
    {
      id: 'work-comments',
      question: 'Please explain some notable findings for the workplaces area here:',
      translationKey: 'notableFindings',
      areaName: 'workplaces',
      answer: '',
      buildingPart: 'Workplaces'
    },
    
    // Toilet Area
    {
      id: 'toilet-music',
      question: 'In the toilet area, is music being played in the background?',
      translationKey: 'music',
      answer: '',
      required: true,
      buildingPart: 'Toilets',
      options: [YES, NO]
    },
    {
      id: 'toilet-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      translationKey: 'airQuality',
      answer: '',
      buildingPart: 'Toilets',
      options: [YES, NO]
    },
    {
      id: 'toilet-smell',
      question: 'Does it smell pleasant around the toilet area?',
      translationKey: 'smell',
      areaName: 'toilet area',
      answer: '',
      buildingPart: 'Toilets',
      options: [YES, NO]
    },
    {
      id: 'toilet-fragrance',
      question: 'Is fragrance consciously used? (dispensers, candles, etc.)',
      translationKey: 'toiletFragrance',
      answer: '',
      buildingPart: 'Toilets',
      options: [YES, NO]
    },
    {
      id: 'toilet-comments',
      question: 'Please explain some notable findings for the toilet area here:',
      translationKey: 'notableFindings',
      areaName: 'toilet area',
      answer: '',
      buildingPart: 'Toilets'
    },

    // Exterior
    {
      id: 'exterior-entrance-visibility',
      question: 'Is the entrance clearly visible from outside?',
      translationKey: 'exteriorEntranceVisibility',
      answer: '',
      required: true,
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-signage',
      question: 'Is there clear signage directing visitors to the entrance?',
      translationKey: 'exteriorSignage',
      answer: '',
      required: true,
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-lighting',
      question: 'Is the exterior of the building well-lit?',
      translationKey: 'exteriorLighting',
      answer: '',
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-cleanliness',
      question: 'Is the exterior of the building clean and well-maintained?',
      translationKey: 'exteriorCleanliness',
      answer: '',
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-accessibility',
      question: 'Is the building accessible for people with disabilities?',
      translationKey: 'exteriorAccessibility',
      answer: '',
      required: true,
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-greenery',
      question: 'Is there greenery or landscaping around the building?',
      translationKey: 'exteriorGreenery',
      answer: '',
      buildingPart: 'Exterior',
      options: [YES, NO]
    },
    {
      id: 'exterior-comments',
      question: 'Please note any additional observations about the exterior:',
      translationKey: 'exteriorComments',
      answer: '',
      buildingPart: 'Exterior'
    },

    // General Interior
    {
      id: 'general-light-quality',
      question: 'How would you rate the overall lighting quality in the building?',
      translationKey: 'generalLightQuality',
      answer: '',
      required: true,
      buildingPart: 'General Interior',
      options: [t('excellent' as any), t('good' as any), t('average' as any), t('poor' as any)]
    },
    {
      id: 'general-temperature',
      question: 'Is the temperature comfortable throughout the building?',
      translationKey: 'generalTemperature',
      answer: '',
      required: true,
      buildingPart: 'General Interior',
      options: [YES, NO, t('tooHot' as any), t('tooCold' as any)]
    },
    {
      id: 'general-noise-level',
      question: 'How would you describe the noise level in the building?',
      translationKey: 'generalNoiseLevel',
      answer: '',
      buildingPart: 'General Interior',
      options: [t('veryQuiet' as any), t('comfortable' as any), t('somewhatNoisy' as any), t('tooNoisy' as any)]
    },
    {
      id: 'general-cleanliness',
      question: 'Rate the overall cleanliness of the interior spaces:',
      translationKey: 'generalCleanliness',
      answer: '',
      required: true,
      buildingPart: 'General Interior',
      options: [t('excellent' as any), t('good' as any), t('average' as any), t('poor' as any)]
    },
    {
      id: 'general-safety',
      question: 'Are safety features clearly marked (fire exits, extinguishers, etc.)?',
      translationKey: 'generalSafety',
      answer: '',
      buildingPart: 'General Interior',
      options: [YES, NO]
    },
    {
      id: 'general-comments',
      question: 'Please provide additional comments about the general interior:',
      translationKey: 'generalComments',
      answer: '',
      buildingPart: 'General Interior'
    },

    // Users
    {
      id: 'users-satisfaction',
      question: 'Based on interactions or observations, how satisfied do users seem with the building?',
      translationKey: 'usersSatisfaction',
      answer: '',
      required: true,
      buildingPart: 'Users',
      options: [t('verySatisfied' as any), t('satisfied' as any), t('neutral' as any), t('dissatisfied' as any)]
    },
    {
      id: 'users-flow',
      question: 'Do users appear to navigate the building easily without confusion?',
      translationKey: 'usersFlow',
      answer: '',
      required: true,
      buildingPart: 'Users',
      options: [YES, NO]
    },
    {
      id: 'users-space-usage',
      question: 'Are all areas of the building being effectively used by occupants?',
      translationKey: 'usersSpaceUsage',
      answer: '',
      buildingPart: 'Users',
      options: [YES, NO, t('someAreasUnderutilized' as any)]
    },
    {
      id: 'users-interaction',
      question: 'Do you observe positive interactions between users in communal spaces?',
      translationKey: 'usersInteraction',
      answer: '',
      buildingPart: 'Users',
      options: [YES, NO, t('limitedInteraction' as any)]
    },
    {
      id: 'users-amenities',
      question: 'Do users appear to have all necessary amenities for their activities?',
      translationKey: 'usersAmenities',
      answer: '',
      buildingPart: 'Users',
      options: [YES, NO]
    },
    {
      id: 'users-comments',
      question: 'Please note any other observations about building users:',
      translationKey: 'usersComments',
      answer: '',
      buildingPart: 'Users'
    },

    // Cleaning Staff
    {
      id: 'cleaning-visible',
      question: 'Is cleaning staff visible during your inspection?',
      translationKey: 'cleaningVisible',
      answer: '',
      required: true,
      buildingPart: 'Cleaning Staff',
      options: [YES, NO]
    },
    {
      id: 'cleaning-equipment',
      question: 'Is cleaning equipment stored neatly and out of the way?',
      translationKey: 'cleaningEquipment',
      answer: '',
      buildingPart: 'Cleaning Staff',
      options: [YES, NO, t('notVisible' as any)]
    },
    {
      id: 'cleaning-schedule',
      question: 'Is there a visible cleaning schedule posted anywhere?',
      translationKey: 'cleaningSchedule',
      answer: '',
      buildingPart: 'Cleaning Staff',
      options: [YES, NO]
    },
    {
      id: 'cleaning-supplies',
      question: 'Are cleaning supplies well-stocked in appropriate areas (bathrooms, etc.)?',
      translationKey: 'cleaningSupplies',
      answer: '',
      required: true,
      buildingPart: 'Cleaning Staff',
      options: [YES, NO]
    },
    {
      id: 'cleaning-effectiveness',
      question: 'Based on building cleanliness, how effective does the cleaning service appear to be?',
      translationKey: 'cleaningEffectiveness',
      answer: '',
      buildingPart: 'Cleaning Staff',
      options: [t('excellent' as any), t('good' as any), t('average' as any), t('poor' as any)]
    },
    {
      id: 'cleaning-comments',
      question: 'Additional observations about cleaning staff or maintenance:',
      translationKey: 'cleaningComments',
      answer: '',
      buildingPart: 'Cleaning Staff'
    }
  ];

  // Process questions to include translated question text
  const processedQuestions: ManualQuestion[] = baseQuestions.map(q => {
    // Create a copy of the question with the translated question text
    const processedQuestion: ManualQuestion = {
      ...q,
      question: getLocalizedQuestion(q)
    };
    
    // Remove our custom fields that aren't part of the ManualQuestion type
    const finalQuestion = processedQuestion as any;
    delete finalQuestion.translationKey;
    delete finalQuestion.areaName;
    
    return finalQuestion as ManualQuestion;
  });

  // Filter questions based on current building part
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);

  // Define a function to normalize building part names
  const normalizeBuildingPart = (part?: string): string => {
    if (!part) return t('other');
    
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
    
    console.log(`Normalizing building part: "${part}" → "${mappings[part] || part}"`);
    return mappings[part] || part;
  };

  useEffect(() => {
    // Normalize the building part name
    const normalizedBuildingPart = normalizeBuildingPart(buildingPart);
    
    // Filter questions based on current building part
    const filteredQuestions = processedQuestions.filter(q => {
      const questionNormalizedPart = normalizeBuildingPart(q.buildingPart);
      const isMatch = questionNormalizedPart === normalizedBuildingPart;
      
      // Enhanced debugging for each question
      if (isMatch) {
        console.log(`MATCH: Question: "${q.question.substring(0, 30)}...", Part: "${q.buildingPart}", Normalized: "${questionNormalizedPart}"`);
      }
      
      return isMatch;
    });
    
    console.log(`Filtering for building part: "${buildingPart}" (normalized: "${normalizedBuildingPart}")`);
    console.log(`Found ${filteredQuestions.length} matching questions`);
    
    if (filteredQuestions.length === 0) {
      console.warn(`No manual questions found for building part: "${buildingPart}" (normalized: "${normalizedBuildingPart}")`);
      
      // Debug all available building parts in the questions
      const availableParts = [...new Set(processedQuestions.map(q => q.buildingPart))];
      console.log(`Available building parts in questions: ${JSON.stringify(availableParts)}`);
    }
    
    setQuestions(filteredQuestions);
  }, [buildingPart, visible, language]); // Added language as a dependency to re-translate when language changes

  // Update answer for a specific question
  const updateAnswer = (id: string, answer: string) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, answer } : q))
    );
  };

  // Handle submit with validation
  const handleSubmit = () => {
    // Check if required questions are answered
    const unansweredRequired = questions
      .filter(q => q.required)
      .filter(q => q.answer.trim() === '')
      .map(q => q.question);
    
    if (unansweredRequired.length > 0) {
      Alert.alert(
        t('requiredQuestions' as any),
        `${t('pleaseAnswerRequired' as any)}\n\n${unansweredRequired.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    onSubmit(questions);
  };

  // Render option buttons for questions with predefined options
  const renderOptionButtons = (question: ManualQuestion) => {
    if (!question.options) return null;
    
    return (
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={`${question.id}-option-${index}`}
            style={[
              styles.optionButton,
              question.answer === option && styles.selectedOptionButton
            ]}
            onPress={() => updateAnswer(question.id, option)}
          >
            <LocalizedText style={[
              styles.optionText,
              question.answer === option && styles.selectedOptionText
            ]}>
              {option}
            </LocalizedText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LocalizedText style={styles.modalTitle}>
            {buildingPart} {t('questions' as any)}
          </LocalizedText>
          <LocalizedText style={styles.modalSubtitle}>
            {t('pleaseAnswerQuestions' as any)} {buildingPart.toLowerCase()}
          </LocalizedText>
          
          {questions.length > 0 ? (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {questions.map((item) => (
                <View key={item.id} style={styles.questionContainer}>
                  <LocalizedText style={styles.questionText}>
                    {item.question} {item.required && <LocalizedText style={styles.requiredIndicator}>*</LocalizedText>}
                  </LocalizedText>
                  
                  {renderOptionButtons(item)}
                  
                  {/* For free-text questions or when option buttons aren't selected */}
                  {(!item.options || item.id.includes('comments')) && (
                    <TextInput
                      style={[styles.input, item.id.includes('comments') ? styles.commentInput : {}]}
                      value={item.answer}
                      onChangeText={(text) => updateAnswer(item.id, text)}
                      placeholder={t('enterYourAnswer' as any)}
                      multiline
                      numberOfLines={item.id.includes('comments') ? 4 : 2}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noQuestionsContainer}>
              <LocalizedText style={styles.noQuestionsText} textKey="noQuestionsAvailable" />
            </View>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <LocalizedText style={styles.cancelButtonText} textKey="back" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={questions.length === 0}
            >
              <LocalizedText style={styles.submitButtonText}>
                {questions.length > 0 ? t('submit' as any) : t('skip' as any)}
              </LocalizedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#023866',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  scrollView: {
    width: '100%',
    // maxHeight: '70%',
  },
  questionContainer: {
    // marginBottom: 16,
    width: '100%',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  requiredIndicator: {
    color: '#FF5A00',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOptionButton: {
    backgroundColor: '#FF5A00',
    borderColor: '#FF5A00',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  commentInput: {
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FF5A00',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionsText: {
    color: '#666',
    fontSize: 16,
  },
}); 