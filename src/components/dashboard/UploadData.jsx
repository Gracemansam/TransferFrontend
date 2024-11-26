import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {toast, useToast} from '@/components/ui/use-toast.jsx';
import { apiRequest } from '@/services/api';

const API_BASE_URL = 'http://localhost:8090/api';

const endpoints = {
    transfer: {
        pending: `${API_BASE_URL}/transfer/upload/pending`,
        upload: `${API_BASE_URL}/transfer/upload`
    },
    hospitals: {
        byName: (name) => `${API_BASE_URL}/auth/hospitals/search?name=${name}`
    }
};

export const UploadData = () => {
    const [file, setFile] = useState(null);
    const [facilityName, setFacilityName] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const data = await apiRequest(endpoints.transfer.pending);
            setPendingRequests(data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const handleFacilitySearch = async () => {
        try {
            const data = await apiRequest(endpoints.hospitals.byName(facilityName));
            if (data) {
                setFacilityId(data.id);
                toast({
                    description: 'Facility found',
                    variant: 'success',
                });
            } else {
                toast({
                    description: 'Facility not found',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                description: 'Error searching facility',
                variant: 'destructive',
            });
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log('File selected:', e.target.files[0]);
    };

    const handleUpload = async (requestId, recipientFacilityId) => {
        if (!file) {
            console.log('No file selected, prompting file input...');
            fileInputRef.current.click();
            return;
        }

        console.log('Uploading file:', file);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('requestId', requestId);
        formData.append('senderFacilityId', recipientFacilityId);

        try {
            await apiRequest(endpoints.transfer.upload, {
                method: 'POST',
                body: formData,
            });
            toast({
                title: "File Uploaded",
                description: "File uploaded successfully",
                variant: "success"
            });
            setFile(null);
            fetchPendingRequests();
        } catch (error) {
            console.error('Upload failed:', error);
            toast({
                title: "Request Failed",
                description: "Error uploading file.",
                variant: "destructive"
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold">Upload Patient Data</h2>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Facility Name</label>
                    <div className="flex gap-2">
                        <Input
                            value={facilityName}
                            onChange={(e) => setFacilityName(e.target.value)}
                            placeholder="Enter facility name"
                        />
                        <Button type="button" onClick={handleFacilitySearch}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">File</label>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        style={{ display: 'none' }}
                    />
                </div>
                {pendingRequests.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No pending transfer requests available.
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
                        {pendingRequests.map((request) => (
                            <tr key={request.requestId}>
                                <td className="border px-4 py-2">{new Date(request.dateTime).toLocaleString()}</td>
                                <td className="border px-4 py-2">{request.description}</td>
                                <td className="border px-4 py-2">
                                    <Button
                                        type="button"
                                        onClick={() => handleUpload(request.requestId, request.recipientFacility)}
                                    >
                                        Upload
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
