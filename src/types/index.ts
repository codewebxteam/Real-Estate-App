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
    createdAt: Date;
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
