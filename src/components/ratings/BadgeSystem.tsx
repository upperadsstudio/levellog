import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Award,
  Star,
  Shield,
  Truck,
  Clock,
  Target,
  Users,
  TrendingUp,
  Crown,
  Zap,
  Heart,
  CheckCircle
} from 'lucide-react';

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
  requirements: string;
}

interface BadgeSystemProps {
  userType: 'embarcador' | 'transportador' | 'transportadora';
  earnedBadges: UserBadge[];
  availableBadges: UserBadge[];
  stats: {
    totalRatings: number;
    averageRating: number;
    completedDeliveries: number;
    onTimeDeliveries: number;
    recommendationRate: number;
  };
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  userType,
  earnedBadges,
  availableBadges,
  stats
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getRarityColor = (rarity: UserBadge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 border-gray-300 text-gray-700';
      case 'rare':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'epic':
        return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'legendary':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getRarityLabel = (rarity: UserBadge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'Comum';
      case 'rare':
        return 'Raro';
      case 'epic':
        return 'Épico';
      case 'legendary':
        return 'Lendário';
      default:
        return '';
    }
  };

  const getProgressPercentage = (badge: UserBadge) => {
    if (!badge.progress) return 0;
    return Math.min((badge.progress.current / badge.progress.required) * 100, 100);
  };

  const getBadgesByCategory = (badges: UserBadge[]) => {
    const categories = {
      performance: badges.filter(b => 
        b.name.includes('Estrela') || 
        b.name.includes('Excelência') || 
        b.name.includes('Qualidade')
      ),
      reliability: badges.filter(b => 
        b.name.includes('Pontual') || 
        b.name.includes('Confiável') || 
        b.name.includes('Consistente')
      ),
      volume: badges.filter(b => 
        b.name.includes('Veterano') || 
        b.name.includes('Especialista') || 
        b.name.includes('Mestre')
      ),
      special: badges.filter(b => 
        b.name.includes('Lendário') || 
        b.name.includes('Elite') || 
        b.name.includes('Champion')
      )
    };
    return categories;
  };

  const earnedCategories = getBadgesByCategory(earnedBadges);
  const availableCategories = getBadgesByCategory(availableBadges);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Conquistas e Badges
            </h3>
            <Badge variant="info">
              {earnedBadges.length} de {earnedBadges.length + availableBadges.length} conquistadas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{earnedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Conquistadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {earnedBadges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-600">Badges Especiais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {availableBadges.filter(b => b.progress && getProgressPercentage(b) > 50).length}
              </div>
              <div className="text-sm text-gray-600">Próximas Conquistas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((earnedBadges.length / (earnedBadges.length + availableBadges.length)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Progresso Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-500" />
              Badges Conquistadas
            </h3>
          </CardHeader>
          <CardContent>
            {Object.entries(earnedCategories).map(([category, badges]) => {
              if (badges.length === 0) return null;
              
              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">
                    {category === 'performance' && 'Performance'}
                    {category === 'reliability' && 'Confiabilidade'}
                    {category === 'volume' && 'Volume'}
                    {category === 'special' && 'Especiais'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 ${getRarityColor(badge.rarity)}`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg ${badge.color}`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{badge.name}</h5>
                            <Badge variant="success" size="sm">
                              {getRarityLabel(badge.rarity)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                        {badge.earnedAt && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <CheckCircle className="h-3 w-3" />
                            <span>Conquistada em {formatDate(badge.earnedAt)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Próximas Conquistas
            </h3>
          </CardHeader>
          <CardContent>
            {Object.entries(availableCategories).map(([category, badges]) => {
              if (badges.length === 0) return null;
              
              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">
                    {category === 'performance' && 'Performance'}
                    {category === 'reliability' && 'Confiabilidade'}
                    {category === 'volume' && 'Volume'}
                    {category === 'special' && 'Especiais'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => {
                      const progressPercentage = getProgressPercentage(badge);
                      
                      return (
                        <div
                          key={badge.id}
                          className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-75 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 rounded-lg bg-gray-200">
                              {badge.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-700">{badge.name}</h5>
                              <Badge variant="default" size="sm">
                                {getRarityLabel(badge.rarity)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                          
                          {badge.progress && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progresso</span>
                                <span>{badge.progress.current} / {badge.progress.required}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            <strong>Requisitos:</strong> {badge.requirements}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Badge Tips */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="h-5 w-5 mr-2 text-orange-500" />
            Dicas para Conquistar Badges
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Para melhorar sua avaliação:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mantenha comunicação clara e frequente</li>
                <li>• Seja sempre pontual nas entregas</li>
                <li>• Cuide bem da carga durante o transporte</li>
                <li>• Seja profissional em todas as interações</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Para conquistar badges especiais:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete entregas consecutivas sem problemas</li>
                <li>• Mantenha alta taxa de recomendação</li>
                <li>• Acumule avaliações 5 estrelas</li>
                <li>• Participe ativamente da plataforma</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};