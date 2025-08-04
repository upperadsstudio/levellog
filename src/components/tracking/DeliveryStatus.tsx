import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Camera,
  FileText,
  Phone,
  MessageSquare
} from 'lucide-react';

interface DeliveryInfo {
  id: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'issue';
  estimatedArrival: Date;
  actualArrival?: Date;
  currentLocation: string;
  progress: number;
  driver: {
    name: string;
    phone: string;
    rating: number;
    photo?: string;
  };
  vehicle: {
    plate: string;
    model: string;
    type: string;
  };
  proofOfDelivery?: {
    signature?: string;
    photos: string[];
    notes: string;
    timestamp: Date;
  };
}

interface DeliveryStatusProps {
  delivery: DeliveryInfo;
  onContactDriver: () => void;
  onReportIssue: () => void;
  onConfirmDelivery?: () => void;
  onRateDelivery?: (rating: number, comment: string) => void;
}

export const DeliveryStatus: React.FC<DeliveryStatusProps> = ({
  delivery,
  onContactDriver,
  onReportIssue,
  onConfirmDelivery,
  onRateDelivery
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: DeliveryInfo['status']) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
        return 'info';
      case 'delayed':
        return 'warning';
      case 'issue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: DeliveryInfo['status']) => {
    switch (status) {
      case 'delivered':
        return 'Entregue';
      case 'in_transit':
        return 'Em trânsito';
      case 'delayed':
        return 'Atrasado';
      case 'issue':
        return 'Problema';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: DeliveryInfo['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'in_transit':
        return <Truck className="h-6 w-6 text-blue-600" />;
      case 'delayed':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'issue':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(delivery.status)}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Status da Entrega</h2>
                <p className="text-gray-600">Entrega #{delivery.id}</p>
              </div>
            </div>
            <Badge variant={getStatusColor(delivery.status)} size="sm">
              {getStatusLabel(delivery.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Progresso</span>
                <span className="text-sm text-gray-600">{delivery.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${delivery.progress}%` }}
                />
              </div>
            </div>

            {/* Current Location */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Localização Atual</span>
              </div>
              <p className="text-sm text-gray-600">{delivery.currentLocation}</p>
            </div>

            {/* ETA */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {delivery.status === 'delivered' ? 'Entregue em' : 'Previsão de chegada'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {delivery.status === 'delivered' && delivery.actualArrival
                  ? formatTime(delivery.actualArrival)
                  : formatTime(delivery.estimatedArrival)
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Info */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Informações do Motorista</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {delivery.driver.photo ? (
                  <img 
                    src={delivery.driver.photo} 
                    alt={delivery.driver.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Truck className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{delivery.driver.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm text-gray-600">{delivery.driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium">{delivery.driver.phone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Veículo:</span>
                <span className="font-medium">{delivery.vehicle.model}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Placa:</span>
                <span className="font-medium">{delivery.vehicle.plate}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={onContactDriver} className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Ações</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {delivery.status === 'delivered' && onConfirmDelivery && (
                <Button className="w-full" onClick={onConfirmDelivery}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Recebimento
                </Button>
              )}

              <Button variant="outline" className="w-full" onClick={onReportIssue}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reportar Problema
              </Button>

              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>

              {delivery.status === 'delivered' && (
                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Entrega
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proof of Delivery */}
      {delivery.status === 'delivered' && delivery.proofOfDelivery && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Comprovante de Entrega</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Data/Hora da entrega:</span>
                <span className="font-medium">{formatTime(delivery.proofOfDelivery.timestamp)}</span>
              </div>

              {delivery.proofOfDelivery.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Observações:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {delivery.proofOfDelivery.notes}
                  </p>
                </div>
              )}

              {delivery.proofOfDelivery.photos.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fotos da entrega:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {delivery.proofOfDelivery.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={photo} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        />
                        <Camera className="absolute top-1 right-1 h-3 w-3 text-white bg-black bg-opacity-50 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {delivery.proofOfDelivery.signature && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assinatura:</h4>
                  <div className="border rounded p-4 bg-gray-50">
                    <img 
                      src={delivery.proofOfDelivery.signature} 
                      alt="Assinatura"
                      className="max-h-20"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};