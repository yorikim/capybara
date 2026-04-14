import { Badge } from "@/ui/badge";
import type { LeadStage } from "@/entities/lead/model/types";
import { stageLabel } from "@/entities/lead/model/mock-data";

const variantMap: Record<LeadStage, "default" | "success" | "warning" | "danger" | "outline"> = {
  new: "default",
  qualified: "default",
  proposal: "warning",
  negotiation: "warning",
  won: "success",
  lost: "danger",
};

export function LeadStatusBadge({ stage }: { stage: LeadStage }) {
  return <Badge variant={variantMap[stage]}>{stageLabel[stage]}</Badge>;
}
