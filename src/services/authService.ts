import { User, UserRole } from '../types';

// Mock DB (simulated)
const db = null as any;

// Mock Auth constant
export const auth = null as any;

// Register a new user
export const registerUser = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'customer'
): Promise<User> => {
    console.warn('Auth is skipped. Returning mock user.');
    return {
        uid: 'mock-uid',
        name,
        email,
        role,
        verified: true,
        kycStatus: 'none',
        createdAt: new Date(),
    };
};

// Login user
export const loginUser = async (
    email: string,
    password: string
): Promise<any> => {
    console.warn('Auth is skipped. Returning mock user.');
    return { uid: 'mock-uid', email } as any;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
    console.log('Skipping logout');
};

// Get user profile (Mock)
export const getUserProfile = async (uid: string): Promise<User | null> => {
    return {
        uid,
        name: 'Deepak Admin',
        email: 'admin@example.com',
        role: 'admin',
        verified: true,
        kycStatus: 'verified',
        createdAt: new Date(),
    };
};

// Listen for auth state changes (Mock)
export const onAuthChange = (
    callback: (user: any | null) => void
) => {
    // Just return a mock user immediately to allow app to proceed
    setTimeout(() => {
        callback({ uid: 'mock-uid', email: 'mock@example.com', displayName: 'Mock User' } as any);
    }, 100);
    return () => { };
};
