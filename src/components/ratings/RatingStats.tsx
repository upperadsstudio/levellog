import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Star,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  Target
} from 'lucide-react';

interface RatingStatsProps {
  stats: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    categoryAverages: {
      communication: number;
      punctuality: number;
      quality: number;
      professionalism: number;
    };
    recommendationRate: number;
    topTags: Array<{
      tag: string;
      count: number;
    }>;
    recentTrend: 'up' | 'down' | 'stable';
  };
  userType: 'embarcador' | 'transportador' | 'transportadora';
  compact?: boolean;
}

export const RatingStats: React.FC<RatingStatsProps> = ({
  stats,
  userType,
  compact = false
}) => {
  const renderStars = (rating: number, size = 'md') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : star <= rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 4.0) return 'Muito Bom';
    if (rating >= 3.5) return 'Bom';
    if (rating >= 3.0) return 'Regular';
    return 'Precisa Melhorar';
  };

  const categoryLabels = {
    communication: 'Comunicação',
    punctuality: 'Pontualidade',
    quality: 'Qualidade',
    professionalism: 'Profissionalismo'
  };

  const getTrendIcon = () => {
    switch (stats.recentTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {renderStars(stats.averageRating)}
              <div>
                <div className={`text-lg font-bold ${getRatingColor(stats.averageRating)}`}>
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">
                  {stats.totalRatings} avaliações
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant={stats.recommendationRate >= 80 ? 'success' : 'warning'} size="sm">
                {stats.recommendationRate}% recomendam
              </Badge>
              <div className="flex items-center space-x-1 mt-1">
                {getTrendIcon()}
                <span className="text-xs text-gray-500">Tendência</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Avaliação Geral
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold mb-2 ${getRatingColor(stats.averageRating)}`}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(stats.averageRating, 'lg')}
            </div>
            <div className="text-lg font-medium text-gray-700 mb-1">
              {getRatingLabel(stats.averageRating)}
            </div>
            <div className="text-sm text-gray-500">
              Baseado em {stats.totalRatings} avaliações
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Avaliação por Categoria
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.categoryAverages).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  {categoryLabels[key as keyof typeof categoryLabels]}
                </span>
                <div className="flex items-center space-x-3">
                  {renderStars(value)}
                  <span className={`font-bold ${getRatingColor(value)}`}>
                    {value.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.recommendationRate}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Recomendação</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.totalRatings}
            </div>
            <div className="text-sm text-gray-600">Total de Avaliações</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tags */}
      {stats.topTags.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-500" />
              Pontos Mais Destacados
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topTags.map((item, index) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.tag}</span>
                  </div>
                  <Badge variant="info" size="sm">
                    {item.count} vezes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trend */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Tendência Recente</h4>
              <p className="text-sm text-gray-600">Últimas 30 avaliações</p>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <span className={`font-medium ${
                stats.recentTrend === 'up' ? 'text-green-600' :
                stats.recentTrend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {stats.recentTrend === 'up' ? 'Melhorando' :
                 stats.recentTrend === 'down' ? 'Piorando' :
                 'Estável'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};