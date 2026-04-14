import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Профиль, уведомления и роли участников маркетплейса.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Контакты менеджера и персональные уведомления</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" defaultValue="Алия Нурлан" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="aliya@capybara.kz" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tg">Telegram для алертов</Label>
              <Input id="tg" defaultValue="@aliya_sales" />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Roles Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="rounded-md border p-2">Owner — доступ ко всем воронкам и SLA</li>
              <li className="rounded-md border p-2">Marketplace Ops — отчеты, маршрутизация заявок</li>
              <li className="rounded-md border p-2">Account Manager — заявки, задачи, follow-up</li>
              <li className="rounded-md border p-2">Furniture Maker — офферы, сроки, статус производства</li>
              <li className="rounded-md border p-2">Client Company — просмотр этапов и подтверждение работ</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
