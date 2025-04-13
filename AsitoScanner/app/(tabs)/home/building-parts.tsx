import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LocalizedText } from '@/components/LocalizedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/constants/Translations';

type BuildingPart = {
    scope: string;
    translationKey: keyof typeof translations.en;
};

const getBuildingParts = (): BuildingPart[] => [
    {
        scope: 'Entrance',
        translationKey: 'entrance',
    },
    {
        scope: 'Break/Chill-Out Area',
        translationKey: 'breakArea',
    },
    {
        scope: 'Food&Drink',
        translationKey: 'foodDrink',
    },
    {
        scope: 'Corridor/Hall Area',
        translationKey: 'corridor',
    },
    {
        scope: 'Workplaces',
        translationKey: 'workplaces',
    },
    {
        scope: 'Toilet Area',
        translationKey: 'toiletArea',
    },
];

export default function BuildingPartsScreen() {
    const { t } = useLanguage();
    const buildingParts = getBuildingParts();
    
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={buildingParts}
                keyExtractor={(item) => item.scope}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.reportContainer}
                        onPress={() =>
                            router.push({
                                pathname: '/home/capture',
                                params: { location: item.scope }
                            })
                        }
                    >
                        <LocalizedText textKey={item.translationKey} />
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
