import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  Star,
  X,
  Send,
  User,
  Truck,
  Clock,
  Shield,
  Award,
  MessageSquare
} from 'lucide-react';

interface RatingFormProps {
  targetUser: {
    id: string;
    name: string;
    type: 'embarcador' | 'transportador' | 'transportadora';
    avatar?: string;
  };
  cargaId: string;
  cargaTitle: string;
  userType: 'embarcador' | 'transportador' | 'transportadora';
  onSubmit: (rating: RatingData) => void;
  onClose: () => void;
}

interface RatingData {
  targetUserId: string;
  cargaId: string;
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
}

export const RatingForm: React.FC<RatingFormProps> = ({
  targetUser,
  cargaId,
  cargaTitle,
  userType,
  onSubmit,
  onClose
}) => {
  const [overallRating, setOverallRating] = useState(0);
  const [categories, setCategories] = useState({
    communication: 0,
    punctuality: 0,
    quality: 0,
    professionalism: 0
  });
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categoryLabels = {
    communication: 'Comunicação',
    punctuality: 'Pontualidade',
    quality: 'Qualidade',
    professionalism: 'Profissionalismo'
  };

  const getAvailableTags = () => {
    if (userType === 'embarcador') {
      // Embarcador avaliando transportador
      return [
        'Pontual', 'Cuidadoso', 'Comunicativo', 'Profissional', 'Confiável',
        'Veículo limpo', 'Entrega rápida', 'Flexível', 'Experiente', 'Recomendo'
      ];
    } else {
      // Transportador avaliando embarcador
      return [
        'Pagamento em dia', 'Comunicativo', 'Organizado', 'Respeitoso', 'Claro nas instruções',
        'Carga bem embalada', 'Local de fácil acesso', 'Flexível', 'Profissional', 'Recomendo'
      ];
    }
  };

  const handleStarClick = (rating: number, category?: keyof typeof categories) => {
    if (category) {
      setCategories(prev => ({ ...prev, [category]: rating }));
    } else {
      setOverallRating(rating);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      alert('Por favor, selecione uma avaliação geral');
      return;
    }

    const ratingData: RatingData = {
      targetUserId: targetUser.id,
      cargaId,
      overallRating,
      categories,
      comment,
      wouldRecommend,
      tags: selectedTags
    };

    onSubmit(ratingData);
  };

  const renderStars = (rating: number, onStarClick: (rating: number) => void, size = 'md') => {
    const starSize = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star)}
            className={`${starSize} transition-colors ${
              star <= rating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className={`${starSize} fill-current`} />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = Object.values(categories).reduce((sum, rating) => sum + rating, 0) / 4;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Avaliar Parceiro</h2>
              <p className="text-gray-600">{cargaTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target User Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {targetUser.avatar ? (
                    <img 
                      src={targetUser.avatar} 
                      alt={targetUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{targetUser.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{targetUser.type}</p>
                </div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Como foi sua experiência geral?
              </h3>
              <div className="flex justify-center mb-4">
                {renderStars(overallRating, setOverallRating, 'lg')}
              </div>
              <p className="text-sm text-gray-600">
                {overallRating === 0 && 'Clique nas estrelas para avaliar'}
                {overallRating === 1 && 'Muito ruim'}
                {overallRating === 2 && 'Ruim'}
                {overallRating === 3 && 'Regular'}
                {overallRating === 4 && 'Bom'}
                {overallRating === 5 && 'Excelente'}
              </p>
            </div>

            {/* Category Ratings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Avalie por categoria
              </h3>
              <div className="space-y-4">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    {renderStars(
                      categories[key as keyof typeof categories], 
                      (rating) => handleStarClick(rating, key as keyof typeof categories)
                    )}
                  </div>
                ))}
              </div>
              
              {averageRating > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Média das categorias:</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-blue-900">{averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Destaque pontos positivos
              </h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableTags().map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentário (opcional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows={4}
                placeholder="Compartilhe detalhes sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Você recomendaria este {targetUser.type}?
              </h3>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    wouldRecommend
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Sim, recomendo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    !wouldRecommend
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <X className="h-4 w-4" />
                  <span>Não recomendo</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={overallRating === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Avaliação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};