import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { LocalizedText } from './LocalizedText';
import { IconSymbol } from './ui/IconSymbol';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/constants/Translations';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageModal({ visible, onClose }: LanguageModalProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <LocalizedText style={styles.modalTitle} textKey="chooseLanguage" />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity 
              style={[
                styles.languageOption,
                language === 'en' && styles.selectedOption
              ]}
              onPress={() => handleLanguageSelect('en')}
            >
              <View style={styles.languageContent}>
                <View style={styles.flagContainer}>
                  <LocalizedText style={styles.flag}>🇬🇧</LocalizedText>
                </View>
                <LocalizedText 
                  style={[
                    styles.languageText,
                    language === 'en' && styles.selectedLanguageText
                  ]} 
                  textKey="english" 
                />
              </View>
              {language === 'en' && (
                <IconSymbol name="checkmark" size={20} color="#FF5A00" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.languageOption,
                language === 'nl' && styles.selectedOption
              ]}
              onPress={() => handleLanguageSelect('nl')}
            >
              <View style={styles.languageContent}>
                <View style={styles.flagContainer}>
                  <LocalizedText style={styles.flag}>🇳🇱</LocalizedText>
                </View>
                <LocalizedText 
                  style={[
                    styles.languageText,
                    language === 'nl' && styles.selectedLanguageText
                  ]} 
                  textKey="dutch" 
                />
              </View>
              {language === 'nl' && (
                <IconSymbol name="checkmark" size={20} color="#FF5A00" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  languageOptions: {
    marginTop: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FF5A00',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    marginRight: 12,
  },
  flag: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 18,
    color: '#333',
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#FF5A00',
  },
}); 