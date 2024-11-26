import React from 'react';
import { Toaster } from './toaster';
import { ToastProvider } from './toast';

export const AppToastProvider = ({ children }) => {
    return (
        <ToastProvider>
            {children}
            <Toaster />
        </ToastProvider>
    );
};