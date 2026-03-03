import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { GradientButton } from '../../components/ui/GradientButton';
import LocationPicker from '../../components/ui/LocationPicker';
import { useAuth } from '../../context/AuthContext';
import { createProperty } from '../../services/propertyService';
import { uploadImage } from '../../services/imageKitService';
import { PropertyType, ListingType } from '../../types';

const AddPropertyScreen = ({ navigation }: any) => {
    const { userProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'flat' as PropertyType,
        listingType: 'sale' as ListingType,
        price: '',
        bhk: '',
        area: '',
        areaUnit: 'sqft' as 'sqft' | 'sqm' | 'sqyd',
        images: [] as string[],
        location: {
            state: 'Uttar Pradesh',
            city: '',
            subCity: '',
            ward: '',
            address: '',
            latitude: 0,
            longitude: 0,
        },
        amenities: [] as string[],
    });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setIsLoading(true);
            try {
                const uploadedUrls = await Promise.all(
                    result.assets.map(async (asset) => {
                        const uploadRes = await uploadImage({
                            uri: asset.uri,
                            name: asset.fileName || `prop_${Date.now()}.jpg`,
                            type: 'image/jpeg',
                        });
                        return uploadRes.url;
                    })
                );
                setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
            } catch (error) {
                Alert.alert('Upload Error', 'Failed to upload some images.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLocationSelect = (loc: any) => {
        setFormData({
            ...formData,
            location: {
                ...formData.location,
                city: loc.city,
                subCity: loc.subCity,
                ward: loc.ward,
            }
        });
        setShowLocationPicker(false);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.location.city) {
            Alert.alert('Required Fields', 'Please fill in title, price, and location.');
            return;
        }

        setIsLoading(true);
        try {
            await createProperty({
                ...formData,
                ownerId: userProfile!.uid,
                partnerId: userProfile!.uid,
                partnerName: userProfile!.name,
                price: Number(formData.price),
                bhk: formData.bhk ? Number(formData.bhk) : undefined,
                area: Number(formData.area),
            });

            Alert.alert('Success', 'Property submitted for review!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create property.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>Add Property</Text>
            </GradientHeader>

            <View style={styles.content}>
                {/* Basic Info */}
                <Text style={styles.sectionTitle}>Basic Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Property Title (e.g. 3BHK Luxury Flat)"
                    value={formData.title}
                    onChangeText={(t) => setFormData({ ...formData, title: t })}
                />

                <View style={styles.row}>
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.chipRow}>
                            {['flat', 'house', 'plot'].map((t) => (
                                <Pressable
                                    key={t}
                                    onPress={() => setFormData({ ...formData, propertyType: t as PropertyType })}
                                    style={[styles.chip, formData.propertyType === t && styles.chipActive]}
                                >
                                    <Text style={[styles.chipText, formData.propertyType === t && styles.chipTextActive]}>
                                        {t.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Listing For</Text>
                        <View style={styles.chipRow}>
                            {['sale', 'rent'].map((l) => (
                                <Pressable
                                    key={l}
                                    onPress={() => setFormData({ ...formData, listingType: l as ListingType })}
                                    style={[styles.chip, formData.listingType === l && styles.chipActive]}
                                >
                                    <Text style={[styles.chipText, formData.listingType === l && styles.chipTextActive]}>
                                        {l.toUpperCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Pricing & Area */}
                <View style={styles.row}>
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Price (₹)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Total Price"
                            keyboardType="numeric"
                            value={formData.price}
                            onChangeText={(t) => setFormData({ ...formData, price: t })}
                        />
                    </View>
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Area ({formData.areaUnit})</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1200"
                            keyboardType="numeric"
                            value={formData.area}
                            onChangeText={(t) => setFormData({ ...formData, area: t })}
                        />
                    </View>
                </View>

                {/* Location Section */}
                <Text style={styles.sectionTitle}>Location in UP</Text>
                <Pressable
                    style={styles.locationSelector}
                    onPress={() => setShowLocationPicker(true)}
                >
                    <Text style={formData.location.city ? styles.selectedLocText : styles.placeholderLocText}>
                        {formData.location.city
                            ? `${formData.location.ward}, ${formData.location.subCity}, ${formData.location.city}`
                            : "Select City → Sub-city → Ward"}
                    </Text>
                    <Text>📍</Text>
                </Pressable>

                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Full Address / Landmark"
                    multiline
                    value={formData.location.address}
                    onChangeText={(t) => setFormData({ ...formData, location: { ...formData.location, address: t } })}
                />

                {/* Images */}
                <Text style={styles.sectionTitle}>Photos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    <Pressable style={styles.addImageBtn} onPress={handlePickImage}>
                        <Text style={{ fontSize: 30 }}>📷</Text>
                        <Text style={{ fontSize: 10, fontWeight: '700', marginTop: 4 }}>Add Photo</Text>
                    </Pressable>
                    {formData.images.map((img, i) => (
                        <View key={i} style={styles.imagePreview}>
                            <Text>✅</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ height: 30 }} />

                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                    <GradientButton title="Submit Listing" onPress={handleSubmit} />
                )}
            </View>

            <LocationPicker
                visible={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onSelect={handleLocationSelect}
            />
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginTop: 20 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 24, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: 16,
        fontSize: 15,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    row: { flexDirection: 'row', gap: 12 },
    flex1: { flex: 1 },
    chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: 11, fontWeight: '800', color: Colors.textMuted },
    chipTextActive: { color: Colors.white },

    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: BorderRadius.md,
        marginBottom: 12,
    },
    placeholderLocText: { color: Colors.textMuted, fontSize: 15 },
    selectedLocText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },

    imageScroll: { flexDirection: 'row', gap: 10 },
    addImageBtn: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.md,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    }
});

export default AddPropertyScreen;
