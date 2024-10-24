// src/components/ui/input.jsx
import React from 'react';

export const Input = ({ type = "text", ...props }) => (
    <input
        type={type}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
    />
);
