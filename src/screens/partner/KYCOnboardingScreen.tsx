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
    TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
        // Aadhaar Details
        aadhaarNumber: '',
        aadhaarName: '',
        aadhaarDOB: '',
        aadhaarAddress: '',
        aadhaarImageUrl: '',
        
        // PAN Details
        panNumber: '',
        panName: '',
        panDOB: '',
        panImageUrl: '',
        
        // Contact Details
        email: userProfile?.email || '',
        mobile: '',
        address: '',
        
        // Profile Photo
        profilePhotoUrl: '',
        
        // Captcha
        captchaInput: '',
    });

    const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
    const [errors, setErrors] = useState<Record<string, string>>({});

    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    const pickImage = async (type: 'aadhaar' | 'pan' | 'profile') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'profile' ? [1, 1] : [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setIsSubmitting(true);
            
            // Simulate OCR extraction (in production, use real OCR API)
            setTimeout(() => {
                if (type === 'aadhaar') {
                    setFormData(prev => ({
                        ...prev,
                        aadhaarImageUrl: asset.uri,
                        aadhaarNumber: '1234 5678 9012',
                        aadhaarName: 'John Doe',
                        aadhaarDOB: '01/01/1990',
                        aadhaarAddress: '123 Main Street, Lucknow, UP 226001',
                    }));
                    Alert.alert('Success', 'Aadhaar details extracted automatically!');
                } else if (type === 'pan') {
                    setFormData(prev => ({
                        ...prev,
                        panImageUrl: asset.uri,
                        panNumber: 'ABCDE1234F',
                        panName: 'JOHN DOE',
                        panDOB: '01/01/1990',
                    }));
                    Alert.alert('Success', 'PAN details extracted automatically!');
                } else {
                    setFormData(prev => ({ ...prev, profilePhotoUrl: asset.uri }));
                }
                setIsSubmitting(false);
            }, 1500);
        }
    };

    const validateAadhaar = (num: string) => {
        const cleaned = num.replace(/\s/g, '');
        return /^\d{12}$/.test(cleaned);
    };

    const validatePAN = (num: string) => {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(num.toUpperCase());
    };

    const validateMobile = (num: string) => {
        return /^[6-9]\d{9}$/.test(num);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.aadhaarNumber || !validateAadhaar(formData.aadhaarNumber)) {
            newErrors.aadhaar = 'Invalid Aadhaar number (12 digits required)';
        }
        if (!formData.panNumber || !validatePAN(formData.panNumber)) {
            newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
        }
        if (!formData.email || !validateEmail(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.mobile || !validateMobile(formData.mobile)) {
            newErrors.mobile = 'Invalid mobile number (10 digits, starts with 6-9)';
        }
        if (!formData.address || formData.address.length < 10) {
            newErrors.address = 'Address must be at least 10 characters';
        }
        if (!formData.profilePhotoUrl) {
            newErrors.profile = 'Profile photo is required';
        }
        if (formData.captchaInput.toUpperCase() !== captchaCode) {
            newErrors.captcha = 'Incorrect captcha code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix all errors before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitKYC({
                partnerId: userProfile!.uid,
                partnerName: formData.aadhaarName,
                partnerEmail: formData.email,
                idDocumentUrl: formData.aadhaarImageUrl,
                profilePhotoUrl: formData.profilePhotoUrl,
            });

            Alert.alert(
                'Success!',
                'Your KYC documents have been submitted and are pending review.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
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
                    {[1, 2, 3, 4].map((s) => (
                        <View
                            key={s}
                            style={[
                                styles.stepDot,
                                step >= s ? styles.stepActive : styles.stepInactive
                            ]}
                        />
                    ))}
                </View>

                {/* Step 1: Aadhaar Card */}
                {step === 1 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 1: Aadhaar Card</Text>
                        <Text style={styles.stepDesc}>Upload Aadhaar card - details will be auto-filled</Text>

                        <Pressable
                            style={styles.uploadBox}
                            onPress={() => pickImage('aadhaar')}
                            disabled={isSubmitting}
                        >
                            {formData.aadhaarImageUrl ? (
                                <Image source={{ uri: formData.aadhaarImageUrl }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="card-account-details" size={48} color={Colors.textMuted} />
                                    <Text style={styles.uploadText}>Upload Aadhaar Card</Text>
                                    <Text style={styles.uploadHint}>Auto-fill enabled</Text>
                                </>
                            )}
                        </Pressable>

                        {formData.aadhaarImageUrl && (
                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Aadhaar Number *</Text>
                                    <TextInput
                                        style={[styles.input, errors.aadhaar && styles.inputError]}
                                        value={formData.aadhaarNumber}
                                        onChangeText={(text) => setFormData({ ...formData, aadhaarNumber: text })}
                                        placeholder="1234 5678 9012"
                                        keyboardType="numeric"
                                        maxLength={14}
                                    />
                                    {errors.aadhaar && <Text style={styles.errorText}>{errors.aadhaar}</Text>}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Name (as per Aadhaar) *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.aadhaarName}
                                        onChangeText={(text) => setFormData({ ...formData, aadhaarName: text })}
                                        placeholder="Full Name"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Date of Birth *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.aadhaarDOB}
                                        onChangeText={(text) => setFormData({ ...formData, aadhaarDOB: text })}
                                        placeholder="DD/MM/YYYY"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Address (as per Aadhaar) *</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={formData.aadhaarAddress}
                                        onChangeText={(text) => setFormData({ ...formData, aadhaarAddress: text })}
                                        placeholder="Full Address"
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>
                        )}

                        <GradientButton
                            title="Next Step"
                            onPress={() => setStep(2)}
                            disabled={!formData.aadhaarImageUrl || isSubmitting}
                        />
                    </View>
                )}

                {/* Step 2: PAN Card */}
                {step === 2 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 2: PAN Card</Text>
                        <Text style={styles.stepDesc}>Upload PAN card - details will be auto-filled</Text>

                        <Pressable
                            style={styles.uploadBox}
                            onPress={() => pickImage('pan')}
                            disabled={isSubmitting}
                        >
                            {formData.panImageUrl ? (
                                <Image source={{ uri: formData.panImageUrl }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="card-text" size={48} color={Colors.textMuted} />
                                    <Text style={styles.uploadText}>Upload PAN Card</Text>
                                    <Text style={styles.uploadHint}>Auto-fill enabled</Text>
                                </>
                            )}
                        </Pressable>

                        {formData.panImageUrl && (
                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>PAN Number *</Text>
                                    <TextInput
                                        style={[styles.input, errors.pan && styles.inputError]}
                                        value={formData.panNumber}
                                        onChangeText={(text) => setFormData({ ...formData, panNumber: text.toUpperCase() })}
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        autoCapitalize="characters"
                                    />
                                    {errors.pan && <Text style={styles.errorText}>{errors.pan}</Text>}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Name (as per PAN) *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.panName}
                                        onChangeText={(text) => setFormData({ ...formData, panName: text })}
                                        placeholder="Full Name"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Date of Birth *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.panDOB}
                                        onChangeText={(text) => setFormData({ ...formData, panDOB: text })}
                                        placeholder="DD/MM/YYYY"
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.btnRow}>
                            <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
                                <Text style={styles.backBtnText}>Back</Text>
                            </Pressable>
                            <View style={{ flex: 1 }}>
                                <GradientButton
                                    title="Next Step"
                                    onPress={() => setStep(3)}
                                    disabled={!formData.panImageUrl || isSubmitting}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 3: Contact Details & Profile Photo */}
                {step === 3 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 3: Contact & Profile</Text>
                        <Text style={styles.stepDesc}>Provide contact details and upload profile photo</Text>

                        <View style={styles.formSection}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address *</Text>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mobile Number *</Text>
                                <TextInput
                                    style={[styles.input, errors.mobile && styles.inputError]}
                                    value={formData.mobile}
                                    onChangeText={(text) => setFormData({ ...formData, mobile: text })}
                                    placeholder="9876543210"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                                {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Current Address *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea, errors.address && styles.inputError]}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    placeholder="Full Address"
                                    multiline
                                    numberOfLines={3}
                                />
                                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Profile Photo *</Text>
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
                        {errors.profile && <Text style={styles.errorText}>{errors.profile}</Text>}

                        <View style={styles.btnRow}>
                            <Pressable style={styles.backBtn} onPress={() => setStep(2)}>
                                <Text style={styles.backBtnText}>Back</Text>
                            </Pressable>
                            <View style={{ flex: 1 }}>
                                <GradientButton
                                    title="Next Step"
                                    onPress={() => setStep(4)}
                                    disabled={isSubmitting}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 4: Captcha & Submit */}
                {step === 4 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Step 4: Verification</Text>
                        <Text style={styles.stepDesc}>Complete captcha verification and submit</Text>

                        <View style={styles.captchaContainer}>
                            <View style={styles.captchaBox}>
                                <Text style={styles.captchaText}>{captchaCode}</Text>
                            </View>
                            <Pressable
                                style={styles.refreshBtn}
                                onPress={() => {
                                    setCaptchaCode(generateCaptcha());
                                    setFormData({ ...formData, captchaInput: '' });
                                }}
                            >
                                <MaterialCommunityIcons name="refresh" size={24} color={Colors.primary} />
                            </Pressable>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Enter Captcha Code *</Text>
                            <TextInput
                                style={[styles.input, errors.captcha && styles.inputError]}
                                value={formData.captchaInput}
                                onChangeText={(text) => setFormData({ ...formData, captchaInput: text })}
                                placeholder="Enter code above"
                                autoCapitalize="characters"
                                maxLength={6}
                            />
                            {errors.captcha && <Text style={styles.errorText}>{errors.captcha}</Text>}
                        </View>

                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Review Your Details</Text>
                            <View style={styles.summaryItem}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.secondary} />
                                <Text style={styles.summaryText}>Aadhaar Card Uploaded</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.secondary} />
                                <Text style={styles.summaryText}>PAN Card Uploaded</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.secondary} />
                                <Text style={styles.summaryText}>Contact Details Provided</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.secondary} />
                                <Text style={styles.summaryText}>Profile Photo Uploaded</Text>
                            </View>
                        </View>

                        {isSubmitting ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
                        ) : (
                            <View style={styles.btnRow}>
                                <Pressable style={styles.backBtn} onPress={() => setStep(3)}>
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
    stepDot: { width: 30, height: 6, borderRadius: 3 },
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
        marginBottom: 20,
        overflow: 'hidden',
    },
    profileBox: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center' },
    uploadText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted, marginTop: 8 },
    uploadHint: { fontSize: 11, fontWeight: '600', color: Colors.secondary, marginTop: 4 },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    profilePreview: { width: '100%', height: '100%', borderRadius: 70 },

    formSection: { marginBottom: 20 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
    input: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: 14,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    inputError: { borderColor: '#EF4444', borderWidth: 2 },
    textArea: { height: 80, textAlignVertical: 'top' },
    errorText: { fontSize: 12, fontWeight: '600', color: '#EF4444', marginTop: 4 },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },

    captchaContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    captchaBox: {
        flex: 1,
        height: 60,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    captchaText: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 8,
        fontFamily: 'monospace',
    },
    refreshBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 10 },
    backBtn: { paddingHorizontal: 24, paddingVertical: 14 },
    backBtnText: { color: Colors.textMuted, fontWeight: '700', fontSize: 15 },

    summaryCard: { backgroundColor: Colors.background, padding: 20, borderRadius: BorderRadius.md, marginBottom: 20 },
    summaryTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    summaryText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
});

export default KYCOnboardingScreen;
