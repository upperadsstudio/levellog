import React, { useState } from 'react';
import { Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Calendar,
  Weight,
  Truck,
  DollarSign,
  Clock,
  Star,
  Package,
  Navigation,
  Send
} from 'lucide-react';

interface CargasDisponiveisProps {
  cargas: Carga[];
  onBack: () => void;
}

export const CargasDisponiveis: React.FC<CargasDisponiveisProps> = ({
  cargas,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    minValue: '',
    maxValue: '',
    vehicleType: '',
    maxDistance: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<Carga | null>(null);

  const filteredCargas = cargas.filter(carga => {
    const matchesSearch = carga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrigin = !filters.origin || 
                         carga.origin.city.toLowerCase().includes(filters.origin.toLowerCase());
    
    const matchesDestination = !filters.destination || 
                              carga.destination.city.toLowerCase().includes(filters.destination.toLowerCase());
    
    const matchesMinValue = !filters.minValue || carga.value >= parseFloat(filters.minValue);
    const matchesMaxValue = !filters.maxValue || carga.value <= parseFloat(filters.maxValue);
    
    const matchesVehicleType = !filters.vehicleType || 
                              carga.vehicleType.toLowerCase().includes(filters.vehicleType.toLowerCase());
    
    const matchesDistance = !filters.maxDistance || 
                           !carga.distance || 
                           carga.distance <= parseFloat(filters.maxDistance);

    return matchesSearch && matchesOrigin && matchesDestination && 
           matchesMinValue && matchesMaxValue && matchesVehicleType && matchesDistance;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const calculateCompatibility = (carga: Carga) => {
    // Simulação de compatibilidade baseada em critérios
    let score = 0;
    
    // Distância (preferência por rotas mais próximas)
    if (carga.distance && carga.distance <= 300) score += 30;
    else if (carga.distance && carga.distance <= 600) score += 20;
    else score += 10;
    
    // Valor (preferência por valores mais altos)
    if (carga.value >= 3000) score += 30;
    else if (carga.value >= 2000) score += 20;
    else score += 10;
    
    // Prazo (preferência por prazos mais flexíveis)
    const daysUntilDeadline = Math.ceil((carga.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDeadline >= 7) score += 25;
    else if (daysUntilDeadline >= 3) score += 15;
    else score += 5;
    
    // Rating do embarcador
    if (carga.embarcador.rating >= 4.5) score += 15;
    else if (carga.embarcador.rating >= 4.0) score += 10;
    else score += 5;
    
    return Math.min(score, 100);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'default';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Alta Compatibilidade';
    if (score >= 60) return 'Média Compatibilidade';
    return 'Baixa Compatibilidade';
  };

  const handleMakeProposal = (carga: Carga) => {
    setSelectedCarga(carga);
  };

  const sortedCargas = filteredCargas.sort((a, b) => {
    return calculateCompatibility(b) - calculateCompatibility(a);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cargas Disponíveis</h1>
            <p className="text-gray-600">Encontre as melhores oportunidades para seu veículo</p>
          </div>
        </div>
        <Badge variant="info">
          {sortedCargas.length} cargas encontradas
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, origem ou destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <Input
                  placeholder="Cidade de origem"
                  value={filters.origin}
                  onChange={(e) => setFilters(prev => ({ ...prev, origin: e.target.value }))}
                />
                <Input
                  placeholder="Cidade de destino"
                  value={filters.destination}
                  onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                />
                <Input
                  placeholder="Tipo de veículo"
                  value={filters.vehicleType}
                  onChange={(e) => setFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                />
                <Input
                  placeholder="Valor mínimo"
                  type="number"
                  value={filters.minValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
                />
                <Input
                  placeholder="Valor máximo"
                  type="number"
                  value={filters.maxValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
                />
                <Input
                  placeholder="Distância máxima (km)"
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: e.target.value }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cargas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCargas.map((carga) => {
          const compatibility = calculateCompatibility(carga);
          const daysUntilDeadline = Math.ceil((carga.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={carga.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {carga.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{carga.embarcador.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({carga.embarcador.totalRatings} avaliações)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getCompatibilityColor(compatibility)} size="sm">
                      {compatibility}% compatível
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {carga.description}
                </p>

                {/* Route */}
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{carga.origin.city}</span>
                  <Navigation className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{carga.destination.city}</span>
                  {carga.distance && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{carga.distance} km</span>
                    </>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Weight className="h-4 w-4 mr-2" />
                    <span>{carga.weight.toLocaleString()} kg</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>{carga.vehicleType}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{daysUntilDeadline} dias</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2" />
                    <span>{carga.cargoType}</span>
                  </div>
                </div>

                {/* Value and Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-lg font-bold text-green-600">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {formatCurrency(carga.value)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMakeProposal(carga)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Proposta
                    </Button>
                  </div>
                </div>

                {/* Compatibility Details */}
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>{getCompatibilityLabel(compatibility)}:</strong> 
                  {compatibility >= 80 && " Excelente oportunidade para seu perfil!"}
                  {compatibility >= 60 && compatibility < 80 && " Boa opção considerando distância e valor."}
                  {compatibility < 60 && " Considere outros fatores antes de propor."}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedCargas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma carga encontrada
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou aguarde novas cargas serem publicadas
          </p>
        </div>
      )}

      {/* Proposal Modal */}
      {selectedCarga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Fazer Proposta</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCarga(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedCarga.title}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedCarga.origin.city} → {selectedCarga.destination.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    Valor sugerido: {formatCurrency(selectedCarga.value)}
                  </p>
                </div>
                
                <Input
                  label="Seu Valor (R$)"
                  type="number"
                  placeholder={selectedCarga.value.toString()}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem para o Embarcador
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Apresente-se e destaque sua experiência..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCarga(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Proposta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};