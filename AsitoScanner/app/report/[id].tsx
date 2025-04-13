import { View, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getReportById, Report } from "@/services/storageService";
import { router } from "expo-router";
import { EmailModal } from "@/components/EmailModal";
import { sendReportByEmail } from "@/services/emailService";
import { LocalizedText } from "@/components/LocalizedText";
import { useLanguage } from "@/context/LanguageContext";

export default function ReportDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        if (!id) {
            router.back();
            return;
        }

        setLoading(true);
        try {
            const reportData = await getReportById(id);
            if (reportData) {
                setReport(reportData);
            } else {
                // Report not found
                alert(t('reportNotFound'));
                router.back();
            }
        } catch (error) {
            console.error('Error loading report:', error);
            alert(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (email: string) => {
        if (!report) {
            return {
                success: false,
                message: t('reportNotFound')
            };
        }

        try {
            return await sendReportByEmail(report, email);
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                message: t('unexpectedError')
            };
        }
    };

    const renderImagePlaceholders = (images: string[]) => {
        if (images.length === 0) return null;

        const placeholders = [];
        for (let i = 0; i < Math.min(images.length, 3); i++) {
            placeholders.push(
                <View key={i} style={styles.imagePlaceholder}>
                    <Image source={{ uri: images[i] }} style={styles.placeholderImage} />
                </View>
            );
        }

        if (images.length > 3) {
            placeholders.pop();
            placeholders.push(
                <View key="more" style={[styles.imagePlaceholder, styles.moreImages]}>
                    <LocalizedText style={styles.moreImagesText}>+{images.length - 2}</LocalizedText>
                </View>
            );
        }

        return (
            <View style={styles.imagesContainer}>
                {placeholders}
            </View>
        );
    };
    
    const renderManualQuestions = () => {
        if (!report || !report.manualQuestions || report.manualQuestions.length === 0) return null;

        const manualQuestions = report.manualQuestions || [];
        
        return (
            <View style={styles.manualQuestionsSection}>
                <LocalizedText style={styles.manualQuestionsTitle} textKey="additionalObservations" />
                
                <View style={styles.manualQuestionsContainer}>
                    {manualQuestions.map((question, index) => (
                        <View key={question.id} style={styles.manualQuestionItem}>
                            <LocalizedText style={styles.manualQuestionText}>
                                {question.question}
                            </LocalizedText>
                            <LocalizedText style={styles.manualAnswerText}>
                                {question.answer || t('noAnswerProvided')}
                            </LocalizedText>
                            
                            {index < manualQuestions.length - 1 && (
                                <View style={styles.questionDivider} />
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF5A00" />
                <LocalizedText style={styles.loadingText} textKey="loadingReport" />
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.circle" size={50} color="#ccc" />
                <LocalizedText style={styles.errorText} textKey="reportNotFound" />
            </View>
        );
    }

    const completedQuestions = report.questions.filter(q => q.completed);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                <LocalizedText style={styles.title} textKey="nationaleNederlandse" />
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <IconSymbol name="person" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{report.userName}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="calendar" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{report.dateTime || report.date}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="hand.thumbsup" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{report.status}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="doc.text" size={20} color="#000" />
                        <LocalizedText style={styles.descriptionText}>{report.description}</LocalizedText>
                    </View>
                </View>

                <View style={styles.divider} />

                {completedQuestions.length > 0 ? (
                    completedQuestions.map((question, index) => (
                        <View key={question.id} style={styles.questionSection}>
                            <LocalizedText style={styles.questionText}>
                                {question.displayText || question.text}
                            </LocalizedText>
                            
                            <View style={styles.analyticalQuestionContainer}>
                                <LocalizedText style={styles.analyticalQuestionText}>
                                    {question.analyticalQuestion || question.text}
                                </LocalizedText>
                            </View>

                            <View style={styles.answerBox}>
                                <LocalizedText style={styles.answerText}>
                                    {question.answer || t('noAnalysisAvailable')}
                                </LocalizedText>
                            </View>

                            {renderImagePlaceholders(question.images)}

                            {index < completedQuestions.length - 1 && (
                                <View style={styles.questionDivider} />
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <IconSymbol name="exclamationmark.circle" size={50} color="#ccc" />
                        <LocalizedText style={styles.emptyStateText} textKey="noCompletedQuestionsInReport" />
                    </View>
                )}
                
                {renderManualQuestions()}
                
                {/* Add some padding at the bottom for the button */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Email Modal */}
            <EmailModal
                visible={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSendEmail={handleSendEmail}
            />

            {/* Email Button */}
            <TouchableOpacity 
                style={styles.emailButton}
                onPress={() => setShowEmailModal(true)}
            >
                <IconSymbol name="envelope" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff'
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    divider: {
        height: 2,
        backgroundColor: '#FF5A00',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
        flex: 1,
    },
    questionSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    analyticalQuestionContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
    },
    analyticalQuestionText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
    },
    answerBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 15,
        marginBottom: 15,
    },
    answerText: {
        fontSize: 16,
        color: '#000',
    },
    imagesContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#eee',
        marginRight: 10,
        overflow: 'hidden',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    moreImages: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    moreImagesText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    questionDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    emptyStateContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    emailButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
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
    manualQuestionsSection: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    manualQuestionsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#023866',
        marginBottom: 15,
    },
    manualQuestionsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    manualQuestionItem: {
        marginBottom: 15,
    },
    manualQuestionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    manualAnswerText: {
        fontSize: 15,
        color: '#444',
        marginLeft: 10,
    },
}); 