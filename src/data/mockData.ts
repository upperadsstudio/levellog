import { Carga, Embarcador, Transportador, Vehicle, Proposal } from '../types';

export const mockEmbarcador: Embarcador = {
  id: '1',
  name: 'João Silva',
  email: 'joao@empresa.com',
  phone: '(11) 99999-9999',
  document: '12.345.678/0001-90',
  type: 'embarcador',
  rating: 4.8,
  totalRatings: 127,
  profileComplete: true,
  createdAt: new Date(),
  companyName: 'Distribuidora Silva & Cia',
  address: {
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    coordinates: { lat: -23.5505, lng: -46.6333 }
  },
  specialties: ['Alimentos', 'Bebidas', 'Produtos Químicos']
};

export const mockTransportador: Transportador = {
  id: '2',
  name: 'Carlos Mendes',
  email: 'carlos@email.com',
  phone: '(11) 98888-8888',
  document: '123.456.789-00',
  type: 'transportador',
  rating: 4.9,
  totalRatings: 98,
  profileComplete: true,
  createdAt: new Date(),
  vehicles: [
    {
      id: '1',
      type: 'truck',
      brand: 'Mercedes',
      model: 'Atego 1719',
      year: 2020,
      capacity: 8000,
      plate: 'ABC-1234',
      features: ['Baú refrigerado', 'Rastreamento GPS', 'Seguro total']
    }
  ],
  license: 'CNH-12345678',
  experience: 8,
  availability: 'disponivel'
};

export const mockTransportador2: Transportador = {
  id: '3',
  name: 'Maria Santos',
  email: 'maria@transportes.com',
  phone: '(11) 97777-7777',
  document: '987.654.321-00',
  type: 'transportador',
  rating: 4.7,
  totalRatings: 156,
  profileComplete: true,
  createdAt: new Date(),
  vehicles: [
    {
      id: '2',
      type: 'truck',
      brand: 'Volvo',
      model: 'FH 440',
      year: 2019,
      capacity: 12000,
      plate: 'DEF-5678',
      features: ['Carreta baú', 'Rastreamento GPS', 'Seguro total']
    }
  ],
  license: 'CNH-87654321',
  experience: 12,
  availability: 'disponivel'
};

export const mockTransportador3: Transportador = {
  id: '4',
  name: 'Pedro Costa',
  email: 'pedro@fretes.com',
  phone: '(11) 96666-6666',
  document: '456.789.123-00',
  type: 'transportador',
  rating: 4.6,
  totalRatings: 89,
  profileComplete: true,
  createdAt: new Date(),
  vehicles: [
    {
      id: '3',
      type: 'truck',
      brand: 'Scania',
      model: 'R450',
      year: 2021,
      capacity: 15000,
      plate: 'GHI-9012',
      features: ['Prancha', 'Rastreamento GPS', 'Seguro total']
    }
  ],
  license: 'CNH-45678912',
  experience: 6,
  availability: 'disponivel'
};

const mockProposals: Proposal[] = [
  {
    id: 'prop1',
    cargaId: '1',
    transportadorId: '2',
    transportador: mockTransportador,
    value: 2300,
    message: 'Tenho experiência com transporte refrigerado e posso garantir a qualidade dos produtos. Meu veículo possui sistema de monitoramento de temperatura 24h.',
    status: 'pendente',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    vehicle: mockTransportador.vehicles[0],
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 dias
  },
  {
    id: 'prop2',
    cargaId: '1',
    transportadorId: '3',
    transportador: mockTransportador2,
    value: 2600,
    message: 'Sou especialista em rotas São Paulo - Rio de Janeiro. Faço essa rota semanalmente e tenho ótimas referências. Posso oferecer seguro adicional.',
    status: 'pendente',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    vehicle: mockTransportador2.vehicles[0],
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 dias
  },
  {
    id: 'prop3',
    cargaId: '1',
    transportadorId: '4',
    transportador: mockTransportador3,
    value: 2800,
    message: 'Ofereço o melhor custo-benefício da região. Veículo novo, motorista experiente e entrega garantida no prazo. Aceito negociação.',
    status: 'pendente',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    vehicle: mockTransportador3.vehicles[0],
    estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 dias
  },
  {
    id: 'prop4',
    cargaId: '2',
    transportadorId: '3',
    transportador: mockTransportador2,
    value: 1650,
    message: 'Especializado em produtos têxteis. Tenho carreta baú adequada para este tipo de carga e experiência na rota Americana - BH.',
    status: 'aceita',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    vehicle: mockTransportador2.vehicles[0],
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
  },
  {
    id: 'prop5',
    cargaId: '3',
    transportadorId: '2',
    transportador: mockTransportador,
    value: 3400,
    message: 'Tenho experiência com mudanças e transporte de móveis. Ofereço embalagem especializada e cuidado extra com itens frágeis.',
    status: 'contraroposta',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
    vehicle: mockTransportador.vehicles[0],
    estimatedDelivery: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) // 8 dias
  }
];

export const mockCargas: Carga[] = [
  {
    id: '1',
    embarcadorId: '1',
    embarcador: mockEmbarcador,
    title: 'Transporte de Alimentos Perecíveis',
    description: 'Transporte de frutas e verduras frescas, necessário refrigeração',
    origin: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      coordinates: { lat: -23.5505, lng: -46.6333 }
    },
    destination: {
      street: 'Rua das Palmeiras, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-020',
      coordinates: { lat: -22.9068, lng: -43.1729 }
    },
    cargoType: 'Alimentos Perecíveis',
    weight: 5000,
    vehicleType: 'Baú refrigerado',
    value: 2500,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    status: 'disponivel',
    createdAt: new Date(),
    proposals: mockProposals.filter(p => p.cargaId === '1'),
    distance: 430,
    estimatedTime: 6
  },
  {
    id: '2',
    embarcadorId: '1',
    embarcador: mockEmbarcador,
    title: 'Carga Seca - Produtos Têxteis',
    description: 'Transporte de roupas e tecidos, carga seca paletizada',
    origin: {
      street: 'Rua da Indústria, 200',
      city: 'Americana',
      state: 'SP',
      zipCode: '13460-000',
      coordinates: { lat: -22.7389, lng: -47.3311 }
    },
    destination: {
      street: 'Av. Central, 1500',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30112-000',
      coordinates: { lat: -19.9167, lng: -43.9345 }
    },
    cargoType: 'Produtos Têxteis',
    weight: 12000,
    vehicleType: 'Carreta baú',
    value: 1800,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
    status: 'contratada',
    createdAt: new Date(),
    proposals: mockProposals.filter(p => p.cargaId === '2'),
    distance: 340,
    estimatedTime: 5
  },
  {
    id: '3',
    embarcadorId: '1',
    embarcador: mockEmbarcador,
    title: 'Mudança Residencial',
    description: 'Transporte de móveis e eletrodomésticos, cuidado especial necessário',
    origin: {
      street: 'Rua dos Jardins, 450',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80020-010',
      coordinates: { lat: -25.4284, lng: -49.2733 }
    },
    destination: {
      street: 'Av. Beira Mar, 300',
      city: 'Florianópolis',
      state: 'SC',
      zipCode: '88010-400',
      coordinates: { lat: -27.5954, lng: -48.5480 }
    },
    cargoType: 'Móveis e Eletrodomésticos',
    weight: 8500,
    vehicleType: 'Baú comum',
    value: 3200,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dias
    status: 'negociacao',
    createdAt: new Date(),
    proposals: mockProposals.filter(p => p.cargaId === '3'),
    distance: 300,
    estimatedTime: 4
  }
];