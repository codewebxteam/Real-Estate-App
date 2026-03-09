import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getPartnerNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import { Notification } from '../../types';
import { useAuth } from '../../context/AuthContext';

const NotificationsCenterScreen = () => {
    const { userProfile } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        if (!userProfile?.uid) return;
        const data = await getPartnerNotifications(userProfile.uid);
        setNotifications(data);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await markNotificationAsRead(notificationId);
        loadNotifications();
    };

    const handleMarkAllAsRead = async () => {
        if (!userProfile?.uid) return;
        await markAllNotificationsAsRead(userProfile.uid);
        loadNotifications();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'inquiry': return 'message-text';
            case 'kyc': return 'badge-account-horizontal';
            case 'property': return 'home-city';
            case 'system': return 'bell';
            default: return 'bell';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'inquiry': return Colors.primary;
            case 'kyc': return Colors.accent;
            case 'property': return Colors.secondary;
            case 'system': return '#8B5CF6';
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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <View style={styles.container}>
            <GradientHeader height={180}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="bell" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unreadCount} new</Text>
                        </View>
                    )}
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {unreadCount > 0 && (
                    <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
                        <MaterialCommunityIcons name="check-all" size={18} color={Colors.primary} />
                        <Text style={styles.markAllText}>Mark all as read</Text>
                    </Pressable>
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
                >
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <AnimatedCard
                                key={notification.id}
                                style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}
                                onPress={() => handleMarkAsRead(notification.id)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                                    <MaterialCommunityIcons
                                        name={getNotificationIcon(notification.type)}
                                        size={24}
                                        color={getNotificationColor(notification.type)}
                                    />
                                </View>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                                        {!notification.isRead && <View style={styles.unreadDot} />}
                                    </View>
                                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                                    <Text style={styles.notificationTime}>{getTimeAgo(notification.createdAt)}</Text>
                                </View>
                            </AnimatedCard>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="bell-off" size={64} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                            <Text style={styles.emptySubtext}>We'll notify you when something important happens</Text>
                        </View>
                    )}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { alignItems: 'center', marginTop: 10 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 8 },
    unreadBadge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, marginTop: 8 },
    unreadText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    content: { flex: 1, padding: 20, marginTop: -30 },
    
    markAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, paddingVertical: 12, borderRadius: BorderRadius.lg, marginBottom: 16, gap: 8, ...Shadows.sm },
    markAllText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
    
    notificationCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, flexDirection: 'row', marginBottom: 12, ...Shadows.sm },
    unreadCard: { borderLeftWidth: 4, borderLeftColor: Colors.primary },
    iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    notificationContent: { flex: 1 },
    notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    notificationTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
    notificationMessage: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, lineHeight: 18, marginBottom: 6 },
    notificationTime: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
    
    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16 },
    emptySubtext: { fontSize: 14, fontWeight: '500', color: Colors.textMuted, marginTop: 8, textAlign: 'center' },
});

export default NotificationsCenterScreen;
