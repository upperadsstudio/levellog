import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  DollarSign,
  Truck,
  MessageSquare
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface AlertSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ 
  position = 'top-right' 
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simular alertas automáticos
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance a cada 8 segundos
        addRandomAlert();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const addRandomAlert = () => {
    const randomAlerts = [
      {
        type: 'success' as const,
        title: 'Entrega Concluída',
        message: 'Sua carga foi entregue com sucesso em Rio de Janeiro.',
        autoClose: true,
        duration: 5000
      },
      {
        type: 'warning' as const,
        title: 'Pagamento Vencendo',
        message: 'O pagamento de R$ 2.500 vence em 2 dias.',
        actionLabel: 'Ver Detalhes'
      },
      {
        type: 'info' as const,
        title: 'Nova Proposta',
        message: 'Você recebeu uma nova proposta de Carlos Mendes.',
        actionLabel: 'Visualizar'
      },
      {
        type: 'error' as const,
        title: 'Atraso na Entrega',
        message: 'A entrega está atrasada em 3 horas devido ao trânsito.',
        actionLabel: 'Rastrear'
      }
    ];

    const randomAlert = randomAlerts[Math.floor(Math.random() * randomAlerts.length)];
    const newAlert: Alert = {
      id: Date.now().toString(),
      ...randomAlert,
      timestamp: new Date()
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Máximo 5 alertas

    // Auto-close se especificado
    if (newAlert.autoClose && newAlert.duration) {
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, newAlert.duration);
    }
  };

  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColors = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3 max-w-sm w-full`}>
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`border-l-4 ${getAlertColors(alert.type)} animate-in slide-in-from-right duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium mb-1">
                  {alert.title}
                </h4>
                <p className="text-sm opacity-90">
                  {alert.message}
                </p>
                
                {alert.actionLabel && alert.onAction && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={alert.onAction}
                      className="text-xs"
                    >
                      {alert.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAlert(alert.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};