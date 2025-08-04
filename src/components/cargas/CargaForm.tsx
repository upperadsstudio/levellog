import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MapPin, 
  Package, 
  Weight, 
  Truck, 
  DollarSign, 
  Calendar,
  FileText,
  ArrowLeft,
  Save
} from 'lucide-react';

interface CargaFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CargaForm: React.FC<CargaFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cargoType: '',
    weight: '',
    value: '',
    deadline: '',
    vehicleType: '',
    origin: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    destination: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    specialRequirements: '',
    contactInfo: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cargaData = {
      ...formData,
      weight: parseFloat(formData.weight),
      value: parseFloat(formData.value),
      deadline: new Date(formData.deadline),
      origin: {
        ...formData.origin,
        coordinates: { lat: -23.5505, lng: -46.6333 } // Mock coordinates
      },
      destination: {
        ...formData.destination,
        coordinates: { lat: -22.9068, lng: -43.1729 } // Mock coordinates
      }
    };

    onSubmit(cargaData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.cargoType;
      case 2:
        return formData.origin.city && formData.origin.state && 
               formData.destination.city && formData.destination.state;
      case 3:
        return formData.weight && formData.vehicleType && formData.value;
      case 4:
        return formData.deadline;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Informações da Carga</h3>
              <p className="text-gray-600">Descreva sua carga detalhadamente</p>
            </div>

            <div className="space-y-4">
              <Input
                label="Título da Carga"
                placeholder="Ex: Transporte de Alimentos Perecíveis"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={4}
                  placeholder="Descreva sua carga, incluindo características especiais, cuidados necessários, etc."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Carga
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cargoType}
                  onChange={(e) => handleChange('cargoType', e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo de carga</option>
                  <option value="Alimentos Perecíveis">Alimentos Perecíveis</option>
                  <option value="Alimentos Secos">Alimentos Secos</option>
                  <option value="Produtos Químicos">Produtos Químicos</option>
                  <option value="Produtos Têxteis">Produtos Têxteis</option>
                  <option value="Móveis e Eletrodomésticos">Móveis e Eletrodomésticos</option>
                  <option value="Materiais de Construção">Materiais de Construção</option>
                  <option value="Produtos Farmacêuticos">Produtos Farmacêuticos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Origem e Destino</h3>
              <p className="text-gray-600">Defina os pontos de coleta e entrega</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  Origem (Coleta)
                </h4>
                <Input
                  label="Endereço"
                  placeholder="Rua, número"
                  value={formData.origin.street}
                  onChange={(e) => handleChange('origin.street', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Cidade"
                    placeholder="Cidade"
                    value={formData.origin.city}
                    onChange={(e) => handleChange('origin.city', e.target.value)}
                    required
                  />
                  <Input
                    label="Estado"
                    placeholder="UF"
                    value={formData.origin.state}
                    onChange={(e) => handleChange('origin.state', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={formData.origin.zipCode}
                  onChange={(e) => handleChange('origin.zipCode', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-600" />
                  Destino (Entrega)
                </h4>
                <Input
                  label="Endereço"
                  placeholder="Rua, número"
                  value={formData.destination.street}
                  onChange={(e) => handleChange('destination.street', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Cidade"
                    placeholder="Cidade"
                    value={formData.destination.city}
                    onChange={(e) => handleChange('destination.city', e.target.value)}
                    required
                  />
                  <Input
                    label="Estado"
                    placeholder="UF"
                    value={formData.destination.state}
                    onChange={(e) => handleChange('destination.state', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  value={formData.destination.zipCode}
                  onChange={(e) => handleChange('destination.zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h3>
              <p className="text-gray-600">Defina peso, veículo e valor</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <Weight className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Peso Total (kg)"
                    type="number"
                    placeholder="Ex: 5000"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <DollarSign className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Valor Oferecido (R$)"
                    type="number"
                    placeholder="Ex: 2500"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Veículo Necessário
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.vehicleType}
                    onChange={(e) => handleChange('vehicleType', e.target.value)}
                    required
                  >
                    <option value="">Selecione o tipo de veículo</option>
                    <option value="Baú comum">Baú comum</option>
                    <option value="Baú refrigerado">Baú refrigerado</option>
                    <option value="Carreta baú">Carreta baú</option>
                    <option value="Carreta sider">Carreta sider</option>
                    <option value="Prancha">Prancha</option>
                    <option value="Graneleiro">Graneleiro</option>
                    <option value="Tanque">Tanque</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos Especiais
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows={3}
                    placeholder="Ex: Rastreamento GPS, seguro total, motorista experiente..."
                    value={formData.specialRequirements}
                    onChange={(e) => handleChange('specialRequirements', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Prazo e Contato</h3>
              <p className="text-gray-600">Finalize sua publicação</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                <Input
                  label="Prazo de Entrega"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="pl-10"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informações de Contato Adicionais
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={3}
                  placeholder="Horários de coleta, pessoa de contato, observações especiais..."
                  value={formData.contactInfo}
                  onChange={(e) => handleChange('contactInfo', e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Resumo da Carga</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Título:</strong> {formData.title}</p>
                  <p><strong>Tipo:</strong> {formData.cargoType}</p>
                  <p><strong>Rota:</strong> {formData.origin.city}/{formData.origin.state} → {formData.destination.city}/{formData.destination.state}</p>
                  <p><strong>Peso:</strong> {formData.weight} kg</p>
                  <p><strong>Veículo:</strong> {formData.vehicleType}</p>
                  <p><strong>Valor:</strong> R$ {formData.value}</p>
                  <p><strong>Prazo:</strong> {formData.deadline}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Publicar Nova Carga</h1>
            <p className="text-gray-600">Passo {currentStep} de {totalSteps}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Publicar Carga
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};