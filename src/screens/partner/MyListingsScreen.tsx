import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Image,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getProperties } from '../../services/propertyService';
import { useAuth } from '../../context/AuthContext';
import { Property } from '../../types';

const MyListingsScreen = ({ navigation }: any) => {
    const { userProfile } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.uid) {
            loadMyProperties();
        }
    }, [userProfile]);

    const loadMyProperties = async () => {
        setIsLoading(true);
        try {
            const all = await getProperties();
            const mine = all.filter(p => p.ownerId === userProfile!.uid);
            setProperties(mine);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return '#10B981';
            case 'rejected': return '#EF4444';
            default: return '#F59E0B'; // pending
        }
    };

    const renderItem = ({ item, index }: { item: Property; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 100)}
            style={styles.card}
        >
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                </View>
                <Text style={styles.cardPrice}>₹{item.price.toLocaleString()}</Text>
                <Text style={styles.cardLoc}>{item.location.city}, {item.location.subCity}</Text>

                <View style={styles.cardFooter}>
                    <View style={styles.statsRow}>
                        <Text style={styles.statText}>👁️ {item.views}</Text>
                        <Text style={styles.statText}>💬 {item.inquiryCount}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>My Listings</Text>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={properties}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>🏗️</Text>
                            <Text style={styles.emptyText}>You haven't listed any properties yet.</Text>
                            <Pressable
                                style={styles.addBtn}
                                onPress={() => navigation.navigate('AddProperty')}
                            >
                                <Text style={styles.addBtnText}>Add Your First Property</Text>
                            </Pressable>
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
    list: { padding: 20 },
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        flexDirection: 'row',
        marginBottom: 16,
        overflow: 'hidden',
        ...Shadows.sm,
    },
    cardImage: { width: 100, height: 100 },
    cardContent: { flex: 1, padding: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
    cardPrice: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginVertical: 2 },
    cardLoc: { fontSize: 12, color: Colors.textMuted },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    statsRow: { flexDirection: 'row', gap: 10 },
    statText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
    badge: { backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { fontSize: 9, fontWeight: '800', color: Colors.textMuted },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { fontSize: 16, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
    addBtn: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: BorderRadius.md },
    addBtnText: { color: Colors.white, fontWeight: '700' },
});

export default MyListingsScreen;
