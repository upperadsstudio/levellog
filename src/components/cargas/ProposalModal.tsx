import React, { useState } from 'react';
import { Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  X,
  DollarSign,
  MessageSquare,
  Truck,
  Send
} from 'lucide-react';

interface ProposalModalProps {
  carga: Carga;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  carga,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState({
    value: carga.value.toString(),
    message: '',
    estimatedDelivery: '',
    vehicleInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      value: parseFloat(formData.value),
      cargaId: carga.id
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fazer Proposta</h2>
              <p className="text-gray-600">{carga.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cargo Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Resumo da Carga</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Origem:</span>
                  <p className="font-medium">{carga.origin.city}, {carga.origin.state}</p>
                </div>
                <div>
                  <span className="text-gray-600">Destino:</span>
                  <p className="font-medium">{carga.destination.city}, {carga.destination.state}</p>
                </div>
                <div>
                  <span className="text-gray-600">Peso:</span>
                  <p className="font-medium">{carga.weight.toLocaleString()} kg</p>
                </div>
                <div>
                  <span className="text-gray-600">Valor sugerido:</span>
                  <p className="font-medium text-green-600">{formatCurrency(carga.value)}</p>
                </div>
              </div>
            </div>

            {/* Proposal Form */}
            <div className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                <Input
                  label="Seu Valor (R$)"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2500.00"
                  value={formData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  className="pl-10"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valor original: {formatCurrency(carga.value)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem para o Embarcador
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={4}
                  placeholder="Apresente-se, destaque sua experiência e explique por que você é a melhor opção para este frete..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Previsão de Entrega"
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informações do Veículo
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.vehicleInfo}
                    onChange={(e) => handleChange('vehicleInfo', e.target.value)}
                  >
                    <option value="">Selecione seu veículo</option>
                    <option value="Mercedes Atego 1719 - Baú refrigerado">Mercedes Atego 1719 - Baú refrigerado</option>
                    <option value="Volvo FH 440 - Carreta baú">Volvo FH 440 - Carreta baú</option>
                    <option value="Scania R450 - Prancha">Scania R450 - Prancha</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Dicas para uma boa proposta:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Seja claro sobre sua experiência com este tipo de carga</li>
                  <li>• Mencione diferenciais como rastreamento, seguro, pontualidade</li>
                  <li>• Seja realista com prazos e valores</li>
                  <li>• Demonstre profissionalismo na comunicação</li>
                </ul>
              </div>
            </div>

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
                disabled={!formData.value || !formData.message}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Proposta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};