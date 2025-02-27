import { StyleSheet, FlatList, View, Text } from 'react-native';

const reports = [
    {
        id: 1,
        title: 'Report 1',
        description: 'Description 1',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        title: 'Report 2',
        description: 'Description 2',
        image: 'https://via.placeholder.com/150',
    },
];
export default function ReportsScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={reports}
                renderItem={({ item }) => (
                    <View style={styles.reportContainer}>
                        <Text>{item.title}</Text>
                    </View>
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
    reportContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#023866',
        padding: 16,
    },
});
