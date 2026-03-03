import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { getAllPendingKYC, updateKYCStatus } from '../../services/kycService';
import { KYCDocument } from '../../types';

const KYCReviewScreen = () => {
    const [submissions, setSubmissions] = useState<KYCDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        setIsLoading(true);
        try {
            const data = await getAllPendingKYC();
            setSubmissions(data);
        } catch (error) {
            console.error('Error loading KYC:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = (id: string, name: string, status: 'verified' | 'rejected') => {
        Alert.alert(
            `${status === 'verified' ? 'Approve' : 'Reject'} KYC`,
            `Are you sure you want to ${status} ${name}'s documents?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Proceed',
                    style: status === 'rejected' ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            await updateKYCStatus(id, status);
                            loadSubmissions(); // Refresh
                        } catch (error) {
                            Alert.alert('Error', 'Update failed.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: KYCDocument }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{item.partnerName}</Text>
                    <Text style={styles.partnerEmail}>{item.partnerEmail}</Text>
                </View>
                <Text style={styles.dateText}>
                    {item.submittedAt.toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.docsRow}>
                <View style={styles.docItem}>
                    <Text style={styles.docLabel}>Identity Document</Text>
                    <Image source={{ uri: item.idDocumentUrl }} style={styles.docImg} />
                </View>
                <View style={styles.docItem}>
                    <Text style={styles.docLabel}>Profile Photo</Text>
                    <Image source={{ uri: item.profilePhotoUrl }} style={styles.docImg} />
                </View>
            </View>

            <View style={styles.actions}>
                <Pressable
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleAction(item.id!, item.partnerName, 'rejected')}
                >
                    <Text style={styles.btnTextReject}>Reject</Text>
                </Pressable>
                <Pressable
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => handleAction(item.id!, item.partnerName, 'verified')}
                >
                    <Text style={styles.btnTextApprove}>Approve Partner</Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <GradientHeader height={140}>
                <Text style={styles.headerTitle}>KYC Review Queue</Text>
            </GradientHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={submissions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id!}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialCommunityIcons name="check-all" size={64} color={Colors.secondary} />
                            <Text style={styles.emptyText}>All caught up! No pending KYC.</Text>
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
    list: { padding: 16 },
    card: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 20, ...Shadows.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    partnerInfo: { flex: 1 },
    partnerName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
    partnerEmail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
    dateText: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },

    docsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    docItem: { flex: 1 },
    docLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: 8 },
    docImg: { width: '100%', height: 100, borderRadius: 8, backgroundColor: Colors.background },

    actions: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    rejectBtn: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' },
    approveBtn: { backgroundColor: Colors.primary },
    btnTextReject: { color: '#EF4444', fontWeight: '800', fontSize: 14 },
    btnTextApprove: { color: Colors.white, fontWeight: '800', fontSize: 14 },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: Colors.textMuted, fontWeight: '600', marginTop: 16 },
});

export default KYCReviewScreen;
