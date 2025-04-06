import { StyleSheet, View, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import { ManualQuestion } from '@/context/SurveyContext';

interface ManualQuestionsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (answers: ManualQuestion[]) => void;
  buildingPart?: string; // Add buildingPart prop
}

export function ManualQuestionsModal({ visible, onCancel, onSubmit, buildingPart = 'Other' }: ManualQuestionsModalProps) {
  // Debug the building part we're seeing
  console.log(`ManualQuestionsModal received buildingPart: "${buildingPart}"`);
  
  // All building-part specific questions
  const allQuestions: ManualQuestion[] = [
    // Entrance
    {
      id: 'entrance-plants-presence',
      question: 'Are there several plants in the entrance area?',
      answer: '',
      required: true,
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      answer: '',
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-plants-real',
      question: 'Are they real?',
      answer: '',
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-plants-height',
      question: 'Are the plants at the entrance on average higher than 1 meter?',
      answer: '',
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-music',
      question: 'Is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-smell',
      question: 'Does it smell pleasant around the entrance area?',
      answer: '',
      buildingPart: 'Entrance',
      options: ['Yes', 'No']
    },
    {
      id: 'entrance-comments',
      question: 'Please explain some notable findings for the entrance area here:',
      answer: '',
      buildingPart: 'Entrance'
    },
    
    // Break/Chill-Out Area
    {
      id: 'break-plants-presence',
      question: 'Are there several plants in the break/chill-out area?',
      answer: '',
      required: true,
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-plants-real',
      question: 'Are they real?',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No', 'Look real, but can\'t tell for sure', 'Look fake & artificial but can\'t tell for sure']
    },
    {
      id: 'break-plants-height',
      question: 'Are the plants at the break/chill-out area on average higher than 1 meter?',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-music',
      question: 'Is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-smell',
      question: 'Does it smell pleasant around the break/chill-out area?',
      answer: '',
      buildingPart: 'Break/Chill-Out Area',
      options: ['Yes', 'No']
    },
    {
      id: 'break-comments',
      question: 'Please explain some notable findings for the break/chill-out area here:',
      answer: '',
      buildingPart: 'Break/Chill-Out Area'
    },
    
    // Corridor/Hall Area
    {
      id: 'corridor-plants-presence',
      question: 'Are there several plants in the Corridor/Hall area?',
      answer: '',
      required: true,
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      answer: '',
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-plants-real',
      question: 'Are they real?',
      answer: '',
      buildingPart: 'Corridor',
      options: ['Yes', 'No', 'Look real, but can\'t tell for sure', 'Look fake & artificial but can\'t tell for sure']
    },
    {
      id: 'corridor-plants-height',
      question: 'Are the plants at the entrance on average higher than 1 meter?',
      answer: '',
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-music',
      question: 'Is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-air-quality',
      question: 'Does the air quality feels pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-smell',
      question: 'Does it smell pleasant around the corridor/hall area?',
      answer: '',
      buildingPart: 'Corridor',
      options: ['Yes', 'No']
    },
    {
      id: 'corridor-comments',
      question: 'Please explain some notable findings for the corridor/hall area here:',
      answer: '',
      buildingPart: 'Corridor'
    },
    
    // Food&Drink
    {
      id: 'food-plants-presence',
      question: 'Are there several plants in the Food&Drink area?',
      answer: '',
      required: true,
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-plants-real',
      question: 'Are they real?',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-plants-height',
      question: 'Are the plants at the Food&Drink area on average higher than 1 meter?',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-music',
      question: 'Is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-smell',
      question: 'Does it smell pleasant around the Food&Drink area?',
      answer: '',
      buildingPart: 'Food&Drink Area',
      options: ['Yes', 'No']
    },
    {
      id: 'food-comments',
      question: 'Please explain some notable findings for the Food&Drink area here:',
      answer: '',
      buildingPart: 'Food&Drink Area'
    },
    
    // Workplaces
    {
      id: 'work-plants-presence',
      question: 'Are there several plants in the workplaces area?',
      answer: '',
      required: true,
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-plants-condition',
      question: 'Are the plants in good condition? (not dead)',
      answer: '',
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-plants-real',
      question: 'Are they real?',
      answer: '',
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-plants-height',
      question: 'Are the plants at the workplaces on average higher than 1 meter?',
      answer: '',
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-music',
      question: 'Is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-smell',
      question: 'Does it smell pleasant around the workplaces?',
      answer: '',
      buildingPart: 'Workplaces',
      options: ['Yes', 'No']
    },
    {
      id: 'work-comments',
      question: 'Please explain some notable findings for the workplaces area here:',
      answer: '',
      buildingPart: 'Workplaces'
    },
    
    // Toilet Area
    {
      id: 'toilet-music',
      question: 'In the toilet area, is music being played in the background?',
      answer: '',
      required: true,
      buildingPart: 'Toilets',
      options: ['Yes', 'No']
    },
    {
      id: 'toilet-air-quality',
      question: 'Does the air quality feel pleasant? (not musty or dusty)?',
      answer: '',
      buildingPart: 'Toilets',
      options: ['Yes', 'No']
    },
    {
      id: 'toilet-smell',
      question: 'Does it smell pleasant around the toilet area?',
      answer: '',
      buildingPart: 'Toilets',
      options: ['Yes', 'No']
    },
    {
      id: 'toilet-fragrance',
      question: 'Is fragrance consciously used? (dispensers, candles, etc.)',
      answer: '',
      buildingPart: 'Toilets',
      options: ['Yes', 'No']
    },
    {
      id: 'toilet-comments',
      question: 'Please explain some notable findings for the toilet area here:',
      answer: '',
      buildingPart: 'Toilets'
    }
  ];

  // Filter questions based on current building part
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);

  // Define a function to normalize building part names
  const normalizeBuildingPart = (part?: string): string => {
    if (!part) return 'Other';
    
    const mappings: Record<string, string> = {
      'Entrance': 'Entrance',
      'Break/Chill-Out Area': 'Break/Chill-Out Area', 
      'Corridor/Hall Area': 'Corridor',
      'Corridor': 'Corridor',
      'Food&Drink': 'Food&Drink Area',
      'Food&Drink Area': 'Food&Drink Area',
      'Workplaces': 'Workplaces',
      'Toilet Area': 'Toilets',
      'Toilets': 'Toilets'
    };
    
    console.log(`Normalizing building part: "${part}" → "${mappings[part] || part}"`);
    return mappings[part] || part;
  };

  useEffect(() => {
    // Normalize the building part name
    const normalizedBuildingPart = normalizeBuildingPart(buildingPart);
    
    // Filter questions based on current building part
    const filteredQuestions = allQuestions.filter(q => {
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
      const availableParts = [...new Set(allQuestions.map(q => q.buildingPart))];
      console.log(`Available building parts in questions: ${JSON.stringify(availableParts)}`);
    }
    
    setQuestions(filteredQuestions);
  }, [buildingPart, visible]);

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
        'Required Questions',
        `Please answer the following required questions before submitting:\n\n${unansweredRequired.join('\n')}`,
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
            <ThemedText style={[
              styles.optionText,
              question.answer === option && styles.selectedOptionText
            ]}>
              {option}
            </ThemedText>
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
          <ThemedText style={styles.modalTitle}>
            {buildingPart} Questions
          </ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            Please answer these questions for the {buildingPart.toLowerCase()}
          </ThemedText>
          
          {questions.length > 0 ? (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {questions.map((item) => (
                <View key={item.id} style={styles.questionContainer}>
                  <ThemedText style={styles.questionText}>
                    {item.question} {item.required && <ThemedText style={styles.requiredIndicator}>*</ThemedText>}
                  </ThemedText>
                  
                  {renderOptionButtons(item)}
                  
                  {/* For free-text questions or when option buttons aren't selected */}
                  {(!item.options || item.id.includes('comments')) && (
                    <TextInput
                      style={[styles.input, item.id.includes('comments') ? styles.commentInput : {}]}
                      value={item.answer}
                      onChangeText={(text) => updateAnswer(item.id, text)}
                      placeholder="Enter your answer"
                      multiline
                      numberOfLines={item.id.includes('comments') ? 4 : 2}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noQuestionsContainer}>
              <ThemedText style={styles.noQuestionsText}>
                No questions available for this building part.
              </ThemedText>
            </View>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelButtonText}>Back</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={questions.length === 0}
            >
              <ThemedText style={styles.submitButtonText}>
                {questions.length > 0 ? "Submit" : "Skip"}
              </ThemedText>
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '90%',
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
    maxHeight: '70%',
  },
  questionContainer: {
    marginBottom: 16,
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
    // marginTop: 16,
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