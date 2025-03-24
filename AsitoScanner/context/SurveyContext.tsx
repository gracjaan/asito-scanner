import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SurveyQuestion = {
  id: string;
  location?: string;
  text: string; // What to show on the screen (e.g., "Door")
  displayText: string; // Same as text for now
  analyticalQuestion: string; // The prompt to send to ChatGPT
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

// Define a type for location prompts
type LocationPrompt = {
  location: string;
  questions: {
    id: string;
    text: string;
    analyticalQuestion: string;
  }[];
};

// Note: Exterior is ignored as per instructions.
const sampleLocationPrompts: LocationPrompt[] = [
  {
    location: "Entrance",
    questions: [
      {
        id: "entrance-door",
        text: "Door",
        analyticalQuestion: "Are the doors in good condition, free from wear spots, graffiti, texts, and fingerprints?"
      },
      {
        id: "entrance-floor",
        text: "Floor",
        analyticalQuestion: "Are the floors well-maintained, free from wear spots, streaks, and footprints?"
      },
      {
        id: "entrance-walls",
        text: "Walls",
        analyticalQuestion: "Are the walls in good condition, with intact paint and no wear, graffiti, texts, or fingerprints?"
      },
      {
        id: "entrance-ceiling",
        text: "Ceiling",
        analyticalQuestion: "Are the ceilings in good condition, with intact paint and no wear, graffiti, texts, or fingerprints?"
      },
      {
        id: "entrance-overall",
        text: "Entrance",
        analyticalQuestion: "Does the entrance look tidy, neat, and visually cohesive with its furniture, color schemes, and interior?"
      },
      {
        id: "reception-desk",
        text: "Reception",
        analyticalQuestion: "Is the reception desk tidy, with no clutter on or behind it?"
      },
      {
        id: "room-daylight",
        text: "Room",
        analyticalQuestion: "Does the room have sufficient daylight and a well-balanced lighting setup using both natural and artificial light?"
      },
      {
        id: "room-lights",
        text: "Lights",
        analyticalQuestion: "Are all lights in the room working properly?"
      },
      {
        id: "room-plants",
        text: "Plants",
        analyticalQuestion: "Is the space equipped with plants, and are they in good condition?"
      }
    ]
  },
  {
    location: "Break/Chill-Out Area",
    questions: [
      {
        id: "break-whole",
        text: "As a Whole",
        analyticalQuestion: "Does the break/chill-out area look harmonious overall (furniture, color schemes, neat tables, and well-maintained plants)?"
      },
      {
        id: "break-lighting",
        text: "Lighting",
        analyticalQuestion: "Is the break/chill-out area well lit (combination of daylight & artificial lighting) and are all lights working?"
      },
      {
        id: "break-floors",
        text: "Floors",
        analyticalQuestion: "Are the floors free from wear spots and clean (with no visible joints, stripes, or footprints)?"
      },
      {
        id: "break-ceiling",
        text: "Ceiling",
        analyticalQuestion: "Is the ceiling neat, well painted, and free from damage?"
      },
      {
        id: "break-walls",
        text: "Walls",
        analyticalQuestion: "Are the walls free from wear and tear and clean (without graffiti, texts, or fingerprints)?"
      },
      {
        id: "break-doors",
        text: "Doors",
        analyticalQuestion: "Do the doors look clean, free of graffiti, texts, and fingerprints (with door knobs visible)?"
      },
      {
        id: "break-trash",
        text: "Trash",
        analyticalQuestion: "Is the trash bin full (trash visibly close to or piling up at the edges)?"
      }
    ]
  },
  {
    location: "Food&Drink",
    questions: [
      {
        id: "food-whole",
        text: "As a Whole",
        analyticalQuestion: "Do the food & drink areas look harmonious overall (tidy furniture, coordinated color schemes, neat tables, and well-maintained surfaces)?"
      },
      {
        id: "food-lighting",
        text: "Lighting",
        analyticalQuestion: "Is the food & drink area well lit (combination of daylight & artificial lighting) and are all lights functioning?"
      },
      {
        id: "food-floors",
        text: "Floors",
        analyticalQuestion: "Are the floors free from wear spots and clean (with no visible joints, stripes, or footprints)?"
      },
      {
        id: "food-ceiling",
        text: "Ceiling",
        analyticalQuestion: "Is the ceiling neat, well painted, and free from damage in the food & drink area?"
      },
      {
        id: "food-walls",
        text: "Walls",
        analyticalQuestion: "Are the walls free from wear and tear and clean (without graffiti, texts, or fingerprints)?"
      },
      {
        id: "food-doors",
        text: "Doors",
        analyticalQuestion: "Do the doors look clean, free of graffiti, texts, and fingerprints (with door knobs visible)?"
      },
      {
        id: "food-trash",
        text: "Trash",
        analyticalQuestion: "Is the trash bin full (trash visibly close to or piling up at the edge)?"
      }
    ]
  },
  {
    location: "Corridor/Hall Area",
    questions: [
      {
        id: "corridor-whole",
        text: "As a Whole",
        analyticalQuestion: "Do the corridors and hall areas look harmonious overall (tidy furniture, coordinated color schemes, and well-maintained plants)?"
      },
      {
        id: "corridor-stairs",
        text: "Stairs",
        analyticalQuestion: "Are the stairs clean, free of streaks, footprints, stains, and gum, and show no signs of wear and tear?"
      },
      {
        id: "corridor-lighting",
        text: "Lighting",
        analyticalQuestion: "Is the corridor well lit (combination of daylight & artificial lighting) and are all lights functioning?"
      },
      {
        id: "corridor-floors",
        text: "Floors",
        analyticalQuestion: "Are the floors free from wear spots and clean (with no visible joints, stripes, or footprints)?"
      },
      {
        id: "corridor-ceiling",
        text: "Ceiling",
        analyticalQuestion: "Is the ceiling neat, well painted, and free from damage?"
      },
      {
        id: "corridor-walls",
        text: "Walls",
        analyticalQuestion: "Are the walls free from wear and tear and clean (without graffiti, texts, or fingerprints)?"
      },
      {
        id: "corridor-doors",
        text: "Doors",
        analyticalQuestion: "Do the doors look clean, free of graffiti, texts, and fingerprints (with door knobs visible)?"
      },
      {
        id: "corridor-trash",
        text: "Trash",
        analyticalQuestion: "Is the trash bin full (trash visibly close to or piling up at the edge)?"
      }
    ]
  },
  {
    location: "Toilet Area",
    questions: [
      {
        id: "toilet-supplies",
        text: "Supplies & Harmony",
        analyticalQuestion: "Have the saint supplies been replenished? Does the toilet area appear harmonious with coordinated color schemes and tidy surfaces?"
      },
      {
        id: "toilet-lighting",
        text: "Lighting",
        analyticalQuestion: "Is the toilet area well lit (combination of daylight & artificial lighting, note white light only) and are all lights working?"
      },
      {
        id: "toilet-ceiling",
        text: "Ceiling",
        analyticalQuestion: "Is the ceiling neat, well painted, and free from damage in the toilet area?"
      },
      {
        id: "toilet-floors",
        text: "Floors",
        analyticalQuestion: "Are the floors free from wear spots and clean (with no visible joints, stripes, or footprints)?"
      },
      {
        id: "toilet-walls",
        text: "Walls",
        analyticalQuestion: "Are the walls free from wear and tear and clean (without graffiti, texts, or fingerprints)?"
      },
      {
        id: "toilet-doors",
        text: "Doors",
        analyticalQuestion: "Do the doors look clean, free of graffiti, texts, and fingerprints (with door knobs clearly visible)?"
      },
      {
        id: "toilet-trash",
        text: "Trash",
        analyticalQuestion: "Is the trash bin full (trash visibly close to or piling up at the edge)?"
      },
      {
        id: "toilet-toilet",
        text: "Toilet",
        analyticalQuestion: "Does the sink(s) look clean?"
      },
      {
        id: "toilet-sink",
        text: "Sink",
        analyticalQuestion: "Do the toilet facilities look clean (both men's and women's toilets)?"
      }
    ]
  }
];

const sampleQuestions: SurveyQuestion[] = sampleLocationPrompts.reduce((acc: SurveyQuestion[], locationObj) => {
  const questionsForLocation = locationObj.questions.map(q => ({
    id: q.id,
    text: q.text, // Shown on screen
    displayText: q.text,
    analyticalQuestion: q.analyticalQuestion, // ChatGPT prompt
    images: [],
    completed: false,
    location: locationObj.location,
  }));
  return acc.concat(questionsForLocation);
}, []);

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
            q.id === questionId ? { ...q, images: [...q.images, imageUri] } : q
        )
    );
  };

  const setAnswerForQuestion = (questionId: string, answer: string) => {
    setQuestions(prevQuestions =>
        prevQuestions.map(q =>
            q.id === questionId ? { ...q, answer } : q
        )
    );
  };

  const markQuestionAsCompleted = (questionId: string) => {
    setQuestions(prevQuestions =>
        prevQuestions.map(q =>
            q.id === questionId ? { ...q, completed: true } : q
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

export const useSurvey = () => useContext(SurveyContext);
