import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSurvey } from "@/context/SurveyContext";

export default function FinalReport() {
    const {
        questions,
        userName,
        surveyDate,
        surveyStatus,
        surveyDescription
    } = useSurvey();

    const completedQuestions = questions.filter(q => q.completed);

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

            {completedQuestions.map((question, index) => (
                <View key={question.id} style={styles.questionSection}>
                    <Text style={styles.questionText}>{question.text}</Text>

                    <View style={styles.answerBox}>
                        <Text style={styles.answerText}>
                            {question.answer || "Dolore eu culpa mollit veniam excepteur. Aliqua reprehenderit proident sint pariatur ut incididunt commodo labore sunt minim ut do eu dolor culpa. Labore cillum commodo reprehenderit irure enim excepteur labore elit aliqua. "}
                        </Text>
                    </View>

                    {renderImagePlaceholders(question.images)}

                    {index < completedQuestions.length - 1 && (
                        <View style={styles.questionDivider} />
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff'
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
    nextImageButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
});