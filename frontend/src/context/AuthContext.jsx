import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('mm_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('mm_token'));
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        const res = await authAPI.login(credentials);
        const { token: t, ...userData } = res.data;
        localStorage.setItem('mm_token', t);
        localStorage.setItem('mm_user', JSON.stringify(userData));
        setToken(t);
        setUser(userData);
        return userData;
    };

    const register = async (data) => {
        const res = await authAPI.register(data);
        const { token: t, ...userData } = res.data;
        localStorage.setItem('mm_token', t);
        localStorage.setItem('mm_user', JSON.stringify(userData));
        setToken(t);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('mm_token');
        localStorage.removeItem('mm_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
