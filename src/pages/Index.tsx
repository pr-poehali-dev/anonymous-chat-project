import { useState } from 'react';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import RulesPage from './RulesPage';
import ContactsPage from './ContactsPage';

type Page = 'home' | 'chat' | 'profile' | 'rules' | 'contacts';
type Gender = 'male' | 'female' | 'any';

export interface UserProfile {
  id: string;
  rating: number;
  totalChats: number;
  blockedUntil: Date | null;
}

export interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGender, setSelectedGender] = useState<Gender>('any');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    rating: 4.5,
    totalChats: 12,
    blockedUntil: null,
  });

  const handleStartChat = (gender: Gender) => {
    setSelectedGender(gender);
    setIsSearching(true);
    setMessages([]);
    
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setCurrentPage('chat');
      setMessages([
        {
          id: '1',
          text: 'Привет! 👋',
          isOwn: false,
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isOwn: true,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      const replies = [
        'Интересно! Расскажи подробнее',
        'Да, согласен с тобой',
        'А ты откуда?',
        'Как твои дела?',
        'Классно! А у меня...',
      ];
      const reply: Message = {
        id: Date.now().toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        isOwn: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleNextChat = () => {
    setIsSearching(true);
    setIsConnected(false);
    setMessages([]);

    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setMessages([
        {
          id: '1',
          text: 'Здравствуй! 😊',
          isOwn: false,
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleRateChat = (rating: number) => {
    const newTotalChats = userProfile.totalChats + 1;
    const newRating = (userProfile.rating * userProfile.totalChats + rating) / newTotalChats;
    
    setUserProfile({
      ...userProfile,
      rating: newRating,
      totalChats: newTotalChats,
    });
    
    handleNextChat();
  };

  const handleStopChat = () => {
    setIsConnected(false);
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          onStartChat={handleStartChat}
          onNavigate={setCurrentPage}
          isSearching={isSearching}
        />
      )}
      
      {currentPage === 'chat' && (
        <ChatPage
          messages={messages}
          isConnected={isConnected}
          isSearching={isSearching}
          onSendMessage={handleSendMessage}
          onNextChat={handleNextChat}
          onStopChat={handleStopChat}
          onRateChat={handleRateChat}
          onNavigate={setCurrentPage}
        />
      )}
      
      {currentPage === 'profile' && (
        <ProfilePage
          profile={userProfile}
          onNavigate={setCurrentPage}
        />
      )}
      
      {currentPage === 'rules' && (
        <RulesPage onNavigate={setCurrentPage} />
      )}
      
      {currentPage === 'contacts' && (
        <ContactsPage onNavigate={setCurrentPage} />
      )}
    </>
  );
};

export default Index;