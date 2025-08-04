import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCargas } from '../hooks/useCargas';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { CargasList } from '../components/cargas/CargasList';
import { CargaForm } from '../components/cargas/CargaForm';
import { CargaDetails } from '../components/cargas/CargaDetails';
import { ProposalModal } from '../components/cargas/ProposalModal';
import { ProposalsPage } from './ProposalsPage';
import { ProfilePage } from './ProfilePage';
import { ChatPage } from './ChatPage';
import { TrackingPage } from './TrackingPage';
import { RatingsPage } from './RatingsPage';
import { FinancialPage } from './FinancialPage';
import { Navbar } from '../components/layout/Navbar';
import { AlertSystem } from '../components/notifications/AlertSystem';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Calendar, MessageSquare, Bell, Search, Filter, MapPin, Truck, Star, DollarSign, Settings } from 'lucide-react';
import { Carga } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { cargas, createCarga, createProposal } = useCargas();
  const [activeView, setActiveView] = useState<'dashboard' | 'publish' | 'search' | 'proposals' | 'messages' | 'notifications' | 'profile' | 'settings' | 'tracking' | 'ratings' | 'financial'>('dashboard');
  const [selectedCarga, setSelectedCarga] = useState<Carga | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [trackingCargaId, setTrackingCargaId] = useState<string>('');

  if (!user) return null;

  const handleViewDetails = (carga: Carga) => {
    setSelectedCarga(carga);
  };

  const handleMakeProposal = (carga: Carga) => {
    setSelectedCarga(carga);
    setShowProposalModal(true);
  };

  const handleTrackCarga = (cargaId: string) => {
    setTrackingCargaId(cargaId);
    setActiveView('tracking');
  };

  const handleCreateCarga = async (cargaData: any) => {
    await createCarga({
      ...cargaData,
      embarcadorId: user.id,
      embarcador: user as any,
      status: 'disponivel' as const,
      proposals: []
    });
    setActiveView('dashboard');
  };

  const handleCreateProposal = async (proposalData: any) => {
    if (selectedCarga) {
      await createProposal(selectedCarga.id, {
        ...proposalData,
        transportadorId: user.id,
        transportador: user as any,
        status: 'pendente' as const
      });
      setShowProposalModal(false);
      setSelectedCarga(null);
    }
  };

  const handleNavigation = (view: string) => {
    setActiveView(view as any);
    setSelectedCarga(null);
    setShowProposalModal(false);
    setTrackingCargaId('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getUserTypeLabel = () => {
    switch (user.type) {
      case 'embarcador':
        return 'Embarcador';
      case 'transportador':
        return 'Transportador';
      case 'transportadora':
        return 'Transportadora';
      default:
        return '';
    }
  };

  const getRecentCargas = () => {
    if (user.type === 'embarcador') {
      return cargas.filter(carga => carga.embarcadorId === user.id);
    }
    return cargas.filter(carga => carga.status === 'disponivel').slice(0, 6);
  };

  const getActiveCargas = () => {
    return cargas.filter(carga => 
      carga.status === 'transporte' || carga.status === 'contratada'
    );
  };

  if (activeView === 'tracking' && trackingCargaId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TrackingPage 
            cargaId={trackingCargaId}
            onBack={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (selectedCarga && !showProposalModal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CargaDetails 
            carga={selectedCarga} 
            onBack={() => setSelectedCarga(null)}
            onMakeProposal={user.type !== 'embarcador' ? handleMakeProposal : undefined}
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
          <FinancialPage />
        </main>
      </div>
    );
  }

  if (activeView === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfilePage onBack={() => setActiveView('dashboard')} />
        </main>
      </div>
    );
  }

  if (activeView === 'proposals') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProposalsPage onBack={() => setActiveView('dashboard')} />
        </main>
      </div>
    );
  }

  if (activeView === 'ratings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RatingsPage onBack={() => setActiveView('dashboard')} />
        </main>
      </div>
    );
  }

  if (activeView === 'publish' && user.type === 'embarcador') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CargaForm 
            onSubmit={handleCreateCarga}
            onCancel={() => setActiveView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (activeView === 'search') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Buscar Cargas</h1>
              <Button variant="outline" onClick={() => setActiveView('dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
            <CargasList
              cargas={cargas.filter(carga => carga.status === 'disponivel')}
              onViewDetails={handleViewDetails}
              onMakeProposal={user.type !== 'embarcador' ? handleMakeProposal : undefined}
              title="Todas as Cargas Disponíveis"
            />
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'messages') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ChatPage onBack={() => setActiveView('dashboard')} />
        </main>
      </div>
    );
  }

  if (activeView === 'notifications') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <AlertSystem position="top-right" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Central de Notificações</h1>
              <Button variant="outline" onClick={() => setActiveView('dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Central de Notificações Ativa
                </h3>
                <p className="text-gray-500">
                  Clique no ícone de sino no topo da página para ver suas notificações
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (activeView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={handleNavigation} />
        <AlertSystem position="top-right" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <Button variant="outline" onClick={() => setActiveView('dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Configurações em Desenvolvimento
                </h3>
                <p className="text-gray-500">
                  As configurações serão implementadas no próximo sprint
                </p>
              </CardContent>
            </Card>
          </div>
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
                  {getUserTypeLabel()} • Bem-vindo ao seu painel
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('dashboard')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agenda
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
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('financial')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('ratings')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                {user.type === 'embarcador' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setActiveView('publish')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Carga
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <DashboardStats userType={user.type} />

          {/* Active Shipments */}
          {getActiveCargas().length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Cargas em Andamento</h3>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver todas no mapa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActiveCargas().map((carga) => (
                    <Card key={carga.id} className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-blue-900">{carga.title}</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTrackCarga(carga.id)}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Rastrear
                          </Button>
                        </div>
                        <p className="text-sm text-blue-700">
                          {carga.origin.city} → {carga.destination.city}
                        </p>
                        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: '65%' }}
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">65% concluído</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                {user.type === 'embarcador' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveView('publish')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Publicar Nova Carga
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveView('proposals')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ver Propostas
                    </Button>
                  </>
                )}
                {(user.type === 'transportador' || user.type === 'transportadora') && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveView('search')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Cargas
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveView('proposals')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Minhas Propostas
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('ratings')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleTrackCarga('1')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Rastreamento
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveView('financial')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Gestão Financeira
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Atividade Recente</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Carga entregue com sucesso</p>
                      <p className="text-xs text-gray-500">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova proposta recebida</p>
                      <p className="text-xs text-gray-500">Há 5 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Avaliação 5 estrelas recebida</p>
                      <p className="text-xs text-gray-500">Há 1 dia</p>
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
                      <p className="text-sm font-medium">Entrega programada</p>
                      <p className="text-xs text-gray-500">Amanhã, 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Coleta agendada</p>
                      <p className="text-xs text-gray-500">Sexta, 09:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Cargas */}
          <CargasList
            cargas={getRecentCargas()}
            onViewDetails={handleViewDetails}
            onMakeProposal={user.type !== 'embarcador' ? handleMakeProposal : undefined}
            title={user.type === 'embarcador' ? 'Suas Cargas' : 'Cargas Recomendadas'}
            showFilters={false}
          />

          {/* Proposal Modal */}
          {showProposalModal && selectedCarga && (
            <ProposalModal
              carga={selectedCarga}
              onSubmit={handleCreateProposal}
              onClose={() => {
                setShowProposalModal(false);
                setSelectedCarga(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};