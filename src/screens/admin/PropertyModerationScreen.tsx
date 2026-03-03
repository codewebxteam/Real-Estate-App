import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getAllPendingProperties, updatePropertyStatus } from '../../services/propertyService';
import { Property } from '../../types';

const PropertyModerationScreen = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setIsLoading(true);
        try {
            const data = await getAllPendingProperties();
            setProperties(data);
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModeration = (id: string, title: string, status: 'live' | 'rejected') => {
        Alert.alert(
            `${status === 'live' ? 'Approve' : 'Reject'} Listing`,
            `Are you sure you want to ${status === 'live' ? 'publish' : 'reject'} "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Proceed',
                    style: status === 'rejected' ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            await updatePropertyStatus(id, status);
                            loadProperties(); // Refresh
                        } catch (error) {
                            Alert.alert('Error', 'Update failed.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Property }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.propertyImg} />

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                    <Text style={styles.typeBadge}>{item.propertyType.toUpperCase()}</Text>
                </View>

                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.location}>{item.location.city}, {item.location.subCity}</Text>

                <View style={styles.ownerRow}>
                    <Text style={styles.ownerLabel}>Listed by:</Text>
                    <Text style={styles.ownerName}>{item.partnerName}</Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        style={[styles.btn, styles.rejectBtn]}
                        onPress={() => handleModeration(item.id!, item.title, 'rejected')}
                    >
                        <Text style={styles.btnTextReject}>Reject</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.btn, styles.approveBtn]}
                        onPress={() => handleModeration(item.id!, item.title, 'live')}
                    >
                        <Text style={styles.btnTextApprove}>Approve & Live</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>Listing Moderation</Text>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={properties}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id!}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialCommunityIcons name="home-search-outline" size={64} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No new listings to moderate.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginTop: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16 },
    card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: 20, ...Shadows.md },
    propertyImg: { width: '100%', height: 180 },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    price: { fontSize: 20, fontWeight: '900', color: Colors.primary },
    typeBadge: { backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: '800', color: Colors.textMuted },
    title: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    location: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },

    ownerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 8, borderRadius: 6, marginBottom: 16 },
    ownerLabel: { fontSize: 11, color: Colors.textMuted, marginRight: 6 },
    ownerName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },

    actions: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    rejectBtn: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' },
    approveBtn: { backgroundColor: Colors.secondary },
    btnTextReject: { color: '#EF4444', fontWeight: '800', fontSize: 13 },
    btnTextApprove: { color: Colors.white, fontWeight: '800', fontSize: 13 },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: Colors.textMuted, fontWeight: '600', marginTop: 16 },
});

export default PropertyModerationScreen;
