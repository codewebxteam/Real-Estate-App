import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

    const loadDashboardData = useCallback(async () => {
        if (!userProfile?.uid) return;
        setIsLoading(true);
        try {
            const partnerId = userProfile.uid;
            const [allProperties, inquiries] = await Promise.all([
                getProperties(),
                getPartnerInquiries(partnerId),
            ]);

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
    }, [userProfile]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return '#F59E0B';
            case 'read': return '#3B82F6';
            case 'responded': return '#10B981';
            default: return Colors.textMuted;
        }
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

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
                    <AnimatedCard style={styles.actionBtn} onPress={() => navigation.navigate('AddProperty')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                            <MaterialCommunityIcons name="home-plus" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.actionText}>Add Property</Text>
                    </AnimatedCard>
                    <AnimatedCard style={styles.actionBtn} onPress={() => navigation.navigate('MyListings')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="home-city" size={24} color={Colors.secondary} />
                        </View>
                        <Text style={styles.actionText}>My Listings</Text>
                    </AnimatedCard>
                    <AnimatedCard style={styles.actionBtn} onPress={() => navigation.navigate('Analytics')}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="chart-line" size={24} color={Colors.accent} />
                        </View>
                        <Text style={styles.actionText}>Analytics</Text>
                    </AnimatedCard>
                </View>

                {/* Feature Cards - Horizontal Scroll */}
                <Text style={styles.sectionTitle}>Manage Your Business</Text>
                <Text style={styles.sectionSubtitle}>Complete business management tools at your fingertips</Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featureScroll}>
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('InquiryManagement')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#EEF2FF' }]}>
                            <MaterialCommunityIcons name="message-text" size={28} color={Colors.primary} />
                        </View>
                        <Text style={styles.featureTitle}>Inquiries</Text>
                        <Text style={styles.featureDesc}>Respond to customers</Text>
                        <View style={styles.featureStats}>
                            <Text style={styles.featureStatsText}>{stats.totalInquiries} active</Text>
                        </View>
                    </AnimatedCard>
                    
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('PropertyBoost')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#F3E8FF' }]}>
                            <MaterialCommunityIcons name="rocket-launch" size={28} color="#8B5CF6" />
                        </View>
                        <Text style={styles.featureTitle}>Boost</Text>
                        <Text style={styles.featureDesc}>Promote properties</Text>
                        <View style={styles.featureStats}>
                            <Text style={styles.featureStatsText}>3 plans</Text>
                        </View>
                    </AnimatedCard>
                    
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('Notifications')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="bell" size={28} color={Colors.accent} />
                        </View>
                        <Text style={styles.featureTitle}>Notifications</Text>
                        <Text style={styles.featureDesc}>Stay updated</Text>
                        <View style={styles.featureStats}>
                            <Text style={styles.featureStatsText}>2 unread</Text>
                        </View>
                    </AnimatedCard>
                    
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('Reviews')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="star" size={28} color="#F59E0B" />
                        </View>
                        <Text style={styles.featureTitle}>Reviews</Text>
                        <Text style={styles.featureDesc}>Manage ratings</Text>
                        <View style={styles.featureStats}>
                            <Text style={styles.featureStatsText}>4.7 ⭐</Text>
                        </View>
                    </AnimatedCard>
                    
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('LeadManagement')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="account-group" size={28} color={Colors.secondary} />
                        </View>
                        <Text style={styles.featureTitle}>Leads</Text>
                        <Text style={styles.featureDesc}>Track customers</Text>
                        <View style={styles.featureStats}>
                            <Text style={styles.featureStatsText}>8 active</Text>
                        </View>
                    </AnimatedCard>
                    
                    <AnimatedCard style={styles.featureCardHorizontal} onPress={() => navigation.navigate('PartnerProfile')}>
                        <View style={[styles.featureBadge, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialCommunityIcons name="badge-account-horizontal" size={28} color="#EF4444" />
                        </View>
                        <Text style={styles.featureTitle}>KYC</Text>
                        <Text style={styles.featureDesc}>Verification</Text>
                        <View style={styles.featureStats}>
                            <Text style={[styles.featureStatsText, { color: '#10B981' }]}>Verified ✓</Text>
                        </View>
                    </AnimatedCard>
                </ScrollView>

                {/* Recent Inquiries */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Inquiries</Text>
                    <Pressable onPress={() => navigation.navigate('InquiryManagement')}>
                        <Text style={styles.viewAll}>View All</Text>
                    </Pressable>
                </View>

                {recentInquiries.length > 0 ? (
                    recentInquiries.map((inquiry) => (
                        <AnimatedCard key={inquiry.id} style={styles.inquiryCard} onPress={() => navigation.navigate('InquiryManagement')}>
                            <View style={styles.inquiryLeft}>
                                <View style={styles.inquiryHeader}>
                                    <Text style={styles.inquiryProp} numberOfLines={1}>{inquiry.propertyName}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inquiry.status) }]}>
                                        <Text style={styles.statusText}>{inquiry.status.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={styles.inquiryCustomer}>
                                    <MaterialCommunityIcons name="account" size={16} color={Colors.textMuted} />
                                    <Text style={styles.inquiryFrom}>{inquiry.customerName}</Text>
                                </View>
                                <Text style={styles.inquiryMessage} numberOfLines={2}>{inquiry.message}</Text>
                            </View>
                            <View style={styles.inquiryRight}>
                                <Text style={styles.dateText}>{getTimeAgo(inquiry.createdAt)}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.primary} />
                            </View>
                        </AnimatedCard>
                    ))
                ) : (
                    <View style={styles.emptyRecent}>
                        <MaterialCommunityIcons name="inbox" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No recent inquiries yet.</Text>
                        <Text style={styles.emptySubtext}>Inquiries will appear here when customers contact you</Text>
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
    sectionSubtitle: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 16, marginTop: -12 },
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

    featureScroll: { marginBottom: 32 },
    featureCardHorizontal: {
        width: 140,
        height: 160,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 12,
        ...Shadows.md,
    },
    featureBadge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    featureTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
    featureDesc: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, textAlign: 'center' },
    featureStats: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Colors.background, borderRadius: BorderRadius.sm },
    featureStatsText: { fontSize: 10, fontWeight: '700', color: Colors.primary },

    inquiryCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        minHeight: 100,
        ...Shadows.sm,
    },
    inquiryLeft: { flex: 1, marginRight: 12 },
    inquiryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    inquiryProp: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
    statusText: { fontSize: 9, fontWeight: '900', color: Colors.white },
    inquiryCustomer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    inquiryFrom: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
    inquiryMessage: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', lineHeight: 18 },
    inquiryRight: { alignItems: 'flex-end' },
    dateText: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', marginBottom: 4 },

    emptyRecent: { padding: 40, alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, ...Shadows.sm },
    emptyText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: 12 },
    emptySubtext: { color: Colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' },
});

export default PartnerDashboardScreen;
