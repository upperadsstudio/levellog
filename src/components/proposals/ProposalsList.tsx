import React, { useState } from 'react';
import { Proposal, Carga } from '../../types';
import { ProposalCard } from './ProposalCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface ProposalsListProps {
  proposals: Array<{ proposal: Proposal; carga: Carga }>;
  userType: 'embarcador' | 'transportador' | 'transportadora';
  title?: string;
  onAccept?: (proposal: Proposal) => void;
  onReject?: (proposal: Proposal) => void;
  onCounterOffer?: (proposal: Proposal) => void;
  onViewDetails: (proposal: Proposal) => void;
  onStartChat?: (proposal: Proposal) => void;
}

export const ProposalsList: React.FC<ProposalsListProps> = ({
  proposals,
  userType,
  title = 'Propostas',
  onAccept,
  onReject,
  onCounterOffer,
  onViewDetails,
  onStartChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProposals = proposals.filter(({ proposal, carga }) => {
    const matchesSearch = 
      proposal.transportador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.proposal.createdAt.getTime() - b.proposal.createdAt.getTime();
        break;
      case 'value':
        comparison = a.proposal.value - b.proposal.value;
        break;
      case 'rating':
        comparison = a.proposal.transportador.rating - b.proposal.transportador.rating;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusCounts = () => {
    const counts = {
      all: proposals.length,
      pendente: 0,
      aceita: 0,
      recusada: 0,
      contraroposta: 0
    };

    proposals.forEach(({ proposal }) => {
      counts[proposal.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {sortedProposals.length} {sortedProposals.length === 1 ? 'proposta' : 'propostas'}
        </span>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por transportador, carga ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Todas' : 
                   status === 'pendente' ? 'Pendentes' :
                   status === 'aceita' ? 'Aceitas' :
                   status === 'recusada' ? 'Recusadas' :
                   'Contrapropostas'} ({count})
                </button>
              ))}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="date">Data</option>
                    <option value="value">Valor</option>
                    <option value="rating">Avaliação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full justify-start"
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4 mr-2" />
                    ) : (
                      <SortDesc className="h-4 w-4 mr-2" />
                    )}
                    {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedProposals.map(({ proposal, carga }) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            carga={carga}
            userType={userType}
            onAccept={onAccept}
            onReject={onReject}
            onCounterOffer={onCounterOffer}
            onViewDetails={onViewDetails}
            onStartChat={onStartChat}
          />
        ))}
      </div>

      {sortedProposals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-500">
            {proposals.length === 0 
              ? 'Ainda não há propostas para exibir'
              : 'Tente ajustar os filtros ou realizar uma nova busca'
            }
          </p>
        </div>
      )}
    </div>
  );
};