import { KYCDocument, KYCStatus } from '../types';

// Mock KYC state (partnerId: kycDoc)
const MOCK_KYC_STORE: Record<string, KYCDocument> = {};

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
    return Object.values(MOCK_KYC_STORE).filter(k => k.status === 'pending');
};

/**
 * Admin: Update KYC status (Mock)
 */
export const updateKYCStatus = async (
    kycDocId: string,
    status: KYCStatus,
    reviewNote?: string
) => {
    console.log('Mock KYC Status Update:', { kycDocId, status, reviewNote });
};
