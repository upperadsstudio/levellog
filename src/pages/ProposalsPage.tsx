import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProposals } from '../hooks/useProposals';
import { ProposalsList } from '../components/proposals/ProposalsList';
import { ProposalDetails } from '../components/proposals/ProposalDetails';
import { ProposalComparison } from '../components/proposals/ProposalComparison';
import { CounterOfferModal } from '../components/proposals/CounterOfferModal';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { Proposal, Carga } from '../types';

interface ProposalsPageProps {
  onBack: () => void;
}

export const ProposalsPage: React.FC<ProposalsPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { 
    proposals, 
    loading, 
    acceptProposal, 
    rejectProposal, 
    createCounterOffer,
    getProposalStats,
    getProposalsForCarga
  } = useProposals(user!.id, user!.type);

  const [activeView, setActiveView] = useState<'list' | 'details' | 'comparison'>('list');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedCarga, setSelectedCarga] = useState<Carga | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [comparisonCarga, setComparisonCarga] = useState<Carga | null>(null);

  if (!user) return null;

  const stats = getProposalStats();

  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    const carga = proposals.find(p => p.proposal.id === proposal.id)?.carga;
    setSelectedCarga(carga || null);
    setActiveView('details');
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      await acceptProposal(proposal);
      // Mostrar notificação de sucesso
    } catch (error) {
      // Mostrar notificação de erro
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    try {
      await rejectProposal(proposal);
      // Mostrar notificação de sucesso
    } catch (error) {
      // Mostrar notificação de erro
    }
  };

  const handleCounterOffer = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    const carga = proposals.find(p => p.proposal.id === proposal.id)?.carga;
    setSelectedCarga(carga || null);
    setShowCounterOfferModal(true);
  };

  const handleCreateCounterOffer = async (counterOfferData: any) => {
    if (selectedProposal) {
      try {
        await createCounterOffer(selectedProposal, counterOfferData);
        setShowCounterOfferModal(false);
        setSelectedProposal(null);
        setSelectedCarga(null);
        // Mostrar notificação de sucesso
      } catch (error) {
        // Mostrar notificação de erro
      }
    }
  };

  const handleStartChat = (proposal: Proposal) => {
    // Implementar navegação para chat
    console.log('Iniciar chat com:', proposal.transportador.name);
  };

  const handleCompareProposals = (carga: Carga) => {
    setComparisonCarga(carga);
    setActiveView('comparison');
  };

  const getPageTitle = () => {
    switch (user.type) {
      case 'embarcador':
        return 'Propostas Recebidas';
      case 'transportador':
      case 'transportadora':
        return 'Minhas Propostas';
      default:
        return 'Propostas';
    }
  };

  const getEmptyStateMessage = () => {
    switch (user.type) {
      case 'embarcador':
        return 'Você ainda não recebeu propostas para suas cargas';
      case 'transportador':
      case 'transportadora':
        return 'Você ainda não enviou propostas para cargas';
      default:
        return 'Nenhuma proposta encontrada';
    }
  };

  // Group proposals by cargo for embarcadores
  const groupedProposals = user.type === 'embarcador' 
    ? proposals.reduce((acc, { proposal, carga }) => {
        if (!acc[carga.id]) {
          acc[carga.id] = { carga, proposals: [] };
        }
        acc[carga.id].proposals.push(proposal);
        return acc;
      }, {} as Record<string, { carga: Carga; proposals: Proposal[] }>)
    : {};

  if (activeView === 'details' && selectedProposal && selectedCarga) {
    return (
      <div className="space-y-6">
        <ProposalDetails
          proposal={selectedProposal}
          carga={selectedCarga}
          userType={user.type}
          onBack={() => setActiveView('list')}
          onAccept={user.type === 'embarcador' ? handleAcceptProposal : undefined}
          onReject={user.type === 'embarcador' ? handleRejectProposal : undefined}
          onCounterOffer={user.type === 'embarcador' ? handleCounterOffer : undefined}
          onStartChat={handleStartChat}
        />
      </div>
    );
  }

  if (activeView === 'comparison' && comparisonCarga) {
    const cargaProposals = getProposalsForCarga(comparisonCarga.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveView('list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Comparar Propostas</h1>
        </div>
        
        <ProposalComparison
          proposals={cargaProposals}
          carga={comparisonCarga}
          onAccept={handleAcceptProposal}
          onReject={handleRejectProposal}
          onCounterOffer={handleCounterOffer}
          onStartChat={handleStartChat}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-gray-600">
              Gerencie suas propostas e negociações
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user.type === 'embarcador' ? 'Contrapropostas' : 'Recusadas'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {user.type === 'embarcador' ? stats.counterOffers : stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embarcador: Grouped by Cargo */}
      {user.type === 'embarcador' && Object.keys(groupedProposals).length > 0 && (
        <div className="space-y-6">
          {Object.values(groupedProposals).map(({ carga, proposals: cargaProposals }) => (
            <Card key={carga.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{carga.title}</h3>
                    <p className="text-sm text-gray-600">
                      {carga.origin.city} → {carga.destination.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="info">
                      {cargaProposals.length} {cargaProposals.length === 1 ? 'proposta' : 'propostas'}
                    </Badge>
                    {cargaProposals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompareProposals(carga)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Comparar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProposalsList
                  proposals={cargaProposals.map(proposal => ({ proposal, carga }))}
                  userType={user.type}
                  onAccept={handleAcceptProposal}
                  onReject={handleRejectProposal}
                  onCounterOffer={handleCounterOffer}
                  onViewDetails={handleViewDetails}
                  onStartChat={handleStartChat}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Transportador: Simple List */}
      {(user.type === 'transportador' || user.type === 'transportadora') && (
        <ProposalsList
          proposals={proposals}
          userType={user.type}
          onViewDetails={handleViewDetails}
          onStartChat={handleStartChat}
        />
      )}

      {/* Empty State */}
      {proposals.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {getEmptyStateMessage()}
          </p>
          {user.type !== 'embarcador' && (
            <Button onClick={onBack}>
              Buscar Cargas Disponíveis
            </Button>
          )}
        </div>
      )}

      {/* Counter Offer Modal */}
      {showCounterOfferModal && selectedProposal && selectedCarga && (
        <CounterOfferModal
          proposal={selectedProposal}
          carga={selectedCarga}
          onSubmit={handleCreateCounterOffer}
          onClose={() => {
            setShowCounterOfferModal(false);
            setSelectedProposal(null);
            setSelectedCarga(null);
          }}
        />
      )}
    </div>
  );
};