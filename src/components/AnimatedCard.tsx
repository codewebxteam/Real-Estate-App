import React, { useEffect } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';

interface AnimatedCardProps {
  image: string;
  title: string;
  price: string;
  delay?: number;
  onPress?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  image,
  title,
  price,
  delay = 0,
  onPress,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1));
    opacity.value = withDelay(delay, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { marginHorizontal: 8 }]}>
      <Pressable
        onPress={onPress}
        className="bg-white rounded-lg overflow-hidden shadow-lg mb-4"
        style={{ width: width * 0.9 }}
      >
        <Image
          source={{ uri: image }}
          className="w-full h-48 bg-gray-300"
          onError={() => console.log('Image failed to load')}
        />
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          <Text className="text-primary text-xl font-bold mt-2">{price}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};
