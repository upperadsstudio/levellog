import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'proposal' | 'message' | 'delivery' | 'payment' | 'rating' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  types: {
    proposals: boolean;
    messages: boolean;
    deliveries: boolean;
    payments: boolean;
    ratings: boolean;
    alerts: boolean;
    system: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: true,
    enableEmail: true,
    enableSMS: false,
    types: {
      proposals: true,
      messages: true,
      deliveries: true,
      payments: true,
      ratings: true,
      alerts: true,
      system: false
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadSettings();
    requestNotificationPermission();
  }, []);

  const loadNotifications = async () => {
    // Simular carregamento de notificações
    setLoading(true);
    
    // Mock data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'proposal',
        title: 'Nova Proposta Recebida',
        message: 'Carlos Mendes enviou uma proposta de R$ 2.300',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/proposals'
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Entrega Concluída',
        message: 'Sua carga foi entregue com sucesso',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/tracking/1'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Verificar se deve mostrar notificação push
    if (shouldShowNotification(newNotification)) {
      showPushNotification(newNotification);
    }

    return newNotification.id;
  }, [settings]);

  const shouldShowNotification = (notification: Notification): boolean => {
    // Verificar se o tipo está habilitado
    if (!settings.types[notification.type as keyof typeof settings.types]) {
      return false;
    }

    // Verificar horário silencioso
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime >= settings.quietHours.start || currentTime <= settings.quietHours.end) {
        return false;
      }
    }

    return settings.enablePush;
  };

  const showPushNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          // Navegar para a URL da ação
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-close após 5 segundos (exceto urgentes)
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  };

  const getNotificationsByPriority = (priority: Notification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  };

  // Simulação de notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance a cada 10 segundos
        const randomTypes: Notification['type'][] = ['proposal', 'message', 'delivery', 'payment', 'alert'];
        const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
        
        addNotification({
          type: randomType,
          title: `Nova ${randomType}`,
          message: 'Você tem uma nova atualização',
          priority: 'medium'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return {
    notifications,
    settings,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    getNotificationsByType,
    getNotificationsByPriority,
    saveSettings,
    requestNotificationPermission
  };
};