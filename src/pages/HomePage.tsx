import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Gender = 'male' | 'female' | 'any';

interface HomePageProps {
  onStartChat: (gender: Gender) => void;
  onNavigate: (page: string) => void;
  isSearching: boolean;
}

export default function HomePage({ onStartChat, onNavigate, isSearching }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Icon name="MessageCircle" size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">АнонимЧат</h1>
          </div>
          
          <nav className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('profile')}
              className="gap-2"
            >
              <Icon name="User" size={18} />
              Профиль
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('rules')}
              className="gap-2"
            >
              <Icon name="Shield" size={18} />
              Правила
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('contacts')}
              className="gap-2"
            >
              <Icon name="HelpCircle" size={18} />
              Помощь
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 rounded-full bg-accent mb-4">
              <Icon name="MessageCircle" size={48} className="text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              Начни анонимное общение
            </h2>
            <p className="text-lg text-muted-foreground">
              Найди интересного собеседника и общайся безопасно
            </p>
          </div>

          {isSearching ? (
            <Card className="p-8 text-center space-y-4 animate-scale-in">
              <div className="inline-block animate-spin">
                <Icon name="Loader2" size={48} className="text-primary" />
              </div>
              <p className="text-xl font-medium">Ищем собеседника...</p>
              <p className="text-muted-foreground">Это займет несколько секунд</p>
            </Card>
          ) : (
            <Card className="p-8 space-y-6 animate-scale-in">
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground block">
                  С кем хочешь общаться?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-secondary hover:border-primary transition-all"
                    onClick={() => onStartChat('female')}
                  >
                    <Icon name="User" size={32} className="text-pink-500" />
                    <span className="text-lg font-medium">Девочка</span>
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-secondary hover:border-primary transition-all"
                    onClick={() => onStartChat('male')}
                  >
                    <Icon name="User" size={32} className="text-blue-500" />
                    <span className="text-lg font-medium">Мальчик</span>
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-auto py-6 flex flex-col gap-3 hover:bg-secondary hover:border-primary transition-all"
                    onClick={() => onStartChat('any')}
                  >
                    <Icon name="Users" size={32} className="text-primary" />
                    <span className="text-lg font-medium">Без разницы</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <p>Общение полностью анонимное. Мы не храним личные данные.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Icon name="Ban" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <p>Маты и 18+ контент запрещены. Блокировка на 7 дней.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Icon name="Star" size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p>После общения оцени собеседника — это поможет другим.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t py-6 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 АнонимЧат. Безопасное общение для всех.</p>
        </div>
      </footer>
    </div>
  );
}
