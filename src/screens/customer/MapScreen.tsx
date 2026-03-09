import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Pressable,
    TextInput,
    ScrollView,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { getProperties } from '../../services/propertyService';
import { Property, PropertyType } from '../../types';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }: any) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
    const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
    const focusProperty = route?.params?.focusProperty;

    const [region, setRegion] = useState({
        latitude: focusProperty?.coordinates?.latitude || 26.8467,
        longitude: focusProperty?.coordinates?.longitude || 80.9462,
        latitudeDelta: focusProperty ? 0.02 : 0.0922,
        longitudeDelta: focusProperty ? 0.02 : 0.0421,
    });

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const props = await getProperties();
            setProperties(props);
        } catch (error) {
            console.error('Error loading map properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            const matchesSearch = 
                prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.subCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.address.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' || prop.propertyType === selectedType;
            return matchesSearch && matchesType && prop.coordinates;
        });
    }, [properties, searchQuery, selectedType]);

    const getMarkerColor = useCallback((type: PropertyType) => {
        switch (type) {
            case 'flat': return Colors.flat;
            case 'house': return Colors.house;
            case 'plot': return Colors.plot;
            default: return Colors.primary;
        }
    }, []);

    const handleMarkerPress = useCallback((property: Property) => {
        if (property.coordinates) {
            setRegion({
                latitude: property.coordinates.latitude,
                longitude: property.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const propertyTypes: Array<{ key: PropertyType | 'all'; label: string; icon: string }> = [
        { key: 'all', label: 'All', icon: '🏘️' },
        { key: 'flat', label: 'Flats', icon: '🏢' },
        { key: 'house', label: 'Houses', icon: '🏠' },
        { key: 'plot', label: 'Plots', icon: '📐' },
    ];

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation
                showsMyLocationButton
                mapType={mapType}
                showsCompass
                showsScale
            >
                {filteredProperties.map((property) => (
                    <Marker
                        key={property.id}
                        coordinate={{
                            latitude: property.coordinates!.latitude,
                            longitude: property.coordinates!.longitude,
                        }}
                        pinColor={getMarkerColor(property.propertyType)}
                        onPress={() => handleMarkerPress(property)}
                    >
                        <View style={[styles.customMarker, { backgroundColor: getMarkerColor(property.propertyType) }]}>
                            <MaterialCommunityIcons name="home" size={20} color={Colors.white} />
                        </View>
                        <Callout
                            onPress={() => navigation.navigate('CustomerDashboard', {
                                screen: 'PropertyDetail',
                                params: { property }
                            })}
                            tooltip
                        >
                            <View style={styles.callout}>
                                <View style={styles.calloutContent}>
                                    <Text style={styles.calloutTitle} numberOfLines={1}>{property.title}</Text>
                                    <Text style={styles.calloutPrice}>₹{property.price.toLocaleString()}</Text>
                                    <View style={styles.calloutFooter}>
                                        <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(property.propertyType) }]}>
                                            <Text style={styles.typeText}>{property.propertyType}</Text>
                                        </View>
                                        <Text style={styles.calloutLink}>View ›</Text>
                                    </View>
                                </View>
                                <View style={styles.calloutArrow} />
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location, area, or property..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.textMuted} />
                        </Pressable>
                    ) : null}
                </View>
                {searchQuery && filteredProperties.length > 0 && (
                    <View style={styles.searchResults}>
                        <Text style={styles.searchResultText}>
                            Found {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                        </Text>
                    </View>
                )}
            </Animated.View>

            {/* Property Type Filter */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {propertyTypes.map((type, index) => (
                        <Animated.View key={type.key} entering={FadeInDown.delay(350 + index * 50)}>
                            <Pressable
                                onPress={() => setSelectedType(type.key)}
                                style={[
                                    styles.filterChip,
                                    selectedType === type.key && styles.filterChipActive,
                                ]}
                            >
                                <Text style={styles.filterIcon}>{type.icon}</Text>
                                <Text
                                    style={[
                                        styles.filterLabel,
                                        selectedType === type.key && styles.filterLabelActive,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Map Controls */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.controlsContainer}>
                <Pressable
                    style={styles.controlButton}
                    onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
                >
                    <MaterialCommunityIcons
                        name={mapType === 'standard' ? 'satellite-variant' : 'map'}
                        size={24}
                        color={Colors.primary}
                    />
                </Pressable>
            </Animated.View>

            {/* Property Count Badge */}
            <Animated.View entering={FadeInDown.delay(500)} style={styles.countBadge}>
                <MaterialCommunityIcons name="home-city" size={16} color={Colors.white} />
                <Text style={styles.countText}>{filteredProperties.length}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },

    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: BorderRadius.md,
        gap: 10,
        ...Shadows.lg,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    searchResults: {
        backgroundColor: Colors.white,
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        ...Shadows.md,
    },
    searchResultText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },

    filterContainer: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        borderColor: Colors.border,
        ...Shadows.sm,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    filterLabelActive: {
        color: Colors.white,
    },

    controlsContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
    },
    controlButton: {
        width: 50,
        height: 50,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },

    countBadge: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
        ...Shadows.md,
    },
    countText: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.white,
        marginLeft: 6,
    },

    customMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        ...Shadows.lg,
    },

    callout: {
        width: 220,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    calloutContent: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        padding: 14,
        ...Shadows.premium,
    },
    calloutTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    calloutPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: Colors.primary,
        marginTop: 6,
    },
    calloutFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.white,
        textTransform: 'uppercase',
    },
    calloutLink: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.secondary,
    },
    calloutArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.white,
    },
});

export default MapScreen;
