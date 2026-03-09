import React, { useState, useEffect, useMemo } from 'react';
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
    const [activeFilters, setActiveFilters] = useState(0);

    useEffect(() => {
        loadData();
    }, [listingType, location]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [props, feat] = await Promise.all([
                getProperties({
                    listingType,
                    city: location.city === 'All Areas' ? undefined : location.city,
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

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            // Property type filter
            if (filters.propertyType && prop.propertyType !== filters.propertyType) {
                return false;
            }
            // Price filter
            if (prop.price > filters.priceRange[1]) {
                return false;
            }
            // BHK filter
            if (filters.bhk) {
                const bhkValue = filters.bhk === '5+' ? 5 : parseInt(filters.bhk);
                if (filters.bhk === '5+') {
                    if (!prop.bhk || prop.bhk < bhkValue) return false;
                } else {
                    if (prop.bhk !== bhkValue) return false;
                }
            }
            return true;
        });
    }, [properties, filters]);

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
        // Count active filters
        let count = 0;
        if (newFilters.propertyType) count++;
        if (newFilters.bhk) count++;
        if (newFilters.priceRange[1] < 100000000) count++;
        setActiveFilters(count);
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
                                {activeFilters > 0 && (
                                    <View style={styles.filterBadge}>
                                        <Text style={styles.filterBadgeText}>{activeFilters}</Text>
                                    </View>
                                )}
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
                    {activeFilters > 0 && (
                        <Pressable onPress={() => handleApplyFilters({ propertyType: '', priceRange: [0, 100000000], bhk: '' })}>
                            <Text style={styles.clearFilters}>Clear Filters</Text>
                        </Pressable>
                    )}
                </View>

                <View style={styles.propertyList}>
                    {isLoading ? (
                        <ActivityIndicator color={Colors.primary} style={{ margin: 40 }} />
                    ) : filteredProperties.length > 0 ? (
                        filteredProperties.map((item, index) => (
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
                                        <Text style={styles.propertyTitle} numberOfLines={2}>{item.title}</Text>
                                        <Pressable 
                                            style={styles.locationRow}
                                            onPress={() => navigation.navigate('Map', { focusProperty: item })}
                                        >
                                            <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
                                            <Text style={styles.propertyLoc} numberOfLines={1}>
                                                {item.location.subCity}, {item.location.city}
                                            </Text>
                                        </Pressable>
                                        <View style={styles.detailsRow}>
                                            {item.bhk && (
                                                <View style={styles.detailChip}>
                                                    <MaterialCommunityIcons name="bed" size={14} color={Colors.textSecondary} />
                                                    <Text style={styles.detailText}>{item.bhk} BHK</Text>
                                                </View>
                                            )}
                                            <View style={styles.detailChip}>
                                                <MaterialCommunityIcons name="ruler-square" size={14} color={Colors.textSecondary} />
                                                <Text style={styles.detailText}>{item.area} {item.areaUnit}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.propertyPrice}>₹{item.price.toLocaleString()}</Text>
                                            <Pressable 
                                                style={styles.viewMapBtn}
                                                onPress={() => navigation.navigate('Map', { focusProperty: item })}
                                            >
                                                <MaterialCommunityIcons name="map-outline" size={16} color={Colors.primary} />
                                                <Text style={styles.viewMapText}>View on Map</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </AnimatedCard>
                            </Animated.View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="home-search-outline" size={64} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>
                                {activeFilters > 0 ? 'No properties match your filters' : 'No properties found in this category.'}
                            </Text>
                            {activeFilters > 0 && (
                                <Pressable 
                                    style={styles.clearBtn}
                                    onPress={() => handleApplyFilters({ propertyType: '', priceRange: [0, 100000000], bhk: '' })}
                                >
                                    <Text style={styles.clearBtnText}>Clear Filters</Text>
                                </Pressable>
                            )}
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
                onApply={handleApplyFilters}
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
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Colors.error,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.white,
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
    clearFilters: { fontSize: 14, color: Colors.error, fontWeight: '700' },

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
    propertyTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, lineHeight: 24 },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    propertyLoc: { fontSize: 13, color: Colors.textMuted, fontWeight: '600', flex: 1 },
    detailsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    detailChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    propertyPrice: { fontSize: 20, fontWeight: '900', color: Colors.primary },
    viewMapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    viewMapText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
    },
    propertyBhk: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },

    emptyContainer: { alignItems: 'center', marginTop: 40, paddingBottom: 40 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { color: Colors.textMuted, fontSize: 15, textAlign: 'center' },
    clearBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
    },
    clearBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.white,
    },
});

export default BrowseScreen;
