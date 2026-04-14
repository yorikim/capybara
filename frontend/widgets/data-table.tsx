import Link from "next/link";

import type { Lead } from "@/entities/lead/model/types";
import { LeadStatusBadge } from "@/entities/lead/ui/lead-status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

function formatBudget(value: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "KZT", maximumFractionDigits: 0 }).format(value);
}

export function DataTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Компания</TableHead>
              <TableHead>Контакт</TableHead>
              <TableHead>Стадия</TableHead>
              <TableHead>Бюджет</TableHead>
              <TableHead>Следующий шаг</TableHead>
              <TableHead>Менеджер</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link href={`/leads/${lead.id}`} className="focus-ring rounded-sm font-medium underline-offset-2 hover:underline">
                    {lead.company}
                  </Link>
                </TableCell>
                <TableCell>{lead.contactName}</TableCell>
                <TableCell><LeadStatusBadge stage={lead.stage} /></TableCell>
                <TableCell>{formatBudget(lead.budget)}</TableCell>
                <TableCell>{new Date(lead.nextActionAt).toLocaleString("ru-RU")}</TableCell>
                <TableCell>{lead.manager}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
