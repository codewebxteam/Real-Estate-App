import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, getRecentActivities, getSystemHealth } from '../../services/adminService';

const AdminDashboardScreen = ({ navigation }: any) => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [statsData, activitiesData, healthData] = await Promise.all([
      getAdminStats(),
      getRecentActivities(),
      getSystemHealth(),
    ]);
    setStats(statsData);
    setActivities(activitiesData);
    setSystemHealth(healthData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (!stats) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.adminBadge}>
          <MaterialCommunityIcons name="shield-crown" size={16} color="#fff" />
          <Text style={styles.adminBadgeText}>SUPER ADMIN</Text>
        </View>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>System Control Center</Text>
      </View>

      <View style={styles.content}>
        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#EEF2FF' }]} onPress={() => navigation.navigate('KYCReview')}>
            <MaterialCommunityIcons name="shield-check" size={28} color="#6366F1" />
            <Text style={styles.statValue}>{stats.pendingKYC}</Text>
            <Text style={styles.statLabel}>Pending KYC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#FEF3C7' }]} onPress={() => navigation.navigate('PropertyModeration')}>
            <MaterialCommunityIcons name="home-alert" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.pendingProperties}</Text>
            <Text style={styles.statLabel}>New Listings</Text>
          </TouchableOpacity>

          <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
            <MaterialCommunityIcons name="account-group" size={28} color="#10B981" />
            <Text style={styles.statValue}>{stats.totalPartners}</Text>
            <Text style={styles.statLabel}>Partners</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <MaterialCommunityIcons name="home-city" size={28} color="#3B82F6" />
            <Text style={styles.statValue}>{stats.totalProperties}</Text>
            <Text style={styles.statLabel}>Properties</Text>
          </View>
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthCard}>
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.healthLabel}>Server Status</Text>
                <Text style={styles.healthValue}>Operational</Text>
              </View>
              <View style={styles.healthItem}>
                <MaterialCommunityIcons name="speedometer" size={20} color={Colors.primary} />
                <Text style={styles.healthLabel}>Uptime</Text>
                <Text style={styles.healthValue}>{systemHealth.uptime}%</Text>
              </View>
            </View>
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <MaterialCommunityIcons name="account-multiple" size={20} color={Colors.primary} />
                <Text style={styles.healthLabel}>Active Users</Text>
                <Text style={styles.healthValue}>{systemHealth.activeUsers}</Text>
              </View>
              <View style={styles.healthItem}>
                <MaterialCommunityIcons name="database" size={20} color={Colors.primary} />
                <Text style={styles.healthLabel}>DB Load</Text>
                <Text style={styles.healthValue}>{systemHealth.databaseLoad}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Revenue & Growth */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueLabel}>Total Revenue</Text>
                <Text style={styles.revenueValue}>₹{(stats.totalRevenue / 100000).toFixed(1)}L</Text>
              </View>
              <View style={styles.growthBadge}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#10B981" />
                <Text style={styles.growthText}>+{stats.monthlyGrowth}%</Text>
              </View>
            </View>
            <View style={styles.revenueStats}>
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatLabel}>Active Listings</Text>
                <Text style={styles.revenueStatValue}>{stats.activeListings}</Text>
              </View>
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatLabel}>Avg Response</Text>
                <Text style={styles.revenueStatValue}>{stats.avgResponseTime}h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                <MaterialCommunityIcons name={activity.icon as any} size={20} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityUser}>{activity.user}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('KYCReview')}>
            <MaterialCommunityIcons name="shield-check" size={22} color={Colors.primary} />
            <Text style={styles.actionText}>Review KYC Submissions</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PropertyModeration')}>
            <MaterialCommunityIcons name="home-search" size={22} color={Colors.primary} />
            <Text style={styles.actionText}>Moderate Properties</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  adminBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  content: { padding: 20, marginTop: -20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.md,
  },
  statValue: { fontSize: 32, fontWeight: '900', color: Colors.text, marginTop: 8 },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginTop: 4 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 12 },

  healthCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    ...Shadows.sm,
  },
  healthRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  healthItem: { flex: 1, alignItems: 'center' },
  healthDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
  healthLabel: { fontSize: 11, color: '#666', marginTop: 4 },
  healthValue: { fontSize: 16, fontWeight: '700', color: Colors.text, marginTop: 2 },

  revenueCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    ...Shadows.sm,
  },
  revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  revenueLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
  revenueValue: { fontSize: 32, fontWeight: '900', color: Colors.text, marginTop: 4 },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  growthText: { fontSize: 13, fontWeight: '800', color: '#10B981' },
  revenueStats: { flexDirection: 'row', gap: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.background },
  revenueStat: { flex: 1 },
  revenueStatLabel: { fontSize: 11, color: '#666', fontWeight: '600' },
  revenueStatValue: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 4 },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: { flex: 1 },
  activityUser: { fontSize: 14, fontWeight: '700', color: Colors.text },
  activityTime: { fontSize: 12, color: '#666', marginTop: 2 },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.sm,
    gap: 12,
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text },
});

export default AdminDashboardScreen;
