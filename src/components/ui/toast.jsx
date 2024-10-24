// src/components/ui/toast.jsx
import React from 'react';

export const Toast = ({ children, ...props }) => (
    <div className="toast" {...props}>
        {children}
    </div>
);

export const ToastClose = ({ onClick }) => (
    <button onClick={onClick} className="toast-close">
        Close
    </button>
);

export const ToastDescription = ({ children }) => (
    <div className="toast-description">
        {children}
    </div>
);

export const ToastProvider = ({ children }) => (
    <div className="toast-provider">
        {children}
    </div>
);

export const ToastTitle = ({ children }) => (
    <div className="toast-title">
        {children}
    </div>
);

export const ToastViewport = () => (
    <div className="toast-viewport">
        {/* This can be used to position the toasts */}
    </div>
);
