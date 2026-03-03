import { Inquiry } from '../types';

// Mock Inquiries Store
const MOCK_INQUIRIES: Inquiry[] = [
    {
        id: 'inq-1',
        propertyId: 'prop-1',
        propertyName: 'Premium 3BHK Flat in Civil Lines',
        customerId: 'mock-uid',
        customerName: 'Mock User',
        customerEmail: 'mock@example.com',
        customerPhone: '9999999999',
        partnerId: 'partner-1',
        message: 'I am interested in this property. When can I visit?',
        status: 'new',
        createdAt: new Date(),
    }
];

/**
 * Create a new inquiry (Mock)
 */
export const createInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = 'mock-inq-' + Math.random().toString(36).substr(2, 9);
    MOCK_INQUIRIES.push({
        ...inquiryData,
        id,
        status: 'new',
        createdAt: new Date(),
    });
    return id;
};

/**
 * Fetch inquiries for a customer (Mock)
 */
export const getCustomerInquiries = async (customerId: string) => {
    return MOCK_INQUIRIES.filter(i => i.customerId === customerId);
};

/**
 * Fetch inquiries for a partner (Mock)
 */
export const getPartnerInquiries = async (partnerId: string) => {
    return MOCK_INQUIRIES.filter(i => i.partnerId === partnerId);
};
