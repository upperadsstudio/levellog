import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Filter,
  Search,
  Eye,
  Share
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'financial' | 'performance' | 'costs' | 'routes';
  period: string;
  generatedAt: Date;
  status: 'ready' | 'generating' | 'error';
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface ReportsPageProps {
  onBack: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onBack }) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const reports: Report[] = [
    {
      id: '1',
      title: 'Relatório Financeiro Mensal',
      type: 'financial',
      period: 'Dezembro 2024',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'ready',
      size: '2.3 MB',
      format: 'pdf'
    },
    {
      id: '2',
      title: 'Análise de Performance de Transportadores',
      type: 'performance',
      period: 'Último Trimestre',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'ready',
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: '3',
      title: 'Breakdown de Custos por Rota',
      type: 'costs',
      period: 'Novembro 2024',
      generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'ready',
      size: '945 KB',
      format: 'pdf'
    },
    {
      id: '4',
      title: 'Otimização de Rotas - Análise Anual',
      type: 'routes',
      period: '2024',
      generatedAt: new Date(),
      status: 'generating',
      size: '-',
      format: 'excel'
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getReportTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'financial':
        return 'Financeiro';
      case 'performance':
        return 'Performance';
      case 'costs':
        return 'Custos';
      case 'routes':
        return 'Rotas';
      default:
        return type;
    }
  };

  const getReportTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'financial':
        return 'success';
      case 'performance':
        return 'info';
      case 'costs':
        return 'warning';
      case 'routes':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'generating':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return 'Pronto';
      case 'generating':
        return 'Gerando...';
      case 'error':
        return 'Erro';
      default:
        return status;
    }
  };

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  const generateNewReport = (type: string) => {
    console.log('Generating new report:', type);
    // Implementar geração de relatório
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
            <h1 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h1>
            <p className="text-gray-600">Análises detalhadas e exportação de dados</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os tipos</option>
                <option value="financial">Financeiro</option>
                <option value="performance">Performance</option>
                <option value="costs">Custos</option>
                <option value="routes">Rotas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateNewReport('financial')}>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório Financeiro</h3>
            <p className="text-sm text-gray-600 mb-4">Receitas, custos e lucros</p>
            <Button variant="outline" size="sm" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateNewReport('performance')}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance</h3>
            <p className="text-sm text-gray-600 mb-4">Análise de transportadores</p>
            <Button variant="outline" size="sm" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateNewReport('costs')}>
          <CardContent className="p-6 text-center">
            <PieChart className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Análise de Custos</h3>
            <p className="text-sm text-gray-600 mb-4">Breakdown detalhado</p>
            <Button variant="outline" size="sm" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => generateNewReport('routes')}>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Otimização de Rotas</h3>
            <p className="text-sm text-gray-600 mb-4">Eficiência e economia</p>
            <Button variant="outline" size="sm" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Relatórios Gerados</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <Badge variant={getReportTypeColor(report.type)} size="sm">
                        {getReportTypeLabel(report.type)}
                      </Badge>
                      <Badge variant={getStatusColor(report.status)} size="sm">
                        {getStatusLabel(report.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Período:</span> {report.period}
                      </div>
                      <div>
                        <span className="font-medium">Gerado em:</span> {formatDate(report.generatedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Tamanho:</span> {report.size}
                      </div>
                      <div>
                        <span className="font-medium">Formato:</span> {report.format.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {report.status === 'ready' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
                      </>
                    )}
                    {report.status === 'generating' && (
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Gerando...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Insights Financeiros</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Melhor Mês</p>
                  <p className="text-sm text-green-700">Dezembro 2024 - R$ 45.600 de lucro</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Rota Mais Rentável</p>
                  <p className="text-sm text-blue-700">São Paulo → Rio de Janeiro</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Transportador Top</p>
                  <p className="text-sm text-purple-700">Carlos Mendes - 98% de sucesso</p>
                </div>
                <Badge className="bg-purple-600">⭐ Top</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recomendações</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                <p className="font-medium text-yellow-900">Otimização de Custos</p>
                <p className="text-sm text-yellow-700">
                  Considere renegociar contratos na rota SP-BH para reduzir custos em 15%
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                <p className="font-medium text-blue-900">Oportunidade de Crescimento</p>
                <p className="text-sm text-blue-700">
                  Região Sul apresenta 23% menos concorrência e margens 18% maiores
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-green-400 bg-green-50">
                <p className="font-medium text-green-900">Performance Excelente</p>
                <p className="text-sm text-green-700">
                  Seus transportadores têm 12% mais pontualidade que a média do mercado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};