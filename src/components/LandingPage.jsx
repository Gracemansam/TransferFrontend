import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
            <Card className="w-full max-w-lg p-6">
                <CardContent className="text-center space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">VitalPath  System</h1>
                    <p className="text-gray-600">Securely transfer patient records between healthcare facilities</p>
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
