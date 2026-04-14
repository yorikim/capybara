import Link from "next/link";

import type { Lead } from "@/entities/lead/model/types";
import { LeadStatusBadge } from "@/entities/lead/ui/lead-status-badge";

function formatAmount(amount: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "KZT", maximumFractionDigits: 0 }).format(amount);
}

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="focus-ring block rounded-lg border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      aria-label={`Открыть заявку ${lead.company}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{lead.company}</p>
          <p className="text-xs text-muted-foreground">{lead.contactName}</p>
        </div>
        <LeadStatusBadge stage={lead.stage} />
      </div>
      <p className="text-sm text-muted-foreground">Следующее действие: {new Date(lead.nextActionAt).toLocaleString("ru-RU")}</p>
      <p className="mt-2 text-sm font-medium">{formatAmount(lead.budget)}</p>
    </Link>
  );
}
