import { Property, PropertyStatus, ListingType } from '../types';

// Mock Data for Properties
const MOCK_PROPERTIES: Property[] = [
    {
        id: 'prop-1',
        partnerId: 'partner-1',
        partnerName: 'Deepak Real Estate',
        title: 'Premium 3BHK Flat in Civil Lines',
        description: 'Spacious and well-ventilated flat with modern amenities and prime location.',
        ownerId: 'owner-1',
        propertyType: 'flat',
        listingType: 'sale',
        price: 8500000,
        bhk: 3,
        area: 1800,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Prayagraj',
            subCity: 'Civil Lines',
            ward: 'Ward 12',
            address: '12-A, MG Road',
            latitude: 25.4358,
            longitude: 81.8463
        },
        amenities: ['Parking', 'Gym', 'Security', 'Power Backup'],
        status: 'live',
        views: 120,
        inquiryCount: 5,
        createdAt: new Date(),
    },
    {
        id: 'prop-2',
        partnerId: 'partner-1',
        partnerName: 'Deepak Real Estate',
        title: 'Modern 2BHK House for Rent',
        description: 'Beautiful independent house with a private garden and excellent connectivity.',
        ownerId: 'owner-2',
        propertyType: 'house',
        listingType: 'rent',
        price: 25000,
        bhk: 2,
        area: 1200,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Prayagraj',
            subCity: 'Tagore Town',
            ward: 'Ward 5',
            address: '45, Tagore Street',
            latitude: 25.4484,
            longitude: 81.8546
        },
        amenities: ['Private Garden', 'Security', '24/7 Water'],
        status: 'live',
        views: 85,
        inquiryCount: 2,
        createdAt: new Date(),
    }
];

/**
 * Fetch all live properties (Mock)
 */
export const getProperties = async (filters?: {
    listingType?: ListingType;
    city?: string;
    propertyType?: string;
}) => {
    let props = MOCK_PROPERTIES.filter(p => p.status === 'live');

    if (filters?.listingType) {
        props = props.filter(p => p.listingType === filters.listingType);
    }

    if (filters?.city) {
        props = props.filter(p => p.location.city.toLowerCase() === filters.city?.toLowerCase());
    }

    return props;
};

/**
 * Fetch featured properties (Mock)
 */
export const getFeaturedProperties = async (count: number = 5) => {
    return MOCK_PROPERTIES.slice(0, count);
};

/**
 * Add a new property listing (Mock)
 */
export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'status' | 'views' | 'inquiryCount'>) => {
    console.log('Mock Property Created:', propertyData);
    return 'mock-prop-' + Math.random().toString(36).substr(2, 9);
};

/**
 * Track property view (Mock)
 */
export const trackPropertyView = async (propertyId: string) => {
    console.log('Mock Tracking View:', propertyId);
};

/**
 * Admin: Get all properties awaiting review (Mock)
 */
export const getAllPendingProperties = async () => {
    return MOCK_PROPERTIES.filter(p => p.status === 'pending');
};

/**
 * Admin: Approve or Reject a property (Mock)
 */
export const updatePropertyStatus = async (
    propertyId: string,
    status: PropertyStatus,
    reviewNote?: string
) => {
    console.log('Mock Status Update:', { propertyId, status, reviewNote });
};
