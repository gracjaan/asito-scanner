import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSurvey } from "@/context/SurveyContext";
import { router } from "expo-router";
import { useState } from "react";
import { EmailModal } from "@/components/EmailModal";
import { sendReportByEmail } from "@/services/emailService";
import { saveReport } from "@/services/storageService";
import { ManualQuestion, SurveyQuestion } from "@/context/SurveyContext";
import { LocalizedText } from "@/components/LocalizedText";
import { useLanguage } from "@/context/LanguageContext";

export default function FinalReport() {
    const {
        questions,
        manualQuestions,
        userName,
        surveyDate,
        surveyDateTime,
        surveyStatus,
        surveyDescription
    } = useSurvey();
    
    const { t } = useLanguage();
    const [showEmailModal, setShowEmailModal] = useState(false);

    const completedQuestions = questions.filter(q => q.completed);
    const hasManualQuestions = manualQuestions.length > 0;

    // Group completed questions by location
    const questionsByLocation = completedQuestions.reduce((groups: Record<string, SurveyQuestion[]>, question) => {
        const location = question.location || t('other');
        if (!groups[location]) {
            groups[location] = [];
        }
        groups[location].push(question);
        return groups;
    }, {});

    // Define the order of locations
    const locations = [
        'Entrance',
        'Break/Chill-Out Area',
        'Corridor/Hall Area',
        'Food&Drink',
        'Workplaces',
        'Toilet Area'
    ];

    const handleViewAllReports = () => {
        router.replace('/');
    };

    const handleSendEmail = async (email: string) => {
        try {
            // Create a report object from the current survey data
            const report = {
                id: new Date().getTime().toString(),
                scope: "Company",
                date: surveyDate,
                dateTime: surveyDateTime,
                status: surveyStatus,
                userName: userName,
                description: surveyDescription,
                questions: questions,
                manualQuestions: manualQuestions
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
        if (!hasManualQuestions) return null;

        // Group questions by building part
        const groupedQuestions = manualQuestions.reduce((groups: Record<string, ManualQuestion[]>, question) => {
            const part = question.buildingPart || t('other');
            if (!groups[part]) {
                groups[part] = [];
            }
            groups[part].push(question);
            return groups;
        }, {});

        // Define the order of building parts
        const buildingParts = ['Entrance', 'Break/Chill-Out Area', 'Corridor', 'Food&Drink Area', 'Workplaces', 'Toilets', 'Other'];

        return (
            <View style={styles.manualQuestionsSection}>
                <LocalizedText style={styles.manualQuestionsTitle} textKey="buildingAreaObservations" />
                
                {buildingParts.map(part => {
                    const partQuestions = groupedQuestions[part];
                    if (!partQuestions || partQuestions.length === 0) return null;
                    
                    return (
                        <View key={part} style={styles.buildingPartSection}>
                            <LocalizedText 
                                style={styles.buildingPartTitle}
                                textKey={part.toLowerCase().replace(/\//g, '').replace(/ /g, '') as any}
                                fallback={part}
                            />
                            
                            <View style={styles.manualQuestionsContainer}>
                                {partQuestions.map((question, index) => (
                                    <View key={question.id} style={styles.manualQuestionItem}>
                                        <LocalizedText style={styles.manualQuestionText}>
                                            {question.question}
                                        </LocalizedText>
                                        <LocalizedText style={[
                                            styles.manualAnswerText, 
                                            question.answer === 'Yes' ? styles.yesAnswer : 
                                            question.answer === 'No' ? styles.noAnswer : null
                                        ]}>
                                            {question.answer || t('noAnswerProvided')}
                                        </LocalizedText>
                                        
                                        {index < partQuestions.length - 1 && !question.id.includes('comments') && (
                                            <View style={styles.questionDivider} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderLocationQuestions = () => {
        if (completedQuestions.length === 0) {
            return (
                <View style={styles.emptyStateContainer}>
                    <IconSymbol name="exclamationmark.circle" size={50} color="#ccc" />
                    <LocalizedText style={styles.emptyStateText} textKey="noCompletedQuestions" />
                </View>
            );
        }

        return (
            <View style={styles.locationsContainer}>
                {locations.map(location => {
                    const locationQuestions = questionsByLocation[location];
                    if (!locationQuestions || locationQuestions.length === 0) return null;
                    
                    return (
                        <View key={location} style={styles.locationSection}>
                            <LocalizedText 
                                style={styles.locationTitle} 
                                textKey={location.toLowerCase().replace(/\//g, '').replace(/ /g, '') as any} 
                                fallback={location} 
                            />
                            
                            {locationQuestions.map((question, index) => {
                                // Get translation key from question ID
                                const getTranslationKey = (questionId: string): string | undefined => {
                                    if (!questionId) return undefined;
                                    const parts = questionId.split('-');
                                    if (parts.length < 2) return undefined;
                                    const location = parts[0];
                                    const questionType = parts.slice(1).join('-');
                                    
                                    // Special cases for specific question types
                                    if (questionType === 'as-a-whole') {
                                      return `${location}AsAWholeText`;
                                    }
                                    
                                    if (location === 'toilet' && questionType === 'supplies-harmony') {
                                      return 'toiletSuppliesHarmonyText';
                                    }
                                    
                                    return `${location}${questionType.charAt(0).toUpperCase() + questionType.slice(1)}`;
                                };
                                
                                // Get the translation key for this question
                                const translationKey = getTranslationKey(question.id);
                                
                                return (
                                <View key={question.id} style={styles.questionSection}>
                                    <LocalizedText 
                                        style={styles.questionText}
                                        textKey={translationKey as any}
                                        fallback={question.displayText || question.text}
                                    />
                                    
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

                                    {index < locationQuestions.length - 1 && (
                                        <View style={styles.questionDivider} />
                                    )}
                                </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                <LocalizedText style={styles.title} textKey="nationaleNederlandse" />
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <IconSymbol name="person" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{userName}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="calendar" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{surveyDateTime}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="hand.thumbsup" size={20} color="#000" />
                        <LocalizedText style={styles.infoText}>{surveyStatus}</LocalizedText>
                    </View>

                    <View style={styles.infoRow}>
                        <IconSymbol name="doc.text" size={20} color="#000" />
                        <LocalizedText style={styles.descriptionText}>{surveyDescription}</LocalizedText>
                    </View>
                </View>

                <View style={styles.divider} />

                {renderLocationQuestions()}
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
    locationsContainer: {
        paddingHorizontal: 20,
    },
    locationSection: {
        marginBottom: 30,
    },
    locationTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#023866',
        marginBottom: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#023866',
    },
    questionSection: {
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
    manualQuestionsSection: {
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    manualQuestionsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#023866',
        marginBottom: 15,
    },
    buildingPartSection: {
        marginBottom: 20,
    },
    buildingPartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF5A00',
        marginBottom: 10,
    },
    manualQuestionsContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
    },
    manualQuestionItem: {
        marginBottom: 10,
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
    yesAnswer: {
        color: '#4CAF50',
        fontWeight: '500',
    },
    noAnswer: {
        color: '#F44336',
        fontWeight: '500',
    }
});