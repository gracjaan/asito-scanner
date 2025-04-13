import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { LocalizedText } from '@/components/LocalizedText';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  
  return (
    <>
      <Stack.Screen options={{ title: t('oops') }} />
      <ThemedView style={styles.container}>
        <LocalizedText type="title" textKey="screenNotExist" />
        <Link href="/" style={styles.link}>
          <LocalizedText type="link" textKey="goToHome" />
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
