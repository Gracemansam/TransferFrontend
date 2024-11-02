import React, { forwardRef } from 'react';

export const Input = forwardRef(({ type = "text", ...props }, ref) => (
    <input
        type={type}
        ref={ref}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
    />
));
