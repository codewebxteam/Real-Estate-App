import { Property, PropertyStatus, ListingType } from '../types';

// Mock Data for Properties
const MOCK_PROPERTIES: Property[] = [
    {
        id: 'prop-1',
        partnerId: 'mock-user-123',
        partnerName: 'John Doe',
        title: 'Luxury 3BHK Apartment in Gomti Nagar',
        description: 'Premium apartment with modern amenities, modular kitchen, and 24/7 security.',
        ownerId: 'mock-user-123',
        propertyType: 'flat',
        listingType: 'sale',
        price: 7500000,
        bhk: 3,
        area: 1650,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Gomti Nagar',
            ward: 'Ward 8',
            address: 'Vibhuti Khand, Gomti Nagar',
            latitude: 26.8467,
            longitude: 80.9462
        },
        coordinates: { latitude: 26.8467, longitude: 80.9462 },
        amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift'],
        status: 'live',
        views: 245,
        inquiryCount: 12,
        createdAt: new Date(),
    },
    {
        id: 'prop-2',
        partnerId: 'mock-user-123',
        partnerName: 'John Doe',
        title: 'Spacious 4BHK Villa in Aliganj',
        description: 'Independent villa with private garden, parking for 3 cars, and premium interiors.',
        ownerId: 'mock-user-123',
        propertyType: 'house',
        listingType: 'sale',
        price: 12500000,
        bhk: 4,
        area: 2800,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Aliganj',
            ward: 'Ward 15',
            address: 'Sector H, Aliganj',
            latitude: 26.8850,
            longitude: 80.9450
        },
        coordinates: { latitude: 26.8850, longitude: 80.9450 },
        amenities: ['Private Garden', 'Parking', 'Security', 'Modular Kitchen', 'Terrace'],
        status: 'live',
        views: 189,
        inquiryCount: 8,
        createdAt: new Date(),
    },
    {
        id: 'prop-3',
        partnerId: 'partner-2',
        partnerName: 'Sharma Properties',
        title: 'Commercial Plot in Hazratganj',
        description: 'Prime commercial plot in the heart of Lucknow, ideal for retail or office space.',
        ownerId: 'owner-3',
        propertyType: 'plot',
        listingType: 'sale',
        price: 25000000,
        area: 5000,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Hazratganj',
            ward: 'Ward 3',
            address: 'MG Marg, Hazratganj',
            latitude: 26.8500,
            longitude: 80.9400
        },
        coordinates: { latitude: 26.8500, longitude: 80.9400 },
        amenities: ['Corner Plot', 'Main Road Facing', 'Clear Title'],
        status: 'live',
        views: 156,
        inquiryCount: 6,
        createdAt: new Date(),
    },
    {
        id: 'prop-4',
        partnerId: 'partner-2',
        partnerName: 'Sharma Properties',
        title: 'Affordable 2BHK Flat in Indira Nagar',
        description: 'Well-maintained flat perfect for small families, close to schools and markets.',
        ownerId: 'owner-4',
        propertyType: 'flat',
        listingType: 'rent',
        price: 18000,
        bhk: 2,
        area: 1100,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Indira Nagar',
            ward: 'Ward 22',
            address: 'Sector 14, Indira Nagar',
            latitude: 26.8700,
            longitude: 80.9900
        },
        coordinates: { latitude: 26.8700, longitude: 80.9900 },
        amenities: ['Parking', 'Security', 'Water Supply', 'Lift'],
        status: 'live',
        views: 98,
        inquiryCount: 4,
        createdAt: new Date(),
    },
    {
        id: 'prop-5',
        partnerId: 'partner-3',
        partnerName: 'Elite Realty',
        title: 'Modern 3BHK Penthouse in Mahanagar',
        description: 'Stunning penthouse with panoramic city views, premium finishes, and rooftop access.',
        ownerId: 'owner-5',
        propertyType: 'flat',
        listingType: 'sale',
        price: 9800000,
        bhk: 3,
        area: 2100,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Mahanagar',
            ward: 'Ward 18',
            address: 'Kursi Road, Mahanagar',
            latitude: 26.8200,
            longitude: 80.9800
        },
        coordinates: { latitude: 26.8200, longitude: 80.9800 },
        amenities: ['Rooftop', 'Gym', 'Swimming Pool', 'Parking', 'Security', 'Club House'],
        status: 'live',
        views: 312,
        inquiryCount: 15,
        createdAt: new Date(),
    },
    {
        id: 'prop-6',
        partnerId: 'partner-3',
        partnerName: 'Elite Realty',
        title: 'Cozy 1BHK Studio in Alambagh',
        description: 'Perfect for bachelors or young couples, fully furnished with modern amenities.',
        ownerId: 'owner-6',
        propertyType: 'flat',
        listingType: 'rent',
        price: 12000,
        bhk: 1,
        area: 650,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Alambagh',
            ward: 'Ward 25',
            address: 'Kanpur Road, Alambagh',
            latitude: 26.8100,
            longitude: 80.8900
        },
        coordinates: { latitude: 26.8100, longitude: 80.8900 },
        amenities: ['Furnished', 'Parking', 'Security', 'Power Backup'],
        status: 'live',
        views: 67,
        inquiryCount: 3,
        createdAt: new Date(),
    },
    {
        id: 'prop-7',
        partnerId: 'partner-4',
        partnerName: 'Prime Estates',
        title: 'Residential Plot in Jankipuram',
        description: 'Ready-to-build residential plot in gated community with all modern facilities.',
        ownerId: 'owner-7',
        propertyType: 'plot',
        listingType: 'sale',
        price: 4500000,
        area: 2000,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Jankipuram',
            ward: 'Ward 30',
            address: 'Jankipuram Extension',
            latitude: 26.9100,
            longitude: 80.9200
        },
        coordinates: { latitude: 26.9100, longitude: 80.9200 },
        amenities: ['Gated Community', 'Park', 'Street Lights', 'Water Connection'],
        status: 'live',
        views: 134,
        inquiryCount: 7,
        createdAt: new Date(),
    },
    {
        id: 'prop-8',
        partnerId: 'partner-4',
        partnerName: 'Prime Estates',
        title: 'Elegant 5BHK Bungalow in Raj Nagar',
        description: 'Luxurious bungalow with swimming pool, landscaped garden, and premium amenities.',
        ownerId: 'owner-8',
        propertyType: 'house',
        listingType: 'sale',
        price: 18500000,
        bhk: 5,
        area: 4200,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Lucknow',
            subCity: 'Raj Nagar',
            ward: 'Ward 12',
            address: 'Faizabad Road, Raj Nagar',
            latitude: 26.8600,
            longitude: 81.0100
        },
        coordinates: { latitude: 26.8600, longitude: 81.0100 },
        amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Servant Quarter', 'Home Theater'],
        status: 'live',
        views: 278,
        inquiryCount: 11,
        createdAt: new Date(),
    },
    {
        id: 'prop-9',
        partnerId: 'partner-5',
        partnerName: 'Kanpur Realty',
        title: 'Spacious 3BHK Flat in Civil Lines Kanpur',
        description: 'Well-maintained apartment in prime location with excellent connectivity.',
        ownerId: 'owner-9',
        propertyType: 'flat',
        listingType: 'sale',
        price: 5500000,
        bhk: 3,
        area: 1450,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Kanpur',
            subCity: 'Civil Lines',
            ward: 'Ward 10',
            address: 'Mall Road, Civil Lines',
            latitude: 26.4499,
            longitude: 80.3319
        },
        coordinates: { latitude: 26.4499, longitude: 80.3319 },
        amenities: ['Parking', 'Lift', 'Security', 'Power Backup'],
        status: 'live',
        views: 145,
        inquiryCount: 6,
        createdAt: new Date(),
    },
    {
        id: 'prop-10',
        partnerId: 'partner-6',
        partnerName: 'Noida Properties',
        title: 'Modern 2BHK Apartment in Sector 62 Noida',
        description: 'Contemporary apartment with modern amenities in IT hub area.',
        ownerId: 'owner-10',
        propertyType: 'flat',
        listingType: 'rent',
        price: 22000,
        bhk: 2,
        area: 1200,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Noida',
            subCity: 'Sector 62',
            ward: 'Block C',
            address: 'Sector 62, Noida',
            latitude: 28.6271,
            longitude: 77.3716
        },
        coordinates: { latitude: 28.6271, longitude: 77.3716 },
        amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Club House'],
        status: 'live',
        views: 198,
        inquiryCount: 9,
        createdAt: new Date(),
    },
    {
        id: 'prop-11',
        partnerId: 'partner-7',
        partnerName: 'Agra Estates',
        title: 'Heritage 4BHK House near Taj Mahal',
        description: 'Beautiful heritage property with modern amenities near Taj Mahal.',
        ownerId: 'owner-11',
        propertyType: 'house',
        listingType: 'sale',
        price: 8500000,
        bhk: 4,
        area: 2500,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Agra',
            subCity: 'Tajganj',
            ward: 'Ward 30',
            address: 'Taj East Gate Road',
            latitude: 27.1751,
            longitude: 78.0421
        },
        coordinates: { latitude: 27.1751, longitude: 78.0421 },
        amenities: ['Garden', 'Parking', 'Heritage Architecture', 'Security'],
        status: 'live',
        views: 234,
        inquiryCount: 11,
        createdAt: new Date(),
    },
    {
        id: 'prop-12',
        partnerId: 'partner-8',
        partnerName: 'Varanasi Realty',
        title: 'Traditional 3BHK House in Sigra Varanasi',
        description: 'Traditional house with modern amenities in cultural heart of Varanasi.',
        ownerId: 'owner-12',
        propertyType: 'house',
        listingType: 'sale',
        price: 6200000,
        bhk: 3,
        area: 1800,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Varanasi',
            subCity: 'Sigra',
            ward: 'Ward 40',
            address: 'Sigra Main Road',
            latitude: 25.3176,
            longitude: 82.9739
        },
        coordinates: { latitude: 25.3176, longitude: 82.9739 },
        amenities: ['Parking', 'Temple Nearby', 'Security', 'Ganga View'],
        status: 'live',
        views: 167,
        inquiryCount: 7,
        createdAt: new Date(),
    },
    {
        id: 'prop-13',
        partnerId: 'partner-9',
        partnerName: 'Prayagraj Properties',
        title: 'Premium 2BHK Flat in Civil Lines Prayagraj',
        description: 'Modern flat in the administrative heart of Prayagraj.',
        ownerId: 'owner-13',
        propertyType: 'flat',
        listingType: 'rent',
        price: 16000,
        bhk: 2,
        area: 1050,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Prayagraj',
            subCity: 'Civil Lines',
            ward: 'Ward 50',
            address: 'MG Marg, Civil Lines',
            latitude: 25.4358,
            longitude: 81.8463
        },
        coordinates: { latitude: 25.4358, longitude: 81.8463 },
        amenities: ['Parking', 'Security', 'Power Backup', 'Water Supply'],
        status: 'live',
        views: 123,
        inquiryCount: 5,
        createdAt: new Date(),
    },
    {
        id: 'prop-14',
        partnerId: 'partner-10',
        partnerName: 'Ghaziabad Homes',
        title: 'Luxury 3BHK Flat in Indirapuram Ghaziabad',
        description: 'Premium apartment in well-planned township with all modern facilities.',
        ownerId: 'owner-14',
        propertyType: 'flat',
        listingType: 'sale',
        price: 7800000,
        bhk: 3,
        area: 1550,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Ghaziabad',
            subCity: 'Indirapuram',
            ward: 'Ward 20',
            address: 'Ahinsa Khand, Indirapuram',
            latitude: 28.6410,
            longitude: 77.3782
        },
        coordinates: { latitude: 28.6410, longitude: 77.3782 },
        amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Club House', 'Park'],
        status: 'live',
        views: 289,
        inquiryCount: 14,
        createdAt: new Date(),
    },
    {
        id: 'prop-15',
        partnerId: 'partner-5',
        partnerName: 'Kanpur Realty',
        title: '2BHK Budget Flat in Kalyanpur Kanpur',
        description: 'Affordable flat perfect for small families near educational institutions.',
        ownerId: 'owner-15',
        propertyType: 'flat',
        listingType: 'rent',
        price: 14000,
        bhk: 2,
        area: 950,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Kanpur Nagar',
            subCity: 'Kalyanpur',
            ward: 'Ward 12',
            address: 'IIT Road, Kalyanpur',
            latitude: 26.5123,
            longitude: 80.2329
        },
        coordinates: { latitude: 26.5123, longitude: 80.2329 },
        amenities: ['Parking', 'Security', 'Water Supply'],
        status: 'live',
        views: 89,
        inquiryCount: 4,
        createdAt: new Date(),
    },
    {
        id: 'prop-16',
        partnerId: 'partner-6',
        partnerName: 'Noida Properties',
        title: 'Premium 3BHK Flat in Sector 18 Noida',
        description: 'Luxurious apartment in the heart of Noida with metro connectivity.',
        ownerId: 'owner-16',
        propertyType: 'flat',
        listingType: 'sale',
        price: 9500000,
        bhk: 3,
        area: 1750,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Gautam Buddha Nagar',
            subCity: 'Noida',
            ward: 'Sector 18',
            address: 'Atta Market, Sector 18',
            latitude: 28.5677,
            longitude: 77.3210
        },
        coordinates: { latitude: 28.5677, longitude: 77.3210 },
        amenities: ['Metro', 'Mall', 'Parking', 'Security', 'Gym', 'Swimming Pool'],
        status: 'live',
        views: 312,
        inquiryCount: 16,
        createdAt: new Date(),
    },
    {
        id: 'prop-17',
        partnerId: 'partner-7',
        partnerName: 'Agra Estates',
        title: 'Commercial Shop in Sikandra Agra',
        description: 'Prime commercial property on main road with high footfall.',
        ownerId: 'owner-17',
        propertyType: 'plot',
        listingType: 'sale',
        price: 6500000,
        area: 800,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Agra',
            subCity: 'Sikandra',
            ward: 'Ward 32',
            address: 'NH-2, Sikandra',
            latitude: 27.2152,
            longitude: 77.9784
        },
        coordinates: { latitude: 27.2152, longitude: 77.9784 },
        amenities: ['Main Road', 'Corner Property', 'Commercial Zone'],
        status: 'live',
        views: 178,
        inquiryCount: 8,
        createdAt: new Date(),
    },
    {
        id: 'prop-18',
        partnerId: 'partner-8',
        partnerName: 'Varanasi Realty',
        title: 'Riverside 2BHK Flat in Lanka Varanasi',
        description: 'Beautiful flat with Ganga view near BHU campus.',
        ownerId: 'owner-18',
        propertyType: 'flat',
        listingType: 'rent',
        price: 18000,
        bhk: 2,
        area: 1100,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Varanasi',
            subCity: 'Lanka',
            ward: 'Ward 42',
            address: 'BHU Road, Lanka',
            latitude: 25.2677,
            longitude: 82.9913
        },
        coordinates: { latitude: 25.2677, longitude: 82.9913 },
        amenities: ['Ganga View', 'Parking', 'Security', 'BHU Nearby'],
        status: 'live',
        views: 145,
        inquiryCount: 7,
        createdAt: new Date(),
    },
    {
        id: 'prop-19',
        partnerId: 'partner-9',
        partnerName: 'Prayagraj Properties',
        title: 'Spacious 3BHK House in George Town',
        description: 'Independent house in colonial area with large garden.',
        ownerId: 'owner-19',
        propertyType: 'house',
        listingType: 'sale',
        price: 7200000,
        bhk: 3,
        area: 2000,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Prayagraj',
            subCity: 'George Town',
            ward: 'Ward 54',
            address: 'Thornhill Road, George Town',
            latitude: 25.4495,
            longitude: 81.8566
        },
        coordinates: { latitude: 25.4495, longitude: 81.8566 },
        amenities: ['Garden', 'Parking', 'Colonial Architecture', 'Security'],
        status: 'live',
        views: 198,
        inquiryCount: 9,
        createdAt: new Date(),
    },
    {
        id: 'prop-20',
        partnerId: 'partner-10',
        partnerName: 'Ghaziabad Homes',
        title: 'Modern 2BHK Flat in Vaishali Ghaziabad',
        description: 'Well-maintained apartment with metro connectivity.',
        ownerId: 'owner-20',
        propertyType: 'flat',
        listingType: 'rent',
        price: 20000,
        bhk: 2,
        area: 1150,
        areaUnit: 'sqft',
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        ],
        location: {
            state: 'Uttar Pradesh',
            city: 'Ghaziabad',
            subCity: 'Vaishali',
            ward: 'Ward 22',
            address: 'Sector 4, Vaishali',
            latitude: 28.6490,
            longitude: 77.3410
        },
        coordinates: { latitude: 28.6490, longitude: 77.3410 },
        amenities: ['Metro', 'Parking', 'Security', 'Power Backup', 'Lift'],
        status: 'live',
        views: 167,
        inquiryCount: 8,
        createdAt: new Date(),
    },
];

// Mock pending properties for admin moderation
const MOCK_PENDING_PROPERTIES: Property[] = [
  {
    id: 'pending-1',
    partnerId: 'partner-201',
    partnerName: 'Ankit Sharma',
    title: 'Luxury 4BHK Penthouse in Gomti Nagar Extension',
    description: 'Ultra-luxury penthouse with private terrace, modular kitchen, and premium fittings.',
    ownerId: 'owner-201',
    propertyType: 'flat',
    listingType: 'sale',
    price: 15500000,
    bhk: 4,
    area: 3200,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Gomti Nagar Extension',
      ward: 'Ward 9',
      address: 'Eldeco City, Gomti Nagar Extension',
      latitude: 26.8567,
      longitude: 80.9562,
    },
    coordinates: { latitude: 26.8567, longitude: 80.9562 },
    amenities: ['Private Terrace', 'Gym', 'Swimming Pool', 'Security', 'Club House'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'pending-2',
    partnerId: 'partner-202',
    partnerName: 'Neha Gupta',
    title: 'Commercial Office Space in Hazratganj',
    description: 'Prime commercial space in the heart of Lucknow, ideal for corporate offices.',
    ownerId: 'owner-202',
    propertyType: 'plot',
    listingType: 'rent',
    price: 85000,
    area: 2500,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Hazratganj',
      ward: 'Ward 3',
      address: 'Sapru Marg, Hazratganj',
      latitude: 26.8510, 
      longitude: 80.9420,
    },
    coordinates: { latitude: 26.8510, longitude: 80.9420 },
    amenities: ['Parking', 'Lift', 'Power Backup', 'Central AC'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'pending-3',
    partnerId: 'partner-203',
    partnerName: 'Rohit Mishra',
    title: 'Spacious 5BHK Villa in Omaxe City',
    description: 'Premium villa with private garden, swimming pool, and modern amenities.',
    ownerId: 'owner-203',
    propertyType: 'house',
    listingType: 'sale',
    price: 22000000,
    bhk: 5,
    area: 4500,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Omaxe City',
      ward: 'Ward 28',
      address: 'Omaxe City, Lucknow',
      latitude: 26.9200,
      longitude: 80.9300,
    },
    coordinates: { latitude: 26.9200, longitude: 80.9300 },
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Club House'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'pending-4',
    partnerId: 'partner-204',
    partnerName: 'Kavita Singh',
    title: 'Modern 2BHK Flat in Eldeco Elegante',
    description: 'Contemporary apartment with premium amenities in gated community.',
    ownerId: 'owner-204',
    propertyType: 'flat',
    listingType: 'rent',
    price: 25000,
    bhk: 2,
    area: 1300,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Vibhuti Khand',
      ward: 'Ward 8',
      address: 'Eldeco Elegante, Vibhuti Khand',
      latitude: 26.8480,
      longitude: 80.9480,
    },
    coordinates: { latitude: 26.8480, longitude: 80.9480 },
    amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: 'pending-5',
    partnerId: 'partner-205',
    partnerName: 'Suresh Yadav',
    title: 'Residential Plot in Sushant Golf City',
    description: 'Premium residential plot in gated township with golf course view.',
    ownerId: 'owner-205',
    propertyType: 'plot',
    listingType: 'sale',
    price: 8500000,
    area: 3000,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Sushant Golf City',
      ward: 'Ward 32',
      address: 'Sushant Golf City, Shaheed Path',
      latitude: 26.7800,
      longitude: 80.9100,
    },
    coordinates: { latitude: 26.7800, longitude: 80.9100 },
    amenities: ['Golf Course', 'Club House', 'Security', 'Park'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'pending-6',
    partnerId: 'partner-206',
    partnerName: 'Deepak Tiwari',
    title: 'Affordable 3BHK Flat in Indira Nagar',
    description: 'Budget-friendly apartment perfect for families, near schools and markets.',
    ownerId: 'owner-206',
    propertyType: 'flat',
    listingType: 'sale',
    price: 4500000,
    bhk: 3,
    area: 1250,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Indira Nagar',
      ward: 'Ward 22',
      address: 'Sector 18, Indira Nagar',
      latitude: 26.8720,
      longitude: 80.9920,
    },
    coordinates: { latitude: 26.8720, longitude: 80.9920 },
    amenities: ['Parking', 'Security', 'Lift', 'Water Supply'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
  },
  {
    id: 'pending-7',
    partnerId: 'partner-207',
    partnerName: 'Pooja Agarwal',
    title: 'Premium 3BHK Flat in Sahara States',
    description: 'Luxurious apartment with world-class amenities and excellent connectivity.',
    ownerId: 'owner-207',
    propertyType: 'flat',
    listingType: 'sale',
    price: 8900000,
    bhk: 3,
    area: 1850,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Jankipuram',
      ward: 'Ward 30',
      address: 'Sahara States, Jankipuram',
      latitude: 26.9150,
      longitude: 80.9250,
    },
    coordinates: { latitude: 26.9150, longitude: 80.9250 },
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Parking', 'Security'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: 'pending-8',
    partnerId: 'partner-208',
    partnerName: 'Manish Kumar',
    title: 'Cozy 1BHK Flat in Alambagh',
    description: 'Compact and affordable flat ideal for bachelors or small families.',
    ownerId: 'owner-208',
    propertyType: 'flat',
    listingType: 'rent',
    price: 10000,
    bhk: 1,
    area: 600,
    areaUnit: 'sqft',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    location: {
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      subCity: 'Alambagh',
      ward: 'Ward 25',
      address: 'Kanpur Road, Alambagh',
      latitude: 26.8120,
      longitude: 80.8920,
    },
    coordinates: { latitude: 26.8120, longitude: 80.8920 },
    amenities: ['Parking', 'Security', 'Water Supply'],
    status: 'pending',
    views: 0,
    inquiryCount: 0,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
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
    return MOCK_PROPERTIES.filter(p => p.status === 'live').slice(0, count);
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
    return new Promise<Property[]>((resolve) => {
        setTimeout(() => resolve([...MOCK_PENDING_PROPERTIES]), 500);
    });
};

/**
 * Admin: Approve or Reject a property (Mock)
 */
export const updatePropertyStatus = async (
    propertyId: string,
    status: PropertyStatus,
    reviewNote?: string
) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const index = MOCK_PENDING_PROPERTIES.findIndex(p => p.id === propertyId);
            if (index !== -1) {
                MOCK_PENDING_PROPERTIES.splice(index, 1);
            }
            console.log('Mock Status Update:', { propertyId, status, reviewNote });
            resolve();
        }, 300);
    });
};
