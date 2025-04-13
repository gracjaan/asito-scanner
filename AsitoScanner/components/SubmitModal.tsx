import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { LocalizedText } from '@/components/LocalizedText';

interface SubmitModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onContinueToManualQuestions: () => void;
}

export function SubmitModal({ visible, onCancel, onSubmit, onContinueToManualQuestions }: SubmitModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LocalizedText style={styles.modalTitle} textKey="sectionComplete" />
          <LocalizedText style={styles.modalText} textKey="completeManualQuestions" />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <LocalizedText style={styles.cancelButtonText} textKey="cancel" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.continueButton]} 
              onPress={onContinueToManualQuestions}
            >
              <LocalizedText style={styles.continueButtonText} textKey="next" />
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#023866',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FF5A00',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FF5A00',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 