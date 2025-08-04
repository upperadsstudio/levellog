import { useState, useEffect } from 'react';

interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
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

interface RatingStats {
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
}

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

export const useRatings = (userId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, [userId]);

  const loadRatings = async () => {
    setLoading(true);
    
    // Simular carregamento de dados
    setTimeout(() => {
      const mockRatings: Rating[] = [
        {
          id: '1',
          fromUserId: '2',
          toUserId: userId,
          fromUser: {
            id: '2',
            name: 'Carlos Mendes',
            type: 'transportador',
          },
          cargaId: '1',
          cargaTitle: 'Transporte de Alimentos Perecíveis',
          overallRating: 5,
          categories: {
            communication: 5,
            punctuality: 5,
            quality: 5,
            professionalism: 5
          },
          comment: 'Excelente embarcador! Muito organizado, pagamento em dia e comunicação clara. A carga estava muito bem embalada e o local de coleta era de fácil acesso. Recomendo!',
          wouldRecommend: true,
          tags: ['Pagamento em dia', 'Comunicativo', 'Organizado', 'Profissional', 'Recomendo'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          helpful: 3
        },
        {
          id: '2',
          fromUserId: '3',
          toUserId: userId,
          fromUser: {
            id: '3',
            name: 'Maria Santos',
            type: 'transportador',
          },
          cargaId: '2',
          cargaTitle: 'Carga Seca - Produtos Têxteis',
          overallRating: 4,
          categories: {
            communication: 4,
            punctuality: 5,
            quality: 4,
            professionalism: 4
          },
          comment: 'Bom embarcador, sempre pontual nos horários combinados. Poderia melhorar um pouco na comunicação durante o transporte, mas no geral foi uma boa experiência.',
          wouldRecommend: true,
          tags: ['Pontual', 'Respeitoso', 'Carga bem embalada'],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          helpful: 1
        },
        {
          id: '3',
          fromUserId: '4',
          toUserId: userId,
          fromUser: {
            id: '4',
            name: 'Pedro Costa',
            type: 'transportador',
          },
          cargaId: '3',
          cargaTitle: 'Mudança Residencial',
          overallRating: 5,
          categories: {
            communication: 5,
            punctuality: 4,
            quality: 5,
            professionalism: 5
          },
          comment: 'Embarcador muito profissional e atencioso. Deu todas as instruções necessárias e foi muito flexível com os horários. Pagamento foi feito conforme combinado.',
          wouldRecommend: true,
          tags: ['Flexível', 'Claro nas instruções', 'Profissional', 'Pagamento em dia'],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          helpful: 2
        }
      ];

      setRatings(mockRatings);
      setStats(calculateStats(mockRatings));
      loadBadges(mockRatings);
      setLoading(false);
    }, 1000);
  };

  const calculateStats = (ratings: Rating[]): RatingStats => {
    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: { communication: 0, punctuality: 0, quality: 0, professionalism: 0 },
        recommendationRate: 0,
        topTags: [],
        recentTrend: 'stable'
      };
    }

    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, r) => sum + r.overallRating, 0) / totalRatings;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
      ratingDistribution[r.overallRating as keyof typeof ratingDistribution]++;
    });

    const categoryAverages = {
      communication: ratings.reduce((sum, r) => sum + r.categories.communication, 0) / totalRatings,
      punctuality: ratings.reduce((sum, r) => sum + r.categories.punctuality, 0) / totalRatings,
      quality: ratings.reduce((sum, r) => sum + r.categories.quality, 0) / totalRatings,
      professionalism: ratings.reduce((sum, r) => sum + r.categories.professionalism, 0) / totalRatings,
    };

    const recommendationRate = (ratings.filter(r => r.wouldRecommend).length / totalRatings) * 100;

    const tagCounts: { [key: string]: number } = {};
    ratings.forEach(r => {
      r.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Simular tendência baseada nas últimas avaliações
    const recentRatings = ratings.slice(-5);
    const recentAverage = recentRatings.reduce((sum, r) => sum + r.overallRating, 0) / recentRatings.length;
    const recentTrend = recentAverage > averageRating ? 'up' : recentAverage < averageRating ? 'down' : 'stable';

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
      categoryAverages,
      recommendationRate,
      topTags,
      recentTrend
    };
  };

  const loadBadges = (ratings: Rating[]) => {
    const stats = calculateStats(ratings);
    
    // Badges conquistadas baseadas nas estatísticas
    const earned: UserBadge[] = [];
    const available: UserBadge[] = [];

    // Badge de primeira avaliação
    if (stats.totalRatings >= 1) {
      earned.push({
        id: 'first-rating',
        name: 'Primeira Impressão',
        description: 'Recebeu sua primeira avaliação',
        icon: '⭐',
        color: 'bg-blue-100',
        rarity: 'common',
        earnedAt: ratings[0]?.createdAt,
        requirements: 'Receber 1 avaliação'
      });
    } else {
      available.push({
        id: 'first-rating',
        name: 'Primeira Impressão',
        description: 'Receba sua primeira avaliação',
        icon: '⭐',
        color: 'bg-blue-100',
        rarity: 'common',
        progress: { current: 0, required: 1 },
        requirements: 'Receber 1 avaliação'
      });
    }

    // Badge de 5 estrelas
    if (stats.averageRating >= 4.8 && stats.totalRatings >= 5) {
      earned.push({
        id: 'five-star',
        name: 'Estrela de Ouro',
        description: 'Mantém avaliação média acima de 4.8',
        icon: '🌟',
        color: 'bg-yellow-100',
        rarity: 'rare',
        earnedAt: new Date(),
        requirements: 'Manter média ≥ 4.8 com pelo menos 5 avaliações'
      });
    } else {
      available.push({
        id: 'five-star',
        name: 'Estrela de Ouro',
        description: 'Mantenha avaliação média acima de 4.8',
        icon: '🌟',
        color: 'bg-yellow-100',
        rarity: 'rare',
        progress: { 
          current: Math.min(stats.totalRatings, 5), 
          required: 5 
        },
        requirements: 'Manter média ≥ 4.8 com pelo menos 5 avaliações'
      });
    }

    // Badge de confiabilidade
    if (stats.recommendationRate >= 90 && stats.totalRatings >= 10) {
      earned.push({
        id: 'trusted',
        name: 'Parceiro Confiável',
        description: '90% dos clientes recomendam seus serviços',
        icon: '🛡️',
        color: 'bg-green-100',
        rarity: 'epic',
        earnedAt: new Date(),
        requirements: '90% de recomendação com 10+ avaliações'
      });
    } else {
      available.push({
        id: 'trusted',
        name: 'Parceiro Confiável',
        description: 'Alcance 90% de recomendação',
        icon: '🛡️',
        color: 'bg-green-100',
        rarity: 'epic',
        progress: { 
          current: Math.min(stats.totalRatings, 10), 
          required: 10 
        },
        requirements: '90% de recomendação com 10+ avaliações'
      });
    }

    // Badge de veterano
    if (stats.totalRatings >= 50) {
      earned.push({
        id: 'veteran',
        name: 'Veterano da Plataforma',
        description: 'Acumulou mais de 50 avaliações',
        icon: '👑',
        color: 'bg-purple-100',
        rarity: 'legendary',
        earnedAt: new Date(),
        requirements: 'Receber 50+ avaliações'
      });
    } else {
      available.push({
        id: 'veteran',
        name: 'Veterano da Plataforma',
        description: 'Acumule 50 avaliações',
        icon: '👑',
        color: 'bg-purple-100',
        rarity: 'legendary',
        progress: { 
          current: stats.totalRatings, 
          required: 50 
        },
        requirements: 'Receber 50+ avaliações'
      });
    }

    setEarnedBadges(earned);
    setAvailableBadges(available);
  };

  const submitRating = async (ratingData: any) => {
    // Simular envio de avaliação
    const newRating: Rating = {
      id: Math.random().toString(36).substr(2, 9),
      fromUserId: ratingData.fromUserId || 'current-user',
      toUserId: ratingData.targetUserId,
      fromUser: {
        id: ratingData.fromUserId || 'current-user',
        name: 'Usuário Atual',
        type: 'embarcador'
      },
      cargaId: ratingData.cargaId,
      cargaTitle: ratingData.cargaTitle || 'Carga',
      overallRating: ratingData.overallRating,
      categories: ratingData.categories,
      comment: ratingData.comment,
      wouldRecommend: ratingData.wouldRecommend,
      tags: ratingData.tags,
      createdAt: new Date(),
      helpful: 0
    };

    setRatings(prev => [newRating, ...prev]);
    
    // Recalcular estatísticas
    const updatedRatings = [newRating, ...ratings];
    setStats(calculateStats(updatedRatings));
    loadBadges(updatedRatings);
  };

  const markAsHelpful = async (ratingId: string) => {
    setRatings(prev => prev.map(rating => 
      rating.id === ratingId 
        ? { ...rating, helpful: (rating.helpful || 0) + 1 }
        : rating
    ));
  };

  const getRatingsForUser = (targetUserId: string) => {
    return ratings.filter(r => r.toUserId === targetUserId);
  };

  const getRatingsByUser = (fromUserId: string) => {
    return ratings.filter(r => r.fromUserId === fromUserId);
  };

  return {
    ratings,
    stats,
    earnedBadges,
    availableBadges,
    loading,
    submitRating,
    markAsHelpful,
    getRatingsForUser,
    getRatingsByUser,
    refreshRatings: loadRatings
  };
};