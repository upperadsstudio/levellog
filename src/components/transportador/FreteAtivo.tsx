import React, { useState } from 'react';
import { Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Truck,
  Phone,
  MessageSquare,
  Camera,
  CheckCircle,
  AlertTriangle,
  Package,
  Route,
  Star,
  Calendar
} from 'lucide-react';

interface FreteAtivoProps {
  fretes: Carga[];
  onBack: () => void;
}

export const FreteAtivo: React.FC<FreteAtivoProps> = ({
  fretes,
  onBack
}) => {
  const [selectedFrete, setSelectedFrete] = useState<Carga | null>(fretes[0] || null);
  const [showProofModal, setShowProofModal] = useState(false);

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

  const getStatusColor = (status: Carga['status']) => {
    switch (status) {
      case 'contratada':
        return 'warning';
      case 'transporte':
        return 'info';
      case 'entregue':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Carga['status']) => {
    switch (status) {
      case 'contratada':
        return 'Aguardando Coleta';
      case 'transporte':
        return 'Em Transporte';
      case 'entregue':
        return 'Entregue';
      default:
        return status;
    }
  };

  const getCurrentStep = (status: Carga['status']) => {
    switch (status) {
      case 'contratada':
        return 1;
      case 'transporte':
        return 2;
      case 'entregue':
        return 3;
      default:
        return 0;
    }
  };

  const steps = [
    { id: 1, title: 'Coleta', description: 'Retirar carga no local de origem' },
    { id: 2, title: 'Transporte', description: 'Carga em trânsito para o destino' },
    { id: 3, title: 'Entrega', description: 'Entregar carga no destino final' }
  ];

  if (fretes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Fretes Ativos</h1>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Truck className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum frete ativo
          </h3>
          <p className="text-gray-500 mb-4">
            Você não possui fretes em andamento no momento
          </p>
          <Button onClick={onBack}>
            Buscar Novas Cargas
          </Button>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Fretes Ativos</h1>
            <p className="text-gray-600">Gerencie seus fretes em andamento</p>
          </div>
        </div>
        <Badge variant="info">
          {fretes.length} {fretes.length === 1 ? 'frete ativo' : 'fretes ativos'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fretes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Seus Fretes</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {fretes.map((frete) => (
                  <div
                    key={frete.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedFrete?.id === frete.id ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFrete(frete)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{frete.title}</h4>
                      <Badge variant={getStatusColor(frete.status)} size="sm">
                        {getStatusLabel(frete.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {frete.origin.city} → {frete.destination.city}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(frete.value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frete Details */}
        <div className="lg:col-span-2">
          {selectedFrete && (
            <div className="space-y-6">
              {/* Frete Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedFrete.title}</h3>
                    <Badge variant={getStatusColor(selectedFrete.status)}>
                      {getStatusLabel(selectedFrete.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Informações da Carga</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peso:</span>
                          <span className="font-medium">{selectedFrete.weight.toLocaleString()} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tipo:</span>
                          <span className="font-medium">{selectedFrete.cargoType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Veículo:</span>
                          <span className="font-medium">{selectedFrete.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-medium text-green-600">{formatCurrency(selectedFrete.value)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Embarcador</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedFrete.embarcador.name}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{selectedFrete.embarcador.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Phone className="h-4 w-4 mr-1" />
                            Ligar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
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
                        <p className="font-medium">{selectedFrete.origin.street}</p>
                        <p>{selectedFrete.origin.city}, {selectedFrete.origin.state}</p>
                        <p>{selectedFrete.origin.zipCode}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-red-600 font-medium">
                        <MapPin className="h-4 w-4 mr-2" />
                        Destino
                      </div>
                      <div className="pl-6 text-gray-600">
                        <p className="font-medium">{selectedFrete.destination.street}</p>
                        <p>{selectedFrete.destination.city}, {selectedFrete.destination.state}</p>
                        <p>{selectedFrete.destination.zipCode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <Route className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-600">Distância</p>
                        <p className="font-medium">{selectedFrete.distance || 'N/A'} km</p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-600">Tempo Estimado</p>
                        <p className="font-medium">{selectedFrete.estimatedTime || 'N/A'}h</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-600">Prazo</p>
                        <p className="font-medium">{formatDate(selectedFrete.deadline)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Steps */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Progresso do Frete</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const currentStep = getCurrentStep(selectedFrete.status);
                      const isCompleted = step.id < currentStep;
                      const isCurrent = step.id === currentStep;
                      const isPending = step.id > currentStep;

                      return (
                        <div key={step.id} className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isCurrent ? 'bg-blue-500 text-white' :
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{step.id}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              isCurrent ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                          {isCurrent && (
                            <Badge variant="info" size="sm">Atual</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex space-x-3">
                      {selectedFrete.status === 'contratada' && (
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar Coleta
                        </Button>
                      )}
                      {selectedFrete.status === 'transporte' && (
                        <Button 
                          className="flex-1"
                          onClick={() => setShowProofModal(true)}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Confirmar Entrega
                        </Button>
                      )}
                      <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reportar Problema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Navigation className="h-4 w-4 mr-2" />
                        Abrir GPS/Navegação
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar para Embarcador
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Camera className="h-4 w-4 mr-2" />
                        Tirar Foto da Carga
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Informações Importantes</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Seguro total da carga ativo</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Navigation className="h-4 w-4" />
                        <span>Rastreamento GPS ativo</span>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-600">
                        <Clock className="h-4 w-4" />
                        <span>Prazo: {Math.ceil((selectedFrete.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias restantes</span>
                      </div>
                      {selectedFrete.specialRequirements && (
                        <div className="flex items-start space-x-2 text-yellow-600">
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <span>{selectedFrete.specialRequirements}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof of Delivery Modal */}
      {showProofModal && selectedFrete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Confirmar Entrega</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowProofModal(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Carga: {selectedFrete.title}</h4>
                  <p className="text-sm text-blue-700">
                    Destino: {selectedFrete.destination.city}, {selectedFrete.destination.state}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos da Entrega
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Tire fotos da carga entregue</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Adicionar Fotos
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assinatura do Recebedor
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 h-32 bg-gray-50">
                    <p className="text-sm text-gray-500 text-center mt-8">
                      Área para assinatura digital
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Adicione observações sobre a entrega..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowProofModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Entrega
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