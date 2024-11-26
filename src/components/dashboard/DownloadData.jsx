import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast.jsx';
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
    const [isDownloading, setIsDownloading] = useState(false);
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
            toast({
                description: 'Error fetching completed requests',
                variant: 'destructive',
            });
        }
    };

    const handleDownload = async (requestId, recipientFacilityId) => {
        setIsDownloading(true);
        try {
            // Make the request using existing apiRequest
            const response = await fetch(
                `${endpoints.transfer.download(requestId)}?recipientFacilityId=${recipientFacilityId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
            }

            // Get filename from content-disposition header
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'decrypted_data.xlsx';
            if (contentDisposition) {
                const matches = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            // Get the blob directly from response
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "File Downloaded",
                description: "File downloaded successfully",
                variant: "success"
            });
        } catch (error) {
            console.error('Error downloading file:', error);
            toast({
                title: "Request Failed",
                description: "Error downloading file.",
                variant: "destructive"
            });
        } finally {
            setIsDownloading(false);
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Date</th>
                                <th className="py-2 px-4 text-left border-b">Description</th>
                                <th className="py-2 px-4 text-left border-b">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {completedRequests.map((request) => (
                                <tr key={request.requestId} className="hover:bg-gray-50">
                                    <td className="border-b px-4 py-2">
                                        {new Date(request.dateTime).toLocaleString()}
                                    </td>
                                    <td className="border-b px-4 py-2">{request.description}</td>
                                    <td className="border-b px-4 py-2">
                                        <Button
                                            type="button"
                                            onClick={() => handleDownload(request.requestId, request.requestingFacility)}
                                            disabled={isDownloading}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {isDownloading ? 'Downloading...' : 'Download'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
