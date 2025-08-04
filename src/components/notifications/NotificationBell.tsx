import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationCenter } from './NotificationCenter';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  onNavigate?: (url: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    // Simular contagem de notificações não lidas
    setUnreadCount(3);
    
    // Simular novas notificações
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance a cada 5 segundos
        setUnreadCount(prev => prev + 1);
        setHasNewNotification(true);
        
        // Remover animação após 3 segundos
        setTimeout(() => setHasNewNotification(false), 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Solicitar permissão para notificações do browser
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotification(false);
  };

  const handleNavigate = (url: string) => {
    setShowNotifications(false);
    if (onNavigate) {
      onNavigate(url);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBellClick}
        className={`relative ${hasNewNotification ? 'animate-pulse' : ''}`}
      >
        <Bell className={`h-4 w-4 ${hasNewNotification ? 'text-blue-600' : ''}`} />
        {unreadCount > 0 && (
          <Badge 
            variant="error" 
            size="sm"
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 z-50">
          <NotificationCenter
            onClose={() => setShowNotifications(false)}
            onNavigate={handleNavigate}
          />
        </div>
      )}
    </div>
  );
};