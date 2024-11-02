import React, {useState, useContext, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card.jsx';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {toast, useToast} from "@/components/ui/use-toast.js";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(email, password);
        if (success) {
            toast({
                title: "Login Successful",
                description: "Welcome back!",
                variant: "success",
            });
            navigate('/dashboard');
        } else {
            toast({
                title: "Login Failed",
                description: "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-blue-50 shadow-xl">
                <CardHeader className="space-y-2">
                    <h2 className="text-3xl font-bold text-center text-blue-800">Welcome Back</h2>
                    <p className="text-center text-blue-600 text-sm">Please enter your credentials to continue</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-blue-700 font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-blue-700 font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 items-center">
                    <p className="text-blue-600">
                        Not a member?{' '}
                        <Link to="/register" className="font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        gender: '',
        password: '',
        username: '',
        hospitalId: ''
    });
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchHospitals();
    }, []);


    const fetchHospitals = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/auth/hospitals');
            const data = await response.json();
            console.log(data); // Check if data is being fetched correctly
            setHospitals(data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8090/api/auth/register/hospital-admin/${formData.hospitalId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.status) {
                toast({
                    title: "Registration Successful",
                    description: "Your account has been created. Please log in.",
                    variant: "success",
                });
                navigate('/login');
            } else {
                toast({
                    title: "Registration Failed",
                    description: data.message || "An error occurred during registration.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };


    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
    <div
        className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-xl bg-blue-50 shadow-xl">
            <CardHeader className="space-y-2">
                <h2 className="text-3xl font-bold text-center text-blue-800">Create Account</h2>
                <p className="text-center text-blue-600 text-sm">Please fill in your information to register</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-blue-700 font-medium">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-blue-700 font-medium">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-blue-700 font-medium">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Choose username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-blue-700 font-medium">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Phone number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-blue-700 font-medium">Gender</Label>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => handleChange({target: {name: 'gender', value: e.target.value}})}
                            >
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hospital" className="text-blue-700 font-medium">Hospital</Label>
                            <Select
                                name="hospitalId"
                                value={formData.hospitalId}
                                onChange={(e) => handleChange({target: {name: 'hospitalId', value: e.target.value}})}
                            >
                                <option value="" disabled>Select hospital</option>
                                {hospitals.map((hospital) => (
                                    <SelectItem key={hospital.id} value={hospital.id}>
                                        {hospital.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-blue-700 font-medium">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div className="flex justify-center pt-4">
                        <Button
                            type="submit"
                            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                        >
                            Register
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 items-center">
                <p className="text-blue-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </CardFooter>
        </Card>
    </div>
);
};

export {LoginPage, RegisterPage};