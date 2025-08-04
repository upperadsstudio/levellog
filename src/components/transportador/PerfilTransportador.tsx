import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  User,
  Truck,
  Star,
  Edit,
  Save,
  Plus,
  X,
  Phone,
  Mail,
  FileText,
  Calendar,
  Award,
  Shield,
  Clock
} from 'lucide-react';

interface PerfilTransportadorProps {
  onBack: () => void;
}

export const PerfilTransportador: React.FC<PerfilTransportadorProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'documents'>('profile');

  if (!user) return null;

  const mockVehicles = [
    {
      id: '1',
      brand: 'Mercedes',
      model: 'Atego 1719',
      year: 2020,
      capacity: 8000,
      plate: 'ABC-1234',
      type: 'Baú refrigerado',
      features: ['Rastreamento GPS', 'Seguro total', 'Refrigeração']
    }
  ];

  const mockDocuments = [
    { id: '1', name: 'CNH', status: 'approved', uploadDate: new Date() },
    { id: '2', name: 'CRLV', status: 'approved', uploadDate: new Date() },
    { id: '3', name: 'ANTT', status: 'pending', uploadDate: new Date() }
  ];

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'vehicles', label: 'Veículos', icon: Truck },
    { id: 'documents', label: 'Documentos', icon: FileText }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações e documentos</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.type}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{user.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({user.totalRatings} avaliações)</span>
                </div>
                <Badge variant="success">Verificado</Badge>
                <Badge variant="info">Ativo</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Taxa de Sucesso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={user.name}
                  disabled={!isEditing}
                />
                <Input
                  label="E-mail"
                  value={user.email}
                  disabled={!isEditing}
                />
                <Input
                  label="Telefone"
                  value={user.phone}
                  disabled={!isEditing}
                />
                <Input
                  label="CPF"
                  value={user.document}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="CNH"
                  value="12345678901"
                  disabled={!isEditing}
                />
                <Input
                  label="Anos de Experiência"
                  value="8"
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
                  <span className="font-bold">47</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Pontualidade</span>
                  </div>
                  <span className="font-bold">95%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Taxa de sucesso</span>
                  </div>
                  <span className="font-bold">98%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Membro desde</span>
                  </div>
                  <span className="font-bold">2022</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Meus Veículos</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Veículo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVehicles.map((vehicle) => (
                <div key={vehicle.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </h4>
                        <p className="text-sm text-gray-600">{vehicle.plate}</p>
                      </div>
                    </div>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capacidade:</span>
                      <p className="font-medium">{vehicle.capacity.toLocaleString()} kg</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <p className="font-medium">{vehicle.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Recursos:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vehicle.features.map((feature, idx) => (
                          <Badge key={idx} variant="info" size="sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Documentos</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-500">
                        Enviado em {doc.uploadDate.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={doc.status === 'approved' ? 'success' : 'warning'}>
                    {doc.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};