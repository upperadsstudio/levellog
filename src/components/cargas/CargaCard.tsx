import React from 'react';
import { Carga } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Clock,
  Star
} from 'lucide-react';

interface CargaCardProps {
  carga: Carga;
  onViewDetails: (carga: Carga) => void;
  onMakeProposal?: (carga: Carga) => void;
  showActions?: boolean;
}

export const CargaCard: React.FC<CargaCardProps> = ({
  carga,
  onViewDetails,
  onMakeProposal,
  showActions = true
}) => {
  const getStatusColor = (status: Carga['status']) => {
    switch (status) {
      case 'disponivel':
        return 'success';
      case 'negociacao':
        return 'warning';
      case 'contratada':
        return 'info';
      case 'transporte':
        return 'info';
      case 'entregue':
        return 'success';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Carga['status']) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'negociacao':
        return 'Em negociação';
      case 'contratada':
        return 'Contratada';
      case 'transporte':
        return 'Em transporte';
      case 'entregue':
        return 'Entregue';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {carga.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">{carga.embarcador.rating}</span>
              <span className="mx-1">•</span>
              <span>{carga.embarcador.totalRatings} avaliações</span>
            </div>
          </div>
          <Badge variant={getStatusColor(carga.status)}>
            {getStatusLabel(carga.status)}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {carga.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Origem</p>
              <p>{carga.origin.city}, {carga.origin.state}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Destino</p>
              <p>{carga.destination.city}, {carga.destination.state}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="h-4 w-4 mr-2" />
            <span>{carga.weight.toLocaleString()} kg</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Truck className="h-4 w-4 mr-2" />
            <span>{carga.vehicleType}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(carga.deadline)}</span>
          </div>
          {carga.distance && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{carga.distance} km</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold text-green-600">
            <DollarSign className="h-5 w-5 mr-1" />
            {formatCurrency(carga.value)}
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(carga)}
              >
                Ver detalhes
              </Button>
              {onMakeProposal && carga.status === 'disponivel' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onMakeProposal(carga)}
                >
                  Fazer proposta
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};