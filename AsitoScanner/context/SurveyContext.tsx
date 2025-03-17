import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SurveyQuestion = {
  id: string;
  text: string; // For backward compatibility
  displayText: string; // What to show to the user (e.g., "take a photo of laptop")
  analyticalQuestion: string; // What to send to OpenAI (e.g., "is the laptop clean?")
  images: string[];
  answer?: string;
  completed: boolean;
};

type SurveyContextType = {
  questions: SurveyQuestion[];
  currentQuestionIndex: number;
  userName: string;
  surveyDate: string;
  surveyStatus: string;
  surveyDescription: string;
  
  setQuestions: (questions: SurveyQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addImageToQuestion: (questionId: string, imageUri: string) => void;
  setAnswerForQuestion: (questionId: string, answer: string) => void;
  markQuestionAsCompleted: (questionId: string) => void;
  setUserName: (name: string) => void;
  setSurveyDate: (date: string) => void;
  setSurveyStatus: (status: string) => void;
  setSurveyDescription: (description: string) => void;
};

const SurveyContext = createContext<SurveyContextType>({
  questions: [],
  currentQuestionIndex: 0,
  userName: 'Gracjan Chmielnicki',
  surveyDate: new Date().toLocaleDateString(),
  surveyStatus: 'in progress',
  surveyDescription: '',
  
  setQuestions: () => {},
  setCurrentQuestionIndex: () => {},
  addImageToQuestion: () => {},
  setAnswerForQuestion: () => {},
  markQuestionAsCompleted: () => {},
  setUserName: () => {},
  setSurveyDate: () => {},
  setSurveyStatus: () => {},
  setSurveyDescription: () => {},
});

const sampleQuestions: SurveyQuestion[] = [
  {
    id: '1',
    text: 'take a photo of the laptop', // For backward compatibility
    displayText: 'take a photo of the laptop',
    analyticalQuestion: 'is the laptop macbook?',
    images: [],
    completed: false,
  },
  {
    id: '2',
    text: 'take a photo of the backpack', // For backward compatibility
    displayText: 'take a photo of the backpack',
    analyticalQuestion: 'is the backpack black?',
    images: [],
    completed: false,
  },
  // Building inspection questions (commented out)
  // {
  //   id: '1',
  //   text: 'take a photo of the staircase and main entrance',
  //   images: [],
  //   completed: false,
  // },
  // {
  //   id: '2',
  //   text: 'take a photo of the emergency exit',
  //   images: [],
  //   completed: false,
  // },
  // {
  //   id: '3',
  //   text: 'take a photo of the elevator',
  //   images: [],
  //   completed: false,
  // },
  // {
  //   id: '4',
  //   text: 'take a photo of the hallway',
  //   images: [],
  //   completed: false,
  // },
  // {
  //   id: '5',
  //   text: 'take a photo of the common area',
  //   images: [],
  //   completed: false,
  // },
];

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userName, setUserName] = useState('Gracjan Chmielnicki');
  const [surveyDate, setSurveyDate] = useState(new Date().toLocaleDateString());
  const [surveyStatus, setSurveyStatus] = useState('in progress');
  const [surveyDescription, setSurveyDescription] = useState(
    'Inspection of the building facilities and safety measures.'
  );

  useEffect(() => {
    const allCompleted = questions.every(q => q.completed);
    if (allCompleted && questions.length > 0) {
      setSurveyStatus('completed');
    } else if (questions.some(q => q.completed)) {
      setSurveyStatus('in progress');
    } else {
      setSurveyStatus('not started');
    }
  }, [questions]);

  const addImageToQuestion = (questionId: string, imageUri: string) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, images: [...q.images, imageUri] }
          : q
      )
    );
  };

  const setAnswerForQuestion = (questionId: string, answer: string) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, answer }
          : q
      )
    );
  };

  const markQuestionAsCompleted = (questionId: string) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, completed: true }
          : q
      )
    );
  };

  return (
    <SurveyContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        userName,
        surveyDate,
        surveyStatus,
        surveyDescription,
        setQuestions,
        setCurrentQuestionIndex,
        addImageToQuestion,
        setAnswerForQuestion,
        markQuestionAsCompleted,
        setUserName,
        setSurveyDate,
        setSurveyStatus,
        setSurveyDescription,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

// Custom hook to use the survey context
export const useSurvey = () => useContext(SurveyContext); 