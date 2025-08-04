import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTracking } from '../hooks/useTracking';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import { DeliveryStatus } from '../components/tracking/DeliveryStatus';
import { RouteOptimization } from '../components/tracking/RouteOptimization';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft,
  MapPin,
  Route,
  Clock,
  Truck,
  BarChart3,
  Settings
} from 'lucide-react';

interface TrackingPageProps {
  cargaId: string;
  onBack: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ cargaId, onBack }) => {
  const { user } = useAuth();
  const {
    currentLocation,
    route,
    timeline,
    delivery,
    routeOptions,
    selectedRouteId,
    loading,
    optimizeRoute,
    selectRoute,
    contactDriver,
    reportIssue,
    confirmDelivery
  } = useTracking(cargaId);

  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'status' | 'routes'>('map');

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações de rastreamento...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'status', label: 'Status', icon: Truck },
    { id: 'routes', label: 'Rotas', icon: Route }
  ];

  const currentEvent = timeline.find(event => event.status === 'current');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rastreamento de Carga</h1>
                <p className="text-gray-600">Carga #{cargaId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {delivery && (
                <Badge 
                  variant={
                    delivery.status === 'delivered' ? 'success' :
                    delivery.status === 'in_transit' ? 'info' :
                    delivery.status === 'delayed' ? 'warning' : 'error'
                  }
                >
                  {delivery.status === 'delivered' ? 'Entregue' :
                   delivery.status === 'in_transit' ? 'Em trânsito' :
                   delivery.status === 'delayed' ? 'Atrasado' : 'Problema'}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          {delivery && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{delivery.progress}%</div>
                  <div className="text-sm text-gray-600">Progresso</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentLocation?.speed || 0} km/h
                  </div>
                  <div className="text-sm text-gray-600">Velocidade</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Intl.DateTimeFormat('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(delivery.estimatedArrival)}
                  </div>
                  <div className="text-sm text-gray-600">ETA</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {timeline.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Checkpoints</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tab Navigation */}
          <Card>
            <CardContent className="p-0">
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === 'map' && currentLocation && (
            <TrackingMap
              cargaId={cargaId}
              currentLocation={currentLocation}
              route={route}
              origin={{
                lat: route[0]?.lat || -23.5505,
                lng: route[0]?.lng || -46.6333,
                address: route[0]?.address || 'São Paulo, SP'
              }}
              destination={{
                lat: route[route.length - 1]?.lat || -22.9068,
                lng: route[route.length - 1]?.lng || -43.1729,
                address: route[route.length - 1]?.address || 'Rio de Janeiro, RJ'
              }}
              estimatedArrival={delivery?.estimatedArrival || new Date()}
              onContactDriver={contactDriver}
              onReportIssue={() => reportIssue('Problema reportado pelo usuário')}
            />
          )}

          {activeTab === 'timeline' && (
            <TrackingTimeline
              events={timeline}
              currentEventId={currentEvent?.id}
            />
          )}

          {activeTab === 'status' && delivery && (
            <DeliveryStatus
              delivery={delivery}
              onContactDriver={contactDriver}
              onReportIssue={() => reportIssue('Problema reportado pelo usuário')}
              onConfirmDelivery={delivery.status === 'delivered' ? () => confirmDelivery({
                signature: '/mock-signature.png',
                photos: ['/mock-photo1.jpg', '/mock-photo2.jpg'],
                notes: 'Entrega realizada com sucesso',
                timestamp: new Date()
              }) : undefined}
            />
          )}

          {activeTab === 'routes' && (
            <RouteOptimization
              routes={routeOptions}
              selectedRouteId={selectedRouteId}
              onSelectRoute={selectRoute}
              onOptimizeRoute={optimizeRoute}
            />
          )}
        </div>
      </div>
    </div>
  );
};