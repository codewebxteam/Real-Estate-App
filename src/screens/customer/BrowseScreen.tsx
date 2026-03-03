import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeInRight,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import LocationPicker from '../../components/ui/LocationPicker';
import FilterModal from '../../components/ui/FilterModal';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getProperties, getFeaturedProperties } from '../../services/propertyService';
import { Property, ListingType } from '../../types';

const { width } = Dimensions.get('window');

const BrowseScreen = ({ navigation }: any) => {
    const [listingType, setListingType] = useState<ListingType>('sale');
    const [properties, setProperties] = useState<Property[]>([]);
    const [featured, setFeatured] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState({
        state: 'Uttar Pradesh',
        city: 'Lucknow',
        subCity: 'All Areas',
        ward: '',
    });
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        propertyType: '',
        priceRange: [0, 100000000],
        bhk: '',
    });

    useEffect(() => {
        loadData();
    }, [listingType, location, filters]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [props, feat] = await Promise.all([
                getProperties({
                    listingType,
                    city: location.city === 'All Areas' ? undefined : location.city,
                    propertyType: filters.propertyType || undefined,
                }),
                getFeaturedProperties(4),
            ]);
            setProperties(props);
            setFeatured(feat);
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderCategoryTab = (type: ListingType, label: string) => (
        <Pressable
            onPress={() => setListingType(type)}
            style={[
                styles.categoryCard,
                listingType === type && styles.categoryActive,
            ]}
        >
            <Text
                style={[
                    styles.categoryLabel,
                    listingType === type && styles.categoryLabelActive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Top Header Section */}
                <GradientHeader height={180}>
                    <Animated.View
                        entering={FadeInDown.duration(600).springify()}
                        style={styles.headerContent}
                    >
                        <View style={styles.locationContainer}>
                            <Text style={styles.locationLabel}>Location</Text>
                            <Pressable
                                style={styles.locationPicker}
                                onPress={() => setIsLocationModalVisible(true)}
                            >
                                <Text style={styles.locationValue}>
                                    {location.city}{location.subCity !== 'All Areas' ? `, ${location.subCity}` : ''}
                                </Text>
                                <Text style={styles.locationArrow}>▼</Text>
                            </Pressable>
                        </View>
                        <View style={styles.searchRow}>
                            <View style={styles.searchBar}>
                                <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} style={{ marginRight: 8 }} />
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search City, Ward..."
                                    placeholderTextColor={Colors.textMuted}
                                    style={styles.searchInput}
                                />
                            </View>
                            <Pressable
                                style={styles.filterBtn}
                                onPress={() => setIsFilterModalVisible(true)}
                            >
                                <MaterialCommunityIcons name="tune" size={24} color={Colors.primary} />
                            </Pressable>
                        </View>
                    </Animated.View>
                </GradientHeader>

                {/* Category Switcher */}
                <Animated.View
                    entering={FadeInUp.delay(300).duration(600).springify()}
                    style={styles.categories}
                >
                    {renderCategoryTab('sale', 'Buy Property')}
                    {renderCategoryTab('rent', 'Rent Property')}
                </Animated.View>

                {/* Featured Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Projects</Text>
                    <Pressable>
                        <Text style={styles.viewAll}>View All</Text>
                    </Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredContainer}
                >
                    {isLoading ? (
                        <ActivityIndicator color={Colors.primary} style={{ margin: 20 }} />
                    ) : featured.length > 0 ? (
                        featured.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInRight.delay(400 + (index * 100)).duration(600).springify()}
                            >
                                <AnimatedCard
                                    style={styles.featuredCard}
                                    onPress={() => navigation.navigate('PropertyDetail', { property: item })}
                                >
                                    <Image source={{ uri: item.images[0] }} style={styles.featuredImg} />
                                    <View style={styles.featuredInfo}>
                                        <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.featuredPrice}>₹{item.price.toLocaleString()}</Text>
                                    </View>
                                </AnimatedCard>
                            </Animated.View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No featured properties yet</Text>
                    )}
                </ScrollView>

                {/* Property List */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recently Added</Text>
                </View>

                <View style={styles.propertyList}>
                    {isLoading ? (
                        <ActivityIndicator color={Colors.primary} style={{ margin: 40 }} />
                    ) : properties.length > 0 ? (
                        properties.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInUp.delay(600 + (index * 100)).duration(600)}
                            >
                                <AnimatedCard
                                    style={styles.propertyCard}
                                    onPress={() => navigation.navigate('PropertyDetail', { property: item })}
                                >
                                    <Image source={{ uri: item.images[0] }} style={styles.propertyImg} />
                                    <View style={styles.propertyBadge}>
                                        <Text style={styles.badgeText}>{item.propertyType.toUpperCase()}</Text>
                                    </View>
                                    <View style={styles.propertyInfo}>
                                        <Text style={styles.propertyTitle}>{item.title}</Text>
                                        <Text style={styles.propertyLoc}>{item.location.city}, {item.location.subCity}</Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.propertyPrice}>₹{item.price.toLocaleString()}</Text>
                                            {item.bhk && <Text style={styles.propertyBhk}>{item.bhk} BHK</Text>}
                                        </View>
                                    </View>
                                </AnimatedCard>
                            </Animated.View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="home-search-outline" size={64} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No properties found in this category.</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <LocationPicker
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelect={(newLoc) => setLocation(newLoc)}
            />

            <FilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={(newFilters) => setFilters(newFilters)}
                currentFilters={filters}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { width: '100%', paddingBottom: 10 },
    locationContainer: { marginBottom: 16 },
    locationLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    locationPicker: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationValue: { fontSize: 18, fontWeight: '800', color: Colors.white, marginRight: 6 },
    locationArrow: { fontSize: 10, color: Colors.white, opacity: 0.8 },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 12,
        height: 48,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...Shadows.lg,
    },
    filterBtn: {
        width: 48,
        height: 48,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: { fontSize: 18, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },

    categories: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginTop: -24,
        gap: 12,
    },
    categoryCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
    categoryActive: {
        backgroundColor: Colors.primary,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 8,
    },
    categoryLabelActive: { color: Colors.white },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
    viewAll: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

    featuredContainer: { paddingLeft: 20, paddingRight: 8 },
    featuredCard: {
        width: 220,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        marginRight: 16,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    featuredImg: { width: '100%', height: 120 },
    featuredInfo: { padding: 12 },
    featuredTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    featuredPrice: { fontSize: 15, fontWeight: '800', color: Colors.primary, marginTop: 4 },

    propertyList: { paddingHorizontal: 20 },
    propertyCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        marginBottom: 20,
        overflow: 'hidden',
        ...Shadows.premium,
    },
    propertyImg: { width: '100%', height: 200 },
    propertyBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: Colors.glassDark,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },
    propertyInfo: { padding: 16 },
    propertyTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
    propertyLoc: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    propertyPrice: { fontSize: 19, fontWeight: '900', color: Colors.primary },
    propertyBhk: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },

    emptyContainer: { alignItems: 'center', marginTop: 40, paddingBottom: 40 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { color: Colors.textMuted, fontSize: 15, textAlign: 'center' },
});

export default BrowseScreen;
