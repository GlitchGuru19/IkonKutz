import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserProfile } from '../types';
import { api } from '../api';

interface User {
    uid: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string, phone: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    isAdmin: false,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on load
        const stored = localStorage.getItem('ikon_user');
        if (stored) {
            const profile = JSON.parse(stored);
            setUser({ uid: profile.id, email: profile.email });
            setUserProfile(profile);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        // Query json-server for user with matching email/pass
        const users = await api.get(`/users?email=${email}&password=${pass}`);
        if (users && users.length > 0) {
            const profile = users[0];
            // Normalize ID
            profile.uid = profile.id;

            localStorage.setItem('ikon_user', JSON.stringify(profile));
            setUser({ uid: profile.id, email: profile.email });
            setUserProfile(profile);
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const signup = async (email: string, pass: string, name: string, phone: string) => {
        // Check if exists
        const existing = await api.get(`/users?email=${email}`);
        if (existing && existing.length > 0) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: crypto.randomUUID(),
            email,
            password: pass,
            displayName: name,
            phone,
            role: 'customer',
            createdAt: Date.now()
        };

        await api.post('/users', newUser);

        // Auto login
        // Normalize for state
        const profile = { ...newUser, uid: newUser.id } as UserProfile;

        localStorage.setItem('ikon_user', JSON.stringify(profile));
        setUser({ uid: profile.uid, email: profile.email });
        setUserProfile(profile);
    };

    const logout = () => {
        localStorage.removeItem('ikon_user');
        setUser(null);
        setUserProfile(null);
    };

    const isAdmin = userProfile?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
