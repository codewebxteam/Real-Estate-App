// ============================================
// UP Real Estate App – Type Definitions
// ============================================

// --- User & Auth ---
export type UserRole = 'customer' | 'partner' | 'admin';
export type KYCStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface User {
    uid: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    verified: boolean;
    kycStatus: KYCStatus;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt?: Date;
}
// --- Property ---
export type PropertyType = 'flat' | 'house' | 'plot';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'pending' | 'live' | 'rejected' | 'archived';

export interface PropertyLocation {
    state: string;
    city: string;
    subCity: string;
    ward: string;
    address: string;
    latitude: number;
    longitude: number;
}
export interface Property {
    id: string;
    partnerId: string;
    partnerName: string;
    title: string;
    description: string;
    ownerId: string;
    propertyType: PropertyType;
    listingType: ListingType;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    price: number;
    bhk?: number;
    area: number; // in sq ft
    areaUnit: 'sqft' | 'sqm' | 'sqyd';
    images: string[];
    videos?: string[];
    location: PropertyLocation;
    amenities: string[];
    status: PropertyStatus;
    views: number;
    inquiryCount: number;
    createdAt: Date;
    updatedAt?: Date;
    reviewNote?: string;
}

// --- Location Hierarchy ---
export interface LocationData {
    id: string;
    state: string;
    city: string;
    subCity: string;
    ward: string;
}

// --- Inquiry ---
export interface Inquiry {
    id: string;
    propertyId: string;
    propertyName: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    partnerId: string;
    message: string;
    status: 'new' | 'read' | 'responded';
    response?: string;
    respondedAt?: Date;
    createdAt: Date;
}

// --- Analytics ---
export interface PropertyAnalytics {
    propertyId: string;
    views: number;
    inquiries: number;
    favorites: number;
    conversionRate: number;
    viewsByDate: { date: string; count: number }[];
    peakHours: { hour: number; count: number }[];
}

export interface PartnerAnalytics {
    totalViews: number;
    totalInquiries: number;
    conversionRate: number;
    bestPerforming: { propertyId: string; propertyName: string; views: number }[];
    monthlyTrends: { month: string; views: number; inquiries: number }[];
}

// --- Property Boost ---
export type BoostPlan = 'basic' | 'premium' | 'featured';
export interface PropertyBoost {
    id: string;
    propertyId: string;
    plan: BoostPlan;
    startDate: Date;
    endDate: Date;
    price: number;
    isActive: boolean;
}

// --- Notification ---
export type NotificationType = 'inquiry' | 'kyc' | 'property' | 'system';
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    actionUrl?: string;
    createdAt: Date;
}

// --- Review ---
export interface Review {
    id: string;
    propertyId: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    response?: string;
    respondedAt?: Date;
    createdAt: Date;
}

// --- Lead ---
export type LeadStatus = 'hot' | 'warm' | 'cold';
export interface Lead {
    id: string;
    propertyId: string;
    propertyName: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: LeadStatus;
    notes: string;
    tags: string[];
    followUpDate?: Date;
    createdAt: Date;
}

// --- Document ---
export interface PropertyDocument {
    id: string;
    propertyId: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date;
    uploadedAt: Date;
}

// --- Pricing Tool ---
export interface PriceSuggestion {
    propertyId: string;
    currentPrice: number;
    suggestedPrice: number;
    marketAverage: number;
    competitorPrices: number[];
    recommendation: string;
}

// --- Availability ---
export interface PropertyAvailability {
    propertyId: string;
    isAvailable: boolean;
    blockedDates: Date[];
    viewingSlots: { date: Date; time: string; customerId?: string }[];
}

// --- Subscription ---
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';
export interface Subscription {
    id: string;
    partnerId: string;
    plan: SubscriptionPlan;
    startDate: Date;
    endDate: Date;
    price: number;
    features: string[];
    isActive: boolean;
}

// --- Gamification ---
export type PartnerLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
export interface PartnerBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
}

export interface PartnerGamification {
    partnerId: string;
    level: PartnerLevel;
    points: number;
    badges: PartnerBadge[];
    rank: number;
}

// --- Contact Request ---
export type ContactRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ContactRequest {
    id: string;
    propertyId: string;
    propertyName: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    partnerId: string;
    partnerName: string;
    partnerEmail: string;
    partnerPhone?: string;
    message: string;
    status: ContactRequestStatus;
    adminNote?: string;
    createdAt: Date;
    reviewedAt?: Date;
}

// --- KYC ---
export interface KYCDocument {
    id: string;
    partnerId: string;
    partnerName: string;
    partnerEmail: string;
    idDocumentUrl: string;
    profilePhotoUrl: string;
    businessName?: string;
    propertyDocumentUrl?: string;
    status: KYCStatus;
    reviewNote?: string;
    submittedAt: Date;
    reviewedAt?: Date;
}

// --- Navigation ---
export type RootStackParamList = {
    Auth: undefined;
    CustomerTabs: undefined;
    PartnerTabs: undefined;
    AdminTabs: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type CustomerTabParamList = {
    Browse: undefined;
    Search: undefined;
    Map: undefined;
    Profile: undefined;
};

export type PartnerTabParamList = {
    Dashboard: undefined;
    AddProperty: undefined;
    MyListings: undefined;
    PartnerProfile: undefined;
};

export type AdminTabParamList = {
    AdminDashboard: undefined;
    KYCReview: undefined;
    PropertyModeration: undefined;
    LocationManagement: undefined;
};
