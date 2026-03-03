import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// firebase/auth import removed



import { User } from '../types';
import { onAuthChange, getUserProfile, logoutUser } from '../services/authService';

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
    // const [firebaseUser, setFirebaseUser] = useState<any | null>(null); 
    // const [userProfile, setUserProfile] = useState<User | null>(null); 
    // const [isLoading, setIsLoading] = useState(false); 

    const [firebaseUser, setFirebaseUser] = useState<any | null>({ uid: 'mock-user-123' });
    const [userProfile, setUserProfile] = useState<User | null>({
        uid: 'mock-user-123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'partner',
        verified: true,
        kycStatus: 'verified',
        createdAt: new Date(),
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Mock identity is persistent
        console.log('Using Mock Auth Context');
    }, []);

    const refreshProfile = async () => {
        // No-op for mock
    };

    const logout = async () => {
        console.log('Mock Logout - staying in mock session');
    };

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
