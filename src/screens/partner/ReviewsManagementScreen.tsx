import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Modal } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getPropertyReviews, respondToReview, getAverageRating } from '../../services/reviewService';
import { getProperties } from '../../services/propertyService';
import { Review, Property } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ReviewsManagementScreen = () => {
    const { userProfile } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [response, setResponse] = useState('');
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!userProfile?.uid) return;
        const allProps = await getProperties();
        const myProps = allProps.filter(p => p.ownerId === userProfile.uid);
        setProperties(myProps);

        const allReviews: Review[] = [];
        let totalRating = 0;
        for (const prop of myProps) {
            const propReviews = await getPropertyReviews(prop.id);
            allReviews.push(...propReviews);
            const rating = await getAverageRating(prop.id);
            totalRating += rating;
        }
        setReviews(allReviews);
        setAverageRating(myProps.length > 0 ? totalRating / myProps.length : 0);
    };

    const handleRespond = async () => {
        if (!selectedReview || !response.trim()) return;
        await respondToReview(selectedReview.id, response);
        setSelectedReview(null);
        setResponse('');
        loadData();
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <MaterialCommunityIcons
                key={index}
                name={index < rating ? 'star' : 'star-outline'}
                size={16}
                color="#F59E0B"
            />
        ));
    };

    return (
        <View style={styles.container}>
            <GradientHeader height={200}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="star" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Reviews & Ratings</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
                        <View style={styles.stars}>{renderStars(Math.round(averageRating))}</View>
                        <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
                    </View>
                </View>
            </GradientHeader>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <AnimatedCard key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.customerInfo}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{review.customerName.charAt(0)}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.customerName}>{review.customerName}</Text>
                                        <View style={styles.stars}>{renderStars(review.rating)}</View>
                                    </View>
                                </View>
                                <Text style={styles.reviewDate}>
                                    {review.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </Text>
                            </View>

                            <Text style={styles.propertyName}>{review.propertyId}</Text>
                            <Text style={styles.reviewComment}>{review.comment}</Text>

                            {review.response ? (
                                <View style={styles.responseContainer}>
                                    <View style={styles.responseHeader}>
                                        <MaterialCommunityIcons name="reply" size={16} color={Colors.primary} />
                                        <Text style={styles.responseLabel}>Your Response</Text>
                                    </View>
                                    <Text style={styles.responseText}>{review.response}</Text>
                                    <Text style={styles.responseDate}>
                                        {review.respondedAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                            ) : (
                                <Pressable
                                    style={styles.respondButton}
                                    onPress={() => setSelectedReview(review)}
                                >
                                    <MaterialCommunityIcons name="reply" size={18} color={Colors.primary} />
                                    <Text style={styles.respondButtonText}>Respond</Text>
                                </Pressable>
                            )}
                        </AnimatedCard>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="star-off" size={64} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No reviews yet</Text>
                        <Text style={styles.emptySubtext}>Reviews from customers will appear here</Text>
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Response Modal */}
            <Modal visible={!!selectedReview} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Respond to Review</Text>
                            <Pressable onPress={() => setSelectedReview(null)}>
                                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
                            </Pressable>
                        </View>

                        {selectedReview && (
                            <>
                                <View style={styles.reviewPreview}>
                                    <View style={styles.previewHeader}>
                                        <Text style={styles.previewCustomer}>{selectedReview.customerName}</Text>
                                        <View style={styles.stars}>{renderStars(selectedReview.rating)}</View>
                                    </View>
                                    <Text style={styles.previewComment}>{selectedReview.comment}</Text>
                                </View>

                                <TextInput
                                    style={styles.responseInput}
                                    placeholder="Write your response..."
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
    ratingContainer: { alignItems: 'center', marginTop: 12 },
    ratingValue: { color: '#fff', fontSize: 36, fontWeight: '900' },
    stars: { flexDirection: 'row', gap: 4, marginTop: 4 },
    reviewCount: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginTop: 4 },
    content: { flex: 1, padding: 20, marginTop: -40 },
    
    reviewCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, marginBottom: 12, ...Shadows.sm },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 16, fontWeight: '900' },
    customerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    reviewDate: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
    propertyName: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, marginBottom: 8 },
    reviewComment: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
    
    responseContainer: { backgroundColor: Colors.background, padding: 12, borderRadius: BorderRadius.sm, marginTop: 8 },
    responseHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    responseLabel: { fontSize: 12, fontWeight: '700', color: Colors.primary },
    responseText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, lineHeight: 18, marginBottom: 4 },
    responseDate: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
    
    respondButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.sm },
    respondButtonText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
    
    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16 },
    emptySubtext: { fontSize: 14, fontWeight: '500', color: Colors.textMuted, marginTop: 8 },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
    
    reviewPreview: { backgroundColor: Colors.background, padding: 16, borderRadius: BorderRadius.md, marginBottom: 16 },
    previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    previewCustomer: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    previewComment: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, lineHeight: 18 },
    
    responseInput: { backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: 12, fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 16, minHeight: 100 },
    
    sendButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg, gap: 8 },
    sendButtonDisabled: { opacity: 0.5 },
    sendButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

export default ReviewsManagementScreen;
