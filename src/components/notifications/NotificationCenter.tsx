import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Bell, X, Check, AlertTriangle, MessageSquare, Package, DollarSign, Star, Clock, Settings, Filter, BookMarked as MarkAsRead } from 'lucide-react';

interface Notification {
  id: string;
  type: 'proposal' | 'message' | 'delivery' | 'payment' | 'rating' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    cargaId?: string;
    userId?: string;
    amount?: number;
    rating?: number;
  };
}

interface NotificationCenterProps {
  onClose?: () => void;
  onNavigate?: (url: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    
    // Simular notificações em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance a cada 10 segundos
        addRandomNotification();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'proposal',
        title: 'Nova Proposta Recebida',
        message: 'Carlos Mendes enviou uma proposta de R$ 2.300 para sua carga de alimentos perecíveis.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/proposals',
        metadata: { cargaId: '1', userId: '2', amount: 2300 }
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Entrega Concluída',
        message: 'Sua carga foi entregue com sucesso em Rio de Janeiro. Confirme o recebimento.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/tracking/1',
        metadata: { cargaId: '1' }
      },
      {
        id: '3',
        type: 'payment',
        title: 'Pagamento Vencido',
        message: 'O pagamento de R$ 3.200 para Pedro Costa está vencido há 2 dias.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'urgent',
        actionUrl: '/financial',
        metadata: { amount: 3200, userId: '4' }
      },
      {
        id: '4',
        type: 'rating',
        title: 'Nova Avaliação Recebida',
        message: 'Maria Santos avaliou você com 5 estrelas! "Excelente embarcador, muito profissional."',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        priority: 'medium',
        actionUrl: '/ratings',
        metadata: { rating: 5, userId: '3' }
      },
      {
        id: '5',
        type: 'message',
        title: 'Nova Mensagem',
        message: 'Carlos Mendes: "Posso garantir temperatura controlada durante todo o transporte."',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/messages',
        metadata: { userId: '2' }
      },
      {
        id: '6',
        type: 'alert',
        title: 'Atraso na Entrega',
        message: 'A entrega em Belo Horizonte está atrasada em 2 horas devido ao trânsito.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/tracking/2',
        metadata: { cargaId: '2' }
      },
      {
        id: '7',
        type: 'system',
        title: 'Atualização do Sistema',
        message: 'Nova funcionalidade de rastreamento em tempo real disponível!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const addRandomNotification = () => {
    const randomNotifications = [
      {
        type: 'proposal' as const,
        title: 'Nova Proposta Recebida',
        message: 'Você recebeu uma nova proposta para sua carga.',
        priority: 'high' as const
      },
      {
        type: 'message' as const,
        title: 'Nova Mensagem',
        message: 'Você tem uma nova mensagem de um transportador.',
        priority: 'medium' as const
      },
      {
        type: 'alert' as const,
        title: 'Alerta de Rota',
        message: 'Condições de tráfego alteradas na sua rota.',
        priority: 'medium' as const
      }
    ];

    const random = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...random,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Mostrar notificação do browser se permitido
    if (Notification.permission === 'granted') {
      new Notification(random.title, {
        body: random.message,
        icon: '/favicon.ico'
      });
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

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'proposal':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'delivery':
        return <Package className="h-4 w-4 text-purple-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'rating':
        return <Star className="h-4 w-4 text-orange-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'important':
        return notification.priority === 'high' || notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4" />
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas
            </Button>
            <Button
              variant={filter === 'important' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('important')}
            >
              Importantes
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando notificações...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'Você está em dia com suas notificações!'
                  : 'As notificações aparecerão aqui'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.metadata && (
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          {notification.metadata.amount && (
                            <span>Valor: R$ {notification.metadata.amount.toLocaleString()}</span>
                          )}
                          {notification.metadata.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{notification.metadata.rating}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};