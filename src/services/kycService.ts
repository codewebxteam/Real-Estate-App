import { KYCDocument, KYCStatus } from '../types';

// Mock KYC state (partnerId: kycDoc)
const MOCK_KYC_STORE: Record<string, KYCDocument> = {};

// Mock pending KYC submissions for admin review
const MOCK_PENDING_KYC: KYCDocument[] = [
  {
    id: 'kyc-001',
    partnerId: 'partner-101',
    partnerName: 'Rajesh Kumar',
    partnerEmail: 'rajesh.kumar@realestate.com',
    idDocumentUrl: 'https://picsum.photos/seed/aadhaar1/400/250',
    profilePhotoUrl: 'https://picsum.photos/seed/profile1/200/200',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'kyc-002',
    partnerId: 'partner-102',
    partnerName: 'Priya Sharma',
    partnerEmail: 'priya.sharma@properties.com',
    idDocumentUrl: 'https://picsum.photos/seed/aadhaar2/400/250',
    profilePhotoUrl: 'https://picsum.photos/seed/profile2/200/200',
    status: 'pending',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 'kyc-003',
    partnerId: 'partner-103',
    partnerName: 'Amit Verma',
    partnerEmail: 'amit.verma@homes.com',
    idDocumentUrl: 'https://picsum.photos/seed/aadhaar3/400/250',
    profilePhotoUrl: 'https://picsum.photos/seed/profile3/200/200',
    status: 'pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'kyc-004',
    partnerId: 'partner-104',
    partnerName: 'Sneha Patel',
    partnerEmail: 'sneha.patel@realty.com',
    idDocumentUrl: 'https://picsum.photos/seed/aadhaar4/400/250',
    profilePhotoUrl: 'https://picsum.photos/seed/profile4/200/200',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'kyc-005',
    partnerId: 'partner-105',
    partnerName: 'Vikram Singh',
    partnerEmail: 'vikram.singh@estates.com',
    idDocumentUrl: 'https://picsum.photos/seed/aadhaar5/400/250',
    profilePhotoUrl: 'https://picsum.photos/seed/profile5/200/200',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

/**
 * Submit KYC documents (Mock)
 */
export const submitKYC = async (kycData: Omit<KYCDocument, 'id' | 'status' | 'submittedAt'>) => {
    const id = 'mock-kyc-' + Math.random().toString(36).substr(2, 9);
    MOCK_KYC_STORE[kycData.partnerId] = {
        ...kycData,
        id,
        status: 'pending',
        submittedAt: new Date(),
    };
    return id;
};

/**
 * Get KYC status (Mock)
 */
export const getPartnerKYC = async (partnerId: string) => {
    // Return a default verified status for the primary mock partner
    if (partnerId === 'partner-1') {
        return {
            id: 'mock-kyc-1',
            partnerId: 'partner-1',
            partnerName: 'Deepak Real Estate',
            partnerEmail: 'deepak@example.com',
            idDocumentUrl: '',
            profilePhotoUrl: '',
            status: 'verified',
            submittedAt: new Date(),
        } as KYCDocument;
    }
    return MOCK_KYC_STORE[partnerId] || null;
};

/**
 * Admin: Get all pending KYC submissions (Mock)
 */
export const getAllPendingKYC = async () => {
    return new Promise<KYCDocument[]>((resolve) => {
        setTimeout(() => resolve([...MOCK_PENDING_KYC]), 500);
    });
};

/**
 * Admin: Update KYC status (Mock)
 */
export const updateKYCStatus = async (
    kycDocId: string,
    status: KYCStatus,
    reviewNote?: string
) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const index = MOCK_PENDING_KYC.findIndex(k => k.id === kycDocId);
            if (index !== -1) {
                MOCK_PENDING_KYC.splice(index, 1);
            }
            console.log('Mock KYC Status Update:', { kycDocId, status, reviewNote });
            resolve();
        }, 300);
    });
};
