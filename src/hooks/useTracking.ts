import { useState, useEffect } from 'react';

interface TrackingLocation {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  speed: number;
  address: string;
  status: 'moving' | 'stopped' | 'loading' | 'unloading';
}

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

export const useTracking = (cargaId: string) => {
  const [currentLocation, setCurrentLocation] = useState<TrackingLocation | null>(null);
  const [route, setRoute] = useState<TrackingLocation[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [delivery, setDelivery] = useState<DeliveryInfo | null>(null);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados de rastreamento
    setTimeout(() => {
      setCurrentLocation({
        id: '1',
        lat: -23.5505,
        lng: -46.6333,
        timestamp: new Date(),
        speed: 65,
        address: 'Rod. Presidente Dutra, km 150 - Guarulhos, SP',
        status: 'moving'
      });

      setRoute([
        {
          id: '1',
          lat: -23.5505,
          lng: -46.6333,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          speed: 0,
          address: 'São Paulo, SP',
          status: 'loading'
        },
        {
          id: '2',
          lat: -23.2000,
          lng: -45.8000,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          speed: 70,
          address: 'Taubaté, SP',
          status: 'moving'
        },
        {
          id: '3',
          lat: -22.9068,
          lng: -43.1729,
          timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
          speed: 0,
          address: 'Rio de Janeiro, RJ',
          status: 'unloading'
        }
      ]);

      setTimeline([
        {
          id: '1',
          type: 'pickup',
          title: 'Coleta realizada',
          description: 'Carga coletada no endereço de origem',
          location: 'São Paulo, SP',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '2',
          type: 'checkpoint',
          title: 'Checkpoint Taubaté',
          description: 'Passagem pelo posto de controle',
          location: 'Taubaté, SP',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '3',
          type: 'checkpoint',
          title: 'Em trânsito',
          description: 'Veículo em movimento na rodovia',
          location: 'Rod. Presidente Dutra',
          timestamp: new Date(),
          status: 'current'
        },
        {
          id: '4',
          type: 'delivery',
          title: 'Entrega programada',
          description: 'Entrega no endereço de destino',
          location: 'Rio de Janeiro, RJ',
          timestamp: new Date(),
          status: 'pending',
          estimatedTime: new Date(Date.now() + 3 * 60 * 60 * 1000)
        }
      ]);

      setDelivery({
        id: cargaId,
        status: 'in_transit',
        estimatedArrival: new Date(Date.now() + 3 * 60 * 60 * 1000),
        currentLocation: 'Rod. Presidente Dutra, km 150 - Guarulhos, SP',
        progress: 65,
        driver: {
          name: 'Carlos Mendes',
          phone: '(11) 98888-8888',
          rating: 4.9,
          photo: undefined
        },
        vehicle: {
          plate: 'ABC-1234',
          model: 'Mercedes Atego 1719',
          type: 'Baú refrigerado'
        }
      });

      setRouteOptions([
        {
          id: 'route1',
          name: 'Rota Principal (Via Dutra)',
          distance: 430,
          duration: 360, // 6 horas
          fuelCost: 180,
          tollCost: 45,
          totalCost: 225,
          traffic: 'medium',
          weather: 'good',
          roadConditions: 'excellent',
          recommended: true,
          waypoints: [
            {
              name: 'Posto Shell - Taubaté',
              type: 'fuel',
              estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
            },
            {
              name: 'Área de descanso - Volta Redonda',
              type: 'rest',
              estimatedTime: new Date(Date.now() + 4 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'route2',
          name: 'Rota Alternativa (Via Fernão Dias)',
          distance: 480,
          duration: 420, // 7 horas
          fuelCost: 200,
          tollCost: 35,
          totalCost: 235,
          traffic: 'low',
          weather: 'good',
          roadConditions: 'good',
          recommended: false,
          waypoints: [
            {
              name: 'Posto BR - Belo Horizonte',
              type: 'fuel',
              estimatedTime: new Date(Date.now() + 3 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'route3',
          name: 'Rota Econômica (Estradas Estaduais)',
          distance: 520,
          duration: 480, // 8 horas
          fuelCost: 160,
          tollCost: 15,
          totalCost: 175,
          traffic: 'low',
          weather: 'rain',
          roadConditions: 'poor',
          recommended: false,
          waypoints: [
            {
              name: 'Posto Ipiranga - Resende',
              type: 'fuel',
              estimatedTime: new Date(Date.now() + 4 * 60 * 60 * 1000)
            }
          ]
        }
      ]);

      setSelectedRouteId('route1');
      setLoading(false);
    }, 1000);
  }, [cargaId]);

  const updateLocation = (location: TrackingLocation) => {
    setCurrentLocation(location);
    setRoute(prev => [...prev, location]);
  };

  const addTimelineEvent = (event: TimelineEvent) => {
    setTimeline(prev => [...prev, event]);
  };

  const updateDeliveryStatus = (status: DeliveryInfo['status'], proofOfDelivery?: DeliveryInfo['proofOfDelivery']) => {
    setDelivery(prev => prev ? {
      ...prev,
      status,
      actualArrival: status === 'delivered' ? new Date() : prev.actualArrival,
      proofOfDelivery: proofOfDelivery || prev.proofOfDelivery
    } : null);
  };

  const optimizeRoute = () => {
    // Simular otimização de rota
    const optimizedRoutes = routeOptions.map(route => ({
      ...route,
      traffic: Math.random() > 0.5 ? 'low' : route.traffic,
      duration: Math.floor(route.duration * (0.9 + Math.random() * 0.2))
    }));
    
    setRouteOptions(optimizedRoutes);
  };

  const selectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
  };

  const contactDriver = () => {
    // Implementar contato com motorista
    console.log('Contacting driver...');
  };

  const reportIssue = (issue: string) => {
    // Implementar reporte de problema
    console.log('Reporting issue:', issue);
    
    const issueEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'issue',
      title: 'Problema reportado',
      description: issue,
      location: currentLocation?.address || 'Localização desconhecida',
      timestamp: new Date(),
      status: 'current'
    };
    
    addTimelineEvent(issueEvent);
  };

  const confirmDelivery = (proofOfDelivery: DeliveryInfo['proofOfDelivery']) => {
    updateDeliveryStatus('delivered', proofOfDelivery);
    
    const completedEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'completed',
      title: 'Entrega confirmada',
      description: 'Entrega realizada com sucesso',
      location: delivery?.currentLocation || 'Destino',
      timestamp: new Date(),
      status: 'completed'
    };
    
    addTimelineEvent(completedEvent);
  };

  return {
    currentLocation,
    route,
    timeline,
    delivery,
    routeOptions,
    selectedRouteId,
    loading,
    updateLocation,
    addTimelineEvent,
    updateDeliveryStatus,
    optimizeRoute,
    selectRoute,
    contactDriver,
    reportIssue,
    confirmDelivery
  };
};