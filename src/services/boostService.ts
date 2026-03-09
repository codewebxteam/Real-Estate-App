import { PropertyBoost, BoostPlan } from '../types';

const BOOST_PLANS = {
    basic: { name: 'Basic Boost', price: 499, days: 7, features: ['2x visibility', 'Priority in search'] },
    premium: { name: 'Premium Boost', price: 999, days: 15, features: ['5x visibility', 'Featured badge', 'Top of search'] },
    featured: { name: 'Featured Listing', price: 1999, days: 30, features: ['10x visibility', 'Homepage featured', 'Premium badge', 'Social media promotion'] },
};

const MOCK_BOOSTS: PropertyBoost[] = [];

export const getBoostPlans = () => BOOST_PLANS;

export const boostProperty = async (propertyId: string, plan: BoostPlan): Promise<string> => {
    const planDetails = BOOST_PLANS[plan];
    const boost: PropertyBoost = {
        id: 'boost-' + Math.random().toString(36).substr(2, 9),
        propertyId,
        plan,
        startDate: new Date(),
        endDate: new Date(Date.now() + planDetails.days * 24 * 60 * 60 * 1000),
        price: planDetails.price,
        isActive: true,
    };
    MOCK_BOOSTS.push(boost);
    return boost.id;
};

export const getPropertyBoost = async (propertyId: string): Promise<PropertyBoost | null> => {
    return MOCK_BOOSTS.find(b => b.propertyId === propertyId && b.isActive) || null;
};
