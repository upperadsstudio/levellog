import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  document: string;
  type: UserType;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('levellog_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Convert createdAt string back to Date object
      if (parsedUser.createdAt) {
        parsedUser.createdAt = new Date(parsedUser.createdAt);
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulação de login - em produção seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determinar tipo de usuário baseado no email para demonstração
      let userType: 'embarcador' | 'transportador' | 'transportadora' = 'embarcador';
      let userName = 'João Silva';
      let userPhone = '(11) 99999-9999';
      let userDocument = '123.456.789-00';
      let userRating = 4.8;
      let userTotalRatings = 127;
      
      // Emails específicos para diferentes tipos de usuário
      if (email.includes('transportador') || email.includes('motorista') || email.includes('carlos')) {
        userType = 'transportador';
        userName = 'Carlos Mendes';
        userPhone = '(11) 98888-8888';
        userDocument = '123.456.789-00';
        userRating = 4.9;
        userTotalRatings = 98;
      } else if (email.includes('transportadora') || email.includes('frota') || email.includes('maria')) {
        userType = 'transportadora';
        userName = 'Maria Santos - Transportes Santos';
        userPhone = '(11) 97777-7777';
        userDocument = '12.345.678/0001-90';
        userRating = 4.7;
        userTotalRatings = 156;
      }

      // Mock user data baseado no tipo
      const mockUser: User = {
        id: userType === 'embarcador' ? '1' : userType === 'transportador' ? '2' : '3',
        name: userName,
        email: email,
        phone: userPhone,
        document: userDocument,
        type: userType,
        rating: userRating,
        totalRatings: userTotalRatings,
        profileComplete: true,
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('levellog_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulação de registro - em produção seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        document: userData.document,
        type: userData.type,
        rating: 0,
        totalRatings: 0,
        profileComplete: false,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('levellog_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('levellog_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};