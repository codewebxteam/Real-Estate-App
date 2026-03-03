import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    interpolateColor,
    Easing,
    withRepeat,
    withDelay as withAnimDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface GradientHeaderProps {
    height?: number;
    children?: React.ReactNode;
}

const FloatingCircle = ({ style, delay }: { style: any, delay: number }) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withAnimDelay(
            delay,
            withRepeat(
                withTiming(15, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={[style, animatedStyle]} />;
};

export const GradientHeader: React.FC<GradientHeaderProps> = ({
    height = 320,
    children,
}) => {
    const animProgress = useSharedValue(0);

    useEffect(() => {
        animProgress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
    }, []);

    const animatedBg = useAnimatedStyle(() => ({
        opacity: animProgress.value,
    }));

    return (
        <View style={[styles.container, { height }]}>
            {/* Base layer */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.primary }]} />

            {/* Animated overlay */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: Colors.primaryDark },
                    animatedBg,
                ]}
            />

            {/* Decorative circles with subtle motion */}
            <FloatingCircle style={[styles.circle, styles.circle1]} delay={0} />
            <FloatingCircle style={[styles.circle, styles.circle2]} delay={500} />
            <FloatingCircle style={[styles.circle, styles.circle3]} delay={1000} />

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    circle1: {
        width: 200,
        height: 200,
        top: -60,
        right: -40,
    },
    circle2: {
        width: 150,
        height: 150,
        bottom: -20,
        left: -30,
    },
    circle3: {
        width: 100,
        height: 100,
        top: 60,
        left: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
});
