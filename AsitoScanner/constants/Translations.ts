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
    
    // Authentication
    login: 'Login',
    logout: 'Logout',
    
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
    nationaleNederlandse: 'Nationale Nederlandse',
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
    
    // Authentication
    login: 'Inloggen',
    logout: 'Uitloggen',
    
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
    nationaleNederlandse: 'Nationale Nederlandse',
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
    toiletFragrance: 'Wordt er gewichtelijk gebruik gemaakt van geur? (dispensers, kaarsen, etc.)',
    lookReal: 'Kijk echt uit, maar je kunt het niet zeker zeggen',
    lookFake: 'Kijk foutig en artificiëel uit, maar je kunt het niet zeker zeggen',
    yes: 'Ja',
    no: 'Nee',
  }
};

export const getTranslation = (key: keyof typeof translations.en, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
}; 