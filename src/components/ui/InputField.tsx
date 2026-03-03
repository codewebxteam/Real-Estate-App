import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    FadeIn,
} from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: string;
    icon?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    icon,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = useSharedValue(0);

    const handleFocus = () => {
        setIsFocused(true);
        borderColor.value = withTiming(1, { duration: 200 });
    };

    const handleBlur = () => {
        setIsFocused(false);
        borderColor.value = withTiming(0, { duration: 200 });
    };

    const animatedBorder = useAnimatedStyle(() => ({
        borderColor: borderColor.value > 0.5 ? Colors.primary : error ? Colors.error : Colors.border,
        borderWidth: borderColor.value > 0.5 ? 2 : 1,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Animated.View style={[styles.inputContainer, animatedBorder, Shadows.sm]}>
                {icon && <Text style={styles.icon}>{icon}</Text>}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </Animated.View>
            {error && (
                <Animated.Text entering={FadeIn.duration(200)} style={styles.error}>
                    {error}
                </Animated.Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 16,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    error: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 4,
        marginLeft: 4,
    },
});
