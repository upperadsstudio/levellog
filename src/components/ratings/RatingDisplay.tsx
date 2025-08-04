import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Star,
  User,
  Calendar,
  Award,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface Rating {
  id: string;
  fromUser: {
    id: string;
    name: string;
    type: 'embarcador' | 'transportador' | 'transportadora';
    avatar?: string;
  };
  cargaId: string;
  cargaTitle: string;
  overallRating: number;
  categories: {
    communication: number;
    punctuality: number;
    quality: number;
    professionalism: number;
  };
  comment: string;
  wouldRecommend: boolean;
  tags: string[];
  createdAt: Date;
  helpful?: number;
}

interface RatingDisplayProps {
  rating: Rating;
  showCargaInfo?: boolean;
  compact?: boolean;
  onMarkHelpful?: (ratingId: string) => void;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  showCargaInfo = true,
  compact = false,
  onMarkHelpful
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const renderStars = (rating: number, size = 'sm') => {
    const starSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const categoryLabels = {
    communication: 'Comunicação',
    punctuality: 'Pontualidade',
    quality: 'Qualidade',
    professionalism: 'Profissionalismo'
  };

  const averageRating = Object.values(rating.categories).reduce((sum, r) => sum + r, 0) / 4;

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {rating.fromUser.avatar ? (
                <img 
                  src={rating.fromUser.avatar} 
                  alt={rating.fromUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{rating.fromUser.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{rating.fromUser.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(rating.overallRating)}
                  <span className="text-sm font-medium">{rating.overallRating.toFixed(1)}</span>
                </div>
              </div>
              
              {rating.comment && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {rating.comment}
                </p>
              )}
              
              {rating.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {rating.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="info" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {rating.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{rating.tags.length - 3}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(rating.createdAt)}</span>
                {rating.wouldRecommend && (
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">Recomenda</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {rating.fromUser.avatar ? (
                <img 
                  src={rating.fromUser.avatar} 
                  alt={rating.fromUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{rating.fromUser.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{rating.fromUser.type}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(rating.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              {renderStars(rating.overallRating, 'lg')}
              <span className="text-lg font-bold">{rating.overallRating.toFixed(1)}</span>
            </div>
            {rating.wouldRecommend && (
              <div className="flex items-center space-x-1 text-green-600">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Recomenda</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Cargo Info */}
          {showCargaInfo && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Carga avaliada</h4>
              <p className="text-sm text-gray-600">{rating.cargaTitle}</p>
            </div>
          )}

          {/* Category Ratings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Avaliação por categoria</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(rating.categories).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {categoryLabels[key as keyof typeof categoryLabels]}
                  </span>
                  <div className="flex items-center space-x-2">
                    {renderStars(value)}
                    <span className="text-sm font-medium">{value.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Média das categorias:</span>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-bold">{averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {rating.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pontos destacados</h4>
              <div className="flex flex-wrap gap-2">
                {rating.tags.map((tag) => (
                  <Badge key={tag} variant="success" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          {rating.comment && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Comentário</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700">{rating.comment}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              {onMarkHelpful && (
                <button
                  onClick={() => onMarkHelpful(rating.id)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Útil</span>
                  {rating.helpful && rating.helpful > 0 && (
                    <span className="text-blue-600 font-medium">({rating.helpful})</span>
                  )}
                </button>
              )}
            </div>
            
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>Responder</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};