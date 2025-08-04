import React from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  FileText, 
  Building, 
  Star, 
  MapPin, 
  Truck, 
  Calendar,
  Edit,
  Shield,
  Award,
  Clock
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  isOwnProfile = false, 
  onEdit 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getProfileCompleteness = () => {
    let completeness = 0;
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.document,
      user.avatar
    ];
    
    fields.forEach(field => {
      if (field) completeness += 20;
    });
    
    return completeness;
  };

  const getUserTypeLabel = () => {
    switch (user.type) {
      case 'embarcador':
        return 'Embarcador';
      case 'transportador':
        return 'Transportador';
      case 'transportadora':
        return 'Transportadora';
      default:
        return '';
    }
  };

  const getVerificationStatus = () => {
    if (user.profileComplete) {
      return { status: 'verified', label: 'Verificado', color: 'success' };
    }
    return { status: 'pending', label: 'Pendente', color: 'warning' };
  };

  const verification = getVerificationStatus();
  const completeness = getProfileCompleteness();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isOwnProfile ? 'Meu Perfil' : `Perfil de ${user.name}`}
        </h1>
        {isOwnProfile && onEdit && (
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Profile Completeness Alert */}
      {isOwnProfile && completeness < 100 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">
                  Complete seu perfil ({completeness}%)
                </h3>
                <p className="text-sm text-yellow-700">
                  Um perfil completo aumenta suas chances de negócios em até 80%
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Completar
              </Button>
            </div>
            <div className="mt-3 w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <Badge variant={verification.color as any}>
                      {verification.label}
                    </Badge>
                  </div>
                  <p className="text-gray-600 capitalize mb-2">{getUserTypeLabel()}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{user.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">
                        ({user.totalRatings} avaliações)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">E-mail</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Documento</p>
                      <p className="font-medium">{user.document}</p>
                    </div>
                  </div>
                  {(user as any).companyName && (
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Empresa</p>
                        <p className="font-medium">{(user as any).companyName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type-specific Information */}
          {user.type === 'transportador' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Informações do Transportador
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CNH</p>
                    <p className="font-medium">{(user as any).license || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experiência</p>
                    <p className="font-medium">
                      {(user as any).experience || 0} anos
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge variant={
                      (user as any).availability === 'disponivel' ? 'success' : 'warning'
                    }>
                      {(user as any).availability === 'disponivel' ? 'Disponível' : 'Ocupado'}
                    </Badge>
                  </div>
                </div>

                {(user as any).vehicles && (user as any).vehicles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Veículos</h4>
                    <div className="space-y-3">
                      {(user as any).vehicles.map((vehicle: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">
                              {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </h5>
                            <span className="text-sm text-gray-500">{vehicle.plate}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Capacidade:</span>
                              <span className="ml-1 font-medium">
                                {vehicle.capacity?.toLocaleString()} kg
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Tipo:</span>
                              <span className="ml-1 font-medium capitalize">
                                {vehicle.type}
                              </span>
                            </div>
                          </div>
                          {vehicle.features && vehicle.features.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {vehicle.features.map((feature: string, idx: number) => (
                                  <Badge key={idx} variant="info" size="sm">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.type === 'embarcador' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informações do Embarcador
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(user as any).address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Endereço</p>
                      <p className="font-medium">
                        {(user as any).address.street}, {(user as any).address.city} - {(user as any).address.state}
                      </p>
                      <p className="text-sm text-gray-500">{(user as any).address.zipCode}</p>
                    </div>
                  )}
                  {(user as any).specialties && (user as any).specialties.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Especialidades</p>
                      <div className="flex flex-wrap gap-2">
                        {(user as any).specialties.map((specialty: string, index: number) => (
                          <Badge key={index} variant="info">
                            {specialty}
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
                    <span className="text-sm text-gray-600">Avaliação</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">{user.totalRatings} avaliações</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Tempo de resposta</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">2h</div>
                    <div className="text-xs text-gray-500">média</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Fretes realizados</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">47</div>
                    <div className="text-xs text-gray-500">total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Taxa de sucesso</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">98%</div>
                    <div className="text-xs text-gray-500">entregas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Atividade Recente</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Frete concluído</p>
                    <p className="text-xs text-gray-500">Há 2 dias</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Proposta enviada</p>
                    <p className="text-xs text-gray-500">Há 5 dias</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Perfil atualizado</p>
                    <p className="text-xs text-gray-500">Há 1 semana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Status de Verificação</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-mail</span>
                  <Badge variant="success" size="sm">Verificado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Telefone</span>
                  <Badge variant="success" size="sm">Verificado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documento</span>
                  <Badge variant={user.profileComplete ? 'success' : 'warning'} size="sm">
                    {user.profileComplete ? 'Verificado' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CNH</span>
                  <Badge variant="warning" size="sm">Pendente</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};