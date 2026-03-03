import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PulseButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const PulseButton: React.FC<PulseButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      scale.value = withRepeat(
        withTiming(1.05, { duration: 600, easing: Easing.ease }),
        -1,
        true
      );
    } else {
      scale.value = 1;
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor = variant === 'primary' ? 'bg-primary' : 'bg-secondary';

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={isLoading}
        className={`${bgColor} rounded-lg py-3 px-6 items-center justify-center`}
      >
        <Text className="text-white font-bold text-base">{title}</Text>
      </Pressable>
    </Animated.View>
  );
};
