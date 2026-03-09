import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getPartnerAnalytics } from '../../services/analyticsService';
import { PartnerAnalytics } from '../../types';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const AnalyticsDashboardScreen = () => {
    const { userProfile } = useAuth();
    const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        if (!userProfile?.uid) return;
        const data = await getPartnerAnalytics(userProfile.uid);
        setAnalytics(data);
    };

    if (!analytics) return null;

    const avgResponseTime = '2.5 hours';
    const totalRevenue = '₹15,75,000';
    const activeLeads = 8;
    const closedDeals = 3;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <GradientHeader height={160}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="chart-box" size={36} color="#fff" />
                    <Text style={styles.headerTitle}>Business Analytics</Text>
                    <Text style={styles.headerSubtitle}>Comprehensive Performance Insights</Text>
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {(['week', 'month', 'year'] as const).map((period) => (
                        <Pressable
                            key={period}
                            style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
                            onPress={() => setSelectedPeriod(period)}
                        >
                            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                                {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Year'}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Key Metrics Grid */}
                <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
                <View style={styles.metricsGrid}>
                    <AnimatedCard style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#EEF2FF' }]}>
                            <MaterialCommunityIcons name="eye" size={28} color={Colors.primary} />
                        </View>
                        <Text style={styles.metricValue}>{analytics.totalViews}</Text>
                        <Text style={styles.metricLabel}>Total Views</Text>
                        <View style={styles.metricChange}>
                            <MaterialCommunityIcons name="trending-up" size={14} color="#10B981" />
                            <Text style={styles.metricChangeText}>+15%</Text>
                        </View>
                    </AnimatedCard>

                    <AnimatedCard style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="message-text" size={28} color={Colors.secondary} />
                        </View>
                        <Text style={styles.metricValue}>{analytics.totalInquiries}</Text>
                        <Text style={styles.metricLabel}>Inquiries</Text>
                        <View style={styles.metricChange}>
                            <MaterialCommunityIcons name="trending-up" size={14} color="#10B981" />
                            <Text style={styles.metricChangeText}>+8%</Text>
                        </View>
                    </AnimatedCard>

                    <AnimatedCard style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="chart-arc" size={28} color={Colors.accent} />
                        </View>
                        <Text style={styles.metricValue}>{analytics.conversionRate}%</Text>
                        <Text style={styles.metricLabel}>Conversion</Text>
                        <View style={styles.metricChange}>
                            <MaterialCommunityIcons name="trending-up" size={14} color="#10B981" />
                            <Text style={styles.metricChangeText}>+2.1%</Text>
                        </View>
                    </AnimatedCard>

                    <AnimatedCard style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialCommunityIcons name="clock-fast" size={28} color="#EF4444" />
                        </View>
                        <Text style={styles.metricValue}>{avgResponseTime}</Text>
                        <Text style={styles.metricLabel}>Avg Response</Text>
                        <View style={styles.metricChange}>
                            <MaterialCommunityIcons name="trending-down" size={14} color="#10B981" />
                            <Text style={styles.metricChangeText}>-30min</Text>
                        </View>
                    </AnimatedCard>
                </View>

                {/* Revenue & Deals */}
                <View style={styles.revenueRow}>
                    <AnimatedCard style={styles.revenueCard}>
                        <MaterialCommunityIcons name="currency-inr" size={32} color="#10B981" />
                        <Text style={styles.revenueValue}>{totalRevenue}</Text>
                        <Text style={styles.revenueLabel}>Total Revenue</Text>
                        <Text style={styles.revenueSubtext}>From {closedDeals} closed deals</Text>
                    </AnimatedCard>
                    <AnimatedCard style={styles.revenueCard}>
                        <MaterialCommunityIcons name="account-group" size={32} color="#8B5CF6" />
                        <Text style={styles.revenueValue}>{activeLeads}</Text>
                        <Text style={styles.revenueLabel}>Active Leads</Text>
                        <Text style={styles.revenueSubtext}>3 hot, 5 warm</Text>
                    </AnimatedCard>
                </View>

                {/* Monthly Trends Chart */}
                <Text style={styles.sectionTitle}>Performance Trends</Text>
                <AnimatedCard style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Views vs Inquiries</Text>
                        <Text style={styles.chartSubtitle}>Last 5 months</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        {analytics.monthlyTrends.map((trend, index) => (
                            <View key={index} style={styles.barGroup}>
                                <View style={styles.barContainer}>
                                    <View style={[styles.bar, styles.viewsBar, { height: (trend.views / 500) * 120 }]} />
                                    <View style={[styles.bar, styles.inquiriesBar, { height: (trend.inquiries / 30) * 120 }]} />
                                </View>
                                <Text style={styles.barLabel}>{trend.month}</Text>
                                <Text style={styles.barValue}>{trend.views}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                            <Text style={styles.legendText}>Views</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
                            <Text style={styles.legendText}>Inquiries</Text>
                        </View>
                    </View>
                </AnimatedCard>

                {/* Property Performance */}
                <Text style={styles.sectionTitle}>Top Performing Properties</Text>
                {analytics.bestPerforming.map((prop, index) => (
                    <AnimatedCard key={index} style={styles.propCard}>
                        <View style={[styles.rankBadge, index === 0 && styles.rankBadgeGold]}>
                            <MaterialCommunityIcons 
                                name={index === 0 ? 'trophy' : 'medal'} 
                                size={18} 
                                color={index === 0 ? '#F59E0B' : Colors.primary} 
                            />
                        </View>
                        <View style={styles.propInfo}>
                            <Text style={styles.propName}>{prop.propertyName}</Text>
                            <View style={styles.propMetrics}>
                                <View style={styles.propMetricItem}>
                                    <MaterialCommunityIcons name="eye" size={14} color={Colors.textMuted} />
                                    <Text style={styles.propMetricText}>{prop.views}</Text>
                                </View>
                                <View style={styles.propMetricItem}>
                                    <MaterialCommunityIcons name="message" size={14} color={Colors.textMuted} />
                                    <Text style={styles.propMetricText}>{Math.floor(prop.views * 0.05)}</Text>
                                </View>
                                <View style={styles.propMetricItem}>
                                    <MaterialCommunityIcons name="heart" size={14} color="#EF4444" />
                                    <Text style={styles.propMetricText}>{Math.floor(prop.views * 0.12)}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.propPerformance}>
                            <Text style={styles.propPerformanceValue}>{((prop.views / analytics.totalViews) * 100).toFixed(1)}%</Text>
                            <Text style={styles.propPerformanceLabel}>of total</Text>
                        </View>
                    </AnimatedCard>
                ))}

                {/* Audience Insights */}
                <Text style={styles.sectionTitle}>Audience Insights</Text>
                <AnimatedCard style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <MaterialCommunityIcons name="clock-time-four" size={24} color="#8B5CF6" />
                        <Text style={styles.insightTitle}>Peak Activity Hours</Text>
                    </View>
                    <Text style={styles.insightText}>Most inquiries: 7-9 PM (35%), 2-4 PM (28%), 10-12 PM (22%)</Text>
                    <View style={styles.insightAction}>
                        <MaterialCommunityIcons name="lightbulb-on" size={16} color={Colors.accent} />
                        <Text style={styles.insightActionText}>Respond during peak hours for 40% better engagement</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <MaterialCommunityIcons name="trending-up" size={24} color="#10B981" />
                        <Text style={styles.insightTitle}>Growth Momentum</Text>
                    </View>
                    <Text style={styles.insightText}>15% increase in views, 8% more inquiries vs last month</Text>
                    <View style={styles.insightAction}>
                        <MaterialCommunityIcons name="lightbulb-on" size={16} color={Colors.accent} />
                        <Text style={styles.insightActionText}>Maintain quality responses to sustain growth</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <MaterialCommunityIcons name="map-marker-radius" size={24} color="#EF4444" />
                        <Text style={styles.insightTitle}>Geographic Reach</Text>
                    </View>
                    <Text style={styles.insightText}>Top cities: Lucknow (45%), Kanpur (25%), Noida (18%)</Text>
                    <View style={styles.insightAction}>
                        <MaterialCommunityIcons name="lightbulb-on" size={16} color={Colors.accent} />
                        <Text style={styles.insightActionText}>Consider adding more properties in high-demand areas</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <MaterialCommunityIcons name="account-search" size={24} color={Colors.primary} />
                        <Text style={styles.insightTitle}>Customer Behavior</Text>
                    </View>
                    <Text style={styles.insightText}>Avg time on listing: 3.2 min, 68% view photos, 42% check location</Text>
                    <View style={styles.insightAction}>
                        <MaterialCommunityIcons name="lightbulb-on" size={16} color={Colors.accent} />
                        <Text style={styles.insightActionText}>Add more high-quality photos to increase engagement</Text>
                    </View>
                </AnimatedCard>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { alignItems: 'center', marginTop: 10 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 },
    headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginTop: 4 },
    content: { padding: 20, marginTop: -30 },
    
    periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 24, backgroundColor: Colors.white, padding: 4, borderRadius: BorderRadius.lg, ...Shadows.sm },
    periodBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
    periodBtnActive: { backgroundColor: Colors.primary },
    periodText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
    periodTextActive: { color: Colors.white },
    
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16, marginTop: 8 },
    
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    metricCard: { width: '48%', backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.lg, ...Shadows.md },
    metricIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    metricValue: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
    metricLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginBottom: 8 },
    metricChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metricChangeText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
    
    revenueRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    revenueCard: { flex: 1, backgroundColor: Colors.white, padding: 20, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.md },
    revenueValue: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginTop: 8 },
    revenueLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginTop: 4 },
    revenueSubtext: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, marginTop: 4 },
    
    chartCard: { backgroundColor: Colors.white, padding: 20, borderRadius: BorderRadius.lg, ...Shadows.md, marginBottom: 24 },
    chartHeader: { marginBottom: 16 },
    chartTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
    chartSubtitle: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginTop: 2 },
    chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 140, marginBottom: 16 },
    barGroup: { alignItems: 'center', flex: 1 },
    barContainer: { flexDirection: 'row', gap: 4, alignItems: 'flex-end', height: 120 },
    bar: { width: 10, borderRadius: 5 },
    viewsBar: { backgroundColor: Colors.primary },
    inquiriesBar: { backgroundColor: Colors.secondary },
    barLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, marginTop: 6 },
    barValue: { fontSize: 9, fontWeight: '600', color: Colors.textSecondary, marginTop: 2 },
    legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
    
    propCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center', marginBottom: 12, ...Shadows.sm },
    rankBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    rankBadgeGold: { backgroundColor: '#FEF3C7' },
    propInfo: { flex: 1 },
    propName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
    propMetrics: { flexDirection: 'row', gap: 12 },
    propMetricItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    propMetricText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
    propPerformance: { alignItems: 'flex-end' },
    propPerformanceValue: { fontSize: 18, fontWeight: '900', color: Colors.primary },
    propPerformanceLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, marginTop: 2 },
    
    insightCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, marginBottom: 12, ...Shadows.sm },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    insightTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
    insightText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
    insightAction: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.accent + '10', padding: 10, borderRadius: BorderRadius.sm },
    insightActionText: { flex: 1, fontSize: 12, fontWeight: '600', color: Colors.accent, lineHeight: 18 },
});

export default AnalyticsDashboardScreen;
