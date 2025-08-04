import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { UserType } from '../../types';
import { User, Mail, Lock, Phone, FileText, Building, Truck } from 'lucide-react';

interface RegisterFormProps {
  onToggleForm: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    document: '',
    type: 'embarcador' as UserType,
    companyName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Truck className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Levellog</h1>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 text-center">
          Crie sua conta
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Junte-se à maior plataforma de transporte do Brasil
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="email"
              type="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="phone"
              type="tel"
              placeholder="Seu telefone"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="document"
              type="text"
              placeholder="CPF ou CNPJ"
              value={formData.document}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="embarcador">Embarcador (Tenho cargas)</option>
              <option value="transportador">Transportador (Tenho veículo)</option>
              <option value="transportadora">Transportadora (Tenho frota)</option>
            </select>
          </div>

          {(formData.type === 'embarcador' || formData.type === 'transportadora') && (
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                name="companyName"
                type="text"
                placeholder="Nome da empresa"
                value={formData.companyName}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="password"
              type="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={onToggleForm}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};