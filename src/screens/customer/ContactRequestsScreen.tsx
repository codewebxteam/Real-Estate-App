import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Linking,
    Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getCustomerContactRequests } from '../../services/contactRequestService';
import { useAuth } from '../../context/AuthContext';
import { ContactRequest } from '../../types';

const ContactRequestsScreen = () => {
    const { userProfile } = useAuth();
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRequests = useCallback(async () => {
        if (!userProfile?.uid) return;
        setIsLoading(true);
        try {
            const data = await getCustomerContactRequests(userProfile.uid);
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userProfile]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved': return { bg: '#D1FAE5', text: '#059669', icon: 'check-circle' };
            case 'rejected': return { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle' };
            default: return { bg: '#FEF3C7', text: '#D97706', icon: 'clock-outline' };
        }
    };

    const handleContact = (request: ContactRequest) => {
        if (request.status !== 'approved') {
            Alert.alert('Not Approved', 'This contact request is still pending admin approval.');
            return;
        }

        Alert.alert(
            'Contact Owner',
            `${request.partnerName}\nEmail: ${request.partnerEmail}${request.partnerPhone ? `\nPhone: ${request.partnerPhone}` : ''}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call',
                    onPress: () => request.partnerPhone && Linking.openURL(`tel:${request.partnerPhone}`)
                },
                {
                    text: 'Email',
                    onPress: () => Linking.openURL(`mailto:${request.partnerEmail}`)
                },
            ]
        );
    };

    const renderRequestItem = ({ item, index }: { item: ContactRequest; index: number }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.propertyInfo}>
                        <MaterialCommunityIcons name="home" size={20} color={Colors.primary} />
                        <Text style={styles.propertyName} numberOfLines={1}>{item.propertyName}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <MaterialCommunityIcons name={statusStyle.icon as any} size={12} color={statusStyle.text} />
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.messageContainer}>
                    <Text style={styles.message} numberOfLines={2}>"{item.message}"</Text>
                </View>

                {item.status === 'approved' && (
                    <View style={styles.ownerInfo}>
                        <MaterialCommunityIcons name="account" size={16} color={Colors.secondary} />
                        <Text style={styles.ownerText}>Owner: {item.partnerName}</Text>
                    </View>
                )}

                {item.adminNote && (
                    <View style={styles.adminNote}>
                        <MaterialCommunityIcons name="shield-check" size={14} color={Colors.textMuted} />
                        <Text style={styles.noteText}>{item.adminNote}</Text>
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <Text style={styles.date}>
                        {item.createdAt.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Text>
                    {item.status === 'approved' && (
                        <Pressable style={styles.contactBtn} onPress={() => handleContact(item)}>
                            <MaterialCommunityIcons name="phone" size={16} color={Colors.white} />
                            <Text style={styles.contactBtnText}>Contact Owner</Text>
                        </Pressable>
                    )}
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>Contact Requests</Text>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderRequestItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialCommunityIcons name="phone-off" size={64} color={Colors.textMuted} opacity={0.5} />
                            <Text style={styles.emptyText}>No contact requests yet</Text>
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
        padding: 16,
        marginBottom: 16,
        ...Shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    propertyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    propertyName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    messageContainer: {
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: BorderRadius.sm,
        marginBottom: 12,
    },
    message: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        backgroundColor: '#F0FDF4',
        padding: 10,
        borderRadius: 8,
    },
    ownerText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.secondary,
    },
    adminNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        padding: 8,
        backgroundColor: Colors.background,
        borderRadius: 6,
    },
    noteText: {
        fontSize: 12,
        color: Colors.textMuted,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    date: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    contactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        gap: 6,
    },
    contactBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.white,
    },
    empty: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textMuted,
        fontWeight: '600',
        marginTop: 16,
    },
});

export default ContactRequestsScreen;
