"use client";

import { createContext, useContext, useMemo } from "react";

import { Toaster } from "@/ui/toaster";
import { useToast } from "@/ui/use-toast";

type ToastContextValue = {
  pushToast: (payload: { title: string; description?: string }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast, dismiss } = useToast();

  const value = useMemo(
    () => ({
      pushToast: (payload: { title: string; description?: string }) => toast(payload),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within ToastContextProvider");
  }
  return context;
}
