import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface RulesPageProps {
  onNavigate: (page: string) => void;
}

export default function RulesPage({ onNavigate }: RulesPageProps) {
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
          <h1 className="text-xl font-bold">Правила использования</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-100/50 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Безопасное общение</h2>
                <p className="text-muted-foreground">
                  Мы создали правила для комфортного и безопасного общения всех пользователей.
                  Пожалуйста, соблюдайте их.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Ban" size={24} className="text-destructive" />
              Что запрещено
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Нецензурная лексика</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Использование мата и оскорбительных выражений строго запрещено.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Контент 18+</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Любой контент сексуального характера запрещен на платформе.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Угрозы и запугивание</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Любые формы угроз, шантажа или запугивания других пользователей.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Спам и реклама</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Массовая рассылка сообщений и продвижение товаров/услуг.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
              Правила хорошего тона
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="ThumbsUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Будьте вежливы и уважительны к собеседнику
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="ThumbsUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Общайтесь на интересные и позитивные темы
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="ThumbsUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Не запрашивайте личную информацию (адреса, телефоны, соцсети)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="ThumbsUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Оценивайте собеседника честно после общения
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="Clock" size={24} className="text-yellow-600" />
              Система блокировок
            </h3>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                За нарушение правил предусмотрены следующие меры:
              </p>
              
              <div className="p-4 rounded-lg bg-white border border-yellow-200">
                <p className="font-semibold mb-2">🔸 Первое нарушение</p>
                <p className="text-sm text-muted-foreground">
                  Блокировка на <strong>7 дней</strong> с предупреждением
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white border border-yellow-200">
                <p className="font-semibold mb-2">🔸 Повторное нарушение</p>
                <p className="text-sm text-muted-foreground">
                  Блокировка на <strong>30 дней</strong>
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white border border-yellow-200">
                <p className="font-semibold mb-2">🔸 Третье нарушение</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Перманентная блокировка</strong> аккаунта
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Как пожаловаться на собеседника?</AccordionTrigger>
                <AccordionContent>
                  Если собеседник нарушает правила, вы можете поставить ему низкую оценку после завершения чата.
                  Также напишите в поддержку через раздел "Контакты" с описанием ситуации.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Как работает система рейтинга?</AccordionTrigger>
                <AccordionContent>
                  После каждого чата вы можете оценить собеседника от 1 до 5 звезд.
                  Средний рейтинг отображается в профиле и помогает другим пользователям.
                  Пользователи с низким рейтингом могут получить временные ограничения.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Можно ли разблокироваться досрочно?</AccordionTrigger>
                <AccordionContent>
                  Нет, блокировка снимается автоматически по истечении срока.
                  Мы рекомендуем внимательно ознакомиться с правилами, чтобы избежать повторных блокировок.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Насколько безопасно общение?</AccordionTrigger>
                <AccordionContent>
                  Все чаты полностью анонимны. Мы не храним личные данные пользователей.
                  Однако помните: не делитесь личной информацией (адресом, телефоном, соцсетями) с незнакомцами.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Button
            onClick={() => onNavigate('home')}
            className="w-full"
            size="lg"
          >
            Я понял(-а) правила
          </Button>
        </div>
      </main>
    </div>
  );
}
