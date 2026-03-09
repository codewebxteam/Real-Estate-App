import { Lead, LeadStatus } from '../types';

const MOCK_LEADS: Lead[] = [
    {
        id: 'lead-1',
        propertyId: 'prop-1',
        propertyName: 'Luxury 3BHK Apartment in Gomti Nagar',
        customerId: 'cust-1',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        customerPhone: '+91 98765 43210',
        status: 'hot',
        notes: 'Very interested, wants to visit this weekend',
        tags: ['urgent', 'ready-to-buy'],
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'lead-2',
        propertyId: 'prop-2',
        propertyName: 'Spacious 4BHK Villa in Aliganj',
        customerId: 'cust-2',
        customerName: 'Priya Singh',
        customerEmail: 'priya@example.com',
        customerPhone: '+91 98765 43211',
        status: 'warm',
        notes: 'Interested but needs to discuss with family',
        tags: ['family', 'budget-check'],
        followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'lead-3',
        propertyId: 'prop-1',
        propertyName: 'Luxury 3BHK Apartment in Gomti Nagar',
        customerId: 'cust-3',
        customerName: 'Amit Kumar',
        customerEmail: 'amit@example.com',
        customerPhone: '+91 98765 43212',
        status: 'cold',
        notes: 'Just browsing, not ready to buy yet',
        tags: ['future-prospect'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
];

export const getPartnerLeads = async (partnerId: string): Promise<Lead[]> => {
    return MOCK_LEADS;
};

export const updateLeadStatus = async (leadId: string, status: LeadStatus): Promise<void> => {
    const lead = MOCK_LEADS.find(l => l.id === leadId);
    if (lead) lead.status = status;
};

export const updateLeadNotes = async (leadId: string, notes: string): Promise<void> => {
    const lead = MOCK_LEADS.find(l => l.id === leadId);
    if (lead) lead.notes = notes;
};

export const addLeadTag = async (leadId: string, tag: string): Promise<void> => {
    const lead = MOCK_LEADS.find(l => l.id === leadId);
    if (lead && !lead.tags.includes(tag)) lead.tags.push(tag);
};

export const setFollowUpDate = async (leadId: string, date: Date): Promise<void> => {
    const lead = MOCK_LEADS.find(l => l.id === leadId);
    if (lead) lead.followUpDate = date;
};

export const exportLeadsToCSV = async (leads: Lead[]): Promise<string> => {
    const headers = ['Name', 'Email', 'Phone', 'Property', 'Status', 'Tags', 'Notes'];
    const rows = leads.map(l => [
        l.customerName,
        l.customerEmail,
        l.customerPhone,
        l.propertyName,
        l.status,
        l.tags.join('; '),
        l.notes,
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
};
