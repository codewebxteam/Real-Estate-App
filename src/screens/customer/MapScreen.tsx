import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Pressable,
    Image,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { getProperties } from '../../services/propertyService';
import { Property } from '../../types';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }: any) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Default region: Lucknow, Uttar Pradesh
    const [region, setRegion] = useState({
        latitude: 26.8467,
        longitude: 80.9462,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const props = await getProperties();
            setProperties(props);

            // If we have properties, focus on the first one's location if available
            // For now, staying on Lucknow default as mock properties might not have precise lat/lng
        } catch (error) {
            console.error('Error loading map properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton
            >
                {properties.map((property) => (
                    property.coordinates && (
                        <Marker
                            key={property.id}
                            coordinate={{
                                latitude: property.coordinates.latitude,
                                longitude: property.coordinates.longitude,
                            }}
                            pinColor={Colors.primary}
                        >
                            <Callout
                                onPress={() => navigation.navigate('Home', {
                                    screen: 'PropertyDetail',
                                    params: { property }
                                })}
                                tooltip
                            >
                                <View style={styles.callout}>
                                    <View style={styles.calloutContent}>
                                        <Text style={styles.calloutTitle}>{property.title}</Text>
                                        <Text style={styles.calloutPrice}>₹{property.price.toLocaleString()}</Text>
                                        <View style={styles.calloutFooter}>
                                            <Text style={styles.calloutType}>{property.propertyType}</Text>
                                            <Text style={styles.calloutLink}>View Details ›</Text>
                                        </View>
                                    </View>
                                    <View style={styles.calloutArrow} />
                                </View>
                            </Callout>
                        </Marker>
                    )
                ))}
            </MapView>

            {/* Map Overlay Controls */}
            <View style={styles.overlay}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>📍</Text>
                    <Text style={styles.searchText}>Exploring properties in UP</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },

    overlay: {
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
        ...Shadows.md,
    },
    searchIcon: { fontSize: 18, marginRight: 10 },
    searchText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },

    callout: {
        width: 200,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    calloutContent: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        padding: 12,
        ...Shadows.lg,
    },
    calloutTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
    calloutPrice: { fontSize: 16, fontWeight: '900', color: Colors.primary, marginTop: 4 },
    calloutFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' },
    calloutType: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
    calloutLink: { fontSize: 11, fontWeight: '700', color: Colors.secondary },
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
