import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { useAuth } from '../../context/AuthContext';
import { getAllPendingKYC } from '../../services/kycService';
import { getAllPendingProperties, getProperties } from '../../services/propertyService';

const AdminDashboardScreen = ({ navigation }: any) => {
    const { userProfile } = useAuth();
    const [stats, setStats] = useState({
        pendingKYC: 0,
        pendingProperties: 0,
        totalProperties: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAdminStats();
    }, []);

    const loadAdminStats = async () => {
        setIsLoading(true);
        try {
            const [pendingKYC, pendingProps, allProps] = await Promise.all([
                getAllPendingKYC(),
                getAllPendingProperties(),
                getProperties(), // This fetches 'live' props
            ]);

            setStats({
                pendingKYC: pendingKYC.length,
                pendingProperties: pendingProps.length,
                totalProperties: allProps.length + pendingProps.length,
            });
        } catch (error) {
            console.error('Error loading admin stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const AdminStatCard = ({ title, value, color, onPress }: any) => (
        <AnimatedCard style={styles.statCard} onPress={onPress}>
            <Text style={styles.statLabel}>{title}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.tapText}>Manage ›</Text>
        </AnimatedCard>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader height={180}>
                <View style={styles.headerContent}>
                    <View style={styles.badgeRow}>
                        <MaterialCommunityIcons name="crown" size={16} color={Colors.white} />
                        <Text style={styles.adminBadge}>SUPER ADMIN</Text>
                    </View>
                    <Text style={styles.welcomeText}>System Overview</Text>
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <View style={styles.statsGrid}>
                            <AdminStatCard
                                title="Pending KYC"
                                value={stats.pendingKYC}
                                color={Colors.primary}
                                onPress={() => navigation.navigate('KYCReview')}
                            />
                            <AdminStatCard
                                title="New Listings"
                                value={stats.pendingProperties}
                                color={Colors.secondary}
                                onPress={() => navigation.navigate('PropertyModeration')}
                            />
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Total Inventory</Text>
                            <Text style={styles.infoValue}>{stats.totalProperties} Properties</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '75%' }]} />
                            </View>
                            <Text style={styles.infoSub}>Across 12 cities in Uttar Pradesh</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Administrative Tasks</Text>
                        <AnimatedCard style={styles.taskItem} onPress={() => navigation.navigate('KYCReview')}>
                            <View style={styles.taskIcon}>
                                <MaterialCommunityIcons name="shield-check" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskName}>Partner Verification</Text>
                                <Text style={styles.taskDesc}>Review pending identity documents</Text>
                            </View>
                        </AnimatedCard>

                        <AnimatedCard style={styles.taskItem} onPress={() => navigation.navigate('PropertyModeration')}>
                            <View style={styles.taskIcon}>
                                <MaterialCommunityIcons name="home-search" size={24} color={Colors.secondary} />
                            </View>
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskName}>Listing Moderation</Text>
                                <Text style={styles.taskDesc}>Approve or reject new property listings</Text>
                            </View>
                        </AnimatedCard>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { alignItems: 'flex-start', width: '100%', marginTop: 20 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8, gap: 4 },
    adminBadge: { color: Colors.white, fontSize: 10, fontWeight: '800' },
    welcomeText: { color: Colors.white, fontSize: 26, fontWeight: '900' },

    content: { padding: 20, marginTop: -30 },
    statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: BorderRadius.lg,
        ...Shadows.lg,
    },
    statLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: 8 },
    statValue: { fontSize: 32, fontWeight: '900' },
    tapText: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginTop: 8 },

    infoCard: {
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: BorderRadius.lg,
        marginBottom: 30,
        ...Shadows.sm,
    },
    infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
    infoValue: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginTop: 4 },
    progressBar: { height: 8, backgroundColor: Colors.background, borderRadius: 4, marginTop: 16, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: Colors.secondary },
    infoSub: { fontSize: 12, color: Colors.textMuted, marginTop: 12, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    taskItem: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginBottom: 12,
        ...Shadows.sm,
    },
    taskIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    taskInfo: { flex: 1 },
    taskName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    taskDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
});

export default AdminDashboardScreen;
