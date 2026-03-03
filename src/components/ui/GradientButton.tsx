import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    style?: ViewStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    variant = 'primary',
    size = 'lg',
    icon,
    style,
}) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: Colors.primary, ...Shadows.lg };
            case 'secondary':
                return { backgroundColor: Colors.secondary, ...Shadows.md };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: Colors.primary };
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
            case 'ghost':
                return { color: Colors.primary };
            default:
                return { color: Colors.textOnPrimary };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: 10, paddingHorizontal: 16 };
            case 'md':
                return { paddingVertical: 12, paddingHorizontal: 20 };
            case 'lg':
                return { paddingVertical: 16, paddingHorizontal: 24 };
            default:
                return { paddingVertical: 16, paddingHorizontal: 24 };
        }
    };

    return (
        <Animated.View style={[animatedStyle, style]}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || isLoading}
                style={[
                    styles.button,
                    getButtonStyle(),
                    getSizeStyle(),
                    (disabled || isLoading) && styles.disabled,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.white} />
                ) : (
                    <>
                        {icon && <Text style={[styles.icon, getTextStyle()]}>{icon}</Text>}
                        <Text style={[styles.title, getTextStyle(), size === 'sm' && { fontSize: 14 }]}>
                            {title}
                        </Text>
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
        gap: 8,
    },
    disabled: {
        opacity: 0.6,
    },
    icon: {
        fontSize: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
