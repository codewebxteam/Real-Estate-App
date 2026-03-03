import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getCustomerInquiries } from '../../services/inquiryService';
import { useAuth } from '../../context/AuthContext';
import { Inquiry } from '../../types';

const MyInquiriesScreen = () => {
    const { userProfile } = useAuth();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.uid) {
            loadInquiries();
        }
    }, [userProfile]);

    const loadInquiries = async () => {
        setIsLoading(true);
        try {
            const data = await getCustomerInquiries(userProfile!.uid);
            setInquiries(data);
        } catch (error) {
            console.error('Error loading inquiries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'responded': return { bg: '#D1FAE5', text: '#059669' };
            case 'read': return { bg: '#DBEAFE', text: '#2563EB' };
            default: return { bg: '#F3F4F6', text: '#4B5563' };
        }
    };

    const renderInquiryItem = ({ item, index }: { item: Inquiry; index: number }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 100)}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.propertyName}>{item.propertyName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.message} numberOfLines={2}>"{item.message}"</Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.date}>
                        {item.createdAt.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Text>
                    <Pressable style={styles.detailsBtn}>
                        <Text style={styles.detailsBtnText}>Details</Text>
                    </Pressable>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>My Inquiries</Text>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={inquiries}
                    renderItem={renderInquiryItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>💬</Text>
                            <Text style={styles.emptyText}>No inquiries sent yet.</Text>
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
        ...Shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    propertyName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    message: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        lineHeight: 20,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: 12,
    },
    date: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    detailsBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.background,
        borderRadius: 6,
    },
    detailsBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
    },
    empty: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textMuted,
        fontWeight: '600',
    },
});

export default MyInquiriesScreen;
