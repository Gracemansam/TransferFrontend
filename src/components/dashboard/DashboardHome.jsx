import React, { useEffect, useContext } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTransfers } from '@/hooks/useTransfers';
import { AuthContext } from '../auth/AuthContext.jsx'

export const DashboardHome = ({ showMessage }) => {
    const { pendingRequests, completedRequests, loading, error, fetchRequests } = useTransfers();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchRequests().catch(() => showMessage('Error fetching requests', 'error'));
    }, [fetchRequests]);

    const chartData = [
        { name: 'Pending', value: pendingRequests },
        { name: 'Completed', value: completedRequests }
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">
                        Welcome, {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-xl text-blue-600">
                        {user?.hospitalName}
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Request Overview</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <LineChart width={600} height={300} data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#2563eb" />
                            </LineChart>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <h3 className="text-xl font-bold text-center">Pending Requests</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center text-blue-600">
                                {pendingRequests}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <h3 className="text-xl font-bold text-center">Completed Requests</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-center text-green-600">
                                {completedRequests}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};