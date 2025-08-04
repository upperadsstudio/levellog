import { useState, useEffect } from 'react';
import { Chat, Message, User } from '../types';

export const useChat = (currentUserId: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de chats
    setTimeout(() => {
      setChats(mockChats);
      setLoading(false);
    }, 1000);
  }, []);

  const sendMessage = async (chatId: string, content: string, attachments?: File[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUserId,
      content,
      timestamp: new Date(),
      read: false
    };

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date()
          }
        : chat
    ));

    // Simular envio para servidor
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const markMessagesAsRead = async (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? {
            ...chat,
            messages: chat.messages.map(message => 
              message.senderId !== currentUserId 
                ? { ...message, read: true }
                : message
            )
          }
        : chat
    ));
  };

  const createChat = async (otherUser: User) => {
    const newChat: Chat = {
      id: Math.random().toString(36).substr(2, 9),
      cargaId: '', // Pode ser associado a uma carga específica
      participants: [otherUser], // O usuário atual será adicionado automaticamente
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChats(prev => [newChat, ...prev]);
    return newChat;
  };

  const deleteChat = async (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const archiveChat = async (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, archived: true } as any
        : chat
    ));
  };

  const getUnreadCount = () => {
    return chats.reduce((total, chat) => {
      return total + chat.messages.filter(message => 
        message.senderId !== currentUserId && !message.read
      ).length;
    }, 0);
  };

  return {
    chats,
    loading,
    sendMessage,
    markMessagesAsRead,
    createChat,
    deleteChat,
    archiveChat,
    getUnreadCount
  };
};

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    cargaId: '1',
    participants: [
      {
        id: '2',
        name: 'Carlos Mendes',
        email: 'carlos@email.com',
        phone: '(11) 98888-8888',
        document: '123.456.789-00',
        type: 'transportador',
        rating: 4.9,
        totalRatings: 98,
        profileComplete: true,
        createdAt: new Date()
      }
    ],
    messages: [
      {
        id: '1',
        senderId: '2',
        content: 'Olá! Vi sua carga de alimentos perecíveis. Tenho experiência com transporte refrigerado.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '2',
        senderId: '1',
        content: 'Ótimo! Pode me falar mais sobre seu veículo e experiência?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '3',
        senderId: '2',
        content: 'Claro! Tenho um Mercedes Atego 1719 com baú refrigerado. Faço essa rota SP-RJ há 8 anos.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '4',
        senderId: '2',
        content: 'Posso garantir temperatura controlada durante todo o transporte.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      }
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '2',
    cargaId: '2',
    participants: [
      {
        id: '3',
        name: 'Maria Santos',
        email: 'maria@transportes.com',
        phone: '(11) 97777-7777',
        document: '987.654.321-00',
        type: 'transportador',
        rating: 4.7,
        totalRatings: 156,
        profileComplete: true,
        createdAt: new Date()
      }
    ],
    messages: [
      {
        id: '5',
        senderId: '3',
        content: 'Bom dia! Tenho interesse na sua carga de produtos têxteis.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '6',
        senderId: '1',
        content: 'Bom dia, Maria! Qual seria sua proposta de valor?',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '7',
        senderId: '3',
        content: 'Posso fazer por R$ 1.650. Tenho carreta baú adequada para este tipo de carga.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];