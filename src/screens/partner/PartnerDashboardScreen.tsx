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
import { getPartnerInquiries } from '../../services/inquiryService';
import { getProperties } from '../../services/propertyService';
import { Inquiry, Property } from '../../types';

const PartnerDashboardScreen = ({ navigation }: any) => {
    const { userProfile } = useAuth();
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalInquiries: 0,
    });
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.uid) {
            loadDashboardData();
        }
    }, [userProfile]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const partnerId = userProfile!.uid;

            // Fetch data concurrently
            const [allProperties, inquiries] = await Promise.all([
                getProperties(), // Later we'll filter this in the service by ownerId
                getPartnerInquiries(partnerId),
            ]);

            // Filter properties for current partner
            const myProperties = allProperties.filter(p => p.ownerId === partnerId);
            const activeProps = myProperties.filter(p => p.status === 'live');

            setStats({
                totalListings: myProperties.length,
                activeListings: activeProps.length,
                totalInquiries: inquiries.length,
            });

            setRecentInquiries(inquiries.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const StatCard = ({ title, value, color }: any) => (
        <AnimatedCard style={styles.statCard}>
            <Text style={styles.statLabel}>{title}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </AnimatedCard>
    );

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader height={180}>
                <View style={styles.headerContent}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.partnerName}>{userProfile?.name}</Text>
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard title="Total Listings" value={stats.totalListings} color={Colors.textPrimary} />
                    <StatCard title="Live Properties" value={stats.activeListings} color={Colors.secondary} />
                    <StatCard title="Total Inquiries" value={stats.totalInquiries} color={Colors.primary} />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <AnimatedCard
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('AddProperty')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                            <MaterialCommunityIcons name="home-plus" size={28} color={Colors.primary} />
                        </View>
                        <Text style={styles.actionText}>Add Property</Text>
                    </AnimatedCard>

                    <AnimatedCard
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('MyListings')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="home-city" size={28} color={Colors.secondary} />
                        </View>
                        <Text style={styles.actionText}>My Listings</Text>
                    </AnimatedCard>

                    <AnimatedCard
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('PartnerProfile')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FFFBEB' }]}>
                            <MaterialCommunityIcons name="badge-account-horizontal" size={28} color={Colors.accent} />
                        </View>
                        <Text style={styles.actionText}>KYC Status</Text>
                    </AnimatedCard>
                </View>

                {/* Recent Inquiries */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Inquiries</Text>
                    <Pressable onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={styles.viewAll}>View All</Text>
                    </Pressable>
                </View>

                {recentInquiries.length > 0 ? (
                    recentInquiries.map((inquiry, index) => (
                        <AnimatedCard key={inquiry.id} style={styles.inquiryCard} onPress={() => { }}>
                            <View style={styles.inquiryInfo}>
                                <Text style={styles.inquiryProp}>{inquiry.propertyName}</Text>
                                <Text style={styles.inquiryFrom}>From: {inquiry.customerName}</Text>
                            </View>
                            <View style={styles.inquiryDate}>
                                <Text style={styles.dateText}>
                                    {inquiry.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </Text>
                            </View>
                        </AnimatedCard>
                    ))
                ) : (
                    <View style={styles.emptyRecent}>
                        <Text style={styles.emptyText}>No recent inquiries yet.</Text>
                    </View>
                )}
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerContent: { alignItems: 'flex-start', width: '100%', marginTop: 20 },
    welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
    partnerName: { color: Colors.white, fontSize: 28, fontWeight: '900', marginTop: 4 },

    content: { padding: 20, marginTop: -30 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        ...Shadows.lg,
    },
    statLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textAlign: 'center', marginBottom: 6 },
    statValue: { fontSize: 22, fontWeight: '900' },

    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    viewAll: { fontSize: 13, fontWeight: '700', color: Colors.primary },

    actionGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    actionBtn: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        ...Shadows.sm,
    },
    actionIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    actionText: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },

    inquiryCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        ...Shadows.sm,
    },
    inquiryInfo: { flex: 1 },
    inquiryProp: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    inquiryFrom: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
    inquiryDate: { alignItems: 'flex-end' },
    dateText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

    emptyRecent: { padding: 20, alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, ...Shadows.sm },
    emptyText: { color: Colors.textMuted, fontSize: 14, fontWeight: '600' },
});

export default PartnerDashboardScreen;
