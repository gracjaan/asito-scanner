import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SurveyQuestion = {
  subtext: string;
  id: string;
  location?: string;
  text: string; // What to show on the screen (e.g., "Door")
  displayText: string; // Same as text for now
  analyticalQuestion: string; // The prompt to send to ChatGPT
  images: string[];
  answer?: string;
  completed: boolean;
};

export type ManualQuestion = {
  id: string;
  question: string;
  answer: string;
  buildingPart?: string;
  options?: string[];
  required?: boolean;
};

type SurveyContextType = {
  questions: SurveyQuestion[];
  manualQuestions: ManualQuestion[];
  currentQuestionIndex: number;
  userName: string;
  surveyDate: string;
  surveyDateTime: string;
  surveyStatus: string;
  surveyDescription: string;

  setQuestions: (questions: SurveyQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addImageToQuestion: (questionId: string, imageUri: string) => void;
  setAnswerForQuestion: (questionId: string, answer: string) => void;
  markQuestionAsCompleted: (questionId: string) => void;
  setUserName: (name: string) => void;
  setSurveyDate: (date: string) => void;
  setSurveyDateTime: (dateTime: string) => void;
  setSurveyStatus: (status: string) => void;
  setSurveyDescription: (description: string) => void;
  removeImageFromQuestion: (questionId: string, imageIndex: number) => void;
  updateQuestionImages: (questionId: string, newImages: string[]) => void;
  setManualQuestions: (questions: ManualQuestion[]) => void;
};

const SurveyContext = createContext<SurveyContextType>({
  questions: [],
  manualQuestions: [],
  currentQuestionIndex: 0,
  userName: 'Gracjan Chmielnicki',
  surveyDate: new Date().toLocaleDateString(),
  surveyDateTime: new Date().toLocaleString(),
  surveyStatus: 'in progress',
  surveyDescription: '',

  setQuestions: () => {},
  setCurrentQuestionIndex: () => {},
  addImageToQuestion: () => {},
  setAnswerForQuestion: () => {},
  markQuestionAsCompleted: () => {},
  setUserName: () => {},
  setSurveyDate: () => {},
  setSurveyDateTime: () => {},
  setSurveyStatus: () => {},
  setSurveyDescription: () => {},
  removeImageFromQuestion: () => {},
  updateQuestionImages: () => {},
  setManualQuestions: () => {},
});

// Define a type for location prompts
type LocationPrompt = {
  location: string;
  questions: {
    id: string;
    text: string;
    subtext: string;
    analyticalQuestion: string;
  }[];
};

// Note: Exterior is ignored as per instructions.
const sampleLocationPrompts: LocationPrompt[] = [
      {
        "location": "Entrance",
        "questions": [
          {
            "id": "entrance-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Are the doors in good condition, free from wear spots, graffiti, texts, and fingerprints? (Beware, they can also be glass doors)."
          },
          {
            "id": "entrance-floor",
            "text": "Floor",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors well-maintained, free from wear spots, streaks, and footprints?"
          },
          {
            "id": "entrance-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls in good condition, with intact paint and no wear, graffiti, texts, or fingerprints? (Beware, they can also be glass walls)."
          },
          {
            "id": "entrance-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)? (Beware,it can also be a glass ceiling)."
          },
          {
            "id": "entrance-overall",
            "text": "Entrance",
            "subtext": "Picture(s) of the entrance as a whole from an open view.",
            "analyticalQuestion": "Does the entrance look tidy, neat, and visually cohesive with its furniture, color schemes, and interior?"
          },
          {
            "id": "entrance-reception",
            "text": "Reception",
            "subtext": "Picture(s) of the reception area and desk from an open view.",
            "analyticalQuestion": "Is the reception desk tidy, with no clutter on or behind it??"
          },
          {
            "id": "entrance-room",
            "text": "Room",
            "subtext": "As a Whole\n(Furniture, harmony, Tidiness plants, etc.) Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.",
            "analyticalQuestion": "The entrance area looks like a whole (furniture, color schemes, interior)? The entrance area looks tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?"
          },
          {
            "id": "entrance-lights",
            "text": "Lights",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the entrance area well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the entrance area working? Does the entrance area have daylight?"
          },
          {
            "id": "entrance-plants",
            "text": "Plants",
            "subtext": "",
            "analyticalQuestion": "Is the space equipped with plants, and are they in good condition?"
          }
        ]
      },
      {
        "location": "Break/Chill-Out Area",
        "questions": [
          {
            "id": "break-as-a-whole",
            "text": "As a Whole\n(Furniture, harmony, Tidiness plants, etc.)",
            "subtext": "Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.",
            "analyticalQuestion": "The break/chill-out area look like a whole (furniture, color schemes, interior)? The break/chill-out area look tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?"
          },
          {
            "id": "break-lighting",
            "text": "Lighting",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the break/chill-out area well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the break/chill-out area working? Does the break/chill-out area have daylight?"
          },
          {
            "id": "break-floors",
            "text": "Floors",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?"
          },
          {
            "id": "break-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)? (Beware,it can also be a glass ceiling)."
          },
          {
            "id": "break-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls)."
          },
          {
            "id": "break-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible. (Beware, they can also be glass doors)."
          },
          {
            "id": "break-trash",
            "text": "Trash",
            "subtext": "Picture(s) showing the whole trash can(s).",
            "analyticalQuestion": "Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin."
          }
        ]
      },
      {
        "location": "Food&Drink",
        "questions": [
          {
            "id": "food-as-a-whole",
            "text": "As a Whole\n(Furniture, harmony, Tidiness plants, etc.)",
            "subtext": "Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.",
            "analyticalQuestion": "The food&drink look like a whole (furniture, color schemes, interior)? The food&drink look tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, broken chairs, damaged desks, etc.)? The furniture is clean (no litter)? The space is equipped with plants?"
          },
          {
            "id": "food-lighting",
            "text": "Lighting",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the food&drink area well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the food&drink area working? Does the food&drink area have daylight?"
          },
          {
            "id": "food-floors",
            "text": "Floors",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?"
          },
          {
            "id": "food-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)? (Beware,it can also be a glass ceiling)."
          },
          {
            "id": "food-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls)."
          },
          {
            "id": "food-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible. (Beware, they can also be glass doors)."
          },
          {
            "id": "food-trash",
            "text": "Trash",
            "subtext": "Picture(s) showing the whole trash can(s).",
            "analyticalQuestion": "Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the trash bin."
          }
        ]
      },
      {
        "location": "Corridor/Hall Area",
        "questions": [
          {
            "id": "corridor-as-a-whole",
            "text": "As a Whole\n(Furniture, harmony, plants, etc.)",
            "subtext": "Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.",
            "analyticalQuestion": "The corridors look like a whole (furniture, color schemes, interior)? The hallways look tidy and neat? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?"
          },
          {
            "id": "corridor-stairs",
            "text": "Stairs",
            "subtext": "Pictures of the stairs from close view and open view from both the bottom and the top of the stairs.",
            "analyticalQuestion": "The stairs look clean (free of streaks, footprints, stains, gum, etc.)? Are the stairs free from wear and tear?"
          },
          {
            "id": "corridor-lighting",
            "text": "Lighting",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the corridor well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the corridor working? Does the corridor have daylight?"
          },
          {
            "id": "corridor-floors",
            "text": "Floors",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?"
          },
          {
            "id": "corridor-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)? (Beware,it can also be a glass ceiling)."
          },
          {
            "id": "corridor-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls)."
          },
          {
            "id": "corridor-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible). (Beware, they can also be glass walls)."
          },
          {
            "id": "corridor-trash",
            "text": "Trash",
            "subtext": "Picture(s) showing the whole trash can(s).",
            "analyticalQuestion": "Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin."
          }
        ]
      },
      {
        "location": "Workplaces",
        "questions": [
          {
            "id": "workplaces-as-a-whole",
            "text": "As a Whole\n(Furniture, harmony, plants, etc.)\n",
            "subtext": "Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.",
            "analyticalQuestion": "The workplace looks like a whole (furniture, color schemes, interior)? The workplace looks tidy and neat? The furniture is in good condition (no (chairs, desks, etc.) broken, damaged, paint worn off, etc.)? The space is equipped with plants?"
          },
          {
            "id": "workplaces-lighting",
            "text": "Lighting",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the workplace well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the workplace working? Does the workspace have daylight?"
          },
          {
            "id": "workplaces-floors",
            "text": "Floors",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?"
          },
          {
            "id": "workplaces-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)? (Beware,it can also be a glass ceiling)."
          },
          {
            "id": "workplaces-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls)."
          },
          {
            "id": "workplaces-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible). (Beware, they can also be glass walls)."
          },
          {
            "id": "workplaces-trash",
            "text": "Trash",
            "subtext": "Picture(s) showing the whole trash can(s).",
            "analyticalQuestion": "Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin."
          },
          {
            "id": "workplaces-workstations",
            "text": "Workstations",
            "subtext": "Pictures of the workstation from both an open view and close view. For a close view, put focus on the tables, computers, monitors, cables, piles of papers.",
            "analyticalQuestion": "Do the workstations look clean (free from fingerprints, dust, waste, coffee spills, etc.)? Are they tidy and neat (note: clean desks, cables tucked away, piles of papers, etc.)? Aethey free of dust (note: open wiring, cupboards, desk)? Do the computers look clean (monitor, keyboard, mouse)?"
          },
          {
            "id": "workplaces-doors-2",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible). (Beware, they can also be glass walls)."
          }
        ]
      },
      {
        "location": "Toilet Area",
        "questions": [
          {
            "id": "toilet-supplies-harmony",
            "text": "Supplies & Harmony",
            "subtext": "Pictures of the toilet area supplies from mainly close view with some open view of the entire toilet area as well.",
            "analyticalQuestion": "Have the saint supplies been replenished? Does everything in the toilet area look harmonious (forms a whole, color schemes, etc.)?"
          },
          {
            "id": "toilet-lighting",
            "text": "Lighting",
            "subtext": "Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).",
            "analyticalQuestion": "Is the toilet area well lit (combination of daylight & artificial lighting, note white light only)? Are all lights in the toilet area working? Does the toilet area have some daylight?"
          },
          {
            "id": "toilet-floors",
            "text": "Floors",
            "subtext": "Pictures of the floors from close view and open view.",
            "analyticalQuestion": "Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?"
          },
          {
            "id": "toilet-ceiling",
            "text": "Ceiling",
            "subtext": "Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.",
            "analyticalQuestion": "Is the ceiling neat (well painted, no damage)?"
          },
          {
            "id": "toilet-walls",
            "text": "Walls",
            "subtext": "Pictures of the walls from close view and open view. Make sure the wall texture is visible.",
            "analyticalQuestion": "Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)?"
          },
          {
            "id": "toilet-doors",
            "text": "Doors",
            "subtext": "Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!",
            "analyticalQuestion": "Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible)"
          },
          {
            "id": "toilet-trash",
            "text": "Trash",
            "subtext": "Picture(s) showing the whole trash can(s).",
            "analyticalQuestion": "Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the trash bin."
          },
          {
            "id": "toilet-sink",
            "text": "Sink",
            "subtext": "General picture of the whole sink.",
            "analyticalQuestion": "Does the sink(s) look clean?"
          },
          {
            "id": "toilet-toilet",
            "text": "Toilet",
            "subtext": "Pictures of the different toilet facilities.",
            "analyticalQuestion": "Do the toilet facilities look clean (both men's and women's toilets)?"
          }
        ]
      }
    ];


const sampleQuestions: SurveyQuestion[] = sampleLocationPrompts.reduce((acc: SurveyQuestion[], locationObj) => {
  const questionsForLocation = locationObj.questions.map(q => ({
    id: q.id,
    text: q.text, // Shown on screen
    displayText: q.text,
    subtext: q.subtext,
    analyticalQuestion: q.analyticalQuestion, // ChatGPT prompt
    images: [],
    completed: false,
    location: locationObj.location,
  }));
  return acc.concat(questionsForLocation);
}, []);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(sampleQuestions);
  const [manualQuestions, setManualQuestions] = useState<ManualQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userName, setUserName] = useState('Gracjan Chmielnicki');
  const [surveyDate, setSurveyDate] = useState(new Date().toLocaleDateString());
  const [surveyDateTime, setSurveyDateTime] = useState(new Date().toLocaleString());
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

  const removeImageFromQuestion = (questionId: string, imageIndex: number) => {
    setQuestions(prevQuestions =>
        prevQuestions.map(q => {
          if (q.id === questionId) {
            const updatedImages = [...(q.images || [])]; // Create a copy
            if (imageIndex >= 0 && imageIndex < updatedImages.length) {
              updatedImages.splice(imageIndex, 1); // Remove the image
            }
            return { ...q, images: updatedImages };
          }
          return q;
        })
    );
  };

  const updateQuestionImages = (questionId: string, newImages: string[]) => {
    setQuestions(prevQuestions =>
        prevQuestions.map(q =>
            q.id === questionId ? { ...q, images: newImages } : q
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
            manualQuestions,
            currentQuestionIndex,
            userName,
            surveyDate,
            surveyDateTime,
            surveyStatus,
            surveyDescription,
            setQuestions,
            setCurrentQuestionIndex,
            addImageToQuestion,
            removeImageFromQuestion,
            setAnswerForQuestion,
            markQuestionAsCompleted,
            setUserName,
            setSurveyDate,
            setSurveyDateTime,
            setSurveyStatus,
            setSurveyDescription,
            updateQuestionImages,
            setManualQuestions,
          }}
      >
        {children}
      </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
