import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';

interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  pendingPayments: number;
  overduePayments: number;
  averageCostPerKm: number;
  monthlyGrowth: number;
}

interface PaymentStatus {
  id: string;
  cargaId: string;
  cargaTitle: string;
  transportador: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  method: 'pix' | 'ted' | 'boleto' | 'cartao';
}

interface FinancialDashboardProps {
  onViewReports: () => void;
  onViewContracts: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  onViewReports,
  onViewContracts
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock data
  const metrics: FinancialMetrics = {
    totalRevenue: 125600,
    totalCosts: 89400,
    profit: 36200,
    profitMargin: 28.8,
    pendingPayments: 15800,
    overduePayments: 3200,
    averageCostPerKm: 2.85,
    monthlyGrowth: 12.5
  };

  const payments: PaymentStatus[] = [
    {
      id: '1',
      cargaId: '1',
      cargaTitle: 'Transporte de Alimentos Perecíveis',
      transportador: 'Carlos Mendes',
      amount: 2500,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      method: 'pix'
    },
    {
      id: '2',
      cargaId: '2',
      cargaTitle: 'Carga Seca - Produtos Têxteis',
      transportador: 'Maria Santos',
      amount: 1800,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paidDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'paid',
      method: 'ted'
    },
    {
      id: '3',
      cargaId: '3',
      cargaTitle: 'Mudança Residencial',
      transportador: 'Pedro Costa',
      amount: 3200,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'overdue',
      method: 'boleto'
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

  const getStatusColor = (status: PaymentStatus['status']) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: PaymentStatus['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getMethodLabel = (method: PaymentStatus['method']) => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'ted':
        return 'TED';
      case 'boleto':
        return 'Boleto';
      case 'cartao':
        return 'Cartão';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600">Controle completo das suas finanças e pagamentos</p>
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
            <option value="year">Último ano</option>
          </select>
          <Button variant="outline" onClick={onViewReports}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button variant="outline" onClick={onViewContracts}>
            <CreditCard className="h-4 w-4 mr-2" />
            Contratos
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{metrics.monthlyGrowth}% este mês</span>
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
                <p className="text-sm font-medium text-gray-600">Custos Totais</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalCosts)}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span>{formatCurrency(metrics.averageCostPerKm)}/km</span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.profit)}</p>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <span>Margem: {metrics.profitMargin}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(metrics.pendingPayments)}</p>
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{formatCurrency(metrics.overduePayments)} vencidos</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Evolução Financeira</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Gráfico de Evolução</h4>
                <p className="text-gray-600">Receitas vs Custos ao longo do tempo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Distribuição de Custos</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Gráfico de Pizza</h4>
                <p className="text-gray-600">Breakdown de custos por categoria</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pagamentos Recentes</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Carga</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Transportador</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Método</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.cargaTitle}</p>
                        <p className="text-sm text-gray-500">#{payment.cargaId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{payment.transportador}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{formatDate(payment.dueDate)}</p>
                      {payment.paidDate && (
                        <p className="text-sm text-gray-500">Pago em {formatDate(payment.paidDate)}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">
                        {getMethodLabel(payment.method)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(payment.status)} size="sm">
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {payment.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pagar
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processar Pagamentos</h3>
            <p className="text-gray-600 mb-4">Efetue pagamentos pendentes em lote</p>
            <Button className="w-full">
              Processar Pagamentos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios Detalhados</h3>
            <p className="text-gray-600 mb-4">Análises completas e exportação</p>
            <Button variant="outline" className="w-full" onClick={onViewReports}>
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestão de Contratos</h3>
            <p className="text-gray-600 mb-4">Templates e assinaturas digitais</p>
            <Button variant="outline" className="w-full" onClick={onViewContracts}>
              Gerenciar Contratos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};