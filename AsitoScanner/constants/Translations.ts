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
  }
};

export const getTranslation = (key: keyof typeof translations.en, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
}; 