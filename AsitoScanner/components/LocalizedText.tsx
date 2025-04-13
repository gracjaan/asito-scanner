import React from 'react';
import { Text, TextProps } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { ThemedText } from './ThemedText';

type LocalizedTextProps = TextProps & {
  textKey?: keyof typeof import('@/constants/Translations').translations.en;
  children?: React.ReactNode;
  fallback?: string;
  params?: Record<string, string | number>;
  useThemedText?: boolean;
};

export function LocalizedText({
  textKey,
  children,
  fallback,
  params = {},
  useThemedText = true,
  ...props
}: LocalizedTextProps) {
  const { t } = useLanguage();
  
  let content: React.ReactNode = children;
  
  if (textKey) {
    content = t(textKey);
  } else if (typeof children === 'string' && children.startsWith('$')) {
    // If the child is a string starting with '$', treat it as a translation key
    const key = children.substring(1) as keyof typeof import('@/constants/Translations').translations.en;
    content = t(key);
  }
  
  if (!content && fallback) {
    content = fallback;
  }
  
  // Apply any parameter replacements for strings
  if (typeof content === 'string' && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      content = (content as string).replace(`{${key}}`, String(value));
    });
  }
  
  const TextComponent = useThemedText ? ThemedText : Text;
  
  return <TextComponent {...props}>{content}</TextComponent>;
} 