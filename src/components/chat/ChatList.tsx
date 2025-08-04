import React, { useState } from 'react';
import { Chat, User } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  Search,
  MessageSquare,
  User as UserIcon,
  Clock,
  Pin,
  Archive,
  MoreVertical
} from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  currentUser: User;
  selectedChatId?: string;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentUser,
  selectedChatId,
  onSelectChat,
  onNewChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short'
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      }).format(date);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p.id !== currentUser.id);
  };

  const getLastMessage = (chat: Chat) => {
    return chat.messages[chat.messages.length - 1];
  };

  const getUnreadCount = (chat: Chat) => {
    return chat.messages.filter(m => 
      m.senderId !== currentUser.id && !m.read
    ).length;
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    const matchesSearch = otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return matchesSearch && getUnreadCount(chat) > 0;
      case 'archived':
        return matchesSearch && (chat as any).archived;
      default:
        return matchesSearch && !(chat as any).archived;
    }
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    const aLastMessage = getLastMessage(a);
    const bLastMessage = getLastMessage(b);
    
    if (!aLastMessage && !bLastMessage) return 0;
    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;
    
    return bLastMessage.timestamp.getTime() - aLastMessage.timestamp.getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Conversas</h2>
          <Button size="sm" onClick={onNewChat}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Nova
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Não lidas
          </Button>
          <Button
            variant={filter === 'archived' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('archived')}
          >
            Arquivadas
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Tente buscar por outro nome'
                : 'Inicie uma conversa com um transportador ou embarcador'
              }
            </p>
            {!searchTerm && (
              <Button onClick={onNewChat}>
                Iniciar Conversa
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sortedChats.map(chat => {
              const otherParticipant = getOtherParticipant(chat);
              const lastMessage = getLastMessage(chat);
              const unreadCount = getUnreadCount(chat);
              const isSelected = chat.id === selectedChatId;

              return (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectChat(chat)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium truncate ${
                            unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {otherParticipant?.name || 'Usuário'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                            {(chat as any).pinned && (
                              <Pin className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                          }`}>
                            {lastMessage ? (
                              <>
                                {lastMessage.senderId === currentUser.id && 'Você: '}
                                {lastMessage.content}
                              </>
                            ) : (
                              'Nenhuma mensagem'
                            )}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};