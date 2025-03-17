import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSurvey } from "@/context/SurveyContext";
import { router } from "expo-router";
import { useState } from "react";
import { EmailModal } from "@/components/EmailModal";
import { sendReportByEmail } from "@/services/emailService";
import { saveReport } from "@/services/storageService";

export default function FinalReport() {
    const {
        questions,
        userName,
        surveyDate,
        surveyStatus,
        surveyDescription
    } = useSurvey();

    const [showEmailModal, setShowEmailModal] = useState(false);

    const completedQuestions = questions.filter(q => q.completed);

    const handleViewAllReports = () => {
        router.replace('/');
    };

    const handleSendEmail = async (email: string) => {
        try {
            // Create a report object from the current survey data
            const report = {
                id: new Date().getTime().toString(),
                scope: "Nationale Nederlandse",
                date: surveyDate,
                status: surveyStatus,
                userName: userName,
                description: surveyDescription,
                questions: questions
            };

            // Save the report first (if not already saved)
            await saveReport(report);

            // Send the email
            return await sendReportByEmail(report, email);
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                message: "Failed to send email. Please try again."
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
                    <Text style={styles.moreImagesText}>+{images.length - 2}</Text>
                </View>
            );
        }

        return (
            <View style={styles.imagesContainer}>
                {placeholders}
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Nationale Nederlandse</Text>
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <IconSymbol name="person" size={20} color="#000" />
                        <Text style={styles.infoText}>{userName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="calendar" size={20} color="#000" />
                        <Text style={styles.infoText}>{surveyDate}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="hand.thumbsup" size={20} color="#000" />
                        <Text style={styles.infoText}>{surveyStatus}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="doc.text" size={20} color="#000" />
                        <Text style={styles.descriptionText}>{surveyDescription}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {completedQuestions.length > 0 ? (
                    completedQuestions.map((question, index) => (
                        <View key={question.id} style={styles.questionSection}>
                            <Text style={styles.questionText}>
                                {question.displayText || question.text}
                            </Text>
                            
                            <View style={styles.analyticalQuestionContainer}>
                                <Text style={styles.analyticalQuestionText}>
                                    {question.analyticalQuestion || question.text}
                                </Text>
                            </View>

                            <View style={styles.answerBox}>
                                <Text style={styles.answerText}>
                                    {question.answer || "No analysis available for this question."}
                                </Text>
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
                        <Text style={styles.emptyStateText}>
                            No completed questions found. Please complete at least one question to generate a report.
                        </Text>
                    </View>
                )}
                
                {/* Add some padding at the bottom for the button */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Email Modal */}
            <EmailModal
                visible={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSendEmail={handleSendEmail}
            />

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setShowEmailModal(true)}
                >
                    <IconSymbol name="envelope" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleViewAllReports}
                >
                    <IconSymbol name="doc.text" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
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
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        flexDirection: 'column',
        gap: 16,
    },
    actionButton: {
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