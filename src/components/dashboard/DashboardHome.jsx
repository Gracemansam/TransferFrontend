import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTransfers } from '@/hooks/useTransfers';

export const DashboardHome = ({ showMessage }) => {
    const { pendingRequests, completedRequests, loading, error, fetchRequests } = useTransfers();

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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Request Overview</h2>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <LineChart width={600} height={200} data={chartData}>
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

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-bold">Pending Requests</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-center">
                            {pendingRequests}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-bold">Completed Requests</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-center">
                            {completedRequests}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
