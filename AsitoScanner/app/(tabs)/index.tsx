import { StyleSheet, FlatList, View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { getAllReports, Report } from '@/services/storageService';

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return '#43A047';
        case 'in progress':
            return '#FB8C00';
        case 'not started':
            return '#E53935';
        default:
            return '#757575';
    }
};

export default function ReportsScreen() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [])
    );

    const loadReports = async () => {
        setLoading(true);
        try {
            const savedReports = await getAllReports();
            setReports(savedReports.reverse());
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportPress = (reportId: string) => {
        router.push({
            pathname: "/report/[id]",
            params: { id: reportId }
        });
    };

    if (reports.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <IconSymbol name="doc.text" size={60} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                    No reports found. Complete a survey to create your first report.
                </ThemedText>
                <TouchableOpacity 
                    style={styles.newSurveyButton}
                    onPress={() => router.push('/home')}
                >
                    <ThemedText style={styles.newSurveyButtonText}>Start New Survey</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={reports}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onRefresh={loadReports}
                refreshing={loading}
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
                                <View style={[
                                    styles.priorityBadge, 
                                    { backgroundColor: getStatusColor(item.status) }
                                ]}>
                                    <ThemedText style={styles.priorityText}>
                                        {item.status}
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.detailsContainer}>
                                <View style={styles.areasContainer}>
                                    <ThemedText style={styles.areasText}>
                                        {item.description || 'No description provided'}
                                    </ThemedText>
                                </View>

                                <View style={styles.dateContainer}>
                                    <IconSymbol name="calendar" size={16} color="#666" />
                                    <ThemedText style={styles.dateText}>
                                        {item.dateTime || item.date}
                                    </ThemedText>
                                </View>
                                
                                <View style={styles.userContainer}>
                                    <IconSymbol name="person" size={16} color="#666" />
                                    <ThemedText style={styles.userText}>
                                        {item.userName}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        <IconSymbol name="chevron.right" size={24} color="#023866" />
                    </TouchableOpacity>
                )}
            />
            
            <TouchableOpacity 
                style={styles.floatingButton}
                onPress={() => router.push('/home')}
            >
                <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#F5F7FA',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F7FA',
    },
    emptyText: {
        marginTop: 16,
        marginBottom: 24,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    newSurveyButton: {
        backgroundColor: '#FF5A00',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    newSurveyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        paddingTop: 16,
        paddingBottom: 100,
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    priorityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
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
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF5A00',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
