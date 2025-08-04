import React from 'react';
import { Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Clock,
  Star,
  User,
  Phone,
  Mail,
  FileText,
  Package
} from 'lucide-react';

interface CargaDetailsProps {
  carga: Carga;
  onBack: () => void;
  onMakeProposal?: (carga: Carga) => void;
}

export const CargaDetails: React.FC<CargaDetailsProps> = ({
  carga,
  onBack,
  onMakeProposal
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
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Badge variant={getStatusColor(carga.status)}>
          {getStatusLabel(carga.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {carga.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    <span>{carga.cargoType}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(carga.value)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Publicado em {formatDate(carga.createdAt)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600">{carga.description}</p>
                </div>

                {carga.specialRequirements && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Requisitos Especiais</h3>
                    <p className="text-gray-600">{carga.specialRequirements}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informações da Rota</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-green-600 font-medium">
                    <MapPin className="h-4 w-4 mr-2" />
                    Origem
                  </div>
                  <div className="pl-6 text-gray-600">
                    <p>{carga.origin.street}</p>
                    <p>{carga.origin.city}, {carga.origin.state}</p>
                    <p>{carga.origin.zipCode}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-red-600 font-medium">
                    <MapPin className="h-4 w-4 mr-2" />
                    Destino
                  </div>
                  <div className="pl-6 text-gray-600">
                    <p>{carga.destination.street}</p>
                    <p>{carga.destination.city}, {carga.destination.state}</p>
                    <p>{carga.destination.zipCode}</p>
                  </div>
                </div>
              </div>

              {carga.distance && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Distância aproximada: {carga.distance} km</span>
                    {carga.estimatedTime && (
                      <span className="ml-4">Tempo estimado: {carga.estimatedTime}h</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Weight className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Peso</div>
                  <div className="font-semibold">{carga.weight.toLocaleString()} kg</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Veículo</div>
                  <div className="font-semibold text-sm">{carga.vehicleType}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Prazo</div>
                  <div className="font-semibold text-sm">{formatDate(carga.deadline)}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Valor</div>
                  <div className="font-semibold text-sm">{formatCurrency(carga.value)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposals */}
          {carga.proposals.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Propostas Recebidas ({carga.proposals.length})
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carga.proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{proposal.transportador.name}</span>
                          <Badge variant={proposal.status === 'aceita' ? 'success' : 'warning'}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(proposal.value)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{proposal.message}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(proposal.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Embarcador Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Embarcador</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{carga.embarcador.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{carga.embarcador.type}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{carga.embarcador.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({carga.embarcador.totalRatings} avaliações)
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {carga.embarcador.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {carga.embarcador.phone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {onMakeProposal && carga.status === 'disponivel' && (
            <Card>
              <CardContent className="p-6">
                <Button
                  className="w-full"
                  onClick={() => onMakeProposal(carga)}
                >
                  Fazer Proposta
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Envie sua proposta para este frete
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informações Rápidas</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getStatusColor(carga.status)} size="sm">
                    {getStatusLabel(carga.status)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicado:</span>
                  <span>{formatDate(carga.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Propostas:</span>
                  <span>{carga.proposals.length}</span>
                </div>
                {carga.distance && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distância:</span>
                    <span>{carga.distance} km</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};