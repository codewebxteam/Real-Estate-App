import { Inquiry } from '../types';

// Mock Inquiries Store
const MOCK_INQUIRIES: Inquiry[] = [
    {
        id: 'inq-1',
        propertyId: 'prop-1',
        propertyName: 'Luxury 3BHK Apartment in Gomti Nagar',
        customerId: 'cust-1',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        customerPhone: '9876543210',
        partnerId: 'mock-user-123',
        message: 'I am interested in this property. When can I schedule a visit?',
        status: 'new',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
        id: 'inq-2',
        propertyId: 'prop-2',
        propertyName: 'Spacious 4BHK Villa in Aliganj',
        customerId: 'cust-2',
        customerName: 'Priya Singh',
        customerEmail: 'priya@example.com',
        customerPhone: '9876543211',
        partnerId: 'mock-user-123',
        message: 'What is the final price? Is there any room for negotiation?',
        status: 'read',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
        id: 'inq-3',
        propertyId: 'prop-1',
        propertyName: 'Luxury 3BHK Apartment in Gomti Nagar',
        customerId: 'cust-3',
        customerName: 'Amit Kumar',
        customerEmail: 'amit@example.com',
        customerPhone: '9876543212',
        partnerId: 'mock-user-123',
        message: 'Is this property available for immediate possession? What are the payment terms?',
        status: 'responded',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
        id: 'inq-4',
        propertyId: 'prop-2',
        propertyName: 'Spacious 4BHK Villa in Aliganj',
        customerId: 'cust-4',
        customerName: 'Sneha Verma',
        customerEmail: 'sneha@example.com',
        customerPhone: '9876543213',
        partnerId: 'mock-user-123',
        message: 'Can I get more photos of the interior? Also, what are the maintenance charges?',
        status: 'new',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
        id: 'inq-5',
        propertyId: 'prop-1',
        propertyName: 'Luxury 3BHK Apartment in Gomti Nagar',
        customerId: 'cust-5',
        customerName: 'Vikram Patel',
        customerEmail: 'vikram@example.com',
        customerPhone: '9876543214',
        partnerId: 'mock-user-123',
        message: 'I would like to know about the parking facilities and security arrangements.',
        status: 'read',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
        id: 'inq-6',
        propertyId: 'prop-2',
        propertyName: 'Spacious 4BHK Villa in Aliganj',
        customerId: 'cust-6',
        customerName: 'Anjali Gupta',
        customerEmail: 'anjali@example.com',
        customerPhone: '9876543215',
        partnerId: 'mock-user-123',
        message: 'Is the garden area included? Can we customize the interiors?',
        status: 'responded',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
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
