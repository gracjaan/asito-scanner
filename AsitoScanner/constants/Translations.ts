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
    startScan: 'Start Scan',
    scanComplete: 'Scan Complete',
    scanInProgress: 'Scanning in Progress',
    report: 'Report',
    viewReport: 'View Report',
    sendEmail: 'Send Report via Email',
    enterEmail: 'Email Address',
    emailSent: 'Email Sent Successfully',
    
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
    
    // Errors
    error: 'Fout',
    tryAgain: 'Probeer Opnieuw',
    send: 'Versturen',
  }
};

export const getTranslation = (key: keyof typeof translations.en, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
}; 