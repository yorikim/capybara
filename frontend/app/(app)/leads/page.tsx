import { getLeads } from "@/entities/lead/model/mock-data";
import { LeadsListView } from "@/features/leads/leads-list-view";

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsListView leads={leads} />;
}
