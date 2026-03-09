import { PropertyAnalytics, PartnerAnalytics } from '../types';

// Mock analytics data
const MOCK_ANALYTICS: Record<string, PropertyAnalytics> = {
    'prop-1': {
        propertyId: 'prop-1',
        views: 245,
        inquiries: 12,
        favorites: 34,
        conversionRate: 4.9,
        viewsByDate: [
            { date: '2024-01-15', count: 45 },
            { date: '2024-01-16', count: 52 },
            { date: '2024-01-17', count: 38 },
            { date: '2024-01-18', count: 61 },
            { date: '2024-01-19', count: 49 },
        ],
        peakHours: [
            { hour: 9, count: 12 },
            { hour: 14, count: 18 },
            { hour: 19, count: 25 },
            { hour: 21, count: 15 },
        ],
    },
    'prop-2': {
        propertyId: 'prop-2',
        views: 189,
        inquiries: 8,
        favorites: 28,
        conversionRate: 4.2,
        viewsByDate: [
            { date: '2024-01-15', count: 35 },
            { date: '2024-01-16', count: 42 },
            { date: '2024-01-17', count: 28 },
            { date: '2024-01-18', count: 45 },
            { date: '2024-01-19', count: 39 },
        ],
        peakHours: [
            { hour: 10, count: 10 },
            { hour: 15, count: 14 },
            { hour: 20, count: 20 },
            { hour: 22, count: 12 },
        ],
    },
};

export const getPropertyAnalytics = async (propertyId: string): Promise<PropertyAnalytics> => {
    return MOCK_ANALYTICS[propertyId] || {
        propertyId,
        views: 0,
        inquiries: 0,
        favorites: 0,
        conversionRate: 0,
        viewsByDate: [],
        peakHours: [],
    };
};

export const getPartnerAnalytics = async (partnerId: string): Promise<PartnerAnalytics> => {
    return {
        totalViews: 434,
        totalInquiries: 20,
        conversionRate: 4.6,
        bestPerforming: [
            { propertyId: 'prop-1', propertyName: 'Luxury 3BHK Apartment in Gomti Nagar', views: 245 },
            { propertyId: 'prop-2', propertyName: 'Spacious 4BHK Villa in Aliganj', views: 189 },
        ],
        monthlyTrends: [
            { month: 'Sep', views: 320, inquiries: 15 },
            { month: 'Oct', views: 380, inquiries: 18 },
            { month: 'Nov', views: 420, inquiries: 22 },
            { month: 'Dec', views: 450, inquiries: 25 },
            { month: 'Jan', views: 434, inquiries: 20 },
        ],
    };
};
