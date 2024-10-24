import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const UploadData = () => {
    const [file, setFile] = useState(null);
    const [facilityName, setFacilityName] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [notifications, setNotifications] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/notifications/${localStorage.getItem('facilityId')}`);
            const data = await response.json();
            setNotifications(data.filter(n => !n.read && n.type === 'TRANSFER_REQUEST'));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleFacilitySearch = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/auth/hospitals/search?name=${facilityName}`);
            const data = await response.json();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !facilityId || notifications.length === 0) {
            toast({
                description: 'Please fill all required fields and ensure you have a pending transfer request',
                variant: 'destructive',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('requestId', notifications[0].requestId); // Use the request ID from the notification
        formData.append('senderFacilityId', facilityId);

        try {
            const response = await fetch('http://localhost:8090/api/transfer/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast({
                    description: 'File uploaded successfully',
                    variant: 'success',
                });
                setFile(null);
                setFacilityName('');
                setFacilityId('');
                fetchNotifications();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast({
                description: 'Error uploading file',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold">Upload Patient Data</h2>
            </CardHeader>
            <CardContent>
                {notifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No pending transfer requests available. Please wait for a transfer request notification.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
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
                        <div>
                            <label className="block text-sm font-medium mb-2">File</label>
                            <Input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".xlsx,.xls"
                            />
                        </div>
                        <Button type="submit">Upload</Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};
