import React, { useState, useCallback, useMemo } from 'react';
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
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { InputField } from '../../components/ui/InputField';
import { GradientButton } from '../../components/ui/GradientButton';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { loginUser } from '../../services/authService';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const emailError = useMemo(() => {
        if (!email) return undefined;
        if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email';
        return undefined;
    }, [email]);

    const passwordError = useMemo(() => {
        if (!password) return undefined;
        if (password.length < 6) return 'Min 6 characters';
        return undefined;
    }, [password]);

    const isFormValid = useMemo(() => {
        return email.trim() && password.trim() && !emailError && !passwordError;
    }, [email, password, emailError, passwordError]);

    const handleLogin = useCallback(async () => {
        if (!isFormValid) return;
        setIsLoading(true);
        try {
            await loginUser(email.trim(), password);
        } catch (error: any) {
            const message =
                error.code === 'auth/user-not-found'
                    ? 'No account found with this email'
                    : error.code === 'auth/wrong-password'
                        ? 'Incorrect password'
                        : error.code === 'auth/invalid-credential'
                            ? 'Invalid email or password'
                            : 'Login failed. Please try again.';
            Alert.alert('Login Error', message);
        } finally {
            setIsLoading(false);
        }
    }, [email, password, isFormValid]);

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
                <GradientHeader height={280}>
                    <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.headerInner}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="home-city" size={50} color={Colors.white} />
                        </View>
                        <Text style={styles.headerTitle}>UP Properties</Text>
                        <Text style={styles.headerSubtitle}>
                            Your trusted real estate partner in Uttar Pradesh
                        </Text>
                    </Animated.View>
                </GradientHeader>

                {/* Form Card */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(300)}
                    style={styles.formCard}
                >
                    <Text style={styles.formTitle}>Welcome Back</Text>
                    <Text style={styles.formSubtitle}>Sign in to continue</Text>

                    <View style={styles.formFields}>
                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            icon="email-outline"
                            error={emailError}
                        />

                        <InputField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            icon="lock-outline"
                            error={passwordError}
                        />

                        <Pressable style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </Pressable>

                        <GradientButton
                            title="Sign In"
                            onPress={handleLogin}
                            isLoading={isLoading}
                            disabled={!isFormValid}
                            icon="🚀"
                            style={{ marginTop: 8 }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Register Link */}
                    <Animated.View entering={FadeInDown.delay(500)}>
                        <Pressable
                            onPress={() => navigation.navigate('Register')}
                            style={styles.registerLink}
                        >
                            <Text style={styles.registerText}>
                                Don't have an account?{' '}
                                <Text style={styles.registerTextBold}>Create One</Text>
                            </Text>
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { flexGrow: 1 },
    headerInner: { alignItems: 'center' },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.lg,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        ...Shadows.glow,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.textOnPrimary,
        textAlign: 'center',
        letterSpacing: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 8,
        maxWidth: '80%',
    },
    formCard: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginTop: -50,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.premium,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    formFields: {},
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    forgotPasswordText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        fontSize: 12,
        color: Colors.textMuted,
        marginHorizontal: 16,
        fontWeight: '600',
    },
    registerLink: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    registerText: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    registerTextBold: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

export default LoginScreen;
