export type LeadStage = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export type LeadPriority = "high" | "medium" | "low";

export type ActivityType = "call" | "meeting" | "email" | "task";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: string;
  owner: string;
}

export interface Task {
  id: string;
  title: string;
  dueAt: string;
  completed: boolean;
}

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  contactPhone: string;
  source: string;
  budget: number;
  stage: LeadStage;
  priority: LeadPriority;
  nextActionAt: string;
  lastActivityAt: string;
  manager: string;
  tags: string[];
  notes: string;
  activities: Activity[];
  tasks: Task[];
}
