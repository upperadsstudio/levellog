import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCargas } from '../hooks/useCargas';
import { TransportadorStats } from '../components/transportador/TransportadorStats';
import { CargasDisponiveis } from '../components/transportador/CargasDisponiveis';
import { MinhasPropostas } from '../components/transportador/MinhasPropostas';
import { FreteAtivo } from '../components/transportador/FreteAtivo';
import { PerfilTransportador } from '../components/transportador/PerfilTransportador';
import { FinanceiroTransportador } from '../components/transportador/FinanceiroTransportador';
import { Navbar } from '../components/layout/Navbar';
import { AlertSystem } from '../components/notifications/AlertSystem';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Truck, 
  Star,
  Package,
  Navigation,
  Calendar,
  Settings,
  Bell,
  MessageSquare
} from 'lucide-react';

export const TransportadorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { cargas } = useCargas();
  const [activeView, setActiveView] = useState<'dashboard' | 'search' | 'proposals' | 'active' | 'profile' | 'financial' | 'messages'>('dashboard');

  if (!user || (user.type !== 'transportador' && user.type !== 'transportadora')) {
    return null;
  }

  const cargasDisponiveis = cargas.filter(carga => carga.status === 'disponivel');
  const minhasPropostas = cargas.flatMap(carga => 
    carga.proposals.filter(proposal => proposal.transportadorId === user.id)
  );
  const fretesAtivos = cargas.filter(carga => 
    carga.status === 'contratada' || carga.status === 'transporte'
  ).filter(carga => 
    carga.proposals.some(proposal => 
      proposal.transportadorId === user.id && proposal.status === 'aceita'
    )
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleNavigation = (view: string) => {
    setActiveView(view as any);
  };

  if (activeView === 'search') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CargasDisponiveis 
            cargas={cargasDisponiveis}
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (activeView === 'proposals') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MinhasPropostas 
            propostas={minhasPropostas}
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (activeView === 'active') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FreteAtivo 
            fretes={fretesAtivos}
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (activeView === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PerfilTransportador 
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (activeView === 'financial') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FinanceiroTransportador 
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigation} />
      <AlertSystem position="top-right" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {user.name}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Transportador • Painel do Motorista
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{user.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({user.totalRatings} avaliações)</span>
                  </div>
                  <Badge variant="success">
                    Disponível
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('search')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Cargas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('proposals')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Minhas Propostas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagens
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setActiveView('active')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Fretes Ativos
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <TransportadorStats />

          {/* Frete Ativo */}
          {fretesAtivos.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Frete em Andamento</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveView('active')}>
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fretesAtivos.slice(0, 1).map((carga) => (
                  <div key={carga.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-blue-900">{carga.title}</h4>
                      <Badge variant="info">
                        {carga.status === 'contratada' ? 'Aguardando coleta' : 'Em transporte'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Rota</p>
                        <p className="text-blue-600">{carga.origin.city} → {carga.destination.city}</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Valor</p>
                        <p className="text-blue-600 font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(carga.value)}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Prazo</p>
                        <p className="text-blue-600">
                          {new Intl.DateTimeFormat('pt-BR').format(carga.deadline)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: '35%' }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-1">35% concluído</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Ações Rápidas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('search')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Novas Cargas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('proposals')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Ver Minhas Propostas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('active')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Fretes Ativos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('financial')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Meu Financeiro
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Meu Perfil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Oportunidades</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cargasDisponiveis.length} cargas disponíveis</p>
                      <p className="text-xs text-gray-500">Na sua região</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{minhasPropostas.length} propostas enviadas</p>
                      <p className="text-xs text-gray-500">Aguardando resposta</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">R$ 15.600 potencial</p>
                      <p className="text-xs text-gray-500">Em propostas pendentes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Próximos Eventos</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Coleta agendada</p>
                      <p className="text-xs text-gray-500">Hoje, 14:00 - São Paulo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Entrega programada</p>
                      <p className="text-xs text-gray-500">Amanhã, 10:00 - Rio de Janeiro</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Manutenção veículo</p>
                      <p className="text-xs text-gray-500">Sexta, 08:00 - Revisão</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cargas Recomendadas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cargas Recomendadas para Você</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveView('search')}>
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cargasDisponiveis.slice(0, 3).map((carga) => (
                  <Card key={carga.id} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-900">{carga.title}</h4>
                        <Badge variant="success" size="sm">
                          Compatível
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        {carga.origin.city} → {carga.destination.city}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                        <div>
                          <span className="font-medium">Peso:</span> {carga.weight.toLocaleString()} kg
                        </div>
                        <div>
                          <span className="font-medium">Valor:</span> {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(carga.value)}
                        </div>
                        <div>
                          <span className="font-medium">Distância:</span> {carga.distance || 'N/A'} km
                        </div>
                        <div>
                          <span className="font-medium">Prazo:</span> {Math.ceil((carga.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias
                        </div>
                      </div>
                      <Button variant="primary" size="sm" className="w-full mt-3">
                        Fazer Proposta
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};