import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  messages: Message[];
  isConnected: boolean;
  isSearching: boolean;
  onSendMessage: (text: string) => void;
  onNextChat: () => void;
  onStopChat: () => void;
  onRateChat: (rating: number) => void;
  onNavigate: (page: string) => void;
}

export default function ChatPage({
  messages,
  isConnected,
  isSearching,
  onSendMessage,
  onNextChat,
  onStopChat,
  onRateChat,
  onNavigate,
}: ChatPageProps) {
  const [inputValue, setInputValue] = useState('');
  const [showRating, setShowRating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleNext = () => {
    setShowRating(true);
  };

  const handleRate = (rating: number) => {
    setShowRating(false);
    onRateChat(rating);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onStopChat}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex items-center gap-2">
              {isConnected && (
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              )}
              <span className="font-semibold">
                {isSearching ? 'Поиск...' : isConnected ? 'Собеседник онлайн' : 'Не подключен'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
            >
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {isSearching ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center space-y-4 animate-scale-in">
              <div className="inline-block animate-spin">
                <Icon name="Loader2" size={48} className="text-primary" />
              </div>
              <p className="text-xl font-medium">Ищем нового собеседника...</p>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Начните беседу</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="break-words">{message.text}</p>
                      <span className={`text-xs mt-1 block ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Напишите сообщение..."
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || !isConnected}
                  size="icon"
                  className="px-6"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={!isConnected}
                  className="flex-1 gap-2"
                >
                  <Icon name="SkipForward" size={18} />
                  Следующий собеседник
                </Button>
                <Button
                  variant="outline"
                  onClick={onStopChat}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Icon name="X" size={18} />
                  Остановить
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      <Dialog open={showRating} onOpenChange={setShowRating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оцените общение</DialogTitle>
            <DialogDescription>
              Как вам понравился собеседник? Ваша оценка поможет улучшить сервис.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="icon"
                className="w-12 h-12 hover:scale-110 transition-transform"
                onClick={() => handleRate(rating)}
              >
                <Icon
                  name="Star"
                  size={32}
                  className="text-yellow-500 hover:fill-yellow-500"
                />
              </Button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            1 — плохо, 5 — отлично
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
