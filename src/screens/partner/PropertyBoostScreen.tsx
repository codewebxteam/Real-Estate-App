import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientHeader } from '../../components/ui/GradientHeader';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { getBoostPlans, boostProperty } from '../../services/boostService';
import { getProperties } from '../../services/propertyService';
import { Property, BoostPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';

const PropertyBoostScreen = () => {
    const { userProfile } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [showPlans, setShowPlans] = useState(false);
    const plans = getBoostPlans();

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        if (!userProfile?.uid) return;
        const allProps = await getProperties();
        const myProps = allProps.filter(p => p.ownerId === userProfile.uid && p.status === 'live');
        setProperties(myProps);
    };

    const handleBoost = async (plan: BoostPlan) => {
        if (!selectedProperty) return;
        await boostProperty(selectedProperty.id, plan);
        setShowPlans(false);
        setSelectedProperty(null);
        alert(`Property boosted with ${plans[plan].name}!`);
    };

    return (
        <View style={styles.container}>
            <GradientHeader height={180}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="rocket-launch" size={32} color="#fff" />
                    <Text style={styles.headerTitle}>Boost Your Properties</Text>
                    <Text style={styles.headerSubtitle}>Increase visibility and get more inquiries</Text>
                </View>
            </GradientHeader>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Boost Plans */}
                <Text style={styles.sectionTitle}>Available Plans</Text>
                <AnimatedCard style={[styles.planCard, styles.basicPlan]}>
                    <View style={styles.planHeader}>
                        <MaterialCommunityIcons name="star" size={28} color="#F59E0B" />
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>Basic Boost</Text>
                            <Text style={styles.planPrice}>₹499 / 7 days</Text>
                        </View>
                    </View>
                    <View style={styles.features}>
                        {plans.basic.features.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </AnimatedCard>

                <AnimatedCard style={[styles.planCard, styles.premiumPlan]}>
                    <View style={styles.planHeader}>
                        <MaterialCommunityIcons name="star-circle" size={28} color="#8B5CF6" />
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>Premium Boost</Text>
                            <Text style={styles.planPrice}>₹999 / 15 days</Text>
                        </View>
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>POPULAR</Text>
                        </View>
                    </View>
                    <View style={styles.features}>
                        {plans.premium.features.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </AnimatedCard>

                <AnimatedCard style={[styles.planCard, styles.featuredPlan]}>
                    <View style={styles.planHeader}>
                        <MaterialCommunityIcons name="crown" size={28} color="#EF4444" />
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>Featured Listing</Text>
                            <Text style={styles.planPrice}>₹1,999 / 30 days</Text>
                        </View>
                    </View>
                    <View style={styles.features}>
                        {plans.featured.features.map((feature, index) => (
                            <View key={index} style={styles.featureRow}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </AnimatedCard>

                {/* Select Property */}
                <Text style={styles.sectionTitle}>Select Property to Boost</Text>
                {properties.map(property => (
                    <AnimatedCard
                        key={property.id}
                        style={styles.propertyCard}
                        onPress={() => {
                            setSelectedProperty(property);
                            setShowPlans(true);
                        }}
                    >
                        <View style={styles.propertyInfo}>
                            <Text style={styles.propertyTitle}>{property.title}</Text>
                            <View style={styles.propertyStats}>
                                <View style={styles.statItem}>
                                    <MaterialCommunityIcons name="eye" size={14} color={Colors.textMuted} />
                                    <Text style={styles.statText}>{property.views} views</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <MaterialCommunityIcons name="message-text" size={14} color={Colors.textMuted} />
                                    <Text style={styles.statText}>{property.inquiryCount} inquiries</Text>
                                </View>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.primary} />
                    </AnimatedCard>
                ))}
            </ScrollView>

            {/* Plan Selection Modal */}
            <Modal visible={showPlans} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choose Boost Plan</Text>
                            <Pressable onPress={() => setShowPlans(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
                            </Pressable>
                        </View>

                        {selectedProperty && (
                            <View style={styles.selectedProperty}>
                                <Text style={styles.selectedLabel}>Selected Property</Text>
                                <Text style={styles.selectedTitle}>{selectedProperty.title}</Text>
                            </View>
                        )}

                        <Pressable style={styles.planOption} onPress={() => handleBoost('basic')}>
                            <View style={styles.planOptionLeft}>
                                <MaterialCommunityIcons name="star" size={24} color="#F59E0B" />
                                <View>
                                    <Text style={styles.planOptionName}>Basic Boost</Text>
                                    <Text style={styles.planOptionPrice}>₹499 / 7 days</Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
                        </Pressable>

                        <Pressable style={styles.planOption} onPress={() => handleBoost('premium')}>
                            <View style={styles.planOptionLeft}>
                                <MaterialCommunityIcons name="star-circle" size={24} color="#8B5CF6" />
                                <View>
                                    <Text style={styles.planOptionName}>Premium Boost</Text>
                                    <Text style={styles.planOptionPrice}>₹999 / 15 days</Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
                        </Pressable>

                        <Pressable style={styles.planOption} onPress={() => handleBoost('featured')}>
                            <View style={styles.planOptionLeft}>
                                <MaterialCommunityIcons name="crown" size={24} color="#EF4444" />
                                <View>
                                    <Text style={styles.planOptionName}>Featured Listing</Text>
                                    <Text style={styles.planOptionPrice}>₹1,999 / 30 days</Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
                        </Pressable>
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
    
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16, marginTop: 8 },
    
    planCard: { backgroundColor: Colors.white, padding: 20, borderRadius: BorderRadius.lg, marginBottom: 16, ...Shadows.md },
    basicPlan: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
    premiumPlan: { borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
    featuredPlan: { borderLeftWidth: 4, borderLeftColor: '#EF4444' },
    planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    planInfo: { flex: 1, marginLeft: 12 },
    planName: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
    planPrice: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginTop: 2 },
    popularBadge: { backgroundColor: '#8B5CF6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
    popularText: { fontSize: 10, fontWeight: '900', color: '#fff' },
    features: { gap: 8 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    featureText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    
    propertyCard: { backgroundColor: Colors.white, padding: 16, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center', marginBottom: 12, ...Shadows.sm },
    propertyInfo: { flex: 1 },
    propertyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
    propertyStats: { flexDirection: 'row', gap: 16 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
    
    selectedProperty: { backgroundColor: Colors.background, padding: 16, borderRadius: BorderRadius.md, marginBottom: 20 },
    selectedLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
    selectedTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
    
    planOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.background, borderRadius: BorderRadius.md, marginBottom: 12 },
    planOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    planOptionName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    planOptionPrice: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginTop: 2 },
});

export default PropertyBoostScreen;
