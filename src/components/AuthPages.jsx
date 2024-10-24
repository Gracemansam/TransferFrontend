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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center">
                    <p>
                        Not a member?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <h2 className="text-2xl font-bold text-center">Register</h2>
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
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="gender">Gender</label>
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
                        <label htmlFor="hospital">Hospital</label>
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
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="text-center">
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </CardFooter>
        </Card>
    </div>
);
};

export {LoginPage, RegisterPage};