"use client";

import { Search } from "lucide-react";

import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

type FilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  stageValue: string;
  onStageChange: (value: string) => void;
};

export function FilterBar({ searchValue, onSearchChange, stageValue, onStageChange }: FilterBarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="search" aria-label="Фильтры заявок">
      <div className="relative lg:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Поиск по компании, контакту или тегам"
          className="pl-9"
          aria-label="Поиск заявок"
        />
      </div>
      <Select value={stageValue} onValueChange={onStageChange}>
        <SelectTrigger aria-label="Фильтр по стадии">
          <SelectValue placeholder="Стадия" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все стадии</SelectItem>
          <SelectItem value="new">Новый</SelectItem>
          <SelectItem value="qualified">Квалифицирован</SelectItem>
          <SelectItem value="proposal">Коммерческое</SelectItem>
          <SelectItem value="negotiation">Переговоры</SelectItem>
          <SelectItem value="won">Выигран</SelectItem>
          <SelectItem value="lost">Потерян</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
