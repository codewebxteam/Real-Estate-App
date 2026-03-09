import { Notification, NotificationType } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        userId: 'mock-user-123',
        type: 'inquiry',
        title: 'New Inquiry Received',
        message: 'You have a new inquiry for Luxury 3BHK Apartment in Gomti Nagar',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 'notif-2',
        userId: 'mock-user-123',
        type: 'property',
        title: 'Property Approved',
        message: 'Your property "Spacious 4BHK Villa" has been approved and is now live',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: 'notif-3',
        userId: 'mock-user-123',
        type: 'system',
        title: 'New Feature Available',
        message: 'Check out our new Analytics Dashboard to track your property performance',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: 'notif-4',
        userId: 'mock-user-123',
        type: 'inquiry',
        title: 'Inquiry Response Needed',
        message: 'Customer is waiting for your response on property inquiry',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
];

export const getPartnerNotifications = async (partnerId: string): Promise<Notification[]> => {
    return MOCK_NOTIFICATIONS.filter(n => n.userId === partnerId);
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
};

export const markAllNotificationsAsRead = async (partnerId: string): Promise<void> => {
    MOCK_NOTIFICATIONS.forEach(n => {
        if (n.userId === partnerId) n.isRead = true;
    });
};

export const getUnreadCount = async (partnerId: string): Promise<number> => {
    return MOCK_NOTIFICATIONS.filter(n => n.userId === partnerId && !n.isRead).length;
};
