import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows, BorderRadius } from '../constants/colors';

const ProfileScreen = () => {
  const { userProfile, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const getRoleBadge = () => {
    switch (userProfile?.role) {
      case 'partner':
        return { label: 'Partner', color: Colors.secondary, bg: '#D1FAE5' };
      case 'admin':
        return { label: 'Admin', color: Colors.accent, bg: '#FEF3C7' };
      default:
        return { label: 'Customer', color: Colors.primary, bg: '#EEF2FF' };
    }
  };

  const badge = getRoleBadge();

  const menuItems = [
    { icon: '❤️', label: 'Favorites', desc: 'Your saved properties' },
    { icon: '📜', label: 'History', desc: 'Recently viewed' },
    { icon: '📞', label: 'My Inquiries', desc: 'Sent inquiries' },
    { icon: '⚙️', label: 'Settings', desc: 'App preferences' },
    { icon: '❓', label: 'Help & Support', desc: 'Get assistance' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />

        <Animated.View entering={FadeInUp.duration(600)} style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.name?.charAt(0)?.toUpperCase() || '👤'}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || 'Not signed in'}</Text>

          {/* Role Badge */}
          <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.roleBadgeText, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Stats Row */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Inquiries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Viewed</Text>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => Alert.alert(item.label, item.desc)}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Logout Button */}
      {isAuthenticated && (
        <Animated.View entering={FadeInDown.delay(400)} style={styles.logoutSection}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </Animated.View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    height: 240,
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -20,
  },
  headerCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 20,
    left: -20,
  },
  profileSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: BorderRadius.lg,
    padding: 16,
    ...Shadows.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // Menu
  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { fontSize: 20 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  menuArrow: { fontSize: 22, color: Colors.textMuted },

  // Logout
  logoutSection: { marginHorizontal: 20, marginTop: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
});

export default ProfileScreen;
