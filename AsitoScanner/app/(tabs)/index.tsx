import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

const reports = [
    {
        id: 'ext-001',
        scope: 'Exterior',
        areas: [
            'Building facade',
            'Windows and doors',
            'External lighting',
            'Walkways',
            'Landscaping'
        ],
        priority: 'high',
        lastInspection: '2024-01-15'
    },
    {
        id: 'int-001',
        scope: 'Interior',
        areas: [
            'Common areas',
            'Hallways',
            'Stairwells',
            'Elevators',
            'Emergency exits'
        ],
        priority: 'medium',
        lastInspection: '2024-02-01'
    },
    {
        id: 'roof-001',
        scope: 'Roof',
        areas: [
            'Roofing material',
            'Drainage systems',
            'HVAC units',
            'Solar panels',
            'Access points'
        ],
        priority: 'high',
        lastInspection: '2023-12-20'
    },
    {
        id: 'park-001',
        scope: 'Parking lot',
        areas: [
            'Surface condition',
            'Line markings',
            'Lighting',
            'Drainage',
            'Security cameras'
        ],
        priority: 'medium',
        lastInspection: '2024-01-30'
    },
    {
        id: 'other-001',
        scope: 'Other',
        areas: [
            'Security systems',
            'Fire safety equipment',
            'Utility connections',
            'Waste management',
            'Storage areas'
        ],
        priority: 'low',
        lastInspection: '2024-02-10'
    }
];

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return '#E53935';
        case 'medium':
            return '#FB8C00';
        case 'low':
            return '#43A047';
        default:
            return '#757575';
    }
};

// Helper function to get priority icon
const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'alert-circle';
        case 'medium':
            return 'alert-triangle';
        case 'low':
            return 'info';
        default:
            return 'help-circle';
    }
};

// Helper function to get scope icon
const getScopeIcon = (scope: string) => {
    switch (scope) {
        case 'Exterior':
            return 'home';
        case 'Interior':
            return 'layout';
        case 'Roof':
            return 'chevrons-up';
        case 'Parking lot':
            return 'car';
        case 'Other':
            return 'more-horizontal';
        default:
            return 'clipboard';
    }
};

export default function ReportsScreen() {
    const handleReportPress = (reportId: string) => {
        console.log(reportId);
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={reports}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.reportContainer}
                        onPress={() => handleReportPress(item.id)}
                    >
                        <View style={styles.reportContent}>
                            <View style={styles.headerRow}>
                                <View style={styles.scopeContainer}>
                                    <ThemedText style={styles.scopeText}>{item.scope}</ThemedText>
                                </View>
                                <View style={styles.priorityBadge}>
                                    <ThemedText style={styles.priorityText}>
                                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.detailsContainer}>
                                <View style={styles.areasContainer}>
                                    <ThemedText style={styles.areasText}>
                                        {item.areas.slice(0, 3).join(', ')}
                                        {item.areas.length > 3 ? ` +${item.areas.length - 3} more` : ''}
                                    </ThemedText>
                                </View>

                                <View style={styles.dateContainer}>
                                    <IconSymbol name="calendar" size={16} color="#666" />
                                    <ThemedText style={styles.dateText}>
                                        Last inspection: {formatDate(item.lastInspection)}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

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
        backgroundColor: '#F5F7FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    list: {
        width: '100%',
    },
    listContent: {
        gap: 16,
        paddingBottom: 24,
    },
    reportContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reportContent: {
        flex: 1,
        marginRight: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    scopeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scopeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF5A00',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    priorityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    detailsContainer: {
        gap: 8,
    },
    areasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    areasLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    areasText: {
        fontSize: 14,
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});