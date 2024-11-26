import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '../common/Sidebar';
import { DashboardHome } from './DashboardHome';
import { SendRequest } from './SendRequest';
import { UploadData } from './UploadData';
import { DownloadData } from './DownloadData';
import { DataTransferHistory } from './DataTransferHistory';
import { EditProfile } from './EditProfile';
import NotificationBell from './NotificationBell';
import { useToast } from '@/components/ui/use-toast.jsx';

export const DashboardLayout = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { user } = useAuth();
    const { toast } = useToast();

    const showMessage = (message, type = 'default') => {
        toast({
            description: message,
            variant: type === 'error' ? 'destructive' : type === 'success' ? 'success' : 'default',
        });
    };

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardHome showMessage={showMessage} />;
            case 'send-request':
                return <SendRequest showMessage={showMessage} />;
            case 'upload-data':
                return <UploadData showMessage={showMessage} />;
            case 'download-data':
                return <DownloadData showMessage={showMessage} />;
            case 'data-transfer-history':
                return <DataTransferHistory showMessage={showMessage} />;
            case 'edit-profile':
                return <EditProfile showMessage={showMessage} />;
            default:
                return <DashboardHome showMessage={showMessage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                <div className="flex-1 overflow-auto">
                    <div className="p-4 bg-white shadow-sm flex justify-between items-center">
                        <h1 className="text-xl font-semibold">
                            {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}
                        </h1>
                        <NotificationBell />
                    </div>
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
