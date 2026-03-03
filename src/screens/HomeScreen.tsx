import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { AnimatedCard } from '../components/AnimatedCard';
import { FadeInView } from '../components/FadeInView';
import { PulseButton } from '../components/PulseButton';

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([
    {
      id: '1',
      title: 'Luxury Apartment',
      price: '$2,500,000',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300',
    },
    {
      id: '2',
      title: 'Modern Villa',
      price: '$3,200,000',
      image: 'https://images.unsplash.com/photo-1570129477492-45ac003000c0?w=400&h=300',
    },
    {
      id: '3',
      title: 'Cozy House',
      price: '$1,800,000',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300',
    },
  ]);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={100}>
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">
            Find Your <Text className="text-primary">Home</Text>
          </Text>
          <Text className="text-gray-600 mt-2">
            Explore premium properties in your area
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={200}>
        <View className="px-4 pb-4 gap-3">
          <TextInput
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-white px-4 py-3 rounded-lg border border-gray-200"
            placeholderTextColor="#999"
          />
          <PulseButton
            title="Search"
            onPress={handleSearch}
            isLoading={isLoading}
          />
        </View>
      </FadeInView>

      <FadeInView delay={300}>
        <View className="px-4 pb-4">
          <Text className="text-xl font-bold text-gray-900 mb-3">
            Featured Properties
          </Text>
        </View>
      </FadeInView>

      <View className="px-2 pb-8">
        {properties.map((property, index) => (
          <AnimatedCard
            key={property.id}
            image={property.image}
            title={property.title}
            price={property.price}
            delay={400 + index * 100}
            onPress={() =>
              navigation.navigate('PropertyDetail', { property })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
