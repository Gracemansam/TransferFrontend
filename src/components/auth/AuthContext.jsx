import React, { createContext, useState, useEffect } from 'react';
import { endpoints, apiRequest } from '../../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserData = async () => {
        try {
            const userData = await apiRequest(endpoints.auth.principal);
            setUser(userData);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await apiRequest(endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            console.log('Login response:', data); // Debugging line

            if (data.jwt) {
                localStorage.setItem('token', data.jwt);
                setToken(data.jwt);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>; // Consider using a proper loading component
    }

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
