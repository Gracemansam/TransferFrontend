import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/services/api';

const API_BASE_URL = 'http://localhost:8090/api';

const endpoints = {
    auditLog: {
        history: `${API_BASE_URL}/audit-log/history`
    }
};

export const DataTransferHistory = () => {
    const [history, setHistory] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchHistory();
    }, []);

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    };

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            console.error('Token has expired');
            toast({
                description: 'Session expired. Please log in again.',
                variant: 'destructive',
            });
            // Redirect to login page or refresh token
            return;
        }

        try {
            const data = await apiRequest(endpoints.auditLog.history);
            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast({
                description: 'Error fetching history',
                variant: 'destructive',
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold">Data Transfer History</h2>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No data transfer history available.
                    </div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2">Date</th>
                            <th className="py-2">Description</th>
                            <th className="py-2">Facility Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((log, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{new Date(log.dateAndTime).toLocaleString()}</td>
                                <td className="border px-4 py-2">{log.description}</td>
                                <td className="border px-4 py-2">{log.facilityName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
};
