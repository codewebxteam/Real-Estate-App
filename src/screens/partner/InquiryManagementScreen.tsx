import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Modal, RefreshControl } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getPartnerInquiries } from '../../services/inquiryService';
import { Inquiry } from '../../types';
import { useAuth } from '../../context/AuthContext';

const InquiryManagementScreen = () => {
    const { userProfile } = useAuth();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [response, setResponse] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const quickReplies = [
        'Thank you for your interest! I would be happy to schedule a property visit.',
        'The property is still available. When would you like to visit?',
        'I can provide more details. Please share your contact number.',
        'This property offers excellent value. Let me know if you have any questions.',
    ];

    useEffect(() => {
        loadInquiries();
    }, []);

    useEffect(() => {
        filterInquiries();
    }, [inquiries, searchQuery, statusFilter]);

    const loadInquiries = async () => {
        if (!userProfile?.uid) return;
        const data = await getPartnerInquiries(userProfile.uid);
        setInquiries(data);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadInquiries();
        setRefreshing(false);
    }, []);

    const filterInquiries = () => {
        let filtered = inquiries;
        if (statusFilter !== 'all') {
            filtered = filtered.filter(i => i.status === statusFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter(i =>
                i.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.customerName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredInquiries(filtered);
    };

    const handleRespond = () => {
        if (!selectedInquiry || !response.trim()) return;
        // Mock response
        console.log('Responding to inquiry:', selectedInquiry.id, response);
        setSelectedInquiry(null);
        setResponse('');
        loadInquiries();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return '#F59E0B';
            case 'read': return '#3B82F6';
            case 'responded': return '#10B981';
            default: return Colors.textMuted;
        }
    };

    const getStatusCounts = () => ({
        all: inquiries.length,
        new: inquiries.filter(i => i.status === 'new').length,
        read: inquiries.filter(i => i.status === 'read').length,
        responded: inquiries.filter(i => i.status === 'responded').length,
    });

    const counts = getStatusCounts();

    return (
        <View style={styles.container}>
            <GradientHeader height={200}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="message-text" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Inquiry Management</Text>
                    <Text style={styles.headerSubtitle}>{inquiries.length} total inquiries</Text>
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by property or customer..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={Colors.textMuted}
                    />
                </View>

                {/* Status Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {(['all', 'new', 'read', 'responded'] as const).map(status => (
                        <Pressable
                            key={status}
                            style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                            onPress={() => setStatusFilter(status)}
                        >
                            <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>
                                {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Inquiries List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
                >
                    {filteredInquiries.length > 0 ? (
                        filteredInquiries.map(inquiry => (
                            <AnimatedCard key={inquiry.id} style={styles.inquiryCard} onPress={() => setSelectedInquiry(inquiry)}>
                                <View style={styles.inquiryHeader}>
                                    <View style={styles.inquiryLeft}>
                                        <Text style={styles.propertyName}>{inquiry.propertyName}</Text>
                                        <View style={styles.customerInfo}>
                                            <MaterialCommunityIcons name="account" size={14} color={Colors.textMuted} />
                                            <Text style={styles.customerName}>{inquiry.customerName}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inquiry.status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(inquiry.status) }]}>
                                            {inquiry.status}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.message} numberOfLines={2}>{inquiry.message}</Text>
                                <View style={styles.inquiryFooter}>
                                    <Text style={styles.date}>
                                        {inquiry.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </Text>
                                    <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.primary} />
                                </View>
                            </AnimatedCard>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="inbox" size={64} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No inquiries found</Text>
                        </View>
                    )}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Response Modal */}
            <Modal visible={!!selectedInquiry} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Respond to Inquiry</Text>
                            <Pressable onPress={() => setSelectedInquiry(null)}>
                                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
                            </Pressable>
                        </View>

                        {selectedInquiry && (
                            <>
                                <View style={styles.inquiryDetails}>
                                    <Text style={styles.detailLabel}>Property</Text>
                                    <Text style={styles.detailValue}>{selectedInquiry.propertyName}</Text>
                                    <Text style={styles.detailLabel}>Customer</Text>
                                    <Text style={styles.detailValue}>{selectedInquiry.customerName}</Text>
                                    <Text style={styles.detailLabel}>Message</Text>
                                    <Text style={styles.detailValue}>{selectedInquiry.message}</Text>
                                </View>

                                <Text style={styles.quickReplyTitle}>Quick Replies</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplyScroll}>
                                    {quickReplies.map((reply, index) => (
                                        <Pressable
                                            key={index}
                                            style={styles.quickReplyChip}
                                            onPress={() => setResponse(reply)}
                                        >
                                            <Text style={styles.quickReplyText}>{reply}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>

                                <TextInput
                                    style={styles.responseInput}
                                    placeholder="Type your response..."
                                    value={response}
                                    onChangeText={setResponse}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />

                                <Pressable
                                    style={[styles.sendButton, !response.trim() && styles.sendButtonDisabled]}
                                    onPress={handleRespond}
                                    disabled={!response.trim()}
                                >
                                    <MaterialCommunityIcons name="send" size={20} color="#fff" />
                                    <Text style={styles.sendButtonText}>Send Response</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    headerContent: { alignItems: 'center', marginTop: 10 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 8 },
    headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginTop: 4 },
    content: { flex: 1, padding: 20, marginTop: -40 },
    
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, ...Shadows.md },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
    
    filterScroll: { marginBottom: 16 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.white, marginRight: 8, ...Shadows.sm },
    filterChipActive: { backgroundColor: Colors.primary },
    filterText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
    filterTextActive: { color: Colors.white },
    
    inquiryCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, marginBottom: 12, ...Shadows.sm },
    inquiryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    inquiryLeft: { flex: 1 },
    propertyName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    customerName: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    message: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
    inquiryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    date: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
    
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textMuted, marginTop: 16 },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
    
    inquiryDetails: { backgroundColor: Colors.background, padding: 16, borderRadius: BorderRadius.md, marginBottom: 16 },
    detailLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginTop: 8 },
    detailValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 4 },
    
    quickReplyTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
    quickReplyScroll: { marginBottom: 16 },
    quickReplyChip: { backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.md, marginRight: 8, maxWidth: 200 },
    quickReplyText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
    
    responseInput: { backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: 12, fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 16, minHeight: 100 },
    
    sendButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg, gap: 8 },
    sendButtonDisabled: { opacity: 0.5 },
    sendButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

export default InquiryManagementScreen;
