import React, { useState } from 'react';
import { Proposal, Carga } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  X,
  DollarSign,
  MessageSquare,
  Calendar,
  Send,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface CounterOfferModalProps {
  proposal: Proposal;
  carga: Carga;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  proposal,
  carga,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState({
    value: proposal.value.toString(),
    message: '',
    deadline: carga.deadline.toISOString().split('T')[0],
    conditions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      value: parseFloat(formData.value),
      deadline: new Date(formData.deadline),
      originalProposalId: proposal.id
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

  const currentValue = parseFloat(formData.value) || 0;
  const originalValue = proposal.value;
  const difference = currentValue - originalValue;
  const percentageDifference = originalValue > 0 ? (difference / originalValue) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fazer Contraproposta</h2>
              <p className="text-gray-600">Para {proposal.transportador.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Original Proposal Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Proposta Original</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Transportador:</span>
                  <p className="font-medium">{proposal.transportador.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Valor proposto:</span>
                  <p className="font-medium text-green-600">{formatCurrency(proposal.value)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Mensagem:</span>
                  <p className="font-medium">{proposal.message}</p>
                </div>
              </div>
            </div>

            {/* Counter Offer Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Novo Valor (R$)"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 2500.00"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    className="pl-10"
                    required
                  />
                  {difference !== 0 && (
                    <div className="mt-1 flex items-center text-xs">
                      {difference > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={difference > 0 ? 'text-green-600' : 'text-red-600'}>
                        {difference > 0 ? '+' : ''}{formatCurrency(Math.abs(difference))} 
                        ({difference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Novo Prazo"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa da Contraproposta
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={4}
                  placeholder="Explique os motivos da sua contraproposta, como urgência, complexidade da carga, distância, etc..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condições Especiais (opcional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={3}
                  placeholder="Ex: Pagamento antecipado, seguro adicional, horários específicos..."
                  value={formData.conditions}
                  onChange={(e) => handleChange('conditions', e.target.value)}
                />
              </div>

              {/* Value Comparison */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Comparação de Valores</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Valor Original</p>
                    <p className="font-bold text-gray-900">{formatCurrency(carga.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Proposta Atual</p>
                    <p className="font-bold text-green-600">{formatCurrency(proposal.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Sua Contraproposta</p>
                    <p className="font-bold text-blue-600">{formatCurrency(currentValue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Dicas para uma boa contraproposta:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Seja justo e realista com o valor proposto</li>
                  <li>• Justifique claramente os motivos da alteração</li>
                  <li>• Considere a urgência e complexidade da carga</li>
                  <li>• Mantenha um tom profissional e respeitoso</li>
                  <li>• Ofereça condições que agreguem valor</li>
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
                Enviar Contraproposta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};