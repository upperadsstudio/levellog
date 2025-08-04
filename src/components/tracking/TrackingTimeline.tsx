import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Truck,
  Package,
  Navigation,
  Flag
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'pickup' | 'checkpoint' | 'delivery' | 'delay' | 'issue' | 'completed';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending' | 'delayed';
  estimatedTime?: Date;
}

interface TrackingTimelineProps {
  events: TimelineEvent[];
  currentEventId?: string;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  events,
  currentEventId
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEventIcon = (type: TimelineEvent['type'], status: TimelineEvent['status']) => {
    const iconClass = `h-5 w-5 ${
      status === 'completed' ? 'text-green-600' :
      status === 'current' ? 'text-blue-600' :
      status === 'delayed' ? 'text-red-600' :
      'text-gray-400'
    }`;

    switch (type) {
      case 'pickup':
        return <Package className={iconClass} />;
      case 'checkpoint':
        return <Navigation className={iconClass} />;
      case 'delivery':
        return <Flag className={iconClass} />;
      case 'delay':
        return <Clock className={iconClass} />;
      case 'issue':
        return <AlertTriangle className={iconClass} />;
      case 'completed':
        return <CheckCircle className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'current':
        return 'info';
      case 'delayed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'current':
        return 'Atual';
      case 'delayed':
        return 'Atrasado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Timeline da Entrega</h3>
        <p className="text-sm text-gray-600">
          Acompanhe o progresso da sua carga em tempo real
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            const isCurrent = event.id === currentEventId;
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className={`absolute left-6 top-12 w-0.5 h-6 ${
                    event.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                  }`} />
                )}
                
                <div className={`flex items-start space-x-4 ${
                  isCurrent ? 'bg-blue-50 p-4 rounded-lg' : ''
                }`}>
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    event.status === 'completed' ? 'bg-green-100' :
                    event.status === 'current' ? 'bg-blue-100' :
                    event.status === 'delayed' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {getEventIcon(event.type, event.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge variant={getStatusColor(event.status)} size="sm">
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {event.status === 'completed' 
                            ? formatTime(event.timestamp)
                            : event.estimatedTime 
                              ? `Previsto: ${formatTime(event.estimatedTime)}`
                              : 'Aguardando'
                          }
                        </span>
                      </div>
                    </div>
                    
                    {event.status === 'delayed' && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Atraso identificado - Motorista foi notificado
                      </div>
                    )}
                    
                    {isCurrent && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <Truck className="h-3 w-3 inline mr-1" />
                        Etapa atual - Atualizações em tempo real
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};