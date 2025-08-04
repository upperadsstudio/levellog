import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  Route,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Phone,
  MessageSquare,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface TrackingLocation {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  speed: number;
  address: string;
  status: 'moving' | 'stopped' | 'loading' | 'unloading';
}

interface TrackingMapProps {
  cargaId: string;
  currentLocation?: TrackingLocation;
  route: TrackingLocation[];
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  estimatedArrival: Date;
  onContactDriver?: () => void;
  onReportIssue?: () => void;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  cargaId,
  currentLocation,
  route,
  origin,
  destination,
  estimatedArrival,
  onContactDriver,
  onReportIssue
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      if (isLive) {
        setLastUpdate(new Date());
      }
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: TrackingLocation['status']) => {
    switch (status) {
      case 'moving':
        return 'success';
      case 'stopped':
        return 'warning';
      case 'loading':
        return 'info';
      case 'unloading':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TrackingLocation['status']) => {
    switch (status) {
      case 'moving':
        return 'Em movimento';
      case 'stopped':
        return 'Parado';
      case 'loading':
        return 'Carregando';
      case 'unloading':
        return 'Descarregando';
      default:
        return status;
    }
  };

  const calculateProgress = () => {
    if (!currentLocation) return 0;
    
    // Simulação simples de progresso baseado na rota
    const totalDistance = route.length;
    const currentIndex = route.findIndex(point => 
      Math.abs(point.lat - currentLocation.lat) < 0.01 && 
      Math.abs(point.lng - currentLocation.lng) < 0.01
    );
    
    return totalDistance > 0 ? Math.max(0, (currentIndex / totalDistance) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rastreamento em Tempo Real</h2>
          <p className="text-gray-600">Carga #{cargaId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Ao vivo' : 'Pausado'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {/* Simulação de mapa */}
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
                {/* Mapa simulado */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Mapa Interativo
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Visualização em tempo real da rota e localização
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Origem: {origin.address}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Posição atual</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Destino: {destination.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso da viagem</span>
                    <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Status Atual</h3>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={getStatusColor(currentLocation.status)}>
                      {getStatusLabel(currentLocation.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Velocidade:</span>
                    <span className="font-medium">{currentLocation.speed} km/h</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Última atualização:</span>
                    <span className="font-medium">{formatTime(lastUpdate)}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-1">Localização atual:</p>
                    <p className="font-medium text-sm">{currentLocation.address}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Aguardando localização...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ETA */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Previsão de Chegada</h3>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatDate(estimatedArrival)}
                </div>
                <p className="text-sm text-gray-600">Estimativa baseada no tráfego atual</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Ações</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {onContactDriver && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onContactDriver}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contatar Motorista
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
              
              {onReportIssue && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onReportIssue}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reportar Problema
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Route Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informações da Rota</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Origem</p>
                    <p className="text-xs text-gray-600">{origin.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Destino</p>
                    <p className="text-xs text-gray-600">{destination.address}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distância total:</span>
                    <span className="font-medium">430 km</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo estimado:</span>
                    <span className="font-medium">6h 30min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};