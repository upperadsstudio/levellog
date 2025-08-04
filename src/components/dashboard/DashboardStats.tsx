import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeType: 'increase' | 'decrease' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, changeType }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm ${getChangeColor()}`}>
              {change}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  userType: 'embarcador' | 'transportador' | 'transportadora';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userType }) => {
  const getStatsForUserType = () => {
    switch (userType) {
      case 'embarcador':
        return [
          {
            title: 'Cargas Publicadas',
            value: '12',
            change: '+2 este mês',
            icon: <Package className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          },
          {
            title: 'Propostas Recebidas',
            value: '34',
            change: '+8 esta semana',
            icon: <Users className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          },
          {
            title: 'Fretes Ativos',
            value: '5',
            change: '2 em transporte',
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            changeType: 'neutral' as const
          },
          {
            title: 'Valor Total',
            value: 'R$ 25.600',
            change: '+12% este mês',
            icon: <DollarSign className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          }
        ];
      case 'transportador':
        return [
          {
            title: 'Propostas Enviadas',
            value: '18',
            change: '+5 esta semana',
            icon: <Package className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          },
          {
            title: 'Fretes Confirmados',
            value: '8',
            change: '3 em andamento',
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            changeType: 'neutral' as const
          },
          {
            title: 'Taxa de Aprovação',
            value: '78%',
            change: '+5% este mês',
            icon: <Users className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          },
          {
            title: 'Receita Total',
            value: 'R$ 15.800',
            change: '+18% este mês',
            icon: <DollarSign className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          }
        ];
      case 'transportadora':
        return [
          {
            title: 'Frota Ativa',
            value: '15',
            change: '12 disponíveis',
            icon: <Package className="h-6 w-6 text-blue-600" />,
            changeType: 'neutral' as const
          },
          {
            title: 'Contratos Ativos',
            value: '23',
            change: '+7 este mês',
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          },
          {
            title: 'Motoristas',
            value: '28',
            change: '25 ativos',
            icon: <Users className="h-6 w-6 text-blue-600" />,
            changeType: 'neutral' as const
          },
          {
            title: 'Faturamento',
            value: 'R$ 89.500',
            change: '+23% este mês',
            icon: <DollarSign className="h-6 w-6 text-blue-600" />,
            changeType: 'increase' as const
          }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForUserType();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          changeType={stat.changeType}
        />
      ))}
    </div>
  );
};