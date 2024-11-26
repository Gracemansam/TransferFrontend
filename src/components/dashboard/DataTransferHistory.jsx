import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast.jsx';
import { apiRequest } from '@/services/api';

const API_BASE_URL = 'http://localhost:8090';

const endpoints = {
    auditLog: {
        history: `${API_BASE_URL}/audit-log/history`  // Ensure the endpoint matches your backend
    }
};

export const DataTransferHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast({
                    description: 'Authentication token not found',
                    variant: 'destructive',
                });
                return;
            }

            // Making request with explicit headers like in DownloadData
            const data = await apiRequest(endpoints.auditLog.history, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast({
                description: 'Error fetching history',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold">Data Transfer History</h2>
                {isLoading && <p className="text-gray-500">Loading...</p>}
            </CardHeader>
            <CardContent>
                {!isLoading && history.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No data transfer history available.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Facility Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">
                                        {new Date(log.dateAndTime).toLocaleString()}
                                    </td>
                                    <td className="border px-4 py-2">{log.description}</td>
                                    <td className="border px-4 py-2">{log.facilityName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isLoading && history.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={fetchHistory}
                            variant="outline"
                        >
                            Refresh
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DataTransferHistory;
