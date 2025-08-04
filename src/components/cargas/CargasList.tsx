import React, { useState } from 'react';
import { Carga } from '../../types';
import { CargaCard } from './CargaCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { Search, Filter, MapPin, Truck, Calendar } from 'lucide-react';

interface CargasListProps {
  cargas: Carga[];
  onViewDetails: (carga: Carga) => void;
  onMakeProposal?: (carga: Carga) => void;
  title?: string;
  showFilters?: boolean;
}

export const CargasList: React.FC<CargasListProps> = ({
  cargas,
  onViewDetails,
  onMakeProposal,
  title = 'Cargas Disponíveis',
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    vehicleType: '',
    minValue: '',
    maxValue: '',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredCargas = cargas.filter(carga => {
    const matchesSearch = carga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.destination.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrigin = !filters.origin || 
                         carga.origin.city.toLowerCase().includes(filters.origin.toLowerCase());
    
    const matchesDestination = !filters.destination || 
                              carga.destination.city.toLowerCase().includes(filters.destination.toLowerCase());
    
    const matchesVehicleType = !filters.vehicleType || 
                              carga.vehicleType.toLowerCase().includes(filters.vehicleType.toLowerCase());
    
    const matchesMinValue = !filters.minValue || carga.value >= parseFloat(filters.minValue);
    const matchesMaxValue = !filters.maxValue || carga.value <= parseFloat(filters.maxValue);

    return matchesSearch && matchesOrigin && matchesDestination && 
           matchesVehicleType && matchesMinValue && matchesMaxValue;
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      vehicleType: '',
      minValue: '',
      maxValue: '',
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">
          {filteredCargas.length} {filteredCargas.length === 1 ? 'carga' : 'cargas'}
        </span>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cargas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros avançados
                </Button>
                {(filters.origin || filters.destination || filters.vehicleType || filters.minValue || filters.maxValue) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>

              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cidade de origem"
                      value={filters.origin}
                      onChange={(e) => handleFilterChange('origin', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cidade de destino"
                      value={filters.destination}
                      onChange={(e) => handleFilterChange('destination', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tipo de veículo"
                      value={filters.vehicleType}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Input
                    placeholder="Valor mínimo"
                    type="number"
                    value={filters.minValue}
                    onChange={(e) => handleFilterChange('minValue', e.target.value)}
                  />
                  <Input
                    placeholder="Valor máximo"
                    type="number"
                    value={filters.maxValue}
                    onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCargas.map(carga => (
          <CargaCard
            key={carga.id}
            carga={carga}
            onViewDetails={onViewDetails}
            onMakeProposal={onMakeProposal}
          />
        ))}
      </div>

      {filteredCargas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma carga encontrada
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou realizar uma nova busca
          </p>
        </div>
      )}
    </div>
  );
};