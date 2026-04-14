import { getLeads, stageLabel, stageOrder } from "@/entities/lead/model/mock-data";
import { KanbanColumn } from "@/widgets/kanban-column";

export default async function PipelinePage() {
  const leads = await getLeads();

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Этапы обработки заявок</h1>
        <p className="text-sm text-muted-foreground">Kanban-фокус на быстром проведении заказа от запроса до исполнения.</p>
      </header>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stageOrder.map((stage) => (
          <KanbanColumn key={stage} title={stageLabel[stage]} leads={leads.filter((lead) => lead.stage === stage)} />
        ))}
      </div>
    </section>
  );
}
