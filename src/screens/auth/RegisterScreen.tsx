import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Alert,
    StyleSheet,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeInRight,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { InputField } from '../../components/ui/InputField';
import { GradientButton } from '../../components/ui/GradientButton';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { registerUser } from '../../services/authService';
import { UserRole } from '../../types';

const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Min 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            await registerUser(email.trim(), password, name.trim(), selectedRole);
            Alert.alert('Success! 🎉', 'Your account has been created successfully.');
            // Navigation is handled by AuthContext
        } catch (error: any) {
            const message =
                error.code === 'auth/email-already-in-use'
                    ? 'An account with this email already exists'
                    : error.code === 'auth/weak-password'
                        ? 'Password is too weak'
                        : 'Registration failed. Please try again.';
            Alert.alert('Registration Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    const roles: { key: UserRole; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; desc: string }[] = [
        { key: 'customer', label: 'Customer', icon: 'account-search-outline', desc: 'Browse & buy properties' },
        { key: 'partner', label: 'Partner', icon: 'home-plus-outline', desc: 'List & sell properties' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <GradientHeader height={220}>
                    <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.headerInner}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="account-plus" size={40} color={Colors.white} />
                        </View>
                        <Text style={styles.headerTitle}>Join UP Properties</Text>
                        <Text style={styles.headerSubtitle}>Create your account</Text>
                    </Animated.View>
                </GradientHeader>

                {/* Form Card */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(300)}
                    style={styles.formCard}
                >
                    {/* Role Selector */}
                    <Text style={styles.sectionTitle}>I am a</Text>
                    <View style={styles.roleRow}>
                        {roles.map((role, index) => (
                            <Animated.View
                                key={role.key}
                                entering={FadeInRight.delay(400 + (index * 100)).duration(600).springify()}
                                style={{ flex: 1 }}
                            >
                                <Pressable
                                    onPress={() => setSelectedRole(role.key)}
                                    style={[
                                        styles.roleCard,
                                        selectedRole === role.key && styles.roleCardActive,
                                    ]}
                                >
                                    <View style={[styles.roleIconContainer, selectedRole === role.key && styles.roleIconContainerActive]}>
                                        <MaterialCommunityIcons
                                            name={role.icon}
                                            size={28}
                                            color={selectedRole === role.key ? Colors.primary : Colors.textMuted}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.roleLabel,
                                            selectedRole === role.key && styles.roleLabelActive,
                                        ]}
                                    >
                                        {role.label}
                                    </Text>
                                    <Text style={styles.roleDesc}>{role.desc}</Text>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Fields */}
                    <View style={styles.formFields}>
                        <InputField
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Rahul Sharma"
                            autoCapitalize="words"
                            icon="account-outline"
                            error={name === '' ? undefined : errors.name}
                        />

                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            icon="email-outline"
                            error={email === '' ? undefined : errors.email}
                        />

                        <InputField
                            label="Phone (Optional)"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+91 9876543210"
                            keyboardType="phone-pad"
                            icon="phone-outline"
                        />

                        <InputField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Min 6 characters"
                            secureTextEntry
                            icon="lock-outline"
                            error={password === '' ? undefined : errors.password}
                        />

                        <InputField
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Re-enter password"
                            secureTextEntry
                            icon="lock-check-outline"
                            error={confirmPassword === '' ? undefined : errors.confirmPassword}
                        />

                        <GradientButton
                            title="Create Account"
                            onPress={handleRegister}
                            isLoading={isLoading}
                            icon="🚀"
                            style={{ marginTop: 12 }}
                        />
                    </View>

                    {/* Login Link */}
                    <Animated.View entering={FadeInDown.delay(500)}>
                        <Pressable
                            onPress={() => navigation.goBack()}
                            style={styles.loginLink}
                        >
                            <Text style={styles.loginText}>
                                Already have an account?{' '}
                                <Text style={styles.loginTextBold}>Sign In</Text>
                            </Text>
                        </Pressable>
                    </Animated.View>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { flexGrow: 1 },
    headerInner: { alignItems: 'center' },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        ...Shadows.glow,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: Colors.textOnPrimary,
        textAlign: 'center',
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 4,
    },
    formCard: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginTop: -40,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.premium,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    roleRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    roleCard: {
        flex: 1,
        padding: 14,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    roleCardActive: {
        borderColor: Colors.primary,
        backgroundColor: '#EEF2FF',
        ...Shadows.md,
    },
    roleIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    roleIconContainerActive: {
        backgroundColor: Colors.white,
    },
    roleIcon: { fontSize: 24, marginBottom: 4 },
    roleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    roleLabelActive: {
        color: Colors.primary,
    },
    roleDesc: {
        fontSize: 11,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 2,
    },
    formFields: {},
    loginLink: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    loginText: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    loginTextBold: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

export default RegisterScreen;
