import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

const reports = [
    {
        scope: 'Exterior',
    },
    {
        scope: 'Interior',
    },
    {
        scope: 'Roof',
    },
    {
        scope: 'Parking lot',
    },
    {
        scope: 'Other',
    },

];

export default function ReportsScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={reports}
                keyExtractor={(item) => item.scope}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.reportContainer} onPress={() => router.push('/home/capture')}>
                        <ThemedText>{item.scope}</ThemedText>
                        <IconSymbol name="chevron.right" size={24} color="#023866" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    list: {
        width: '100%',
        gap: 16,
    },
    reportContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#023866',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listContent: {
        gap: 16,
    },
});
