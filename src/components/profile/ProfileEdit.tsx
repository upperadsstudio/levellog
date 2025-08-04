import React, { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  ArrowLeft,
  Save,
  Upload,
  User as UserIcon,
  Mail,
  Phone,
  FileText,
  Building,
  MapPin,
  Truck,
  Plus,
  X
} from 'lucide-react';

interface ProfileEditProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ 
  user, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    document: user.document,
    companyName: (user as any).companyName || '',
    address: {
      street: (user as any).address?.street || '',
      city: (user as any).address?.city || '',
      state: (user as any).address?.state || '',
      zipCode: (user as any).address?.zipCode || ''
    },
    license: (user as any).license || '',
    experience: (user as any).experience || '',
    specialties: (user as any).specialties || [],
    vehicles: (user as any).vehicles || []
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    capacity: '',
    plate: '',
    type: 'truck',
    features: []
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);

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
    onSave(formData);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addVehicle = () => {
    if (newVehicle.brand && newVehicle.model && newVehicle.plate) {
      setFormData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, {
          ...newVehicle,
          id: Math.random().toString(36).substr(2, 9),
          year: parseInt(newVehicle.year),
          capacity: parseInt(newVehicle.capacity),
          features: []
        }]
      }));
      setNewVehicle({
        brand: '',
        model: '',
        year: '',
        capacity: '',
        plate: '',
        type: 'truck',
        features: []
      });
      setShowVehicleForm(false);
    }
  };

  const removeVehicle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Informações Básicas
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG até 2MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <Input
                label="Telefone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
              <Input
                label="CPF/CNPJ"
                value={formData.document}
                onChange={(e) => handleChange('document', e.target.value)}
                required
              />
            </div>

            {(user.type === 'embarcador' || user.type === 'transportadora') && (
              <Input
                label="Nome da Empresa"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Address (for Embarcador) */}
        {user.type === 'embarcador' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Endereço"
                    value={formData.address.street}
                    onChange={(e) => handleChange('address.street', e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <Input
                  label="Cidade"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                />
                <Input
                  label="Estado"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  placeholder="UF"
                />
                <Input
                  label="CEP"
                  value={formData.address.zipCode}
                  onChange={(e) => handleChange('address.zipCode', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transportador Information */}
        {user.type === 'transportador' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Informações do Transportador
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="CNH"
                  value={formData.license}
                  onChange={(e) => handleChange('license', e.target.value)}
                  placeholder="Número da CNH"
                />
                <Input
                  label="Anos de Experiência"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="Ex: 5"
                />
              </div>

              {/* Vehicles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Veículos</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVehicleForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Veículo
                  </Button>
                </div>

                {formData.vehicles.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {formData.vehicles.map((vehicle: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">
                              {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </h5>
                            <p className="text-sm text-gray-600">
                              {vehicle.plate} • {vehicle.capacity?.toLocaleString()} kg
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVehicle(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showVehicleForm && (
                  <Card className="border-blue-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Novo Veículo</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVehicleForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Marca"
                          value={newVehicle.brand}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="Ex: Mercedes"
                        />
                        <Input
                          label="Modelo"
                          value={newVehicle.model}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                          placeholder="Ex: Atego 1719"
                        />
                        <Input
                          label="Ano"
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="Ex: 2020"
                        />
                        <Input
                          label="Capacidade (kg)"
                          type="number"
                          value={newVehicle.capacity}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, capacity: e.target.value }))}
                          placeholder="Ex: 8000"
                        />
                        <Input
                          label="Placa"
                          value={newVehicle.plate}
                          onChange={(e) => setNewVehicle(prev => ({ ...prev, plate: e.target.value }))}
                          placeholder="ABC-1234"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newVehicle.type}
                            onChange={(e) => setNewVehicle(prev => ({ ...prev, type: e.target.value }))}
                          >
                            <option value="truck">Caminhão</option>
                            <option value="van">Van</option>
                            <option value="carreta">Carreta</option>
                            <option value="bitrem">Bitrem</option>
                            <option value="outros">Outros</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowVehicleForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="button" onClick={addVehicle}>
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Specialties (for Embarcador) */}
        {user.type === 'embarcador' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Especialidades
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ex: Alimentos, Produtos Químicos"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" onClick={addSpecialty}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((specialty: string, index: number) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{specialty}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialty(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
};