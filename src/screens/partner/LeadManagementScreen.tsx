import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Modal, Alert } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getPartnerLeads, updateLeadStatus, updateLeadNotes, exportLeadsToCSV } from '../../services/leadService';
import { Lead, LeadStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

const LeadManagementScreen = () => {
    const { userProfile } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadLeads();
    }, []);

    useEffect(() => {
        filterLeads();
    }, [leads, statusFilter]);

    const loadLeads = async () => {
        if (!userProfile?.uid) return;
        const data = await getPartnerLeads(userProfile.uid);
        setLeads(data);
    };

    const filterLeads = () => {
        if (statusFilter === 'all') {
            setFilteredLeads(leads);
        } else {
            setFilteredLeads(leads.filter(l => l.status === statusFilter));
        }
    };

    const handleStatusChange = async (leadId: string, status: LeadStatus) => {
        await updateLeadStatus(leadId, status);
        loadLeads();
    };

    const handleSaveNotes = async () => {
        if (!selectedLead) return;
        await updateLeadNotes(selectedLead.id, notes);
        setSelectedLead(null);
        setNotes('');
        loadLeads();
    };

    const handleExport = async () => {
        const csv = await exportLeadsToCSV(leads);
        Alert.alert('Export Successful', 'Leads exported to CSV format');
        console.log('CSV Data:', csv);
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'hot': return '#EF4444';
            case 'warm': return '#F59E0B';
            case 'cold': return '#3B82F6';
        }
    };

    const getStatusCounts = () => ({
        all: leads.length,
        hot: leads.filter(l => l.status === 'hot').length,
        warm: leads.filter(l => l.status === 'warm').length,
        cold: leads.filter(l => l.status === 'cold').length,
    });

    const counts = getStatusCounts();

    return (
        <View style={styles.container}>
            <GradientHeader height={180}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="account-group" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Lead Management</Text>
                    <Text style={styles.headerSubtitle}>{leads.length} total leads</Text>
                </View>
            </GradientHeader>

            <View style={styles.content}>
                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
                        <Text style={styles.statValue}>{counts.hot}</Text>
                        <Text style={styles.statLabel}>Hot</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
                        <Text style={styles.statValue}>{counts.warm}</Text>
                        <Text style={styles.statLabel}>Warm</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
                        <Text style={styles.statValue}>{counts.cold}</Text>
                        <Text style={styles.statLabel}>Cold</Text>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                        {(['all', 'hot', 'warm', 'cold'] as const).map(status => (
                            <Pressable
                                key={status}
                                style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                                onPress={() => setStatusFilter(status)}
                            >
                                <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Pressable style={styles.exportButton} onPress={handleExport}>
                        <MaterialCommunityIcons name="download" size={20} color={Colors.primary} />
                    </Pressable>
                </View>

                {/* Leads List */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredLeads.map(lead => (
                        <AnimatedCard key={lead.id} style={styles.leadCard} onPress={() => {
                            setSelectedLead(lead);
                            setNotes(lead.notes);
                        }}>
                            <View style={styles.leadHeader}>
                                <View style={styles.leadLeft}>
                                    <Text style={styles.customerName}>{lead.customerName}</Text>
                                    <Text style={styles.propertyName}>{lead.propertyName}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                                        {lead.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.contactInfo}>
                                <View style={styles.contactItem}>
                                    <MaterialCommunityIcons name="email" size={14} color={Colors.textMuted} />
                                    <Text style={styles.contactText}>{lead.customerEmail}</Text>
                                </View>
                                <View style={styles.contactItem}>
                                    <MaterialCommunityIcons name="phone" size={14} color={Colors.textMuted} />
                                    <Text style={styles.contactText}>{lead.customerPhone}</Text>
                                </View>
                            </View>

                            {lead.tags.length > 0 && (
                                <View style={styles.tags}>
                                    {lead.tags.map((tag, index) => (
                                        <View key={index} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {lead.notes && (
                                <Text style={styles.notes} numberOfLines={2}>{lead.notes}</Text>
                            )}

                            {lead.followUpDate && (
                                <View style={styles.followUp}>
                                    <MaterialCommunityIcons name="calendar-clock" size={14} color={Colors.accent} />
                                    <Text style={styles.followUpText}>
                                        Follow up: {lead.followUpDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                            )}
                        </AnimatedCard>
                    ))}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Lead Details Modal */}
            <Modal visible={!!selectedLead} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Lead Details</Text>
                            <Pressable onPress={() => setSelectedLead(null)}>
                                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
                            </Pressable>
                        </View>

                        {selectedLead && (
                            <ScrollView>
                                <View style={styles.detailsSection}>
                                    <Text style={styles.sectionTitle}>Customer Information</Text>
                                    <Text style={styles.detailLabel}>Name</Text>
                                    <Text style={styles.detailValue}>{selectedLead.customerName}</Text>
                                    <Text style={styles.detailLabel}>Email</Text>
                                    <Text style={styles.detailValue}>{selectedLead.customerEmail}</Text>
                                    <Text style={styles.detailLabel}>Phone</Text>
                                    <Text style={styles.detailValue}>{selectedLead.customerPhone}</Text>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.sectionTitle}>Lead Status</Text>
                                    <View style={styles.statusButtons}>
                                        {(['hot', 'warm', 'cold'] as LeadStatus[]).map(status => (
                                            <Pressable
                                                key={status}
                                                style={[
                                                    styles.statusButton,
                                                    { backgroundColor: getStatusColor(status) + '20' },
                                                    selectedLead.status === status && { borderWidth: 2, borderColor: getStatusColor(status) }
                                                ]}
                                                onPress={() => handleStatusChange(selectedLead.id, status)}
                                            >
                                                <Text style={[styles.statusButtonText, { color: getStatusColor(status) }]}>
                                                    {status.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.sectionTitle}>Notes</Text>
                                    <TextInput
                                        style={styles.notesInput}
                                        placeholder="Add notes about this lead..."
                                        value={notes}
                                        onChangeText={setNotes}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                    <Pressable style={styles.saveButton} onPress={handleSaveNotes}>
                                        <Text style={styles.saveButtonText}>Save Notes</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
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
    content: { flex: 1, padding: 20, marginTop: -30 },
    
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statCard: { flex: 1, backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, alignItems: 'center', borderLeftWidth: 4, ...Shadows.sm },
    statValue: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary },
    statLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, marginTop: 4 },
    
    filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.white, marginRight: 8, ...Shadows.sm },
    filterChipActive: { backgroundColor: Colors.primary },
    filterText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
    filterTextActive: { color: Colors.white },
    exportButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
    
    leadCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, marginBottom: 12, ...Shadows.sm },
    leadHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    leadLeft: { flex: 1 },
    customerName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    propertyName: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm, height: 24 },
    statusText: { fontSize: 11, fontWeight: '900' },
    
    contactInfo: { gap: 6, marginBottom: 12 },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    contactText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
    
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
    tag: { backgroundColor: Colors.primary + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
    tagText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
    
    notes: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, fontStyle: 'italic', marginBottom: 8 },
    
    followUp: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accent + '10', paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.sm },
    followUpText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
    
    detailsSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
    detailLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginTop: 8 },
    detailValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 4 },
    
    statusButtons: { flexDirection: 'row', gap: 12 },
    statusButton: { flex: 1, paddingVertical: 12, borderRadius: BorderRadius.md, alignItems: 'center' },
    statusButtonText: { fontSize: 13, fontWeight: '900' },
    
    notesInput: { backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: 12, fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 12, minHeight: 100 },
    saveButton: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: BorderRadius.lg, alignItems: 'center' },
    saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

export default LeadManagementScreen;
