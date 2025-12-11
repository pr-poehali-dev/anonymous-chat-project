import { useState, useEffect, useRef } from 'react';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import RulesPage from './RulesPage';
import ContactsPage from './ContactsPage';
import { chatApi } from '@/lib/chatApi';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedGender, setSelectedGender] = useState<Gender>('any');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [lastMessageId, setLastMessageId] = useState(0);
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const matchingInterval = useRef<NodeJS.Timeout | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    rating: 4.5,
    totalChats: 0,
    blockedUntil: null,
  });

  useEffect(() => {
    const initUser = async () => {
      try {
        const profile = await chatApi.registerUser(userProfile.id);
        setUserProfile({
          ...profile,
          blockedUntil: profile.blockedUntil ? new Date(profile.blockedUntil) : null,
        });
      } catch (error) {
        console.error('Failed to register user:', error);
      }
    };
    initUser();
  }, []);

  useEffect(() => {
    if (sessionId && isConnected) {
      pollingInterval.current = setInterval(async () => {
        try {
          const newMessages = await chatApi.getMessages(sessionId, lastMessageId);
          
          if (newMessages.length > 0) {
            const formattedMessages = newMessages.map((msg) => ({
              id: msg.id.toString(),
              text: msg.text,
              isOwn: msg.sender_id === userProfile.id,
              timestamp: new Date(msg.timestamp),
            }));
            
            setMessages((prev) => [...prev, ...formattedMessages]);
            setLastMessageId(Math.max(...newMessages.map(m => m.id)));
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      }, 1000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [sessionId, isConnected, lastMessageId, userProfile.id]);

  const handleStartChat = async (gender: Gender) => {
    setSelectedGender(gender);
    setIsSearching(true);
    setMessages([]);
    setLastMessageId(0);
    setCurrentPage('chat');

    try {
      matchingInterval.current = setInterval(async () => {
        try {
          const result = await chatApi.findMatch(userProfile.id, gender, 'any');
          
          if (result.matched && result.session_id) {
            if (matchingInterval.current) {
              clearInterval(matchingInterval.current);
            }
            
            setSessionId(result.session_id);
            setPartnerId(result.partner_id || null);
            setIsSearching(false);
            setIsConnected(true);
            
            toast({
              title: 'Собеседник найден!',
              description: 'Начинайте общение',
            });
          }
        } catch (error) {
          console.error('Matching error:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to start matching:', error);
      setIsSearching(false);
      toast({
        title: 'Ошибка',
        description: 'Не удалось начать поиск',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!sessionId) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      text,
      isOwn: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await chatApi.sendMessage(sessionId, userProfile.id, text);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    }
  };

  const handleNextChat = async () => {
    if (sessionId) {
      await chatApi.endSession(sessionId, userProfile.id);
    }
    
    if (matchingInterval.current) {
      clearInterval(matchingInterval.current);
    }
    
    setIsSearching(true);
    setIsConnected(false);
    setMessages([]);
    setSessionId(null);
    setPartnerId(null);
    setLastMessageId(0);

    try {
      matchingInterval.current = setInterval(async () => {
        try {
          const result = await chatApi.findMatch(userProfile.id, selectedGender, 'any');
          
          if (result.matched && result.session_id) {
            if (matchingInterval.current) {
              clearInterval(matchingInterval.current);
            }
            
            setSessionId(result.session_id);
            setPartnerId(result.partner_id || null);
            setIsSearching(false);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Matching error:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to find next match:', error);
    }
  };

  const handleRateChat = async (rating: number) => {
    if (!sessionId) return;

    try {
      await chatApi.rateChat(sessionId, userProfile.id, rating);
      
      const updatedProfile = await chatApi.getProfile(userProfile.id);
      setUserProfile({
        ...updatedProfile,
        blockedUntil: updatedProfile.blockedUntil ? new Date(updatedProfile.blockedUntil) : null,
      });
    } catch (error) {
      console.error('Failed to rate chat:', error);
    }
    
    handleNextChat();
  };

  const handleStopChat = async () => {
    if (sessionId) {
      await chatApi.endSession(sessionId, userProfile.id);
    }
    
    if (matchingInterval.current) {
      clearInterval(matchingInterval.current);
    }
    
    setIsConnected(false);
    setIsSearching(false);
    setSessionId(null);
    setPartnerId(null);
    setMessages([]);
    setCurrentPage('home');
  };

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      if (matchingInterval.current) {
        clearInterval(matchingInterval.current);
      }
    };
  }, []);

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
