import React, { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  X,
  Search,
  User as UserIcon,
  Star,
  MessageSquare
} from 'lucide-react';

interface NewChatModalProps {
  availableUsers: User[];
  onStartChat: (user: User) => void;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  availableUsers,
  onStartChat,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'embarcador' | 'transportador' | 'transportadora'>('all');

  const filteredUsers = availableUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedUserType === 'all' || user.type === selectedUserType;
    
    return matchesSearch && matchesType;
  });

  const getUserTypeLabel = (type: User['type']) => {
    switch (type) {
      case 'embarcador':
        return 'Embarcador';
      case 'transportador':
        return 'Transportador';
      case 'transportadora':
        return 'Transportadora';
      default:
        return '';
    }
  };

  const getUserTypeColor = (type: User['type']) => {
    switch (type) {
      case 'embarcador':
        return 'info';
      case 'transportador':
        return 'success';
      case 'transportadora':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nova Conversa</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User Type Filter */}
          <div className="flex space-x-2">
            <Button
              variant={selectedUserType === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedUserType('all')}
            >
              Todos
            </Button>
            <Button
              variant={selectedUserType === 'embarcador' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedUserType('embarcador')}
            >
              Embarcadores
            </Button>
            <Button
              variant={selectedUserType === 'transportador' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedUserType('transportador')}
            >
              Transportadores
            </Button>
            <Button
              variant={selectedUserType === 'transportadora' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedUserType('transportadora')}
            >
              Transportadoras
            </Button>
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou buscar por outro termo
                </p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onStartChat(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <Badge variant={getUserTypeColor(user.type)} size="sm">
                            {getUserTypeLabel(user.type)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{user.email}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{user.rating.toFixed(1)}</span>
                            <span>({user.totalRatings})</span>
                          </div>
                        </div>
                        
                        {(user as any).companyName && (
                          <p className="text-sm text-gray-500 mt-1">
                            {(user as any).companyName}
                          </p>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Conversar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};