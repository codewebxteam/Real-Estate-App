import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { FadeInView } from '../FadeInView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LocationPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: {
        state: string;
        city: string;
        subCity: string;
        ward: string;
    }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    visible,
    onClose,
    onSelect,
}) => {
    const [step, setStep] = useState(1); // 1: City, 2: Sub-city, 3: Ward (State is locked to UP)
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSubCity, setSelectedSubCity] = useState('');

    // Mock data based on Uttar Pradesh regions
    const locations = {
        'Lucknow': {
            'Gomti Nagar': ['Ward 1', 'Ward 2', 'Ward 3'],
            'Indira Nagar': ['Ward A', 'Ward B', 'Ward C'],
        },
        'Kanpur': {
            'Civil Lines': ['Ward 10', 'Ward 11'],
            'Kalyanpur': ['Ward 20', 'Ward 21'],
        },
        'Noida': {
            'Sector 18': ['A Block', 'B Block'],
            'Sector 62': ['C Block', 'D Block'],
        },
    };

    const handleSelect = (item: string) => {
        if (step === 1) {
            setSelectedCity(item);
            setStep(2);
        } else if (step === 2) {
            setSelectedSubCity(item);
            setStep(3);
        } else if (step === 3) {
            onSelect({
                state: 'Uttar Pradesh',
                city: selectedCity,
                subCity: selectedSubCity,
                ward: item,
            });
            onClose();
            // Reset after a delay
            setTimeout(() => setStep(1), 500);
        }
    };

    const getTitle = () => {
        switch (step) {
            case 1: return 'Select City in UP';
            case 2: return `Sub-city in ${selectedCity}`;
            case 3: return `Select Ward in ${selectedSubCity}`;
            default: return 'Select Location';
        }
    };

    const getData = () => {
        if (step === 1) return Object.keys(locations);
        if (step === 2) return Object.keys((locations as any)[selectedCity] || {});
        if (step === 3) return (locations as any)[selectedCity][selectedSubCity] || [];
        return [];
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <Pressable style={styles.flex} onPress={onClose} />
                <FadeInView style={styles.modalContent}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <Text style={styles.title}>{getTitle()}</Text>
                        {step > 1 && (
                            <Pressable onPress={() => setStep(step - 1)}>
                                <Text style={styles.backButton}>← Back</Text>
                            </Pressable>
                        )}
                    </View>

                    <FlatList
                        data={getData()}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handleSelect(item)}
                                style={styles.listItem}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                                <Text style={styles.itemArrow}>›</Text>
                            </Pressable>
                        )}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.empty}>No locations found</Text>}
                    />
                </FadeInView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        height: SCREEN_HEIGHT * 0.7,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: Colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    backButton: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    itemArrow: {
        fontSize: 22,
        color: Colors.textMuted,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: Colors.textMuted,
        fontSize: 15,
    },
});

export default LocationPicker;
