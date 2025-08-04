import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import { ChatList } from '../components/chat/ChatList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { NewChatModal } from '../components/chat/NewChatModal';
import { ChatNotifications } from '../components/chat/ChatNotifications';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft,
  MessageSquare,
  Users,
  Bell
} from 'lucide-react';
import { Chat, User } from '../types';

interface ChatPageProps {
  onBack: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { 
    chats, 
    loading, 
    sendMessage, 
    markMessagesAsRead, 
    createChat,
    getUnreadCount 
  } = useChat(user!.id);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');

  // Mock available users for new chat
  const availableUsers: User[] = [
    {
      id: '4',
      name: 'Pedro Costa',
      email: 'pedro@fretes.com',
      phone: '(11) 96666-6666',
      document: '456.789.123-00',
      type: 'transportador',
      rating: 4.6,
      totalRatings: 89,
      profileComplete: true,
      createdAt: new Date()
    },
    {
      id: '5',
      name: 'Ana Silva',
      email: 'ana@logistica.com',
      phone: '(11) 95555-5555',
      document: '789.123.456-00',
      type: 'transportadora',
      rating: 4.8,
      totalRatings: 234,
      profileComplete: true,
      createdAt: new Date()
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: '1',
      type: 'message' as const,
      title: 'Nova mensagem de Carlos Mendes',
      message: 'Posso garantir temperatura controlada durante todo o transporte.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      userId: '2',
      userName: 'Carlos Mendes'
    },
    {
      id: '2',
      type: 'proposal' as const,
      title: 'Nova proposta recebida',
      message: 'Maria Santos enviou uma proposta para sua carga de produtos têxteis.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      userId: '3',
      userName: 'Maria Santos'
    }
  ];

  if (!user) return null;

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    markMessagesAsRead(chat.id);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (selectedChat) {
      await sendMessage(selectedChat.id, content, attachments);
    }
  };

  const handleNewChat = async (otherUser: User) => {
    const newChat = await createChat(otherUser);
    setSelectedChat(newChat);
    setShowNewChatModal(false);
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    // Implementar funcionalidade de chamada
    console.log(`Iniciando chamada ${type}`);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    // Implementar marcação de notificação como lida
    console.log('Marcar como lida:', notificationId);
  };

  const handleMarkAllNotificationsAsRead = () => {
    // Implementar marcação de todas as notificações como lidas
    console.log('Marcar todas como lidas');
  };

  const handleDismissNotification = (notificationId: string) => {
    // Implementar dismissal de notificação
    console.log('Dispensar notificação:', notificationId);
  };

  const handleNavigateToChat = (userId: string) => {
    const chat = chats.find(c => 
      c.participants.some(p => p.id === userId)
    );
    if (chat) {
      setSelectedChat(chat);
      setActiveTab('chats');
    }
  };

  const unreadCount = getUnreadCount();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
              <p className="text-gray-600">
                Converse com transportadores e embarcadores
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>{unreadCount} não lidas</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'chats' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversas
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'chats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Chat List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <ChatList
                  chats={chats}
                  currentUser={user}
                  selectedChatId={selectedChat?.id}
                  onSelectChat={handleSelectChat}
                  onNewChat={() => setShowNewChatModal(true)}
                />
              </Card>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedChat ? (
                <Card className="h-full">
                  <ChatWindow
                    chat={selectedChat}
                    currentUser={user}
                    onBack={() => setSelectedChat(null)}
                    onSendMessage={handleSendMessage}
                    onStartCall={handleStartCall}
                  />
                </Card>
              ) : (
                <Card className="h-full">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Selecione uma conversa
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Escolha uma conversa existente ou inicie uma nova
                      </p>
                      <Button onClick={() => setShowNewChatModal(true)}>
                        <Users className="h-4 w-4 mr-2" />
                        Nova Conversa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ChatNotifications
              notifications={mockNotifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDismiss={handleDismissNotification}
              onNavigateToChat={handleNavigateToChat}
            />
          </div>
        )}

        {/* New Chat Modal */}
        {showNewChatModal && (
          <NewChatModal
            availableUsers={availableUsers}
            onStartChat={handleNewChat}
            onClose={() => setShowNewChatModal(false)}
          />
        )}
      </div>
    </div>
  );
};