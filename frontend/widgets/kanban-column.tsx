import { LeadCard } from "@/entities/lead/ui/lead-card";
import type { Lead } from "@/entities/lead/model/types";

export function KanbanColumn({ title, leads }: { title: string; leads: Lead[] }) {
  return (
    <section className="flex h-full min-w-[290px] flex-1 flex-col rounded-lg border bg-card p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{leads.length}</span>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </section>
  );
}
