import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  aircraftId: string;
  aircraftTitle: string;
  aircraftPrice: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat?: Chat | null;
  currentUserId: string;
  currentUserRole: 'buyer' | 'seller';
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  selectedChat,
  currentUserId,
  currentUserRole
}) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      aircraftId: '1',
      aircraftTitle: 'Boeing 737-800 for Sale',
      aircraftPrice: '$25,000,000',
      buyerId: 'buyer1',
      buyerName: 'Ivan Petrov',
      sellerId: 'seller1',
      sellerName: 'Alexey Sidorov',
      messages: [
        {
          id: '1',
          senderId: 'buyer1',
          senderName: 'Ivan Petrov',
          senderRole: 'buyer',
          text: t('messages.mockMessage1'),
          timestamp: new Date(Date.now() - 3600000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'seller1',
          senderName: 'Alexey Sidorov',
          senderRole: 'seller',
          text: t('messages.mockMessage2'),
          timestamp: new Date(Date.now() - 1800000),
          isRead: true
        },
        {
          id: '3',
          senderId: 'buyer1',
          senderName: 'Ivan Petrov',
          senderRole: 'buyer',
          text: t('messages.mockMessage3'),
          timestamp: new Date(Date.now() - 900000),
          isRead: false
        }
      ],
      lastMessage: t('messages.mockMessage3'),
      lastMessageTime: new Date(Date.now() - 900000),
      unreadCount: 1
    },
    {
      id: '2',
      aircraftId: '2',
      aircraftTitle: 'Airbus A320neo',
      aircraftPrice: '$35,000,000',
      buyerId: 'buyer2',
      buyerName: 'Maria Kozlova',
      sellerId: 'seller1',
      sellerName: 'Alexey Sidorov',
      messages: [
        {
          id: '4',
          senderId: 'buyer2',
          senderName: 'Maria Kozlova',
          senderRole: 'buyer',
          text: t('messages.mockMessage4'),
          timestamp: new Date(Date.now() - 7200000),
          isRead: true
        },
        {
          id: '5',
          senderId: 'seller1',
          senderName: 'Alexey Sidorov',
          senderRole: 'seller',
          text: t('messages.mockMessage5'),
          timestamp: new Date(Date.now() - 3600000),
          isRead: true
        }
      ],
      lastMessage: t('messages.mockMessage5'),
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0
    }
  ]);
  
  const [activeChat, setActiveChat] = useState<Chat | null>(selectedChat || chats[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setActiveChat(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: t('messages.you'),
      senderRole: currentUserRole,
      text: message.trim(),
      timestamp: new Date(),
      isRead: false
    };

    // Обновляем чат с новым сообщением
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp,
          unreadCount: chat.unreadCount + 1
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setActiveChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage.text,
      lastMessageTime: newMessage.timestamp,
      unreadCount: prev.unreadCount + 1
    } : null);
    
    setMessage('');
    toast.success(t('messages.messageSent'));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatTime(date);
    } else if (diffInHours < 48) {
      return t('messages.yesterday');
    } else {
      return date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('messages.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">{t('messages.chats')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => {
                const otherParty = currentUserRole === 'buyer' ? chat.sellerName : chat.buyerName;
                const isActive = activeChat?.id === chat.id;
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      isActive ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{otherParty}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(chat.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      {chat.aircraftTitle}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-black rounded-full">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {currentUserRole === 'buyer' ? activeChat.sellerName : activeChat.buyerName}
                      </h3>
                      <p className="text-sm text-gray-600">{activeChat.aircraftTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{activeChat.aircraftPrice}</p>
                      <p className="text-xs text-gray-500">{t('messages.aircraftPrice')}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeChat.messages.map((msg) => {
                    const isOwnMessage = msg.senderId === currentUserId;
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          isOwnMessage 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg px-4 py-2`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">
                              {msg.senderName}
                            </span>
                            <span className={`text-xs ${
                              isOwnMessage ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('messages.enterMessage')}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
                      rows={2}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('messages.selectChat')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal; 