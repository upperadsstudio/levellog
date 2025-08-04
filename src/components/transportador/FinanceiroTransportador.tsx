import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  BarChart3,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface FinanceiroTransportadorProps {
  onBack: () => void;
}

export const FinanceiroTransportador: React.FC<FinanceiroTransportadorProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const financialData = {
    totalReceived: 15800,
    pending: 3200,
    thisMonth: 8900,
    lastMonth: 7200,
    growth: 23.6,
    averagePerTrip: 1850
  };

  const payments = [
    {
      id: '1',
      cargaTitle: 'Transporte de Alimentos Perecíveis',
      embarcador: 'João Silva',
      amount: 2500,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending' as const
    },
    {
      id: '2',
      cargaTitle: 'Carga Seca - Produtos Têxteis',
      embarcador: 'Maria Santos',
      amount: 1800,
      paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'paid' as const
    },
    {
      id: '3',
      cargaTitle: 'Mudança Residencial',
      embarcador: 'Pedro Costa',
      amount: 3200,
      paidDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'paid' as const
    }
  ];

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

  const getStatusColor = (status: 'pending' | 'paid') => {
    return status === 'paid' ? 'success' : 'warning';
  };

  const getStatusLabel = (status: 'pending' | 'paid') => {
    return status === 'paid' ? 'Pago' : 'Pendente';
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Meu Financeiro</h1>
            <p className="text-gray-600">Controle seus ganhos e pagamentos</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
            <option value="quarter">Último trimestre</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recebido</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalReceived)}</p>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{financialData.growth}% este mês</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">A Receber</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financialData.pending)}</p>
                <p className="text-sm text-gray-600">2 pagamentos</p>
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
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.thisMonth)}</p>
                <p className="text-sm text-gray-600">vs {formatCurrency(financialData.lastMonth)} anterior</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média por Frete</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(financialData.averagePerTrip)}</p>
                <p className="text-sm text-gray-600">Últimos 30 dias</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Evolução dos Ganhos</h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Gráfico de Ganhos</h4>
              <p className="text-gray-600">Evolução mensal dos seus ganhos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{payment.cargaTitle}</h4>
                  <p className="text-sm text-gray-600">Embarcador: {payment.embarcador}</p>
                  <p className="text-xs text-gray-500">
                    {payment.status === 'paid' 
                      ? `Pago em ${formatDate(payment.paidDate!)}`
                      : `Vence em ${formatDate(payment.dueDate!)}`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                  <Badge variant={getStatusColor(payment.status)} size="sm">
                    {getStatusLabel(payment.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dados Bancários</h3>
            <p className="text-gray-600 mb-4">Gerencie suas informações de pagamento</p>
            <Button variant="outline" className="w-full">
              Configurar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
            <p className="text-gray-600 mb-4">Baixe relatórios detalhados</p>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Planejamento</h3>
            <p className="text-gray-600 mb-4">Defina metas e objetivos</p>
            <Button variant="outline" className="w-full">
              Configurar Metas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};