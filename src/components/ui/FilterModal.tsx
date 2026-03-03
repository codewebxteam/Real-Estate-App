import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientButton } from './GradientButton';
import { FadeInView } from '../FadeInView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
    currentFilters,
}) => {
    const [propertyType, setPropertyType] = useState(currentFilters.propertyType || '');
    const [priceRange, setPriceRange] = useState(currentFilters.priceRange || [0, 100000000]);
    const [bhk, setBhk] = useState(currentFilters.bhk || '');

    const propertyTypes = [
        { label: 'Flat', value: 'flat', icon: '🏢' },
        { label: 'House', value: 'house', icon: '🏠' },
        { label: 'Plot', value: 'plot', icon: '⛰️' },
    ];

    const bhkOptions = ['1', '2', '3', '4', '5+'];

    const handleApply = () => {
        onApply({ propertyType, priceRange, bhk });
        onClose();
    };

    const resetFilters = () => {
        setPropertyType('');
        setBhk('');
        setPriceRange([0, 100000000]);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <Pressable style={styles.flex} onPress={onClose} />
                <FadeInView style={styles.modalContent}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <Text style={styles.title}>Advanced Filters</Text>
                        <Pressable onPress={resetFilters}>
                            <Text style={styles.resetText}>Reset</Text>
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Property Type */}
                        <Text style={styles.sectionTitle}>Property Type</Text>
                        <View style={styles.typeGrid}>
                            {[
                                { id: 'flat', label: 'Flat', icon: 'office-building' as const },
                                { id: 'house', label: 'House', icon: 'home-variant' as const },
                                { id: 'plot', label: 'Plot', icon: 'land-plots' as const },
                            ].map((type) => (
                                <Pressable
                                    key={type.id}
                                    style={[
                                        styles.typeCard,
                                        propertyType === type.id && styles.typeCardActive,
                                    ]}
                                    onPress={() => setPropertyType(type.id)}
                                >
                                    <MaterialCommunityIcons
                                        name={type.icon}
                                        size={24}
                                        color={propertyType === type.id ? Colors.white : Colors.primary}
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            propertyType === type.id && styles.typeLabelActive,
                                        ]}
                                    >
                                        {type.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* BHK Selection */}
                        <Text style={styles.sectionTitle}>BHK</Text>
                        <View style={styles.bhkRow}>
                            {bhkOptions.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => setBhk(option)}
                                    style={[
                                        styles.bhkChip,
                                        bhk === option && styles.bhkChipActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bhkLabel,
                                            bhk === option && styles.bhkLabelActive,
                                        ]}
                                    >
                                        {option === '5+' ? '5+ BHK' : `${option} BHK`}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Price Range (Simplified for logic) */}
                        <Text style={styles.sectionTitle}>Max Price</Text>
                        <View style={styles.priceGrid}>
                            {[500000, 1000000, 5000000, 10000000, 20000000, 50000000].map((price) => (
                                <Pressable
                                    key={price}
                                    onPress={() => setPriceRange([0, price])}
                                    style={[
                                        styles.priceChip,
                                        priceRange[1] === price && styles.priceChipActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.priceLabel,
                                            priceRange[1] === price && styles.priceLabelActive,
                                        ]}
                                    >
                                        ₹{(price / 100000).toFixed(1)}L
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <GradientButton title="Apply Filters" onPress={handleApply} icon="✨" />
                    </View>
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
        maxHeight: SCREEN_HEIGHT * 0.85,
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
    title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
    resetText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
    content: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16, marginTop: 12 },

    typeGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    typeCard: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    typeCardActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginTop: 8,
    },
    typeLabelActive: { color: Colors.white },

    bhkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    bhkChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
    },
    bhkChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    bhkLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
    bhkLabelActive: { color: Colors.white },

    priceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    priceChip: {
        width: (Dimensions.get('window').width - 60) / 3,
        paddingVertical: 12,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    priceChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    priceLabel: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
    priceLabelActive: { color: Colors.white },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingBottom: 34,
    },
});

export default FilterModal;
