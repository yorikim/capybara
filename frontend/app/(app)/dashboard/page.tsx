import { getDashboardStats, getLeads } from "@/entities/lead/model/mock-data";
import { LeadCard } from "@/entities/lead/ui/lead-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function DashboardPage() {
  const [stats, leads] = await Promise.all([getDashboardStats(), getLeads()]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Обзор маркетплейса</h1>
        <p className="text-sm text-muted-foreground">Первые 3 секунды: KPI, новые заявки и ближайшие задачи.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Activation Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats.activationRate}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Заявка → Оффер</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats.leadToOpportunity}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Task Completion</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats.taskCompletion}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Time-to-Log-Request</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-semibold">{stats.avgTimeToLogLead}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Новые заявки</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {leads.slice(0, 4).map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Сегодняшние задачи</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {leads.flatMap((lead) => lead.tasks).slice(0, 4).map((task) => (
                <li key={task.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Дедлайн: {new Date(task.dueAt).toLocaleString("ru-RU")}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
