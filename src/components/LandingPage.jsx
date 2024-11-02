import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="container mx-auto px-4 h-screen flex flex-col md:flex-row items-center justify-between">
                {/* Left side content */}
                <div className="md:w-1/2 space-y-6 text-center md:text-left">
                    <div className="mb-8">
                        {/*<img src="/api/placeholder/50/50" alt="VitalPath Logo" className="h-12 w-12 mb-4" />*/}
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            <span className="text-gray-900">Vital</span>
                            <span className="text-blue-500">Path</span>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-8">
                        Seamless Health Record Transfers for Better Patient Care. Experience the ease
                        of transferring health records securely and efficiently. Our platform ensures
                        better patient care by connecting healthcare providers seamlessly.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <Button
                            onClick={() => navigate('/login')}
                            className="px-8 py-2 text-lg bg-blue-500 hover:bg-blue-600"
                        >
                            Login
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/register')}
                            className="px-8 py-2 text-lg border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                            Register
                        </Button>
                    </div>
                </div>
                {/* Right side image */}
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img
                        src="/images/main.svg"
                        alt="Medical Records"
                        className="w-full h-auto rounded-lg shadow-xl"
                    />
                </div>
            </div>
        </div>
    );
};
