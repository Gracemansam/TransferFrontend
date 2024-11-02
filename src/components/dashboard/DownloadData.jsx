import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/services/api';

const API_BASE_URL = 'http://localhost:8090/api';

const endpoints = {
    transfer: {
        completed: `${API_BASE_URL}/transfer/download/completed`,
        download: (requestId) => `${API_BASE_URL}/transfer/download/${requestId}`
    }
};

export const DownloadData = () => {
    const [completedRequests, setCompletedRequests] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchCompletedRequests();
    }, []);

    const fetchCompletedRequests = async () => {
        try {
            const data = await apiRequest(endpoints.transfer.completed);
            setCompletedRequests(data);
        } catch (error) {
            console.error('Error fetching completed requests:', error);
        }
    };

    const handleDownload = async (requestId, recipientFacilityId) => {
        try {
            const response = await apiRequest(`${endpoints.transfer.download(requestId)}?recipientFacilityId=${recipientFacilityId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'decrypted_data.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast({
                description: 'File downloaded successfully',
                variant: 'success',
            });
        } catch (error) {
            console.error('Error downloading file:', error);
            toast({
                description: 'Error downloading file',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold">Download Sent Files</h2>
            </CardHeader>
            <CardContent>
                {completedRequests.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No completed transfer requests available.
                    </div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2">Date</th>
                            <th className="py-2">Description</th>
                            <th className="py-2">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {completedRequests.map((request) => (
                            <tr key={request.requestId}>
                                <td className="border px-4 py-2">{new Date(request.dateTime).toLocaleString()}</td>
                                <td className="border px-4 py-2">{request.description}</td>
                                <td className="border px-4 py-2">
                                    <Button
                                        type="button"
                                        onClick={() => handleDownload(request.requestId, request.requestingFacility)}
                                    >
                                        Download
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
};
