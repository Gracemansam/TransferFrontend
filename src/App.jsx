import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage,RegisterPage } from './components/AuthPages.jsx';

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { LandingPage } from './components/LandingPage';
import { Toaster } from './components/ui/toaster';

import { useToast } from "@/components/ui/use-toast";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Toaster />
            </Router>
        </AuthProvider>
    );
};


// Add this component to your main App.jsx/tsx
export const ToastProvider = ({ children }) => {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
};

export default App;