import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Route, 
  Navigation, 
  Clock, 
  Fuel, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface RouteOption {
  id: string;
  name: string;
  distance: number;
  duration: number;
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  traffic: 'low' | 'medium' | 'high';
  weather: 'good' | 'rain' | 'storm';
  roadConditions: 'excellent' | 'good' | 'poor';
  recommended: boolean;
  waypoints: Array<{
    name: string;
    type: 'fuel' | 'rest' | 'toll' | 'checkpoint';
    estimatedTime: Date;
  }>;
}

interface RouteOptimizationProps {
  routes: RouteOption[];
  selectedRouteId?: string;
  onSelectRoute: (routeId: string) => void;
  onOptimizeRoute: () => void;
}

export const RouteOptimization: React.FC<RouteOptimizationProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onOptimizeRoute
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTrafficColor = (traffic: RouteOption['traffic']) => {
    switch (traffic) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTrafficLabel = (traffic: RouteOption['traffic']) => {
    switch (traffic) {
      case 'low':
        return 'Trânsito livre';
      case 'medium':
        return 'Trânsito moderado';
      case 'high':
        return 'Trânsito intenso';
      default:
        return traffic;
    }
  };

  const getWeatherIcon = (weather: RouteOption['weather']) => {
    switch (weather) {
      case 'good':
        return '☀️';
      case 'rain':
        return '🌧️';
      case 'storm':
        return '⛈️';
      default:
        return '☀️';
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simular otimização
    setIsOptimizing(false);
    onOptimizeRoute();
  };

  const bestRoute = routes.find(route => route.recommended);
  const selectedRoute = routes.find(route => route.id === selectedRouteId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Otimização de Rota</h2>
          <p className="text-gray-600">Escolha a melhor rota baseada em tempo, custo e condições</p>
        </div>
        <Button onClick={handleOptimize} disabled={isOptimizing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          {isOptimizing ? 'Otimizando...' : 'Otimizar Rota'}
        </Button>
      </div>

      {/* Summary */}
      {bestRoute && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Rota Recomendada</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{bestRoute.distance} km</div>
                <div className="text-sm text-green-700">Distância</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatDuration(bestRoute.duration)}</div>
                <div className="text-sm text-green-700">Tempo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(bestRoute.totalCost)}</div>
                <div className="text-sm text-green-700">Custo Total</div>
              </div>
              <div className="text-center">
                <Badge variant={getTrafficColor(bestRoute.traffic)}>
                  {getTrafficLabel(bestRoute.traffic)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const savings = bestRoute && route.id !== bestRoute.id 
            ? route.totalCost - bestRoute.totalCost 
            : 0;

          return (
            <Card 
              key={route.id} 
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              } ${route.recommended ? 'border-green-200' : ''}`}
              onClick={() => onSelectRoute(route.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Route className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">{route.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {route.recommended && (
                      <Badge variant="success" size="sm">Recomendada</Badge>
                    )}
                    {isSelected && (
                      <Badge variant="info" size="sm">Selecionada</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{route.distance} km</div>
                      <div className="text-xs text-gray-600">Distância</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatDuration(route.duration)}</div>
                      <div className="text-xs text-gray-600">Tempo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(route.totalCost)}</div>
                      <div className="text-xs text-gray-600">Custo</div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Fuel className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">Combustível:</span>
                      </div>
                      <span className="font-medium">{formatCurrency(route.fuelCost)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">Pedágios:</span>
                      </div>
                      <span className="font-medium">{formatCurrency(route.tollCost)}</span>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <Badge variant={getTrafficColor(route.traffic)} size="sm">
                        {getTrafficLabel(route.traffic)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <span className="text-lg">{getWeatherIcon(route.weather)}</span>
                    </div>
                    <div className="text-center">
                      <Badge 
                        variant={route.roadConditions === 'excellent' ? 'success' : 
                               route.roadConditions === 'good' ? 'warning' : 'error'} 
                        size="sm"
                      >
                        {route.roadConditions === 'excellent' ? 'Excelente' :
                         route.roadConditions === 'good' ? 'Boa' : 'Ruim'}
                      </Badge>
                    </div>
                  </div>

                  {/* Savings/Extra Cost */}
                  {savings !== 0 && (
                    <div className={`text-center p-2 rounded ${
                      savings > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                      <div className="flex items-center justify-center space-x-1">
                        {savings > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="text-sm font-medium">
                          {savings > 0 ? '+' : ''}{formatCurrency(Math.abs(savings))}
                        </span>
                      </div>
                      <div className="text-xs">
                        {savings > 0 ? 'mais caro' : 'economia'}
                      </div>
                    </div>
                  )}

                  {/* Waypoints */}
                  {route.waypoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Pontos de parada:</h4>
                      <div className="space-y-1">
                        {route.waypoints.slice(0, 3).map((waypoint, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{waypoint.name}</span>
                            </div>
                            <span className="text-gray-500">
                              {new Intl.DateTimeFormat('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(waypoint.estimatedTime)}
                            </span>
                          </div>
                        ))}
                        {route.waypoints.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{route.waypoints.length - 3} mais paradas
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Detalhes da Rota Selecionada</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pontos de Parada</h4>
                  <div className="space-y-2">
                    {selectedRoute.waypoints.map((waypoint, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            waypoint.type === 'fuel' ? 'bg-yellow-500' :
                            waypoint.type === 'rest' ? 'bg-blue-500' :
                            waypoint.type === 'toll' ? 'bg-red-500' :
                            'bg-green-500'
                          }`} />
                          <span className="text-sm font-medium">{waypoint.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Intl.DateTimeFormat('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(waypoint.estimatedTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Alertas e Avisos</h4>
                  <div className="space-y-2">
                    {selectedRoute.traffic === 'high' && (
                      <div className="flex items-center space-x-2 p-2 bg-red-50 text-red-700 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Trânsito intenso previsto</span>
                      </div>
                    )}
                    {selectedRoute.weather === 'rain' && (
                      <div className="flex items-center space-x-2 p-2 bg-blue-50 text-blue-700 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Chuva prevista na rota</span>
                      </div>
                    )}
                    {selectedRoute.roadConditions === 'poor' && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 text-yellow-700 rounded">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Condições ruins da estrada</span>
                      </div>
                    )}
                    {selectedRoute.traffic === 'low' && selectedRoute.weather === 'good' && selectedRoute.roadConditions === 'excellent' && (
                      <div className="flex items-center space-x-2 p-2 bg-green-50 text-green-700 rounded">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Condições ideais para viagem</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};