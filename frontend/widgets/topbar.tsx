"use client";

import Link from "next/link";
import { Moon, Plus, Sun } from "lucide-react";

import { Button } from "@/ui/button";
import { useTheme } from "@/shared/lib/theme";

export function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
      <div>
        <p className="text-sm font-semibold">Операционный ритм заказов</p>
        <p className="text-xs text-muted-foreground">Новая заявка до назначения follow-up за &lt; 2 минуты</p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/leads">
            <Plus className="mr-1 h-4 w-4" />
            Новая заявка
          </Link>
        </Button>
        <Button size="icon" variant="outline" onClick={toggleTheme} aria-label="Переключить тему">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
