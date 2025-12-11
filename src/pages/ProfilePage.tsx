import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface UserProfile {
  id: string;
  rating: number;
  totalChats: number;
  blockedUntil: Date | null;
}

interface ProfilePageProps {
  profile: UserProfile;
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ profile, onNavigate }: ProfilePageProps) {
  const ratingPercentage = (profile.rating / 5) * 100;

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
          <h1 className="text-xl font-bold">Личный кабинет</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Icon name="User" size={36} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Анонимный пользователь</h2>
                <p className="text-sm text-muted-foreground">ID: {profile.id}</p>
              </div>
            </div>

            {profile.blockedUntil && profile.blockedUntil > new Date() && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <Icon name="Ban" size={24} className="text-destructive flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">Временная блокировка</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ваш аккаунт заблокирован до {profile.blockedUntil.toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="BarChart3" size={24} className="text-primary" />
              Статистика
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="MessageCircle" size={20} />
                  <span className="text-sm">Всего чатов</span>
                </div>
                <p className="text-3xl font-bold">{profile.totalChats}</p>
              </div>

              <div className="p-4 rounded-lg bg-secondary space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Star" size={20} />
                  <span className="text-sm">Рейтинг</span>
                </div>
                <p className="text-3xl font-bold">{profile.rating.toFixed(1)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Качество общения</span>
                <span className="font-semibold">{profile.rating.toFixed(1)} / 5.0</span>
              </div>
              <Progress value={ratingPercentage} className="h-2" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Award" size={24} className="text-primary" />
              Достижения
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-lg border-2 text-center ${profile.totalChats >= 1 ? 'border-primary bg-primary/5' : 'border-border bg-muted/50'}`}>
                <div className="text-3xl mb-2">🌟</div>
                <p className="text-sm font-medium">Первый чат</p>
                {profile.totalChats >= 1 && (
                  <p className="text-xs text-primary mt-1">Получено</p>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 text-center ${profile.totalChats >= 10 ? 'border-primary bg-primary/5' : 'border-border bg-muted/50'}`}>
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium">10 бесед</p>
                {profile.totalChats >= 10 ? (
                  <p className="text-xs text-primary mt-1">Получено</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{profile.totalChats}/10</p>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 text-center ${profile.rating >= 4.5 ? 'border-primary bg-primary/5' : 'border-border bg-muted/50'}`}>
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm font-medium">Высокий рейтинг</p>
                {profile.rating >= 4.5 ? (
                  <p className="text-xs text-primary mt-1">Получено</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Нужен 4.5+</p>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 text-center ${profile.totalChats >= 50 ? 'border-primary bg-primary/5' : 'border-border bg-muted/50'}`}>
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm font-medium">Супер-болтун</p>
                {profile.totalChats >= 50 ? (
                  <p className="text-xs text-primary mt-1">Получено</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{profile.totalChats}/50</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-lg font-semibold">Настройки</h3>
            
            <Button variant="outline" className="w-full justify-start gap-3">
              <Icon name="Shield" size={20} />
              Правила и политика
            </Button>
            
            <Button variant="outline" className="w-full justify-start gap-3">
              <Icon name="HelpCircle" size={20} />
              Помощь и поддержка
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
