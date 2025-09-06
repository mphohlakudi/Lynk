
import React, { useEffect } from 'react';
import { Notification } from '../types';
import { CheckCircleIcon, InfoIcon, WarningIcon } from './icons/NotificationIcons';

interface NotificationsProps {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const iconMap = {
    info: <InfoIcon className="text-blue-400" />,
    success: <CheckCircleIcon className="text-green-400" />,
    warning: <WarningIcon className="text-yellow-400" />,
};

const colorMap = {
    info: 'bg-gray-900 border-l-4 border-blue-400',
    success: 'bg-gray-900 border-l-4 border-green-400',
    warning: 'bg-gray-900 border-l-4 border-yellow-400',
}


const Notifications: React.FC<NotificationsProps> = ({ notifications, setNotifications }) => {
    
    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        if(notifications.length > 0) {
            const timer = setTimeout(() => {
                if (notifications.length > 0) {
                    removeNotification(notifications[notifications.length - 1].id)
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifications]);


    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-3 w-80 z-50" role="region" aria-label="Notifications">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg shadow-lg text-white ${colorMap[notification.type]} animate-fade-in-up`}
                    role={notification.type === 'warning' ? 'alert' : 'status'}
                >
                    <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>
                    <p className="flex-grow text-sm">{notification.message}</p>
                    <button 
                        onClick={() => removeNotification(notification.id)} 
                        className="text-xl font-light leading-none flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Close notification"
                    >
                        &times;
                    </button>
                </div>
            ))}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Notifications;
