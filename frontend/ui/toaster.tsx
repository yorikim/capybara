"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";

import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/ui/toast";
import type { ToastItem } from "@/ui/use-toast";

type ToasterProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <ToastProvider>
      {toasts.map((item) => (
        <Toast key={item.id} onOpenChange={(open) => !open && onDismiss(item.id)}>
          <ToastTitle>{item.title}</ToastTitle>
          {item.description ? <ToastDescription>{item.description}</ToastDescription> : null}
          <ToastPrimitives.Close className="sr-only">Закрыть</ToastPrimitives.Close>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
