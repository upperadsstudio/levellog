// Tipos principais da aplicação
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF ou CNPJ
  type: 'embarcador' | 'transportador' | 'transportadora';
  rating: number;
  totalRatings: number;
  profileComplete: boolean;
  createdAt: Date;
  avatar?: string;
}

export interface Embarcador extends User {
  type: 'embarcador';
  companyName: string;
  address: Address;
  specialties: string[];
}

export interface Transportador extends User {
  type: 'transportador';
  vehicles: Vehicle[];
  license: string;
  experience: number; // years
  availability: 'disponivel' | 'ocupado' | 'inativo';
}

export interface Transportadora extends User {
  type: 'transportadora';
  companyName: string;
  fleet: Vehicle[];
  operatingRegions: string[];
  license: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  id: string;
  type: 'truck' | 'van' | 'carreta' | 'bitrem' | 'outros';
  brand: string;
  model: string;
  year: number;
  capacity: number; // kg
  plate: string;
  features: string[];
}

export interface Carga {
  id: string;
  embarcadorId: string;
  embarcador: Embarcador;
  title: string;
  description: string;
  origin: Address;
  destination: Address;
  cargoType: string;
  weight: number;
  vehicleType: string;
  value: number;
  deadline: Date;
  status: 'disponivel' | 'negociacao' | 'contratada' | 'transporte' | 'entregue' | 'cancelada';
  createdAt: Date;
  proposals: Proposal[];
  distance?: number;
  estimatedTime?: number;
  specialRequirements?: string;
}

export interface Proposal {
  id: string;
  cargaId: string;
  transportadorId: string;
  transportador: Transportador | Transportadora;
  value: number;
  message: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'contraroposta';
  createdAt: Date;
  vehicle?: Vehicle;
  estimatedDelivery?: Date;
}

export interface Chat {
  id: string;
  cargaId?: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: MessageAttachment[];
  type?: 'text' | 'image' | 'file' | 'location';
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  cargaId: string;
  stars: number;
  comment?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'proposal' | 'message' | 'rating' | 'cargo' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface Document {
  id: string;
  userId: string;
  type: 'cpf' | 'cnpj' | 'cnh' | 'crlv' | 'antt' | 'outros';
  name: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: Date;
  verificationDate?: Date;
  rejectionReason?: string;
}

export type UserType = User['type'];