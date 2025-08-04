import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Clock, 
  Star,
  Truck,
  MapPin,
  CheckCircle
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeType: 'increase' | 'decrease' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  changeType,
  color = 'blue'
}) => {
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

  const getBackgroundColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50';
      case 'yellow':
        return 'bg-yellow-50';
      case 'purple':
        return 'bg-purple-50';
      default:
        return 'bg-blue-50';
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
          <div className={`p-3 ${getBackgroundColor()} rounded-lg`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TransportadorStats: React.FC = () => {
  const stats = [
    {
      title: 'Propostas Enviadas',
      value: '18',
      change: '+5 esta semana',
      icon: <Package className="h-6 w-6 text-blue-600" />,
      changeType: 'increase' as const,
      color: 'blue'
    },
    {
      title: 'Taxa de Aprovação',
      value: '78%',
      change: '+12% este mês',
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      changeType: 'increase' as const,
      color: 'green'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 15.800',
      change: '+18% este mês',
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
      changeType: 'increase' as const,
      color: 'yellow'
    },
    {
      title: 'Fretes Concluídos',
      value: '47',
      change: '8 este mês',
      icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
      changeType: 'neutral' as const,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Performance Semanal</h3>
              <Badge variant="success">Excelente</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pontualidade</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Qualidade</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Comunicação</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Metas do Mês</h3>
              <Badge variant="warning">Em Progresso</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Fretes Realizados</span>
                  <span className="text-sm font-medium">8/12</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Meta de Receita</span>
                  <span className="text-sm font-medium">R$ 15.800/R$ 20.000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Avaliação Média</span>
                  <span className="text-sm font-medium">4.9/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};