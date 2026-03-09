import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Alert,
    TextInput,
    Modal,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { GradientButton } from '../../components/ui/GradientButton';
import { getPendingContactRequests, updateContactRequestStatus } from '../../services/contactRequestService';
import { ContactRequest } from '../../types';

const ContactRequestReviewScreen = () => {
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

    const loadRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getPendingContactRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleReview = (request: ContactRequest, action: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setActionType(action);
        setAdminNote('');
        setIsModalVisible(true);
    };

    const submitReview = async () => {
        if (!selectedRequest) return;

        try {
            await updateContactRequestStatus(
                selectedRequest.id,
                actionType === 'approve' ? 'approved' : 'rejected',
                adminNote || undefined
            );
            Alert.alert('Success', `Contact request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
            setIsModalVisible(false);
            loadRequests();
        } catch (error) {
            Alert.alert('Error', 'Failed to update request');
        }
    };

    const renderRequestItem = ({ item, index }: { item: ContactRequest; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.badge}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.warning} />
                    <Text style={styles.badgeText}>PENDING REVIEW</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property</Text>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="home" size={18} color={Colors.primary} />
                    <Text style={styles.infoText}>{item.propertyName}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account" size={18} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{item.customerName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email" size={18} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{item.customerEmail}</Text>
                </View>
                {item.customerPhone && (
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="phone" size={18} color={Colors.textSecondary} />
                        <Text style={styles.infoText}>{item.customerPhone}</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Owner Details</Text>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-tie" size={18} color={Colors.secondary} />
                    <Text style={styles.infoText}>{item.partnerName}</Text>
                </View>
            </View>

            <View style={styles.messageBox}>
                <Text style={styles.messageLabel}>Customer Message:</Text>
                <Text style={styles.messageText}>"{item.message}"</Text>
            </View>

            <View style={styles.dateRow}>
                <MaterialCommunityIcons name="calendar" size={14} color={Colors.textMuted} />
                <Text style={styles.dateText}>
                    Requested on {item.createdAt.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                </Text>
            </View>

            <View style={styles.actionRow}>
                <Pressable
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleReview(item, 'reject')}
                >
                    <MaterialCommunityIcons name="close" size={18} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Reject</Text>
                </Pressable>
                <Pressable
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => handleReview(item, 'approve')}
                >
                    <MaterialCommunityIcons name="check" size={18} color={Colors.white} />
                    <Text style={styles.actionBtnText}>Approve</Text>
                </Pressable>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>Contact Requests</Text>
                <Text style={styles.headerSubtitle}>Review customer contact requests</Text>
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
                            <MaterialCommunityIcons name="check-all" size={64} color={Colors.secondary} opacity={0.5} />
                            <Text style={styles.emptyText}>No pending requests</Text>
                        </View>
                    }
                />
            )}

            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {actionType === 'approve' ? 'Approve' : 'Reject'} Contact Request
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedRequest?.customerName} → {selectedRequest?.partnerName}
                        </Text>

                        <TextInput
                            style={styles.noteInput}
                            placeholder="Add a note (optional)"
                            placeholderTextColor={Colors.textMuted}
                            value={adminNote}
                            onChangeText={setAdminNote}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalBtn, actionType === 'approve' ? styles.approveBtn : styles.rejectBtn]}
                                onPress={submitReview}
                            >
                                <Text style={styles.actionBtnText}>
                                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginTop: 20 },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
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
        marginBottom: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.warning,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textMuted,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    messageBox: {
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    messageLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textMuted,
        marginBottom: 6,
    },
    messageText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    approveBtn: {
        backgroundColor: Colors.secondary,
    },
    rejectBtn: {
        backgroundColor: Colors.error,
    },
    actionBtnText: {
        fontSize: 14,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    noteInput: {
        backgroundColor: Colors.background,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: Colors.textPrimary,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: Colors.background,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
});

export default ContactRequestReviewScreen;
