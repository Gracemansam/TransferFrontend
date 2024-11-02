// src/components/ui/alert.jsx
import React from 'react';

export const Alert = ({ variant, children }) => {
    const variantClasses = {
        destructive: 'bg-red-100 text-red-800 border-red-200',
        success: 'bg-green-100 text-green-800 border-green-200',
        default: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
        <div className={`border-l-4 p-4 ${variantClasses[variant] || variantClasses.default}`}>
            {children}
        </div>
    );
};

export const AlertDescription = ({ children }) => {
    return <div className="mt-2 text-sm">{children}</div>;
};
