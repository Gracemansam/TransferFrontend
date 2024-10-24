import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/notifications/${localStorage.getItem('facilityId')}`);
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:8090/api/notifications/${notificationId}/read`, {
                method: 'POST'
            });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
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
                                        className={`p-2 rounded ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                                        onClick={() => !notification.read && markAsRead(notification.id)}
                                    >
                                        <p className="text-sm">{notification.message}</p>
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
        </div>
    );
};

export default NotificationBell;
