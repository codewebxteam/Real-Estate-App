import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { GradientButton } from '../../components/ui/GradientButton';
import { useAuth } from '../../context/AuthContext';
import { submitKYC } from '../../services/kycService';
import { uploadImage } from '../../services/imageKitService';

const KYCOnboardingScreen = ({ navigation }: any) => {
    const { userProfile } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        idType: 'AadharCard' as 'AadharCard' | 'PANCard' | 'VoterID',
        idDocumentUrl: '',
        profilePhotoUrl: '',
        businessName: '',
    });

    const pickImage = async (type: 'id' | 'profile') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            try {
                setIsSubmitting(true);
                const uploadResult = await uploadImage({
                    uri: asset.uri,
                    name: asset.fileName || 'upload.jpg',
                    type: 'image/jpeg',
                });

                if (type === 'id') {
                    setFormData({ ...formData, idDocumentUrl: uploadResult.url });
                } else {
                    setFormData({ ...formData, profilePhotoUrl: uploadResult.url });
                }
            } catch (error) {
                Alert.alert('Upload Failed', 'Failed to upload image to ImageKit.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.idDocumentUrl || !formData.profilePhotoUrl) {
            Alert.alert('Missing Info', 'Please upload both ID and Profile Photo.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitKYC({
                partnerId: userProfile!.uid,
                partnerName: userProfile!.name,
                partnerEmail: userProfile!.email,
                idDocumentUrl: formData.idDocumentUrl,
                profilePhotoUrl: formData.profilePhotoUrl,
                businessName: formData.businessName,
            });

            Alert.alert(
                'Success!',
                'Your KYC documents have been submitted and are pending review.',
                [{ text: 'OK', onPress: () => navigation.replace('PartnerDashboard') }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit KYC documents.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader height={160}>
                <Text style={styles.headerTitle}>KYC Verification</Text>
                <Text style={styles.headerSub}>Verify your identity to start listing</Text>
            </GradientHeader>

            <View style={styles.content}>
                <View style={styles.stepIndicator}>
                    {[1, 2, 3].map((s) => (
                        <View
                            key={s}
                            style={[
                                styles.stepDot,
                                step >= s ? styles.stepActive : styles.stepInactive
                            ]}
                        />
                    ))}
                </View>

                {step === 1 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 1: Identity Document</Text>
                        <Text style={styles.stepDesc}>Upload a clear photo of your Aadhar, PAN, or Voter ID.</Text>

                        <Pressable
                            style={styles.uploadBox}
                            onPress={() => pickImage('id')}
                            disabled={isSubmitting}
                        >
                            {formData.idDocumentUrl ? (
                                <Image source={{ uri: formData.idDocumentUrl }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="account-details" size={48} color={Colors.textMuted} />
                                    <Text style={styles.uploadText}>Select ID Document</Text>
                                </>
                            )}
                        </Pressable>

                        <GradientButton
                            title="Next Step"
                            onPress={() => setStep(2)}
                            disabled={!formData.idDocumentUrl || isSubmitting}
                        />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 2: Profile Photo</Text>
                        <Text style={styles.stepDesc}>A professional photo helps build trust with customers.</Text>

                        <Pressable
                            style={[styles.uploadBox, styles.profileBox]}
                            onPress={() => pickImage('profile')}
                            disabled={isSubmitting}
                        >
                            {formData.profilePhotoUrl ? (
                                <Image source={{ uri: formData.profilePhotoUrl }} style={styles.profilePreview} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="camera-account" size={48} color={Colors.textMuted} />
                                    <Text style={styles.uploadText}>Upload Photo</Text>
                                </>
                            )}
                        </Pressable>

                        <View style={styles.btnRow}>
                            <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
                                <Text style={styles.backBtnText}>Back</Text>
                            </Pressable>
                            <View style={{ flex: 1 }}>
                                <GradientButton
                                    title="Next Step"
                                    onPress={() => setStep(3)}
                                    disabled={!formData.profilePhotoUrl || isSubmitting}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 3: Review & Submit</Text>
                        <Text style={styles.stepDesc}>Review your details before final submission.</Text>

                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Partner Name</Text>
                                <Text style={styles.summaryValue}>{userProfile?.name}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>ID Uploaded</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.summaryValue, { color: Colors.secondary }]}>YES </Text>
                                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.secondary} />
                                </View>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Photo Uploaded</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.summaryValue, { color: Colors.secondary }]}>YES </Text>
                                    <MaterialCommunityIcons name="check-circle" size={16} color={Colors.secondary} />
                                </View>
                            </View>
                        </View>

                        {isSubmitting ? (
                            <ActivityIndicator size="large" color={Colors.primary} />
                        ) : (
                            <View style={styles.btnRow}>
                                <Pressable style={styles.backBtn} onPress={() => setStep(2)}>
                                    <Text style={styles.backBtnText}>Back</Text>
                                </Pressable>
                                <View style={{ flex: 1 }}>
                                    <GradientButton title="Submit for Approval" onPress={handleSubmit} />
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white },
    headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

    content: { padding: 20 },
    stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30 },
    stepDot: { width: 40, height: 6, borderRadius: 3 },
    stepActive: { backgroundColor: Colors.primary },
    stepInactive: { backgroundColor: Colors.borderLight },

    stepContent: { width: '100%' },
    stepTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
    stepDesc: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 20 },

    uploadBox: {
        height: 180,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        overflow: 'hidden',
    },
    profileBox: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center' },
    uploadIcon: { fontSize: 40, marginBottom: 12 },
    uploadText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    profilePreview: { width: '100%', height: '100%', borderRadius: 70 },

    btnRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    backBtn: { paddingHorizontal: 24, paddingVertical: 14 },
    backBtnText: { color: Colors.textMuted, fontWeight: '700' },

    summaryCard: { backgroundColor: Colors.background, padding: 20, borderRadius: BorderRadius.md, marginBottom: 30 },
    summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    summaryLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
    summaryValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
});

export default KYCOnboardingScreen;
