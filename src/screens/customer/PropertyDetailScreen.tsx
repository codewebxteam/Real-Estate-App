import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { FadeInView } from '../../components/FadeInView';
import { PulseButton } from '../../components/PulseButton';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { createInquiry } from '../../services/inquiryService';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route, navigation }: any) => {
  const { property } = route.params as { property: Property };
  const { userProfile, isAuthenticated } = useAuth();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });


  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [150, 250], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollY.value, [150, 250], [-20, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const handleContact = async () => {
    if (!isAuthenticated || !userProfile) {
      Alert.alert('Login Required', 'Please login to contact the owner.');
      return;
    }

    try {
      await createInquiry({
        propertyId: property.id,
        partnerId: property.ownerId,
        customerId: userProfile.uid,
        propertyName: property.title,
        customerName: userProfile.name,
        customerEmail: userProfile.email,
        customerPhone: userProfile.phone || '',
        message: `I'm interested in ${property.title}. Please contact me.`,
      });

      Alert.alert(
        'Inquiry Sent!',
        `Your interest in "${property.title}" has been shared with the partner. They will contact you shortly.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Inquiry error:', error);
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Sticky Glassy Header */}
      <Animated.View style={[styles.stickyHeader, headerAnimatedStyle]}>
        <View style={styles.glassHeaderInner}>
          <Text style={styles.stickyTitle} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.stickyPrice}>₹{property.price.toLocaleString()}</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.mainImage}
          />
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{property.propertyType.toUpperCase()}</Text>
          </View>
          <View style={styles.listingBadge}>
            <Text style={styles.listingBadgeText}>FOR {property.listingType.toUpperCase()}</Text>
          </View>
        </View>

        <FadeInView style={styles.detailsContainer}>
          {/* Title & Price */}
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.price}>₹{property.price.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            {property.bhk && (
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="home-outline" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>{property.bhk} BHK</Text>
              </View>
            )}
            {property.bhk && <View style={styles.divider} />}
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="arrow-expand-all" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>{property.area} {property.areaUnit}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText} numberOfLines={1}>{property.location.city}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About Property</Text>
          <Text style={styles.description}>{property.description}</Text>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity: string) => (
                  <View key={amenity} style={styles.amenityItem}>
                    <MaterialCommunityIcons name="check-circle-outline" size={16} color={Colors.secondary} />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Action Button */}
          <View style={styles.footer}>
            <PulseButton
              title="Contact Property Owner"
              onPress={handleContact}
              variant="primary"
            />
            <Text style={styles.footerNote}>
              Every listing on our platform is manually verified by the admin for your safety.
            </Text>
          </View>
        </FadeInView>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Persistent Floating Contact Button (Optional if you want it footer only) */}
    </View >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  imageContainer: { width: width, height: 300 },
  mainImage: { width: '100%', height: '100%' },
  typeBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  listingBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  listingBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '800' },

  detailsContainer: { paddingHorizontal: 20, paddingTop: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleCol: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  price: { fontSize: 24, fontWeight: '900', color: Colors.primary, marginTop: 4 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    marginTop: 24,
  },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  infoText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  divider: { width: 1, height: 20, backgroundColor: Colors.border },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 24, marginBottom: 12 },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },

  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6
  },
  amenityText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },

  footer: { marginTop: 32 },
  footerNote: { textAlign: 'center', color: Colors.textMuted, fontSize: 12, marginTop: 12, lineHeight: 18 },

  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 100,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.glassHeavy,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    ...Shadows.md,
  },
  glassHeaderInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, flex: 1, marginRight: 16 },
  stickyPrice: { fontSize: 16, fontWeight: '900', color: Colors.primary },
});

export default PropertyDetailScreen;
