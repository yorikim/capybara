"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, KanbanSquare, List, Settings, UserRound } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Обзор", icon: Home },
  { href: "/leads", label: "Заявки", icon: List },
  { href: "/pipeline", label: "Этапы заказа", icon: KanbanSquare },
  { href: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b bg-card px-4 py-3 md:w-64 md:border-b-0 md:border-r md:px-3 md:py-6" aria-label="Главная навигация">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="rounded-md bg-primary/15 p-2 text-primary">
          <UserRound className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Capybara Marketplace</p>
          <p className="text-xs text-muted-foreground">Заказ мебели у проверенных мебельщиков</p>
        </div>
      </div>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
