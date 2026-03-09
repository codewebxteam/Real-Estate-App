import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    TextInput,
    RefreshControl,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getCustomerInquiries } from '../../services/inquiryService';
import { useAuth } from '../../context/AuthContext';
import { Inquiry } from '../../types';

const MyInquiriesScreen = () => {
    const { userProfile } = useAuth();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'responded'>('all');

    const loadInquiries = useCallback(async () => {
        if (!userProfile?.uid) return;
        try {
            const data = await getCustomerInquiries(userProfile.uid);
            setInquiries(data);
        } catch (error) {
            console.error('Error loading inquiries:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [userProfile]);

    useEffect(() => {
        loadInquiries();
    }, [loadInquiries]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadInquiries();
    }, [loadInquiries]);

    const filteredInquiries = useMemo(() => {
        return inquiries.filter((inquiry) => {
            const matchesSearch = inquiry.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [inquiries, searchQuery, filterStatus]);

    const statusCounts = useMemo(() => {
        return {
            all: inquiries.length,
            new: inquiries.filter(i => i.status === 'new').length,
            read: inquiries.filter(i => i.status === 'read').length,
            responded: inquiries.filter(i => i.status === 'responded').length,
        };
    }, [inquiries]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'responded': return { bg: '#D1FAE5', text: '#059669', icon: 'check-circle' };
            case 'read': return { bg: '#DBEAFE', text: '#2563EB', icon: 'eye' };
            default: return { bg: '#FEF3C7', text: '#D97706', icon: 'clock-outline' };
        }
    };

    const StatusFilter = ({ status, label, count }: any) => (
        <Pressable
            onPress={() => setFilterStatus(status)}
            style={[
                styles.filterChip,
                filterStatus === status && styles.filterChipActive,
            ]}
        >
            <Text style={[
                styles.filterLabel,
                filterStatus === status && styles.filterLabelActive,
            ]}>
                {label}
            </Text>
            <View style={[
                styles.countBadge,
                filterStatus === status && styles.countBadgeActive,
            ]}>
                <Text style={[
                    styles.countText,
                    filterStatus === status && styles.countTextActive,
                ]}>
                    {count}
                </Text>
            </View>
        </Pressable>
    );

    const renderInquiryItem = ({ item, index }: { item: Inquiry; index: number }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 50)}
                style={styles.card}
            >
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
                    <MaterialCommunityIcons name="message-text-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.message} numberOfLines={2}>"{item.message}"</Text>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.dateContainer}>
                        <MaterialCommunityIcons name="calendar" size={14} color={Colors.textMuted} />
                        <Text style={styles.date}>
                            {item.createdAt.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                    <Pressable style={styles.detailsBtn}>
                        <Text style={styles.detailsBtnText}>View Details</Text>
                        <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.primary} />
                    </Pressable>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <GradientHeader height={180}>
                <Animated.View entering={FadeInUp.delay(200)} style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Inquiries</Text>
                    <Text style={styles.headerSubtitle}>
                        Track your property inquiries
                    </Text>
                </Animated.View>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <>
                    {/* Search Bar */}
                    <Animated.View entering={FadeInDown.delay(300)} style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by property name..."
                                placeholderTextColor={Colors.textMuted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery ? (
                                <Pressable onPress={() => setSearchQuery('')}>
                                    <MaterialCommunityIcons name="close-circle" size={20} color={Colors.textMuted} />
                                </Pressable>
                            ) : null}
                        </View>
                    </Animated.View>

                    {/* Status Filters */}
                    <Animated.View entering={FadeInDown.delay(400)} style={styles.filterContainer}>
                        <StatusFilter status="all" label="All" count={statusCounts.all} />
                        <StatusFilter status="new" label="New" count={statusCounts.new} />
                        <StatusFilter status="read" label="Read" count={statusCounts.read} />
                        <StatusFilter status="responded" label="Replied" count={statusCounts.responded} />
                    </Animated.View>

                    {/* Inquiries List */}
                    <FlatList
                        data={filteredInquiries}
                        renderItem={renderInquiryItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.primary]}
                                tintColor={Colors.primary}
                            />
                        }
                        ListEmptyComponent={
                            <Animated.View entering={FadeInDown.delay(500)} style={styles.empty}>
                                <MaterialCommunityIcons name="message-off-outline" size={64} color={Colors.textMuted} opacity={0.5} />
                                <Text style={styles.emptyTitle}>
                                    {searchQuery || filterStatus !== 'all' ? 'No matching inquiries' : 'No inquiries yet'}
                                </Text>
                                <Text style={styles.emptyText}>
                                    {searchQuery || filterStatus !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'Start browsing properties and send inquiries'}
                                </Text>
                            </Animated.View>
                        }
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { alignItems: 'flex-start', width: '100%', marginTop: 20 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    searchContainer: { paddingHorizontal: 20, marginTop: -30, marginBottom: 16 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: BorderRadius.md,
        gap: 10,
        ...Shadows.lg,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.textPrimary,
    },

    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 16,
    },
    filterChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: Colors.border,
        gap: 6,
        ...Shadows.sm,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    filterLabelActive: {
        color: Colors.white,
    },
    countBadge: {
        backgroundColor: Colors.background,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    countBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    countText: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    countTextActive: {
        color: Colors.white,
    },

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
        letterSpacing: 0.5,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: BorderRadius.sm,
        marginBottom: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    date: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    detailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.background,
        borderRadius: 8,
        gap: 4,
    },
    detailsBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },

    empty: {
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default MyInquiriesScreen;
