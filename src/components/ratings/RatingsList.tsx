import React, { useState } from 'react';
import { RatingDisplay } from './RatingDisplay';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  Search,
  Filter,
  Star,
  Calendar,
  SortAsc,
  SortDesc,
  Award
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

interface RatingsListProps {
  ratings: Rating[];
  title?: string;
  showFilters?: boolean;
  compact?: boolean;
  onMarkHelpful?: (ratingId: string) => void;
}

export const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  title = 'Avaliações',
  showFilters = true,
  compact = false,
  onMarkHelpful
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [recommendationFilter, setRecommendationFilter] = useState<string>('all');

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.fromUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.cargaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = ratingFilter === null || rating.overallRating === ratingFilter;
    const matchesUserType = userTypeFilter === 'all' || rating.fromUser.type === userTypeFilter;
    const matchesRecommendation = 
      recommendationFilter === 'all' ||
      (recommendationFilter === 'yes' && rating.wouldRecommend) ||
      (recommendationFilter === 'no' && !rating.wouldRecommend);

    return matchesSearch && matchesRating && matchesUserType && matchesRecommendation;
  });

  const sortedRatings = [...filteredRatings].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'rating':
        comparison = a.overallRating - b.overallRating;
        break;
      case 'helpful':
        comparison = (a.helpful || 0) - (b.helpful || 0);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      counts[rating.overallRating as keyof typeof counts]++;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {sortedRatings.length} {sortedRatings.length === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, comentário ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={ratingFilter === null ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setRatingFilter(null)}
                >
                  Todas ({ratings.length})
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={ratingFilter === rating ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setRatingFilter(rating)}
                  >
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                    {rating} ({ratingCounts[rating as keyof typeof ratingCounts]})
                  </Button>
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros avançados
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ordenar por:</span>
                  <select
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="date">Data</option>
                    <option value="rating">Avaliação</option>
                    <option value="helpful">Mais úteis</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de usuário
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userTypeFilter}
                      onChange={(e) => setUserTypeFilter(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      <option value="embarcador">Embarcadores</option>
                      <option value="transportador">Transportadores</option>
                      <option value="transportadora">Transportadoras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recomendação
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={recommendationFilter}
                      onChange={(e) => setRecommendationFilter(e.target.value)}
                    >
                      <option value="all">Todas</option>
                      <option value="yes">Recomenda</option>
                      <option value="no">Não recomenda</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setRatingFilter(null);
                        setUserTypeFilter('all');
                        setRecommendationFilter('all');
                      }}
                      className="w-full"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ratings List */}
      <div className="space-y-4">
        {sortedRatings.map(rating => (
          <RatingDisplay
            key={rating.id}
            rating={rating}
            compact={compact}
            onMarkHelpful={onMarkHelpful}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedRatings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {ratings.length === 0 ? 'Nenhuma avaliação ainda' : 'Nenhuma avaliação encontrada'}
          </h3>
          <p className="text-gray-500">
            {ratings.length === 0 
              ? 'As avaliações aparecerão aqui após as primeiras entregas'
              : 'Tente ajustar os filtros ou realizar uma nova busca'
            }
          </p>
        </div>
      )}
    </div>
  );
};