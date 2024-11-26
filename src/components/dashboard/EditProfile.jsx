import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast.jsx';
import { apiRequest } from '@/services/api';

const API_BASE_URL = 'http://localhost:8090/api';

const endpoints = {
    auth: {
        principal: `${API_BASE_URL}/auth/principal`
    },
    user: {
        update: (id) => `${API_BASE_URL}/user/${id}`
    }
};

export const EditProfile = ({ showMessage }) => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: ''
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await apiRequest(endpoints.auth.principal);
            setUserData(data);
        } catch (error) {
            showMessage('Error fetching user data', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest(endpoints.user.update(userData.id), {
                method: 'PUT',
                body: JSON.stringify(userData)
            });

            showMessage('Profile updated successfully', 'success');
        } catch (error) {
            showMessage('Error updating profile', 'error');
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl mt-6">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">First Name</label>
                                <Input
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Last Name</label>
                                <Input
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <Input
                                    name="phoneNumber"
                                    value={userData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Gender</label>
                            <select
                                name="gender"
                                value={userData.gender}
                                onChange={handleChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">Update Profile</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProfile;
