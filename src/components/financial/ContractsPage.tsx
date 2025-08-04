import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  PenTool,
  Share
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  transportador: string;
  cargaId: string;
  value: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'cancelled';
  signedBy: string[];
  template: string;
  clauses: string[];
}

interface ContractsPageProps {
  onBack: () => void;
}

export const ContractsPage: React.FC<ContractsPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewContractModal, setShowNewContractModal] = useState(false);

  const contracts: Contract[] = [
    {
      id: '1',
      title: 'Contrato de Transporte - Alimentos Perecíveis',
      transportador: 'Carlos Mendes',
      cargaId: '1',
      value: 2500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      signedBy: ['João Silva', 'Carlos Mendes'],
      template: 'Transporte Refrigerado',
      clauses: [
        'Manutenção de temperatura entre 2°C e 8°C',
        'Seguro total da carga',
        'Rastreamento GPS obrigatório',
        'Entrega em até 48 horas'
      ]
    },
    {
      id: '2',
      title: 'Contrato de Transporte - Produtos Têxteis',
      transportador: 'Maria Santos',
      cargaId: '2',
      value: 1800,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'pending_signature',
      signedBy: ['João Silva'],
      template: 'Transporte Seco',
      clauses: [
        'Carga paletizada e embalada',
        'Seguro básico incluído',
        'Prazo de entrega: 72 horas',
        'Descarga por conta do destinatário'
      ]
    },
    {
      id: '3',
      title: 'Contrato de Mudança Residencial',
      transportador: 'Pedro Costa',
      cargaId: '3',
      value: 3200,
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      status: 'draft',
      signedBy: [],
      template: 'Mudança Residencial',
      clauses: [
        'Embalagem de itens frágeis incluída',
        'Montagem e desmontagem de móveis',
        'Seguro total dos bens',
        'Prazo flexível conforme disponibilidade'
      ]
    }
  ];

  const templates = [
    'Transporte Refrigerado',
    'Transporte Seco',
    'Mudança Residencial',
    'Transporte de Veículos',
    'Carga Perigosa',
    'Transporte Urgente'
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

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending_signature':
        return 'warning';
      case 'completed':
        return 'info';
      case 'draft':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending_signature':
        return 'Aguardando Assinatura';
      case 'completed':
        return 'Concluído';
      case 'draft':
        return 'Rascunho';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending_signature':
        return <PenTool className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.transportador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Contratos</h1>
            <p className="text-gray-600">Templates, assinaturas digitais e controle de contratos</p>
          </div>
        </div>
        <Button onClick={() => setShowNewContractModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{contracts.length}</div>
            <div className="text-sm text-gray-600">Total de Contratos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Contratos Ativos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <PenTool className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'pending_signature').length}
            </div>
            <div className="text-sm text-gray-600">Aguardando Assinatura</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Edit className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">
              {contracts.filter(c => c.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Rascunhos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="pending_signature">Aguardando Assinatura</option>
              <option value="active">Ativo</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(contract.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
                    <Badge variant={getStatusColor(contract.status)} size="sm">
                      {getStatusLabel(contract.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Transportador</p>
                      <p className="font-medium">{contract.transportador}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor</p>
                      <p className="font-medium text-green-600">{formatCurrency(contract.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Período</p>
                      <p className="font-medium">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Template</p>
                      <p className="font-medium">{contract.template}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Principais Cláusulas:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {contract.clauses.slice(0, 4).map((clause, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-gray-700">{clause}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <PenTool className="h-3 w-3" />
                      <span>Assinado por: {contract.signedBy.length > 0 ? contract.signedBy.join(', ') : 'Nenhuma assinatura'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  {contract.status === 'draft' && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                  {contract.status === 'pending_signature' && (
                    <Button variant="primary" size="sm">
                      <PenTool className="h-4 w-4 mr-1" />
                      Assinar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Templates Disponíveis</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{template}</h4>
                    <p className="text-sm text-gray-600">Template padrão</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Contract Modal */}
      {showNewContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Novo Contrato</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNewContractModal(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input label="Título do Contrato" placeholder="Ex: Contrato de Transporte..." />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Transportador" placeholder="Nome do transportador" />
                  <Input label="Valor" type="number" placeholder="0,00" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Data de Início" type="date" />
                  <Input label="Data de Fim" type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione um template</option>
                    {templates.map((template, index) => (
                      <option key={index} value={template}>{template}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowNewContractModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    Criar Contrato
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