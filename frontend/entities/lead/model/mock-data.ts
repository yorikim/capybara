import type { Lead, LeadStage } from "@/entities/lead/model/types";

const leads: Lead[] = [
  {
    id: "LD-1042",
    company: "Coffee Point Group",
    contactName: "Арман Садыков",
    contactPhone: "+7 701 000 1102",
    source: "Реферал",
    budget: 4200000,
    stage: "proposal",
    priority: "high",
    nextActionAt: "2026-04-15T10:00:00.000Z",
    lastActivityAt: "2026-04-14T08:00:00.000Z",
    manager: "Алия Нурлан",
    tags: ["HoReCa", "Срочный"],
    notes: "Нужен запуск до открытия филиала.",
    activities: [
      { id: "A1", type: "meeting", title: "Бриф по барной зоне", createdAt: "2026-04-13T10:30:00.000Z", owner: "Алия" },
      { id: "A2", type: "email", title: "Отправлен коммерческий расчет", createdAt: "2026-04-14T07:40:00.000Z", owner: "Алия" },
    ],
    tasks: [
      { id: "T1", title: "Согласовать материалы фасадов", dueAt: "2026-04-15T11:00:00.000Z", completed: false },
      { id: "T2", title: "Запросить план помещения", dueAt: "2026-04-16T08:00:00.000Z", completed: false },
    ],
  },
  {
    id: "LD-1033",
    company: "Retail Hub",
    contactName: "Мария Коваленко",
    contactPhone: "+7 777 019 7771",
    source: "Instagram",
    budget: 2900000,
    stage: "qualified",
    priority: "medium",
    nextActionAt: "2026-04-15T13:30:00.000Z",
    lastActivityAt: "2026-04-14T05:12:00.000Z",
    manager: "Дастан Орда",
    tags: ["Ритейл"],
    notes: "Проект для сети островков в ТРЦ.",
    activities: [
      { id: "A3", type: "call", title: "Уточнили требования к витринам", createdAt: "2026-04-14T05:12:00.000Z", owner: "Дастан" },
    ],
    tasks: [{ id: "T3", title: "Назначить замер", dueAt: "2026-04-15T13:30:00.000Z", completed: false }],
  },
  {
    id: "LD-1021",
    company: "Medica+",
    contactName: "Ерлан Мурат",
    contactPhone: "+7 700 120 0011",
    source: "Сайт",
    budget: 5100000,
    stage: "negotiation",
    priority: "high",
    nextActionAt: "2026-04-14T16:00:00.000Z",
    lastActivityAt: "2026-04-14T09:05:00.000Z",
    manager: "Алия Нурлан",
    tags: ["Медцентр", "Сеть"],
    notes: "Важна рассрочка и SLA по монтажу.",
    activities: [
      { id: "A4", type: "meeting", title: "Обсудили условия поэтапной оплаты", createdAt: "2026-04-14T09:05:00.000Z", owner: "Алия" },
    ],
    tasks: [{ id: "T4", title: "Подготовить финальный договор", dueAt: "2026-04-14T14:00:00.000Z", completed: false }],
  },
  {
    id: "LD-1014",
    company: "Bakery 24",
    contactName: "Айгерим Сейт",
    contactPhone: "+7 705 560 9911",
    source: "Холодный звонок",
    budget: 1800000,
    stage: "new",
    priority: "low",
    nextActionAt: "2026-04-15T09:00:00.000Z",
    lastActivityAt: "2026-04-13T11:22:00.000Z",
    manager: "Дастан Орда",
    tags: ["HoReCa"],
    notes: "Запросили компактную линию витрин.",
    activities: [{ id: "A5", type: "call", title: "Первичный контакт", createdAt: "2026-04-13T11:22:00.000Z", owner: "Дастан" }],
    tasks: [{ id: "T5", title: "Отправить шаблон брифа", dueAt: "2026-04-15T09:00:00.000Z", completed: true }],
  },
];

export const stageOrder: LeadStage[] = ["new", "qualified", "proposal", "negotiation", "won", "lost"];

export const stageLabel: Record<LeadStage, string> = {
  new: "Новый",
  qualified: "Квалифицирован",
  proposal: "Коммерческое",
  negotiation: "Переговоры",
  won: "Выигран",
  lost: "Потерян",
};

export async function getLeads() {
  return Promise.resolve(leads);
}

export async function getLeadById(id: string) {
  const lead = leads.find((item) => item.id === id);
  return Promise.resolve(lead ?? null);
}

export async function getDashboardStats() {
  return Promise.resolve({
    activationRate: 68,
    leadToOpportunity: 34,
    taskCompletion: 82,
    avgTimeToLogLead: "1m 18s",
  });
}
