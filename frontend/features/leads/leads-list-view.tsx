"use client";

import { useMemo, useState } from "react";

import type { Lead } from "@/entities/lead/model/types";
import { FilterBar } from "@/features/filters/filter-bar";
import { LeadFormModal } from "@/features/leads/lead-form-modal";
import { DataTable } from "@/widgets/data-table";
import { EmptyState } from "@/widgets/empty-state";
import { Button } from "@/ui/button";

const PAGE_SIZE = 3;

export function LeadsListView({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const byStage = stage === "all" ? leads : leads.filter((item) => item.stage === stage);
    return byStage.filter((item) => {
      const text = `${item.company} ${item.contactName} ${item.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [leads, query, stage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const nextPage = () => setPage((prev) => Math.min(totalPages, prev + 1));
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Заявки клиентов</h1>
          <p className="text-sm text-muted-foreground">Добавление, фильтрация и быстрый переход к подбору мебельщика.</p>
        </div>
        <LeadFormModal />
      </div>

      <FilterBar
        searchValue={query}
        onSearchChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        stageValue={stage}
        onStageChange={(value) => {
          setStage(value);
          setPage(1);
        }}
      />

      {pageData.length > 0 ? (
        <>
          <DataTable leads={pageData} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Страница {page} из {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevPage} disabled={page <= 1}>
                Назад
              </Button>
              <Button variant="outline" onClick={nextPage} disabled={page >= totalPages}>
                Вперед
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="Заявки не найдены" description="Измените фильтры или добавьте новую заявку, чтобы запустить обработку заказа." />
      )}
    </section>
  );
}
