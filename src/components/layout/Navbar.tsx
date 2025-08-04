import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  MessageSquare, 
  Search,
  Truck,
  Package,
  Plus,
  Settings,
  Star,
  DollarSign,
  Bell
} from 'lucide-react';

interface NavbarProps {
  onNavigate?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('dashboard')}>
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Levellog
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {user.type === 'embarcador' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('publish')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Carga
                  </Button>
                )}
                
                {(user.type === 'transportador' || user.type === 'transportadora') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('search')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Cargas
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('proposals')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {user.type === 'embarcador' ? 'Propostas' : 'Minhas Propostas'}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('ratings')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleNavigation('financial')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigation('notifications')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </Button>
                
                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-500 capitalize">{user.type}</p>
                      </div>
                      <button
                        onClick={() => handleNavigation('profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 inline mr-2" />
                        Meu Perfil
                      </button>
                      <button
                        onClick={() => handleNavigation('ratings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Star className="h-4 w-4 inline mr-2" />
                        Minhas Avaliações
                      </button>
                      <button
                        onClick={() => handleNavigation('settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        Configurações
                      </button>
                      <div className="border-t">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
            {user && (
              <>
                <div className="px-3 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 capitalize">{user.type}</p>
                </div>
                
                {user.type === 'embarcador' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('publish')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Carga
                  </Button>
                )}
                
                {(user.type === 'transportador' || user.type === 'transportadora') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('search')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Cargas
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('proposals')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {user.type === 'embarcador' ? 'Propostas' : 'Minhas Propostas'}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('ratings')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('financial')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('profile')}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('settings')}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};