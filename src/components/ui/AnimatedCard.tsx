import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Shadows } from '../../constants/colors';

interface AnimatedCardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
    activeOpacity?: number;
    scaleTo?: number;
    delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    style,
    onPress,
    activeOpacity = 0.95,
    scaleTo = 0.98,
}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value }
        ],
        opacity: opacity.value,
    }));

    const onPressIn = () => {
        scale.value = withSpring(scaleTo, { damping: 15 });
        translateY.value = withSpring(-2, { damping: 15 });
        opacity.value = withTiming(activeOpacity);
    };

    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        opacity.value = withTiming(1);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View style={[styles.card, style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
});

export default AnimatedCard;
