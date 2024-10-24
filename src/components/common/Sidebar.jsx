import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Home, FileText, Upload, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ activeView, setActiveView }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'send-request', label: 'Send Request', icon: FileText },
        { id: 'upload-data', label: 'Upload Data', icon: Upload },
        { id: 'edit-profile', label: 'Edit Profile', icon: User }
    ];

    return (
        <div className="w-64 bg-white shadow-lg flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Health Transfer</h1>
                <p className="text-sm text-gray-600 mt-1">{user?.firstName} {user?.lastName}</p>
            </div>
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full text-left px-6 py-3 flex items-center gap-2 ${
                                activeView === item.id
                                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <IconComponent size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-gray-600"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        </div>
    );
};
