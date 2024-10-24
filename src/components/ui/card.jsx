// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
    <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ children, className }) => (
    <div className={`border-b pb-2 ${className}`}>
        {children}
    </div>
);

export const CardContent = ({ children, className }) => (
    <div className={`mt-2 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className }) => (
    <div className={`border-t pt-2 ${className}`}>
        {children}
    </div>
);
