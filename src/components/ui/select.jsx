// src/components/ui/select.jsx
import React from 'react';

export const Select = ({ children, ...props }) => (
    <div className="relative">
        <select className="block w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>
            {children}
        </select>
    </div>
);

export const SelectItem = ({ value, children }) => (
    <option value={value} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
        {children}
    </option>
);
export const SelectTrigger = ({ children }) => (
    <div className="flex items-center justify-between px-3 py-2 border rounded cursor-pointer">
        {children}
    </div>
);

export const SelectValue = ({ children }) => (
    <span className="block truncate">{children}</span>
);

export const SelectContent = ({ children }) => (
    <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
        {children}
    </div>
);


