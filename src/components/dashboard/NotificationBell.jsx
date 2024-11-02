import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/services/api';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const count = await apiRequest('http://localhost:8090/api/notifications/unread-count', {
                method: 'GET'
            });
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await apiRequest('http://localhost:8090/api/notifications/getUnreadNotifications', {
                method: 'GET'
            });
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        fetchNotifications(); // Initial fetch
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await apiRequest(`http://localhost:8090/api/notifications/${notificationId}/read`, {
                method: 'POST'
            });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadCount}
                    </div>
                )}
            </Button>

            {showNotifications && (
                <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50">
                    <CardContent className="p-2">
                        {notifications.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No notifications</p>
                        ) : (
                            <div className="space-y-2">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                                            notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                        }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <p className="text-sm">
                                            {notification.message.split('.Message:')[0]}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <AlertDialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Notification Details
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            {selectedNotification && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">
                                            {selectedNotification.message}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Received: {new Date(selectedNotification.createdAt).toLocaleString()}
                                    </div>
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCloseModal}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default NotificationBell;
