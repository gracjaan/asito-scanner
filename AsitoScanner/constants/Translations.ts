export type Language = 'en' | 'nl';

export const translations = {
  en: {
    // Common
    appName: 'Asito Scanner',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    next: 'Next',
    back: 'Back',
    settings: 'Settings',
    home: 'Home',
    language: 'Language',
    chooseLanguage: 'Choose Language',
    english: 'English',
    dutch: 'Dutch',
    switchToEnglish: 'English',
    switchToDutch: 'Nederlands',
    success: 'Success',
    
    // Manual-only sections
    manualQuestionsOnly: 'This section contains only manual questions.',
    manualQuestionsLoading: 'Manual questions are loading...',
    
    // Photo Tips
    analyzingImages: 'Analyzing images...',
    photoTakingTips: 'Photo Taking Tips',
    photoTipsIntro: 'To help the AI analyze the images effectively, please follow these tips:',
    photoTipLightingLabel: 'Good Lighting:',
    photoTipLighting: 'Ensure the area is well-lit. Avoid shadows or direct glare if possible.',
    photoTipFocusLabel: 'Focus:',
    photoTipFocus: 'Make sure the subject of the photo is clear and in focus. Tap the screen to focus if needed.',
    photoTipFramingLabel: 'Framing:',
    photoTipFraming: 'Capture the entire relevant item or area mentioned in the question. Don\'t cut off important parts.',
    photoTipAnglesLabel: 'Multiple Angles:',
    photoTipAngles: 'Sometimes, photos from different angles help provide more context. Use the small image slots.',
    photoTipMainImageLabel: 'Main Image:',
    photoTipMainImage: 'Use the large placeholder for the primary, most representative photo.',
    gotIt: 'Got it!',
    
    // Authentication
    login: 'Login',
    logout: 'Logout',

    "food&drinkarea": "Food & Drink",
    "toilets": "Toilets",
    
    // Survey/Scanning
    startScan: 'Start Scanning',
    scanComplete: 'Scan Complete',
    scanInProgress: 'Scanning in Progress',
    report: 'Report',
    viewReport: 'View Report',
    sendEmail: 'Send Report via Email',
    enterEmail: 'Email Address',
    emailSent: 'Email Sent Successfully',
    emailInstructions: 'Enter the recipient\'s email address to send this report.',
    validEmailRequired: 'Please enter a valid email address',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    sectionComplete: 'Section Complete',
    completeManualQuestions: 'You have completed all questions for this section. Before submitting, you need to complete the additional manual questions in the next section.',
    
    // Reports Screen
    reports: 'Reports',
    noReportsFound: 'No reports found. Complete a survey to create your first report.',
    startNewSurvey: 'Start New Survey',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    noDescription: 'No description provided',
    
    // Final Report
    nationaleNederlandse: 'Company',
    buildingAreaObservations: 'Building Area Observations',
    noCompletedQuestions: 'No completed questions found. Please complete at least one question to generate a report.',
    noAnalysisAvailable: 'No analysis available for this question.',
    noAnswerProvided: 'No answer provided',
    other: 'Other',
    
    // Report Detail
    additionalObservations: 'Additional Observations',
    loadingReport: 'Loading report...',
    reportNotFound: 'Report not found',
    noCompletedQuestionsInReport: 'No completed questions found in this report.',
    
    // Building Parts
    buildingParts: 'Building Parts',
    entrance: 'Entrance',
    breakArea: 'Break/Chill-Out Area',
    foodDrink: 'Food & Drink',
    corridor: 'Corridor/Hall Area',
    workplaces: 'Workplaces',
    toiletArea: 'Toilet Area',
    
    // Building Parts and Special Titles
    breakchill: 'Break/Chill-Out Area',
    breakchilloutarea: 'Break/Chill-Out Area',
    'breakchill-outarea': 'Break/Chill-Out Area',
    corridorhallarea: 'Corridor/Hall Area',
    fooddrink: 'Food & Drink',
    'food&drink': 'Food & Drink',
    foodanddrink: 'Food & Drink',
    toiletarea: 'Toilet Area',
    
    // Special Translation Keys for Component Display
    breakAsAWholeText: 'As a Whole (Furniture, harmony, Tidiness plants, etc.)',
    breakAsAWholeSubtext: 'Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.',
    
    corridorAsAWholeText: 'As a Whole (Furniture, harmony, plants, etc.)',
    corridorAsAWholeSubtext: 'Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.',
    
    foodAsAWholeText: 'As a Whole (Furniture, harmony, Tidiness plants, etc.)',
    foodAsAWholeSubtext: 'Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.',
    
    workplacesAsAWholeText: 'As a Whole (Furniture, harmony, plants, etc.)',
    workplacesAsAWholeSubtext: 'Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.',
    
    toiletSuppliesHarmonyText: 'Supplies & Harmony',
    toiletSuppliesHarmonySubtext: 'Pictures of the toilet area supplies from mainly close view with some open view of the entire toilet area as well.',
    
    // Not Found
    oops: 'Oops!',
    screenNotExist: 'This screen doesn\'t exist.',
    goToHome: 'Go to home screen!',
    
    // Errors
    error: 'Error',
    tryAgain: 'Try Again',
    send: 'Send',
    
    // ManualQuestionsModal
    questions: 'Questions',
    pleaseAnswerQuestions: 'Please answer these questions for the',
    noQuestionsAvailable: 'No questions available for this building part.',
    requiredQuestions: 'Required Questions',
    pleaseAnswerRequired: 'Please answer the following required questions before submitting:',
    enterYourAnswer: 'Enter your answer',
    skip: 'Skip',
    
    // Common Questions
    plantsPresence: 'Are there several plants in the {area}?',
    plantsCondition: 'Are the plants in good condition? (not dead)',
    plantsReal: 'Are they real?',
    plantsHeight: 'Are the plants at the {area} on average higher than 1 meter?',
    music: 'Is music being played in the background?',
    airQuality: 'Does the air quality feel pleasant? (not musty or dusty)?',
    smell: 'Does it smell pleasant around the {area}?',
    notableFindings: 'Please explain some notable findings for the {area} here:',
    toiletFragrance: 'Is fragrance consciously used? (dispensers, candles, etc.)',
    lookReal: 'Look real, but can\'t tell for sure',
    lookFake: 'Look fake & artificial but can\'t tell for sure',
    yes: 'Yes',
    no: 'No',
    
    // Manual Questions - Exterior
    exteriorEntranceVisibility: 'Is the entrance clearly visible from outside?',
    exteriorSignage: 'Is there clear signage directing visitors to the entrance?',
    exteriorLighting: 'Is the exterior of the building well-lit?',
    exteriorCleanliness: 'Is the exterior of the building clean and well-maintained?',
    exteriorAccessibility: 'Is the building accessible for people with disabilities?',
    exteriorGreenery: 'Is there greenery or landscaping around the building?',
    exteriorComments: 'Please note any additional observations about the exterior:',
    
    // Manual Questions - General Interior
    generalLightQuality: 'How would you rate the overall lighting quality in the building?',
    generalTemperature: 'Is the temperature comfortable throughout the building?',
    generalNoiseLevel: 'How would you describe the noise level in the building?',
    generalCleanliness: 'Rate the overall cleanliness of the interior spaces:',
    generalSafety: 'Are safety features clearly marked (fire exits, extinguishers, etc.)?',
    generalComments: 'Please provide additional comments about the general interior:',
    
    // Manual Questions - Users
    usersSatisfaction: 'Based on interactions or observations, how satisfied do users seem with the building?',
    usersFlow: 'Do users appear to navigate the building easily without confusion?',
    usersSpaceUsage: 'Are all areas of the building being effectively used by occupants?',
    usersInteraction: 'Do you observe positive interactions between users in communal spaces?',
    usersAmenities: 'Do users appear to have all necessary amenities for their activities?',
    usersComments: 'Please note any other observations about building users:',
    
    // Manual Questions - Cleaning Staff
    cleaningVisible: 'Is cleaning staff visible during your inspection?',
    cleaningEquipment: 'Is cleaning equipment stored neatly and out of the way?',
    cleaningSchedule: 'Is there a visible cleaning schedule posted anywhere?',
    cleaningSupplies: 'Are cleaning supplies well-stocked in appropriate areas (bathrooms, etc.)?',
    cleaningEffectiveness: 'Based on building cleanliness, how effective does the cleaning service appear to be?',
    cleaningComments: 'Additional observations about cleaning staff or maintenance:',
    
    // Additional Option Choices
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    veryQuiet: 'Very quiet',
    comfortable: 'Comfortable',
    somewhatNoisy: 'Somewhat noisy',
    tooNoisy: 'Too noisy',
    tooHot: 'Too hot',
    tooCold: 'Too cold',
    verySatisfied: 'Very satisfied',
    satisfied: 'Satisfied',
    neutral: 'Neutral',
    dissatisfied: 'Dissatisfied',
    limitedInteraction: 'Limited interaction',
    someAreasUnderutilized: 'Some areas underutilized',
    notVisible: 'Not visible',
    
    // Survey Question Texts - Entrance
    entranceDoors: 'Doors',
    entranceDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    entranceFloor: 'Floor',
    entranceFloorSubtext: 'Pictures of the floors from close view and open view.',
    entranceWalls: 'Walls',
    entranceWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    entranceCeiling: 'Ceiling',
    entranceCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    entranceOverall: 'Entrance',
    entranceOverallSubtext: 'Picture(s) of the entrance as a whole from an open view.',
    entranceReception: 'Reception',
    entranceReceptionSubtext: 'Picture(s) of the reception area and desk from an open view.',
    entranceRoom: 'Room',
    entranceRoomSubtext: 'As a Whole\n(Furniture, harmony, Tidiness plants, etc.) Pictures from an open view of the entire space. If plants are present, include a picture of such. Include close view pictures of furniture.',
    entranceLights: 'Lights',
    entranceLightsSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    entrancePlants: 'Plants',
    entrancePlantsSubtext: '',
    
    // Survey Question Texts - Break Area
    breakAsAWhole: 'As a Whole\n(Furniture, harmony, Tidiness plants, etc.)',
    breakLighting: 'Lighting',
    breakLightingSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    breakFloors: 'Floors',
    breakFloorsSubtext: 'Pictures of the floors from close view and open view.',
    breakCeiling: 'Ceiling',
    breakCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    breakWalls: 'Walls',
    breakWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    breakDoors: 'Doors',
    breakDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    breakTrash: 'Trash',
    breakTrashSubtext: 'Picture(s) showing the whole trash can(s).',
    
    // Survey Question Texts - Food & Drink
    foodAsAWhole: 'As a Whole\n(Furniture, harmony, Tidiness plants, etc.)',
    foodLighting: 'Lighting',
    foodLightingSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    foodFloors: 'Floors',
    foodFloorsSubtext: 'Pictures of the floors from close view and open view.',
    foodCeiling: 'Ceiling',
    foodCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    foodWalls: 'Walls',
    foodWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    foodDoors: 'Doors',
    foodDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    foodTrash: 'Trash',
    foodTrashSubtext: 'Picture(s) showing the whole trash can(s).',
    
    // Survey Question Texts - Corridor
    corridorAsAWhole: 'As a Whole\n(Furniture, harmony, plants, etc.)',
    corridorStairs: 'Stairs',
    corridorStairsSubtext: 'Pictures of the stairs from close view and open view from both the bottom and the top of the stairs.',
    corridorLighting: 'Lighting',
    corridorLightingSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    corridorFloors: 'Floors',
    corridorFloorsSubtext: 'Pictures of the floors from close view and open view.',
    corridorCeiling: 'Ceiling',
    corridorCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    corridorWalls: 'Walls',
    corridorWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    corridorDoors: 'Doors',
    corridorDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    corridorTrash: 'Trash',
    corridorTrashSubtext: 'Picture(s) showing the whole trash can(s).',
    
    // Survey Question Texts - Workplaces
    workplacesAsAWhole: 'As a Whole\n(Furniture, harmony, plants, etc.)',
    workplacesLighting: 'Lighting',
    workplacesLightingSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    workplacesFloors: 'Floors',
    workplacesFloorsSubtext: 'Pictures of the floors from close view and open view.',
    workplacesCeiling: 'Ceiling',
    workplacesCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    workplacesWalls: 'Walls',
    workplacesWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    workplacesDoors: 'Doors',
    workplacesDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    workplacesTrash: 'Trash',
    workplacesTrashSubtext: 'Picture(s) showing the whole trash can(s).',
    workplacesWorkstations: 'Workstations',
    workplacesWorkstationsSubtext: 'Pictures of the workstation from both an open view and close view. For a close view, put focus on the tables, computers, monitors, cables, piles of papers.',
    
    // Survey Question Texts - Toilet Area
    toiletSuppliesHarmony: 'Supplies & Harmony',
    toiletLighting: 'Lighting',
    toiletLightingSubtext: 'Pictures of both natural light (windows and sun reflection) as well as artificial lighting (fixtures).',
    toiletFloors: 'Floors',
    toiletFloorsSubtext: 'Pictures of the floors from close view and open view.',
    toiletCeiling: 'Ceiling',
    toiletCeilingSubtext: 'Picture of the ceiling with the phone tilted at an angle. Show the edges where the wall ends and the ceiling starts.',
    toiletWalls: 'Walls',
    toiletWallsSubtext: 'Pictures of the walls from close view and open view. Make sure the wall texture is visible.',
    toiletDoors: 'Doors',
    toiletDoorsSubtext: 'Pictures of the doors from close view and open view. Make sure door knobs and frames are visible!',
    toiletTrash: 'Trash',
    toiletTrashSubtext: 'Picture(s) showing the whole trash can(s).',
    toiletSink: 'Sink',
    toiletSinkSubtext: 'General picture of the whole sink.',
    toiletToilet: 'Toilet',
    toiletToiletSubtext: 'Pictures of the different toilet facilities.',
    
    // Analytical Questions - Entrance
    entranceReceptionAnalytical: 'Is the reception desk tidy, with no clutter on or behind it?',
    entranceRoomAnalytical: 'The entrance area looks like a whole (furniture, color schemes, interior)? The entrance area looks tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?',
    entranceLightsAnalytical: 'Is the entrance area well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the entrance area working? Does the entrance area have daylight?',
    entrancePlantsAnalytical: 'Is the space equipped with plants, and are they in good condition?',
    entranceFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    entranceCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)? (Beware, it can also be a glass ceiling).',
    entranceWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls).',
    entranceDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible. (Beware, they can also be glass doors).',

    // Analytical Questions - Break/Chill-Out Area
    breakAsAWholeAnalytical: 'The break/chill-out area look like a whole (furniture, color schemes, interior)? The break/chill-out area look tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?',
    breakLightingAnalytical: 'Is the break/chill-out area well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the break/chill-out area working? Does the break/chill-out area have daylight?',
    breakFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    breakCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)? (Beware, it can also be a glass ceiling).',
    breakWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls).',
    breakDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible. (Beware, they can also be glass doors).',
    breakTrashAnalytical: 'Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin.',
    
    // Analytical Questions - Corridors
    corridorAsAWholeAnalytical: 'The corridors look like a whole (furniture, color schemes, interior)? The hallways look tidy and neat? The furniture is in good condition (not broken, damaged, paint worn off, etc.)? The space is equipped with plants?',
    corridorStairsAnalytical: 'The stairs look clean (free of streaks, footprints, stains, gum, etc.)? Are the stairs free from wear and tear?',
    corridorLightingAnalytical: 'Is the corridor well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the corridor working? Does the corridor have daylight?',
    corridorFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    corridorCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)? (Beware, it can also be a glass ceiling).',
    corridorWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls).',
    corridorDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible). (Beware, they can also be glass walls).',
    corridorTrashAnalytical: 'Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin.',
    
    // Analytical Questions - Workplaces
    workplacesAsAWholeAnalytical: 'The workplace looks like a whole (furniture, color schemes, interior)? The workplace looks tidy and neat? The furniture is in good condition (no (chairs, desks, etc.) broken, damaged, paint worn off, etc.)? The space is equipped with plants?',
    workplacesLightingAnalytical: 'Is the workplace well lit (combination of daylight & artificial lighting, note white/yellow light only)? Are all lights in the workplace working? Does the workspace have daylight?',
    workplacesFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    workplacesCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)? (Beware, it can also be a glass ceiling).',
    workplacesWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls).',
    workplacesDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible). (Beware, they can also be glass walls).',
    workplacesTrashAnalytical: 'Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the edge of the trash bin.',
    workplacesWorkstationsAnalytical: 'Do the workstations look clean (free from fingerprints, dust, waste, coffee spills, etc.)? Are they tidy and neat (note: clean desks, cables tucked away, piles of papers, etc.)? Are they free of dust (note: open wiring, cupboards, desk)? Do the computers look clean (monitor, keyboard, mouse)?',
    
    // Analytical Questions - Toilet Area
    toiletSuppliesHarmonyAnalytical: 'Have the saint supplies been replenished? Does everything in the toilet area look harmonious (forms a whole, color schemes, etc.)?',
    toiletLightingAnalytical: 'Is the toilet area well lit (combination of daylight & artificial lighting, note white light only)? Are all lights in the toilet area working? Does the toilet area have some daylight?',
    toiletFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    toiletCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)?',
    toiletWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)?',
    toiletDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible)',
    toiletTrashAnalytical: 'Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the trash bin.',
    toiletSinkAnalytical: 'Does the sink(s) look clean?',
    toiletToiletAnalytical: 'Do the toilet facilities look clean (both men\'s and women\'s toilets)?',
    
    // Food & Drink
    foodAsAWholeAnalytical: 'The food&drink look like a whole (furniture, color schemes, interior)? The food&drink look tidy and neat with tidy tables? The furniture is in good condition (not broken, damaged, paint worn off, broken chairs, damaged desks, etc.)? The furniture is clean (no litter)? Is the space equipped with plants?',
    foodLightingAnalytical: 'Is the food&drink area well lit (combination of daylight & artificial lighting, let on white/yellow light only)? Are all lights in the food&drink area working? Does the food&drink area have daylight?',
    foodFloorsAnalytical: 'Are the floors free from wear spots? Do the floors look clean (note the joints, stripes, footprints, etc.)?',
    foodCeilingAnalytical: 'Is the ceiling neat (well painted, no damage)? (Beware, it can also be a glass ceiling).',
    foodWallsAnalytical: 'Are the walls free of wear and tear (the paint is good)? Do the walls look clean (free of graffiti, texts and fingerprints)? (Beware, they can also be glass walls).',
    foodDoorsAnalytical: 'Do the doors look clean (free of graffiti, texts and fingerprints)? (Doors only count as doors if the door knob is visible. (Beware, they can also be glass doors).',
    foodTrashAnalytical: 'Is the trash bin full? We consider the bin full when the trash is visibly close to or actually piling from the trash bin.',
    
    // New manual-only sections
    exterior: 'Exterior',
    generalinterior: 'General Interior',
    users: 'Users',
    cleaningstaff: 'Cleaning Staff',
    
    // Manual Assessment
    manualAssessment: 'Manual Assessment Observations',
  },
  nl: {
    // Common
    appName: 'Asito Scanner',
    save: 'Opslaan',
    cancel: 'Annuleren',
    submit: 'Indienen',
    next: 'Volgende',
    back: 'Terug',
    settings: 'Instellingen',
    home: 'Home',
    language: 'Taal',
    chooseLanguage: 'Kies Taal',
    english: 'Engels',
    dutch: 'Nederlands',
    switchToEnglish: 'English',
    switchToDutch: 'Nederlands',
    success: 'Succes',
    
    // Manual-only sections
    manualQuestionsOnly: 'Deze sectie bevat alleen handmatige vragen.',
    manualQuestionsLoading: 'Handmatige vragen worden geladen...',
    
    // Photo Tips
    analyzingImages: 'Beelden analyseren...',
    photoTakingTips: 'Foto Tips',
    photoTipsIntro: 'Om de AI te helpen de afbeeldingen effectief te analyseren, volg deze tips:',
    photoTipLightingLabel: 'Goed Verlichting:',
    photoTipLighting: 'Zorg ervoor dat het gebied goed verlicht is. Vermijd schaduwen of direct zonlicht indien mogelijk.',
    photoTipFocusLabel: 'Focus:',
    photoTipFocus: 'Zorg ervoor dat het onderwerp van de foto scherp en in focus is. Tik op het scherm om scherp te stellen indien nodig.',
    photoTipFramingLabel: 'Framing:',
    photoTipFraming: 'Leg het hele relevante item of gebied vast dat in de vraag wordt genoemd. Snijd geen belangrijke delen af.',
    photoTipAnglesLabel: 'Meerdere Hoeken:',
    photoTipAngles: 'Soms helpen foto\'s vanuit verschillende hoeken om meer context te bieden. Gebruik de kleine afbeeldingsslots.',
    photoTipMainImageLabel: 'Hoofdfoto:',
    photoTipMainImage: 'Gebruik de grote placeholder voor de primaire, meest representatieve foto.',
    gotIt: 'Begrepen!',
    
    // Authentication
    login: 'Inloggen',
    logout: 'Uitloggen',

    "food&drinkarea": "Eten & Drinken",
    "toilets": "Toiletruimte",
    
    // Survey/Scanning
    startScan: 'Start Scan',
    scanComplete: 'Scan Voltooid',
    scanInProgress: 'Scan in Uitvoering',
    report: 'Rapport',
    viewReport: 'Bekijk Rapport',
    sendEmail: 'Rapport Versturen via E-mail',
    enterEmail: 'E-mailadres',
    emailSent: 'E-mail Succesvol Verzonden',
    emailInstructions: 'Voer het e-mailadres van de ontvanger in om dit rapport te versturen.',
    validEmailRequired: 'Voer een geldig e-mailadres in',
    unexpectedError: 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.',
    sectionComplete: 'Sectie Voltooid',
    completeManualQuestions: 'U heeft alle vragen voor deze sectie voltooid. Voordat u indient, moet u de aanvullende handmatige vragen in de volgende sectie voltooien.',
    
    // Reports Screen
    reports: 'Rapporten',
    noReportsFound: 'Geen rapporten gevonden. Voltooi een scan om je eerste rapport te maken.',
    startNewSurvey: 'Start Nieuwe Scan',
    completed: 'Voltooid',
    inProgress: 'In Uitvoering',
    notStarted: 'Niet Gestart',
    noDescription: 'Geen beschrijving gevonden',
    
    // Final Report
    nationaleNederlandse: 'Company',
    buildingAreaObservations: 'Gebiedsobservaties',
    noCompletedQuestions: 'Geen voltooide vragen gevonden. Voltooi ten minste één vraag om een rapport te genereren.',
    noAnalysisAvailable: 'Geen analyse beschikbaar voor deze vraag.',
    noAnswerProvided: 'Geen antwoord gegeven',
    other: 'Overig',
    
    // Report Detail
    additionalObservations: 'Aanvullende Observaties',
    loadingReport: 'Rapport laden...',
    reportNotFound: 'Rapport niet gevonden',
    noCompletedQuestionsInReport: 'Geen voltooide vragen gevonden in dit rapport.',
    
    // Building Parts
    buildingParts: 'Gebouwdelen',
    entrance: 'Ingang',
    breakArea: 'Pauze/Ontspanningsruimte',
    foodDrink: 'Eten & Drinken',
    corridor: 'Gang/Hal Gebied',
    workplaces: 'Werkplekken',
    toiletArea: 'Toiletruimte',
    
    // Building Parts and Special Titles
    breakchill: 'Pauze/Ontspanningsruimte',
    breakchilloutarea: 'Pauze/Ontspanningsruimte',
    'breakchill-outarea': 'Pauze/Ontspanningsruimte',
    corridorhallarea: 'Gang/Hal Gebied',
    fooddrink: 'Eten & Drinken',
    'food&drink': 'Eten & Drinken',
    foodanddrink: 'Eten & Drinken',
    toiletarea: 'Toiletruimte',
    
    // Special Translation Keys for Component Display
    breakAsAWholeText: 'Als geheel (Meubilair, harmonie, Netheid planten, etc.)',
    breakAsAWholeSubtext: 'Foto\'s vanuit een open zicht van de hele ruimte. Als er planten aanwezig zijn, voeg dan een foto daarvan toe. Voeg dichtbij-foto\'s van meubilair toe.',
    
    corridorAsAWholeText: 'Als geheel (Meubilair, harmonie, planten, etc.)',
    corridorAsAWholeSubtext: 'Foto\'s vanuit een open zicht van de hele ruimte. Als er planten aanwezig zijn, voeg dan een foto daarvan toe. Voeg dichtbij-foto\'s van meubilair toe.',
    
    foodAsAWholeText: 'Als geheel (Meubilair, harmonie, Netheid planten, etc.)',
    foodAsAWholeSubtext: 'Foto\'s vanuit een open zicht van de hele ruimte. Als er planten aanwezig zijn, voeg dan een foto daarvan toe. Voeg dichtbij-foto\'s van meubilair toe.',
    
    workplacesAsAWholeText: 'Als geheel (Meubilair, harmonie, plants, etc.)',
    workplacesAsAWholeSubtext: 'Foto\'s vanuit een open zicht van de hele ruimte. Als er planten aanwezig zijn, voeg dan een foto daarvan toe. Voeg dichtbij-foto\'s van meubilair toe.',
    
    toiletSuppliesHarmonyText: 'Benodigdheden & Harmonie',
    toiletSuppliesHarmonySubtext: 'Foto\'s van de toiletbenodigdheden, voornamelijk van dichtbij, met ook enkele foto\'s van het volledige toiletgebied.',
    
    // Not Found
    oops: 'Oeps!',
    screenNotExist: 'Dit scherm bestaat niet.',
    goToHome: 'Ga naar het startscherm!',
    
    // Errors
    error: 'Fout',
    tryAgain: 'Probeer Opnieuw',
    send: 'Versturen',
    
    // ManualQuestionsModal
    questions: 'Vragen',
    pleaseAnswerQuestions: 'Beantwoord deze vragen voor de',
    noQuestionsAvailable: 'Geen vragen beschikbaar voor dit gebouwdeel.',
    requiredQuestions: 'Vereiste Vragen',
    pleaseAnswerRequired: 'Beantwoord de volgende vereiste vragen voordat u indient:',
    enterYourAnswer: 'Voer uw antwoord in',
    skip: 'Overslaan',
    
    // Common Questions
    plantsPresence: 'Zijn er meerdere planten in de {area}?',
    plantsCondition: 'Zijn de planten in goede conditie? (niet dood)',
    plantsReal: 'Zijn ze echt?',
    plantsHeight: 'Zijn de planten in de {area} gemiddeld hoger dan 1 meter?',
    music: 'Wordt er muziek afgespeeld in de achtergrond?',
    airQuality: 'Voelt de luchtkwaliteit er lekker aan? (niet mustig of stofig)?',
    smell: 'Voelt het er lekker aan om de {area} rondom?',
    notableFindings: 'Plaats hier enkele opvallende ontdekkingen voor de {area}:',
    toiletFragrance: 'Is fragrance bewust gebruikt? (dispensers, kaarsen, etc.)',
    lookReal: 'Kijk echt uit, maar je kunt het niet zeker zeggen',
    lookFake: 'Kijk foutig en artificiëel uit, maar je kunt het niet zeker zeggen',
    yes: 'Ja',
    no: 'Nee',
    
    // Manual Questions - Exterior
    exteriorEntranceVisibility: 'Is de ingang duidelijk zichtbaar van buitenaf?',
    exteriorSignage: 'Is er duidelijke bewegwijzering die bezoekers naar de ingang leidt?',
    exteriorLighting: 'Is de buitenkant van het gebouw goed verlicht?',
    exteriorCleanliness: 'Is de buitenkant van het gebouw schoon en goed onderhouden?',
    exteriorAccessibility: 'Is het gebouw toegankelijk voor mensen met een beperking?',
    exteriorGreenery: 'Is er groen of landschapsarchitectuur rond het gebouw?',
    exteriorComments: 'Noteer eventuele aanvullende observaties over de buitenkant:',
    
    // Manual Questions - General Interior
    generalLightQuality: 'Hoe zou u de algemene lichtkwaliteit in het gebouw beoordelen?',
    generalTemperature: 'Is de temperatuur comfortabel in het hele gebouw?',
    generalNoiseLevel: 'Hoe zou u het geluidsniveau in het gebouw omschrijven?',
    generalCleanliness: 'Beoordeel de algemene netheid van de binnenruimtes:',
    generalSafety: 'Zijn veiligheidsvoorzieningen duidelijk aangegeven (nooduitgangen, brandblussers, enz.)?',
    generalComments: 'Geef aanvullende opmerkingen over het algemene interieur:',
    
    // Manual Questions - Users
    usersSatisfaction: 'Op basis van interacties of observaties, hoe tevreden lijken gebruikers met het gebouw?',
    usersFlow: 'Lijken gebruikers gemakkelijk door het gebouw te navigeren zonder verwarring?',
    usersSpaceUsage: 'Worden alle gebieden van het gebouw effectief gebruikt door de bewoners?',
    usersInteraction: 'Observeert u positieve interacties tussen gebruikers in gemeenschappelijke ruimtes?',
    usersAmenities: 'Lijken gebruikers alle nodige voorzieningen te hebben voor hun activiteiten?',
    usersComments: 'Noteer eventuele andere observaties over gebouwgebruikers:',
    
    // Manual Questions - Cleaning Staff
    cleaningVisible: 'Is het schoonmaakpersoneel zichtbaar tijdens uw inspectie?',
    cleaningEquipment: 'Wordt schoonmaakmateriaal netjes en uit de weg opgeborgen?',
    cleaningSchedule: 'Is er ergens een zichtbaar schoonmaakschema opgehangen?',
    cleaningSupplies: 'Zijn schoonmaakmiddelen goed voorradig in de juiste ruimtes (badkamers, enz.)?',
    cleaningEffectiveness: 'Gebaseerd op de netheid van het gebouw, hoe effectief lijkt de schoonmaakdienst te zijn?',
    cleaningComments: 'Aanvullende observaties over schoonmaakpersoneel of onderhoud:',
    
    // Additional Option Choices
    excellent: 'Uitstekend',
    good: 'Goed',
    average: 'Gemiddeld',
    poor: 'Slecht',
    veryQuiet: 'Zeer rustig',
    comfortable: 'Comfortabel',
    somewhatNoisy: 'Enigszins rumoerig',
    tooNoisy: 'Te rumoerig',
    tooHot: 'Te warm',
    tooCold: 'Te koud',
    verySatisfied: 'Zeer tevreden',
    satisfied: 'Tevreden',
    neutral: 'Neutraal',
    dissatisfied: 'Ontevreden',
    limitedInteraction: 'Beperkte interactie',
    someAreasUnderutilized: 'Sommige gebieden onderbenut',
    notVisible: 'Niet zichtbaar',
    
    // Survey Question Texts - Entrance
    entranceDoors: 'Deuren',
    entranceDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    entranceFloor: 'Vloer',
    entranceFloorSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    entranceWalls: 'Muren',
    entranceWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    entranceCeiling: 'Plafond',
    entranceCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    entranceOverall: 'Ingang',
    entranceOverallSubtext: 'Foto(\'s) van de ingang als geheel vanuit een open zicht.',
    entranceReception: 'Receptie',
    entranceReceptionSubtext: 'Foto(\'s) van de receptieruimte en -balie vanuit een open zicht.',
    entranceRoom: 'Ruimte',
    entranceRoomSubtext: 'Als geheel\n(Meubilair, harmonie, Netheid planten, etc.) Foto\'s vanuit een open zicht van de hele ruimte. Als er planten aanwezig zijn, voeg dan een foto daarvan toe. Voeg dichtbij-foto\'s van meubilair toe.',
    entranceLights: 'Verlichting',
    entranceLightsSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    entrancePlants: 'Planten',
    entrancePlantsSubtext: '',
    
    // Survey Question Texts - Break Area
    breakAsAWhole: 'Als geheel\n(Meubilair, harmonie, Netheid planten, etc.)',
    breakLighting: 'Verlichting',
    breakLightingSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    breakFloors: 'Vloeren',
    breakFloorsSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    breakCeiling: 'Plafond',
    breakCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    breakWalls: 'Muren',
    breakWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    breakDoors: 'Deuren',
    breakDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    breakTrash: 'Afval',
    breakTrashSubtext: 'Foto(\'s) die de hele prullenbak(ken) tonen.',
    
    // Survey Question Texts - Food & Drink
    foodAsAWhole: 'Als geheel\n(Meubilair, harmonie, Netheid planten, etc.)',
    foodLighting: 'Verlichting',
    foodLightingSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    foodFloors: 'Vloeren',
    foodFloorsSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    foodCeiling: 'Plafond',
    foodCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    foodWalls: 'Muren',
    foodWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    foodDoors: 'Deuren',
    foodDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    foodTrash: 'Afval',
    foodTrashSubtext: 'Foto(\'s) die de hele prullenbak(ken) tonen.',
    
    // Survey Question Texts - Corridor
    corridorAsAWhole: 'Als geheel\n(Meubilair, harmonie, planten, etc.)',
    corridorStairs: 'Trappen',
    corridorStairsSubtext: 'Foto\'s van de trappen van dichtbij en van veraf, zowel vanaf de onderkant als de bovenkant van de trappen.',
    corridorLighting: 'Verlichting',
    corridorLightingSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    corridorFloors: 'Vloeren',
    corridorFloorsSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    corridorCeiling: 'Plafond',
    corridorCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    corridorWalls: 'Muren',
    corridorWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    corridorDoors: 'Deuren',
    corridorDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    corridorTrash: 'Afval',
    corridorTrashSubtext: 'Foto(\'s) die de hele prullenbak(ken) tonen.',
    
    // Survey Question Texts - Workplaces
    workplacesAsAWhole: 'Als geheel\n(Meubilair, harmonie, planten, etc.)',
    workplacesLighting: 'Verlichting',
    workplacesLightingSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    workplacesFloors: 'Vloeren',
    workplacesFloorsSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    workplacesCeiling: 'Plafond',
    workplacesCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    workplacesWalls: 'Muren',
    workplacesWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    workplacesDoors: 'Deuren',
    workplacesDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    workplacesTrash: 'Afval',
    workplacesTrashSubtext: 'Foto(\'s) die de hele prullenbak(ken) tonen.',
    workplacesWorkstations: 'Werkplekken',
    workplacesWorkstationsSubtext: 'Foto\'s van de werkplek vanuit zowel een open zicht als dichtbij. Voor een dichtbij-zicht, focus op de tafels, computers, monitoren, kabels, stapels papier.',
    
    // Survey Question Texts - Toilet Area
    toiletSuppliesHarmony: 'Benodigdheden & Harmonie',
    toiletLighting: 'Verlichting',
    toiletLightingSubtext: 'Foto\'s van zowel natuurlijk licht (ramen en zonreflectie) als kunstmatige verlichting (armaturen).',
    toiletFloors: 'Vloeren',
    toiletFloorsSubtext: 'Foto\'s van de vloeren van dichtbij en van veraf.',
    toiletCeiling: 'Plafond',
    toiletCeilingSubtext: 'Foto van het plafond met de telefoon in een hoek gehouden. Toon de randen waar de muur eindigt en het plafond begint.',
    toiletWalls: 'Muren',
    toiletWallsSubtext: 'Foto\'s van de muren van dichtbij en van veraf. Zorg ervoor dat de muurtextuur zichtbaar is.',
    toiletDoors: 'Deuren',
    toiletDoorsSubtext: 'Foto\'s van de deuren van dichtbij en van veraf. Zorg ervoor dat deurknoppen en frames zichtbaar zijn!',
    toiletTrash: 'Afval',
    toiletTrashSubtext: 'Foto(\'s) die de hele prullenbak(ken) tonen.',
    toiletSink: 'Wastafel',
    toiletSinkSubtext: 'Algemene foto van de hele wastafel.',
    toiletToilet: 'Toilet',
    toiletToiletSubtext: 'Foto\'s van de verschillende toiletfaciliteiten.',
    
    // Analytical Questions - Entrance
    entranceReceptionAnalytical: 'Is de receptiebalie opgeruimd, zonder rommel erop of erachter?',
    entranceRoomAnalytical: 'Ziet de entree er uit als een geheel (meubels, kleurenschema\'s, interieur)? Ziet de entree er netjes uit met opgeruimde tafels? Zijn de meubels in goede staat (niet kapot, beschadigd, verf versleten, etc.)? Is de ruimte uitgerust met planten?',
    entranceLightsAnalytical: 'Is de entree goed verlicht (combinatie van daglicht & kunstlicht, let op wit/geel licht)? Werken alle lampen in de entree? Heeft de entree daglicht?',
    entrancePlantsAnalytical: 'Is de ruimte voorzien van planten en zijn ze in goede staat?',
    entranceFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    entranceCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)? (Let op, het kan ook een glazen plafond zijn).',
    entranceWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Let op, het kunnen ook glazen wanden zijn).',
    entranceDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is. (Let op, het kunnen ook glazen deuren zijn).',

    // Analytical Questions - Break/Chill-Out Area
    breakAsAWholeAnalytical: 'Ziet de pauze/ontspanningsruimte er uit als een geheel (meubels, kleurenschema\'s, interieur)? Ziet de pauze/ontspanningsruimte er netjes uit met opgeruimde tafels? Zijn de meubels in goede staat (niet kapot, beschadigd, verf versleten, etc.)? Is de ruimte voorzien van planten?',
    breakLightingAnalytical: 'Is de pauze/ontspanningsruimte goed verlicht (combinatie van daglicht & kunstlicht, let op wit/geel licht)? Werken alle lampen in de pauze/ontspanningsruimte? Heeft de pauze/ontspanningsruimte daglicht?',
    breakFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    breakCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)? (Let op, het kan ook een glazen plafond zijn).',
    breakWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Let op, het kunnen ook glazen wanden zijn).',
    breakDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is. (Let op, het kunnen ook glazen deuren zijn).',
    breakTrashAnalytical: 'Is de prullenbak vol? We beschouwen de prullenbak als vol wanneer het afval zichtbaar dicht bij of daadwerkelijk opstapelt vanaf de rand van de prullenbak.',
    
    // Analytical Questions - Corridors
    corridorAsAWholeAnalytical: 'Zien de gangen er uit als een geheel (meubels, kleurenschema\'s, interieur)? Zien de gangen er netjes uit? Zijn de meubels in goede staat (niet kapot, beschadigd, verf versleten, etc.)? Is de ruimte voorzien van planten?',
    corridorStairsAnalytical: 'Zien de trappen er schoon uit (vrij van strepen, voetafdrukken, vlekken, kauwgom, etc.)? Zijn de trappen vrij van slijtage?',
    corridorLightingAnalytical: 'Is de gang goed verlicht (combinatie van daglicht & kunstlicht, let op wit/geel licht)? Werken alle lampen in de gang? Heeft de gang daglicht?',
    corridorFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    corridorCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)? (Let op, het kan ook een glazen plafond zijn).',
    corridorWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Let op, het kunnen ook glazen wanden zijn).',
    corridorDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is). (Let op, het kunnen ook glazen wanden zijn).',
    corridorTrashAnalytical: 'Is de prullenbak vol? We beschouwen de prullenbak als vol wanneer het afval zichtbaar dicht bij of daadwerkelijk opstapelt vanaf de rand van de prullenbak.',
    
    // Analytical Questions - Workplaces
    workplacesAsAWholeAnalytical: 'Ziet de werkplek er uit als een geheel (meubels, kleurenschema\'s, interieur)? Ziet de werkplek er netjes uit? Zijn de meubels in goede staat (geen (stoelen, bureaus, etc.) kapot, beschadigd, verf versleten, etc.)? Is de ruimte voorzien van planten?',
    workplacesLightingAnalytical: 'Is de werkplek goed verlicht (combinatie van daglicht & kunstlicht, let op wit/geel licht)? Werken alle lampen op de werkplek? Heeft de werkruimte daglicht?',
    workplacesFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    workplacesCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)? (Let op, het kan ook een glazen plafond zijn).',
    workplacesWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Let op, het kunnen ook glazen wanden zijn).',
    workplacesDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is). (Let op, het kunnen ook glazen wanden zijn).',
    workplacesTrashAnalytical: 'Is de prullenbak vol? We beschouwen de prullenbak als vol wanneer het afval zichtbaar dicht bij of daadwerkelijk opstapelt vanaf de rand van de prullenbak.',
    workplacesWorkstationsAnalytical: 'Zien de werkplekken er schoon uit (vrij van vingerafdrukken, stof, afval, koffievlekken, etc.)? Zijn ze netjes en opgeruimd (let op: schone bureaus, opgeborgen kabels, stapels papier, etc.)? Zijn ze stofvrij (let op: open bedrading, kasten, bureau)? Zien de computers er schoon uit (monitor, toetsenbord, muis)?',
    
    // Analytical Questions - Toilet Area
    toiletSuppliesHarmonyAnalytical: 'Zijn de sanitaire benodigdheden aangevuld? Ziet alles in het toiletgebied er harmonieus uit (vormt een geheel, kleurenschema\'s, etc.)?',
    toiletLightingAnalytical: 'Is het toiletgebied goed verlicht (combinatie van daglicht & kunstlicht, let op wit licht)? Werken alle lampen in het toiletgebied? Heeft het toiletgebied wat daglicht?',
    toiletFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    toiletCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)?',
    toiletWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)?',
    toiletDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is)',
    toiletTrashAnalytical: 'Is de prullenbak vol? We beschouwen de prullenbak als vol wanneer het afval zichtbaar dicht bij of daadwerkelijk opstapelt vanaf de prullenbak.',
    toiletSinkAnalytical: 'Ziet/zien de wastafel(s) er schoon uit?',
    toiletToiletAnalytical: 'Zien de toiletvoorzieningen er schoon uit (zowel heren- als damestoiletten)?',
    
    // Food & Drink
    foodAsAWholeAnalytical: 'Ziet het eet- en drinkgedeelte er uit als een geheel (meubels, kleurenschema\'s, interieur)? Ziet het eet- en drinkgedeelte er netjes uit met opgeruimde tafels? Zijn de meubels in goede staat (niet kapot, beschadigd, verf versleten, kapotte stoelen, beschadigde bureaus, etc.)? Zijn de meubels schoon (geen rommel)? Is de ruimte voorzien van planten?',
    foodLightingAnalytical: 'Is het eet- en drinkgedeelte goed verlicht (combinatie van daglicht & kunstlicht, let op wit/geel licht)? Werken alle lampen in het eet- en drinkgedeelte? Heeft het eet- en drinkgedeelte daglicht?',
    foodFloorsAnalytical: 'Zijn de vloeren vrij van slijtplekken? Zien de vloeren er schoon uit (let op voegen, strepen, voetafdrukken, etc.)?',
    foodCeilingAnalytical: 'Is het plafond netjes (goed geschilderd, geen beschadigingen)? (Let op, het kan ook een glazen plafond zijn).',
    foodWallsAnalytical: 'Zijn de muren vrij van slijtage (de verf is goed)? Zien de muren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Let op, het kunnen ook glazen wanden zijn).',
    foodDoorsAnalytical: 'Zien de deuren er schoon uit (vrij van graffiti, teksten en vingerafdrukken)? (Deuren tellen alleen als deuren als de deurklink zichtbaar is. (Let op, het kunnen ook glazen deuren zijn).',
    foodTrashAnalytical: 'Is de prullenbak vol? We beschouwen de prullenbak als vol wanneer het afval zichtbaar dicht bij of daadwerkelijk opstapelt vanaf de rand van de prullenbak.',
    
    // New manual-only sections
    exterior: 'Exterieur',
    generalinterior: 'Algemeen Interieur',
    users: 'Gebruikers',
    cleaningstaff: 'Schoonmaakpersoneel',
    
    // Manual Assessment
    manualAssessment: 'Manual Assessment Observations',
  }
};

export const getTranslation = (key: keyof typeof translations.en, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
}; 