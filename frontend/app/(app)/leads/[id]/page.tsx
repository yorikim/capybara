import { notFound } from "next/navigation";

import { getLeadById } from "@/entities/lead/model/mock-data";
import { LeadStatusBadge } from "@/entities/lead/ui/lead-status-badge";
import { FollowUpForm } from "@/features/tasks/follow-up-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{lead.company}</h1>
          <p className="text-sm text-muted-foreground">{lead.contactName} · {lead.contactPhone}</p>
        </div>
        <LeadStatusBadge stage={lead.stage} />
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>История заявки и активности</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {lead.activities.map((activity) => (
                <li key={activity.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString("ru-RU")} · {activity.owner}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Следующее действие</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Ближайший шаг</p>
              <p className="text-sm font-medium">{new Date(lead.nextActionAt).toLocaleString("ru-RU")}</p>
            </div>
            <FollowUpForm />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{lead.notes}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lead.tasks.map((task) => (
                <li key={task.id} className="rounded-md border p-3 text-sm">
                  <p>{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.completed ? "Выполнено" : "Открыто"} · {new Date(task.dueAt).toLocaleString("ru-RU")}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
