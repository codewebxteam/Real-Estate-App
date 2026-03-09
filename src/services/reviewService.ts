import { Review } from '../types';

const MOCK_REVIEWS: Review[] = [
    {
        id: 'review-1',
        propertyId: 'prop-1',
        customerId: 'cust-1',
        customerName: 'Rahul Sharma',
        rating: 5,
        comment: 'Excellent property! The location is perfect and the amenities are top-notch. Highly recommended!',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'review-2',
        propertyId: 'prop-1',
        customerId: 'cust-2',
        customerName: 'Priya Singh',
        rating: 4,
        comment: 'Good property with modern facilities. The only downside is parking space is limited.',
        response: 'Thank you for your feedback! We are working on expanding the parking area.',
        respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'review-3',
        propertyId: 'prop-2',
        customerId: 'cust-3',
        customerName: 'Amit Kumar',
        rating: 5,
        comment: 'Beautiful villa with spacious rooms and a lovely garden. Perfect for families!',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
];

export const getPropertyReviews = async (propertyId: string): Promise<Review[]> => {
    return MOCK_REVIEWS.filter(r => r.propertyId === propertyId);
};

export const respondToReview = async (reviewId: string, response: string): Promise<void> => {
    const review = MOCK_REVIEWS.find(r => r.id === reviewId);
    if (review) {
        review.response = response;
        review.respondedAt = new Date();
    }
};

export const getAverageRating = async (propertyId: string): Promise<number> => {
    const reviews = MOCK_REVIEWS.filter(r => r.propertyId === propertyId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
};
