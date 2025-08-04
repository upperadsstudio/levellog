import React, { useState } from 'react';
import { Proposal } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Calendar,
  Package,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface MinhasPropostasProps {
  propostas: Proposal[];
  onBack: () => void;
}

export const MinhasPropostas: React.FC<MinhasPropostasProps> = ({
  propostas,
  onBack
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPropostas = propostas.filter(proposta => {
    if (statusFilter === 'all') return true;
    return proposta.status === statusFilter;
  });

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
        return 'Aguardando Resposta';
      case 'aceita':
        return 'Aceita';
      case 'recusada':
        return 'Recusada';
      case 'contraroposta':
        return 'Contraproposta Recebida';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'aceita':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'recusada':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'contraroposta':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProposalStats = () => {
    return {
      total: propostas.length,
      pendente: propostas.filter(p => p.status === 'pendente').length,
      aceita: propostas.filter(p => p.status === 'aceita').length,
      recusada: propostas.filter(p => p.status === 'recusada').length,
      contraroposta: propostas.filter(p => p.status === 'contraroposta').length,
    };
  };

  const stats = getProposalStats();

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
            <h1 className="text-2xl font-bold text-gray-900">Minhas Propostas</h1>
            <p className="text-gray-600">Acompanhe o status das suas propostas enviadas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Enviadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.pendente}</div>
            <div className="text-sm text-gray-600">Aguardando</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.aceita}</div>
            <div className="text-sm text-gray-600">Aceitas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {stats.total > 0 ? Math.round((stats.aceita / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Sucesso</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Todas ({stats.total})
            </Button>
            <Button
              variant={statusFilter === 'pendente' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pendente')}
            >
              Pendentes ({stats.pendente})
            </Button>
            <Button
              variant={statusFilter === 'aceita' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('aceita')}
            >
              Aceitas ({stats.aceita})
            </Button>
            <Button
              variant={statusFilter === 'contraroposta' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('contraroposta')}
            >
              Contrapropostas ({stats.contraroposta})
            </Button>
            <Button
              variant={statusFilter === 'recusada' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('recusada')}
            >
              Recusadas ({stats.recusada})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredPropostas.map((proposta) => (
          <Card key={proposta.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(proposta.status)}
                    <h3 className="font-semibold text-gray-900">
                      Proposta para: {proposta.cargaId}
                    </h3>
                    <Badge variant={getStatusColor(proposta.status)} size="sm">
                      {getStatusLabel(proposta.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Valor Proposto:</span>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(proposta.value)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Enviada em:</span>
                      <p>{formatDate(proposta.createdAt)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Embarcador:</span>
                      <div className="flex items-center space-x-1">
                        <span>{proposta.transportador.name}</span>
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{proposta.transportador.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Sua Mensagem:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {proposta.message}
                </p>
              </div>

              {proposta.estimatedDelivery && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>Entrega prevista: {formatDate(proposta.estimatedDelivery)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Proposta #{proposta.id}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {proposta.status === 'pendente' && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Conversar
                    </Button>
                  )}
                  {proposta.status === 'contraroposta' && (
                    <Button variant="primary" size="sm">
                      Ver Contraproposta
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPropostas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {propostas.length === 0 ? 'Nenhuma proposta enviada' : 'Nenhuma proposta encontrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {propostas.length === 0 
              ? 'Comece buscando cargas disponíveis e enviando suas propostas'
              : 'Tente ajustar os filtros'
            }
          </p>
          {propostas.length === 0 && (
            <Button onClick={onBack}>
              Buscar Cargas Disponíveis
            </Button>
          )}
        </div>
      )}
    </div>
  );
};