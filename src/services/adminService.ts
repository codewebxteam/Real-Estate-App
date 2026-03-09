// Mock data for Admin Dashboard
export const MOCK_ADMIN_STATS = {
  totalUsers: 1247,
  totalPartners: 89,
  totalProperties: 342,
  pendingKYC: 5,
  pendingProperties: 8,
  activeListings: 298,
  rejectedListings: 36,
  totalRevenue: 2450000,
  monthlyGrowth: 18.5,
  avgResponseTime: 2.4, // hours
};

export const MOCK_RECENT_ACTIVITIES = [
  { id: '1', type: 'kyc_approved', user: 'Rajesh Kumar', time: '5 min ago', icon: 'shield-check', color: '#10B981' },
  { id: '2', type: 'property_approved', user: 'Priya Sharma', time: '12 min ago', icon: 'home-check', color: '#3B82F6' },
  { id: '3', type: 'kyc_rejected', user: 'Amit Verma', time: '25 min ago', icon: 'shield-alert', color: '#EF4444' },
  { id: '4', type: 'property_rejected', user: 'Sneha Patel', time: '1 hour ago', icon: 'home-remove', color: '#F59E0B' },
  { id: '5', type: 'new_partner', user: 'Vikram Singh', time: '2 hours ago', icon: 'account-plus', color: '#8B5CF6' },
];

export const MOCK_SYSTEM_HEALTH = {
  serverStatus: 'operational',
  uptime: 99.8,
  activeUsers: 234,
  apiResponseTime: 145, // ms
  databaseLoad: 42, // percentage
};

export const getAdminStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ADMIN_STATS), 500);
  });
};

export const getRecentActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RECENT_ACTIVITIES), 300);
  });
};

export const getSystemHealth = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SYSTEM_HEALTH), 400);
  });
};
