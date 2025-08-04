import React, { useState } from 'react';
import { Proposal, Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Star,
  DollarSign,
  Calendar,
  Truck,
  User,
  Check,
  X,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Award,
  Clock
} from 'lucide-react';

interface ProposalComparisonProps {
  proposals: Proposal[];
  carga: Carga;
  onAccept?: (proposal: Proposal) => void;
  onReject?: (proposal: Proposal) => void;
  onCounterOffer?: (proposal: Proposal) => void;
  onStartChat?: (proposal: Proposal) => void;
}

export const ProposalComparison: React.FC<ProposalComparisonProps> = ({
  proposals,
  carga,
  onAccept,
  onReject,
  onCounterOffer,
  onStartChat
}) => {
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getValueDifference = (proposalValue: number) => {
    const difference = proposalValue - carga.value;
    const percentage = (difference / carga.value) * 100;
    return { difference, percentage };
  };

  const toggleProposalSelection = (proposalId: string) => {
    setSelectedProposals(prev => {
      if (prev.includes(proposalId)) {
        return prev.filter(id => id !== proposalId);
      } else if (prev.length < 3) {
        return [...prev, proposalId];
      }
      return prev;
    });
  };

  const sortedProposals = [...proposals].sort((a, b) => {
    // Sort by rating first, then by value
    if (a.transportador.rating !== b.transportador.rating) {
      return b.transportador.rating - a.transportador.rating;
    }
    return a.value - b.value;
  });

  const bestValue = Math.min(...proposals.map(p => p.value));
  const bestRating = Math.max(...proposals.map(p => p.transportador.rating));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comparar Propostas</h2>
          <p className="text-gray-600">
            {proposals.length} propostas para "{carga.title}"
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Selecione até 3 propostas para comparar
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Melhor Valor</div>
            <div className="font-bold text-green-600">{formatCurrency(bestValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Melhor Avaliação</div>
            <div className="font-bold text-yellow-600">{bestRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Valor Médio</div>
            <div className="font-bold text-blue-600">
              {formatCurrency(proposals.reduce((sum, p) => sum + p.value, 0) / proposals.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Total Propostas</div>
            <div className="font-bold text-purple-600">{proposals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      {selectedProposals.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Comparação Detalhada</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Critério</th>
                    {selectedProposals.map(proposalId => {
                      const proposal = proposals.find(p => p.id === proposalId)!;
                      return (
                        <th key={proposalId} className="text-center py-3 px-4 font-medium text-gray-900">
                          {proposal.transportador.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Valor</td>
                    {selectedProposals.map(proposalId => {
                      const proposal = proposals.find(p => p.id === proposalId)!;
                      const { difference, percentage } = getValueDifference(proposal.value);
                      return (
                        <td key={proposalId} className="text-center py-3 px-4">
                          <div className="font-bold">{formatCurrency(proposal.value)}</div>
                          <div className={`text-xs ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {difference >= 0 ? '+' : ''}{percentage.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Avaliação</td>
                    {selectedProposals.map(proposalId => {
                      const proposal = proposals.find(p => p.id === proposalId)!;
                      return (
                        <td key={proposalId} className="text-center py-3 px-4">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">{proposal.transportador.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {proposal.transportador.totalRatings} avaliações
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Entrega Prevista</td>
                    {selectedProposals.map(proposalId => {
                      const proposal = proposals.find(p => p.id === proposalId)!;
                      return (
                        <td key={proposalId} className="text-center py-3 px-4">
                          {proposal.estimatedDelivery ? formatDate(proposal.estimatedDelivery) : 'Não informado'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Veículo</td>
                    {selectedProposals.map(proposalId => {
                      const proposal = proposals.find(p => p.id === proposalId)!;
                      return (
                        <td key={proposalId} className="text-center py-3 px-4">
                          {proposal.vehicle ? (
                            <div>
                              <div className="font-medium text-sm">
                                {proposal.vehicle.brand} {proposal.vehicle.model}
                              </div>
                              <div className="text-xs text-gray-500">
                                {proposal.vehicle.capacity.toLocaleString()} kg
                              </div>
                            </div>
                          ) : (
                            'Não informado'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProposals.map((proposal) => {
          const { difference, percentage } = getValueDifference(proposal.value);
          const isSelected = selectedProposals.includes(proposal.id);
          const isBestValue = proposal.value === bestValue;
          const isBestRating = proposal.transportador.rating === bestRating;

          return (
            <Card 
              key={proposal.id} 
              className={`relative transition-all ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleProposalSelection(proposal.id)}
                  disabled={!isSelected && selectedProposals.length >= 3}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-1">
                {isBestValue && (
                  <Badge variant="success" size="sm">Melhor Valor</Badge>
                )}
                {isBestRating && (
                  <Badge variant="warning" size="sm">Melhor Avaliado</Badge>
                )}
              </div>

              <CardContent className="p-6 pt-12">
                {/* Transportador Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {proposal.transportador.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{proposal.transportador.rating.toFixed(1)}</span>
                      <span>({proposal.transportador.totalRatings})</span>
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(proposal.value)}
                  </div>
                  <div className={`text-sm flex items-center justify-center ${
                    difference >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {difference >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {difference >= 0 ? '+' : ''}{percentage.toFixed(1)}% do valor original
                  </div>
                </div>

                {/* Message Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {proposal.message}
                  </p>
                </div>

                {/* Vehicle Info */}
                {proposal.vehicle && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Truck className="h-4 w-4" />
                    <span>
                      {proposal.vehicle.brand} {proposal.vehicle.model}
                    </span>
                  </div>
                )}

                {/* Estimated Delivery */}
                {proposal.estimatedDelivery && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Entrega: {formatDate(proposal.estimatedDelivery)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  {proposal.status === 'pendente' && (
                    <>
                      {onAccept && (
                        <Button
                          size="sm"
                          onClick={() => onAccept(proposal)}
                          className="w-full"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                      )}
                      <div className="flex space-x-2">
                        {onCounterOffer && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCounterOffer(proposal)}
                            className="flex-1"
                          >
                            Contraproposta
                          </Button>
                        )}
                        {onStartChat && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStartChat(proposal)}
                            className="flex-1"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        )}
                      </div>
                      {onReject && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject(proposal)}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Recusar
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};