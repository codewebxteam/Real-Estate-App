import { ContactRequest, ContactRequestStatus } from '../types';

// Mock Contact Requests Store
const MOCK_CONTACT_REQUESTS: ContactRequest[] = [];

/**
 * Customer: Submit contact request
 */
export const submitContactRequest = async (requestData: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>) => {
    const id = 'req-' + Math.random().toString(36).substr(2, 9);
    const newRequest: ContactRequest = {
        ...requestData,
        id,
        status: 'pending',
        createdAt: new Date(),
    };
    MOCK_CONTACT_REQUESTS.push(newRequest);
    return id;
};

/**
 * Customer: Get my contact requests
 */
export const getCustomerContactRequests = async (customerId: string) => {
    return MOCK_CONTACT_REQUESTS.filter(r => r.customerId === customerId);
};

/**
 * Admin: Get all pending contact requests
 */
export const getPendingContactRequests = async () => {
    return MOCK_CONTACT_REQUESTS.filter(r => r.status === 'pending');
};

/**
 * Admin: Approve/Reject contact request
 */
export const updateContactRequestStatus = async (
    requestId: string,
    status: ContactRequestStatus,
    adminNote?: string
) => {
    const request = MOCK_CONTACT_REQUESTS.find(r => r.id === requestId);
    if (request) {
        request.status = status;
        request.adminNote = adminNote;
        request.reviewedAt = new Date();
    }
    return request;
};

/**
 * Get contact request by ID
 */
export const getContactRequestById = async (requestId: string) => {
    return MOCK_CONTACT_REQUESTS.find(r => r.id === requestId);
};
