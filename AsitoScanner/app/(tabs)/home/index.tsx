import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/home/building-parts')}
            >
                <IconSymbol name="camera" size={50} color="#FF5A00" />
                <ThemedText style={styles.buttonText}>Start Scanning</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        justifyContent: 'center',   
        alignContent: 'center',
    },
    startButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        maxHeight: 200,
        backgroundColor: 'rgba(255, 90, 0, 0.1)',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF5A00',
        gap: 16,
    },
    buttonText: {
        fontSize: 24,
        color: '#FF5A00',
        fontWeight: '600',
    },
});