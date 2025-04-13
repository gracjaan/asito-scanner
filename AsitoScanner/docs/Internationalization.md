# Asito Scanner - Internationalization (i18n)

This document describes how to use and extend the internationalization (i18n) system implemented in the Asito Scanner app.

## Overview

The app supports multiple languages with a simple translation system. Currently, the following languages are implemented:

- English (en)
- Dutch (nl)

Users can switch between languages by tapping the globe icon in the app header, which opens a language selection modal.

## How It Works

The internationalization system consists of:

1. **Translation Files**: Located in `constants/Translations.ts`
2. **Language Context**: Located in `context/LanguageContext.tsx` 
3. **LocalizedText Component**: Located in `components/LocalizedText.tsx`
4. **Language Modal**: Located in `components/LanguageModal.tsx`
5. **Language Toggle**: A globe icon in the app header that opens the language selection modal

## Adding Translations

To add new text to the application with translations:

1. Add new keys and translations to `constants/Translations.ts`:

```typescript
export const translations = {
  en: {
    // Add your English translations here
    newKey: 'English text',
  },
  nl: {
    // Add your Dutch translations here
    newKey: 'Dutch text',
  },
};
```

## Using Translations in Components

There are two ways to use translations in your components:

### 1. Using the LocalizedText Component

The `LocalizedText` component can be used as a direct replacement for `Text` or `ThemedText`:

```jsx
import { LocalizedText } from '@/components/LocalizedText';

// Using a key directly
<LocalizedText textKey="cancel" />

// Using translations with parameters
<LocalizedText 
  textKey="greeting" 
  params={{ name: userName }} 
/>

// Using a regular string (no translation)
<LocalizedText>This won't be translated</LocalizedText>

// Using the special $ prefix in children
<LocalizedText>$cancel</LocalizedText>
```

### 2. Using the useLanguage Hook

For more complex scenarios, you can use the `useLanguage` hook:

```jsx
import { useLanguage } from '@/context/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  // Get a translated string
  const translatedText = t('cancel');
  
  // Change the language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };
  
  return (
    // Your component JSX
  );
}
```

## Adding New Languages

To add support for a new language:

1. Update the `Language` type in `constants/Translations.ts`:
```typescript
export type Language = 'en' | 'nl' | 'fr'; // Add new language code
```

2. Add translations for the new language in the `translations` object:
```typescript
export const translations = {
  en: { ... },
  nl: { ... },
  fr: { // New language
    appName: 'Asito Scanner',
    // Add all translations here
  }
};
```

3. Update the `LanguageModal` component in `components/LanguageModal.tsx` to include the new language option with appropriate flag and text.

## Best Practices

1. **Use Keys Consistently**: Use the same translation keys across the application.
2. **Keep Translations Short**: Avoid long translations that might not fit in UI elements.
3. **Use Parameters**: For dynamic content, use parameters rather than concatenating strings.
4. **Update All Languages**: When adding a new key, add translations for all supported languages. 