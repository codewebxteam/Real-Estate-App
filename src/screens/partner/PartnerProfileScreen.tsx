import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Colors, Shadows } from '../../constants/colors';

const PartnerProfileScreen = () => {
  const { userProfile, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Success', 'Logged out successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>{userProfile?.name}</Text>
        <Text style={styles.userEmail}>{userProfile?.email}</Text>
        <View style={styles.roleBadge}>
          <MaterialCommunityIcons name="shield-star" size={16} color={Colors.primary} />
          <Text style={styles.roleText}>{userProfile?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="email" size={20} color={Colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userProfile?.email}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>KYC Status</Text>
            <Text style={[styles.infoValue, { color: '#10B981' }]}>
              {userProfile?.kycStatus?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="calendar" size={20} color={Colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="account-edit" size={22} color={Colors.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="lock-reset" size={22} color={Colors.primary} />
          <Text style={styles.actionText}>Change Password</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="bell-ring" size={22} color={Colors.primary} />
          <Text style={styles.actionText}>Notification Settings</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="help-circle" size={22} color={Colors.primary} />
          <Text style={styles.actionText}>Help & Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.md,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    ...Shadows.sm,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
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
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    ...Shadows.md,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PartnerProfileScreen;
