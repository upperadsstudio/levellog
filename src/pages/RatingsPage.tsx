import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRatings } from '../hooks/useRatings';
import { RatingStats } from '../components/ratings/RatingStats';
import { RatingsList } from '../components/ratings/RatingsList';
import { BadgeSystem } from '../components/ratings/BadgeSystem';
import { RatingForm } from '../components/ratings/RatingForm';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft,
  Star,
  Award,
  BarChart3,
  Users,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface RatingsPageProps {
  onBack: () => void;
}

export const RatingsPage: React.FC<RatingsPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { 
    ratings, 
    stats, 
    earnedBadges, 
    availableBadges, 
    loading, 
    submitRating, 
    markAsHelpful 
  } = useRatings(user!.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'ratings' | 'badges'>('overview');
  const [showRatingForm, setShowRatingForm] = useState(false);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'ratings', label: 'Avaliações', icon: Star },
    { id: 'badges', label: 'Conquistas', icon: Award }
  ];

  const handleRatingSubmit = async (ratingData: any) => {
    await submitRating(ratingData);
    setShowRatingForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Avaliações e Feedback</h1>
            <p className="text-gray-600">
              Gerencie sua reputação e veja o feedback dos parceiros
            </p>
          </div>
        </div>
        
        {stats && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {stats.totalRatings} avaliações
              </p>
            </div>
            <Badge variant={stats.recommendationRate >= 80 ? 'success' : 'warning'}>
              {stats.recommendationRate.toFixed(0)}% recomendam
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalRatings}
              </div>
              <div className="text-sm text-gray-600">Total de Avaliações</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {earnedBadges.length}
              </div>
              <div className="text-sm text-gray-600">Badges Conquistadas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.recommendationRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Recomendação</div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  {tab.id === 'ratings' && ratings.length > 0 && (
                    <Badge variant="info" size="sm">
                      {ratings.length}
                    </Badge>
                  )}
                  {tab.id === 'badges' && earnedBadges.length > 0 && (
                    <Badge variant="success" size="sm">
                      {earnedBadges.length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && stats && (
        <RatingStats 
          stats={stats} 
          userType={user.type}
        />
      )}

      {activeTab === 'ratings' && (
        <RatingsList
          ratings={ratings}
          onMarkHelpful={markAsHelpful}
        />
      )}

      {activeTab === 'badges' && (
        <BadgeSystem
          userType={user.type}
          earnedBadges={earnedBadges}
          availableBadges={availableBadges}
          stats={{
            totalRatings: stats?.totalRatings || 0,
            averageRating: stats?.averageRating || 0,
            completedDeliveries: 25, // Mock data
            onTimeDeliveries: 23, // Mock data
            recommendationRate: stats?.recommendationRate || 0
          }}
        />
      )}

      {/* Rating Form Modal */}
      {showRatingForm && (
        <RatingForm
          targetUser={{
            id: '2',
            name: 'Carlos Mendes',
            type: 'transportador'
          }}
          cargaId="1"
          cargaTitle="Transporte de Alimentos Perecíveis"
          userType={user.type}
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingForm(false)}
        />
      )}

      {/* Empty State */}
      {!stats || stats.totalRatings === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ainda não há avaliações
            </h3>
            <p className="text-gray-600 mb-6">
              Complete suas primeiras entregas para começar a receber avaliações e construir sua reputação na plataforma.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>💡 <strong>Dica:</strong> Mantenha sempre uma comunicação clara</p>
              <p>⏰ <strong>Dica:</strong> Seja pontual nas entregas</p>
              <p>🎯 <strong>Dica:</strong> Cuide bem da carga durante o transporte</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};