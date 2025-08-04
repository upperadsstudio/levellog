import React, { useState } from 'react';
import { Proposal, Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  User,
  DollarSign,
  Calendar,
  MessageSquare,
  Check,
  X,
  Star,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  TrendingUp,
  Award
} from 'lucide-react';

interface ProposalDetailsProps {
  proposal: Proposal;
  carga: Carga;
  userType: 'embarcador' | 'transportador' | 'transportadora';
  onBack: () => void;
  onAccept?: (proposal: Proposal) => void;
  onReject?: (proposal: Proposal) => void;
  onCounterOffer?: (proposal: Proposal) => void;
  onStartChat?: (proposal: Proposal) => void;
}

export const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  proposal,
  carga,
  userType,
  onBack,
  onAccept,
  onReject,
  onCounterOffer,
  onStartChat
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

  const handleReject = () => {
    if (onReject) {
      onReject(proposal);
      setShowRejectModal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Badge variant={getStatusColor(proposal.status)} size="sm">
          {getStatusLabel(proposal.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Proposta de {proposal.transportador.name}
                </h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(proposal.value)}
                  </div>
                  <div className={`text-sm ${valueDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {valueDifference >= 0 ? '+' : ''}{formatCurrency(Math.abs(valueDifference))} 
                    ({percentageDifference >= 0 ? '+' : ''}{percentageDifference.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Mensagem do Transportador</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {proposal.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Valor Proposto</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(proposal.value)}
                    </div>
                    <div className="text-sm text-blue-700">
                      Valor original: {formatCurrency(carga.value)}
                    </div>
                  </div>

                  {proposal.estimatedDelivery && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Entrega Prevista</h4>
                      <div className="text-lg font-bold text-green-600">
                        {formatDate(proposal.estimatedDelivery)}
                      </div>
                      <div className="text-sm text-green-700">
                        Prazo original: {formatDate(carga.deadline)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informações da Carga</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{carga.title}</h4>
                  <p className="text-gray-600">{carga.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-green-600 font-medium mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      Origem
                    </div>
                    <div className="pl-6 text-gray-600">
                      <p>{carga.origin.city}, {carga.origin.state}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-red-600 font-medium mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      Destino
                    </div>
                    <div className="pl-6 text-gray-600">
                      <p>{carga.destination.city}, {carga.destination.state}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Peso</div>
                    <div className="font-semibold">{carga.weight.toLocaleString()} kg</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Veículo</div>
                    <div className="font-semibold text-xs">{carga.vehicleType}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Prazo</div>
                    <div className="font-semibold text-xs">{formatDate(carga.deadline)}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">Distância</div>
                    <div className="font-semibold">{carga.distance || 'N/A'} km</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          {proposal.vehicle && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Veículo Proposto</h3>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {proposal.vehicle.brand} {proposal.vehicle.model} ({proposal.vehicle.year})
                    </h4>
                    <span className="text-sm text-gray-500">{proposal.vehicle.plate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capacidade:</span>
                      <span className="ml-1 font-medium">
                        {proposal.vehicle.capacity.toLocaleString()} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <span className="ml-1 font-medium capitalize">
                        {proposal.vehicle.type}
                      </span>
                    </div>
                  </div>
                  {proposal.vehicle.features && proposal.vehicle.features.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {proposal.vehicle.features.map((feature, idx) => (
                          <Badge key={idx} variant="info" size="sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Transportador Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Transportador</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{proposal.transportador.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {proposal.transportador.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{proposal.transportador.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">
                    ({proposal.transportador.totalRatings} avaliações)
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {proposal.transportador.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {proposal.transportador.phone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Estatísticas</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Fretes realizados</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">47</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Taxa de sucesso</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">98%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Tempo médio</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">2h</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {onStartChat && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => onStartChat(proposal)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar Chat
                  </Button>
                )}

                {userType === 'embarcador' && proposal.status === 'pendente' && (
                  <>
                    {onAccept && (
                      <Button
                        className="w-full"
                        onClick={() => onAccept(proposal)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aceitar Proposta
                      </Button>
                    )}
                    {onCounterOffer && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => onCounterOffer(proposal)}
                      >
                        Fazer Contraproposta
                      </Button>
                    )}
                    {onReject && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setShowRejectModal(true)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Recusar Proposta
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Timeline</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Proposta enviada</p>
                    <p className="text-xs text-gray-500">{formatDate(proposal.createdAt)}</p>
                  </div>
                </div>
                {proposal.status !== 'pendente' && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      proposal.status === 'aceita' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Proposta {getStatusLabel(proposal.status).toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">Há 2 horas</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Recusar Proposta</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Tem certeza que deseja recusar esta proposta? Esta ação não pode ser desfeita.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da recusa (opcional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Explique o motivo da recusa..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    className="flex-1"
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};