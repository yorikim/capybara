"use client";

import { useCallback, useState } from "react";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...item, id }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return { toasts, toast, dismiss };
}
