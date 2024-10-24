import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useHospitals } from '@/hooks/useHospitals';
import { endpoints, apiRequest } from '@/services/api';
import {toast} from "@/components/ui/use-toast.js";

export const SendRequest = ({ showMessage }) => {
    const [selectedHospital, setSelectedHospital] = useState('');
    const { hospitals, loading, error, fetchHospitals } = useHospitals();

    useEffect(() => {
        fetchHospitals().catch(() => showMessage('Error fetching hospitals', 'error'));
    }, [fetchHospitals]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHospital) {
            toast({
                title: "Validation Error",
                description: "Please select a hospital",
                variant: "destructive",
            });
            return;
        }

        try {
            await apiRequest(endpoints.transfer.request, {
                method: 'POST',
                body: JSON.stringify({
                    recipientFacility: selectedHospital
                })
            });

            toast({
                title: "Request Sent",
                description: "Transfer request has been sent successfully.",
                variant: "success",
            });
            setSelectedHospital('');
        } catch (error) {
            toast({
                title: "Request Failed",
                description: "Failed to send transfer request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleChange = (e) => {
        setSelectedHospital(e.target.value);
    };

    if (loading) return <div>Loading hospitals...</div>;
    if (error) return <div>Error loading hospitals: {error}</div>;
    if (!hospitals || hospitals.length === 0) return <div>No hospitals available</div>;

    return (
        <Card className="w-full">
            <CardHeader>
                <h2 className="text-2xl font-bold">Send Transfer Request</h2>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="hospital" className="text-sm font-medium">
                            Select Hospital
                        </label>
                        <select
                            name="hospitalId"
                            value={selectedHospital}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="" disabled>Select hospital</option>
                            {hospitals.map((hospital) => (
                                <option key={hospital.id} value={hospital.id}>
                                    {hospital.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!selectedHospital}
                    >
                        Send Request
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};