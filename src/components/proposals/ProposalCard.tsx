import React from 'react';
import { Proposal, Carga } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  User, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  Star,
  Truck,
  MapPin
} from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  carga: Carga;
  userType: 'embarcador' | 'transportador' | 'transportadora';
  onAccept?: (proposal: Proposal) => void;
  onReject?: (proposal: Proposal) => void;
  onCounterOffer?: (proposal: Proposal) => void;
  onViewDetails: (proposal: Proposal) => void;
  onStartChat?: (proposal: Proposal) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  carga,
  userType,
  onAccept,
  onReject,
  onCounterOffer,
  onViewDetails,
  onStartChat
}) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'pendente':
        return 'warning';
      case 'aceita':
        return 'success';
      case 'recusada':
        return 'error';
      case 'contraroposta':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Proposal['status']) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aceita':
        return 'Aceita';
      case 'recusada':
        return 'Recusada';
      case 'contraroposta':
        return 'Contraproposta';
      default:
        return status;
    }
  };

  const valueDifference = proposal.value - carga.value;
  const percentageDifference = ((valueDifference / carga.value) * 100);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {proposal.transportador.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{proposal.transportador.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{proposal.transportador.totalRatings} avaliações</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusColor(proposal.status)}>
            {getStatusLabel(proposal.status)}
          </Badge>
        </div>

        {/* Cargo Info */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{carga.title}</span>
            </div>
            <span className="text-gray-500">
              {carga.origin.city} → {carga.destination.city}
            </span>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Valor Original</p>
            <p className="font-bold text-gray-900">{formatCurrency(carga.value)}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Proposta</p>
            <p className="font-bold text-blue-600">{formatCurrency(proposal.value)}</p>
            <p className={`text-xs ${valueDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {valueDifference >= 0 ? '+' : ''}{percentageDifference.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Vehicle Info */}
        {proposal.vehicle && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Truck className="h-4 w-4" />
            <span>
              {proposal.vehicle.brand} {proposal.vehicle.model} ({proposal.vehicle.year})
            </span>
            <span>•</span>
            <span>{proposal.vehicle.capacity.toLocaleString()} kg</span>
          </div>
        )}

        {/* Message Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {proposal.message}
          </p>
        </div>

        {/* Estimated Delivery */}
        {proposal.estimatedDelivery && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Calendar className="h-4 w-4" />
            <span>Entrega prevista: {formatDate(proposal.estimatedDelivery)}</span>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
          <Clock className="h-3 w-3" />
          <span>Enviada em {formatDate(proposal.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(proposal)}
          >
            Ver Detalhes
          </Button>

          {onStartChat && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStartChat(proposal)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </Button>
          )}

          {userType === 'embarcador' && proposal.status === 'pendente' && (
            <>
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(proposal)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aceitar
                </Button>
              )}
              {onCounterOffer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCounterOffer(proposal)}
                >
                  Contraproposta
                </Button>
              )}
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(proposal)}
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
};