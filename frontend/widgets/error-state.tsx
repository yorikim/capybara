import { TriangleAlert } from "lucide-react";

import { Button } from "@/ui/button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-danger/40 bg-danger/10 p-4">
      <div className="flex items-start gap-2">
        <TriangleAlert className="mt-0.5 h-4 w-4 text-danger" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-danger">Не удалось загрузить данные</p>
          <p className="text-sm">{message}</p>
          {onRetry ? (
            <Button type="button" size="sm" className="mt-3" onClick={onRetry}>
              Повторить
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
