import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
// import { onAuthChange, getUserProfile, logoutUser } from '../services/authService';

interface AuthContextType {
    firebaseUser: any | null;
    userProfile: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    refreshProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userProfile: null,
    isLoading: true,
    isAuthenticated: false,
    refreshProfile: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   
    // Options: 'customer' | 'partner' | 'admin'
    const CURRENT_ROLE: 'customer' | 'partner' | 'admin' = 'customer'; 
    // const CURRENT_ROLE: 'customer' | 'partner' | 'admin' = 'partner';   
    // const CURRENT_ROLE: 'customer' | 'partner' | 'admin' = 'admin';   

    const getUserName = () => {
        if (CURRENT_ROLE === 'admin') return 'Admin User';
        if (CURRENT_ROLE === 'partner') return 'John Doe (Partner)';
        return 'Customer User';
    };

    const [firebaseUser] = useState<any | null>({ uid: 'mock-user-123' });
    const [userProfile] = useState<User | null>({
        uid: 'mock-user-123',
        name: getUserName(),
        email: `${CURRENT_ROLE}@example.com`,
        role: CURRENT_ROLE,
        verified: true,
        kycStatus: 'verified',
        createdAt: new Date(),
    });
    const [isLoading] = useState(false);

    useEffect(() => {
        console.log(' Current Role:', CURRENT_ROLE);
        console.log(' Dashboard:', CURRENT_ROLE === 'customer' ? 'Customer Tabs' : CURRENT_ROLE === 'partner' ? 'Partner Tabs' : 'Admin Tabs');
    }, []);

    const refreshProfile = useCallback(async () => {
        // No-op for mock
        console.log('Profile refreshed');
    }, []);

    const logout = useCallback(async () => {
        console.log('Mock Logout - staying in mock session');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                userProfile,
                isLoading,
                isAuthenticated: !!firebaseUser,
                refreshProfile,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
