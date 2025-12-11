import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContactsPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactsPage({ onNavigate }: ContactsPageProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !message) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Сообщение отправлено!',
      description: 'Мы свяжемся с вами в ближайшее время',
    });
    
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('home')}
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-xl font-bold">Контакты и поддержка</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 bg-gradient-to-br from-accent/50 to-secondary/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Icon name="Headphones" size={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Мы всегда на связи</h2>
                <p className="text-muted-foreground">
                  Есть вопросы или предложения? Напишите нам, и мы обязательно ответим!
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Icon name="Mail" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">support@anonimchat.ru</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Icon name="MessageCircle" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telegram</h3>
              <p className="text-sm text-muted-foreground">@anonimchat_support</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Время работы</h3>
              <p className="text-sm text-muted-foreground">24/7</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Форма обратной связи</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Ваш Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  placeholder="Опишите вашу проблему или предложение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Icon name="Send" size={20} className="mr-2" />
                Отправить сообщение
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="LifeBuoy" size={24} className="text-primary" />
              Быстрая помощь
            </h3>
            
            <div className="space-y-3">
              <details className="group">
                <summary className="cursor-pointer p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors list-none flex items-center justify-between">
                  <span className="font-medium">Не могу найти собеседника</span>
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 mt-2 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Поиск собеседника может занять от нескольких секунд до минуты.
                    Если поиск длится более минуты, попробуйте обновить страницу или изменить параметры поиска.
                  </p>
                </div>
              </details>

              <details className="group">
                <summary className="cursor-pointer p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors list-none flex items-center justify-between">
                  <span className="font-medium">Меня заблокировали незаслуженно</span>
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 mt-2 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Если вы считаете, что блокировка была ошибочной, напишите в поддержку через форму выше
                    с указанием вашего ID из профиля. Мы рассмотрим вашу заявку в течение 24 часов.
                  </p>
                </div>
              </details>

              <details className="group">
                <summary className="cursor-pointer p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors list-none flex items-center justify-between">
                  <span className="font-medium">Проблемы с отображением сайта</span>
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 mt-2 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Попробуйте очистить кэш браузера или использовать другой браузер.
                    Мы рекомендуем Chrome, Firefox или Safari последних версий.
                  </p>
                </div>
              </details>

              <details className="group">
                <summary className="cursor-pointer p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors list-none flex items-center justify-between">
                  <span className="font-medium">Предложение по улучшению</span>
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 mt-2 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Мы всегда рады вашим идеям! Напишите нам через форму выше или в Telegram.
                    Лучшие предложения будут реализованы в следующих обновлениях.
                  </p>
                </div>
              </details>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-100/50 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Heart" size={24} className="text-red-500" />
              <h3 className="text-lg font-semibold">Поддержите проект</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              АнонимЧат — бесплатный проект. Если вам нравится наш сервис,
              расскажите о нас друзьям или поддержите нас материально.
            </p>
            <Button variant="outline" className="gap-2">
              <Icon name="Coffee" size={20} />
              Поддержать разработчиков
            </Button>
          </Card>

          <Button
            onClick={() => onNavigate('home')}
            className="w-full"
            size="lg"
          >
            <Icon name="Home" size={20} className="mr-2" />
            На главную
          </Button>
        </div>
      </main>
    </div>
  );
}
