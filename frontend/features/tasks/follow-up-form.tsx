"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { useAppToast } from "@/shared/lib/toast-provider";

const followUpSchema = z.object({
  dueAt: z.string().min(1, "Укажите дату и время"),
  details: z.string().min(8, "Минимум 8 символов"),
});

type FollowUpValues = z.infer<typeof followUpSchema>;

export function FollowUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useAppToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm<FollowUpValues>({
    resolver: zodResolver(followUpSchema),
    mode: "onChange",
    defaultValues: { dueAt: "", details: "" },
  });

  const submit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsLoading(false);
    pushToast({ title: "Follow-up запланирован", description: "Задача добавлена в календарь менеджера" });
    reset();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submit)}>
      <div className="space-y-1.5">
        <Label htmlFor="dueAt">Дата follow-up</Label>
        <Input id="dueAt" type="datetime-local" {...register("dueAt")} aria-invalid={Boolean(errors.dueAt)} />
        {errors.dueAt ? <p className="text-xs text-danger">{errors.dueAt.message}</p> : <p className="text-xs text-muted-foreground">Выберите ближайший свободный слот.</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="details">Комментарий</Label>
        <Textarea id="details" placeholder="Что уточнить у клиента на следующем шаге" {...register("details")} aria-invalid={Boolean(errors.details)} />
        {errors.details ? <p className="text-xs text-danger">{errors.details.message}</p> : null}
      </div>
      <Button type="submit" disabled={!isValid || isLoading} aria-busy={isLoading}>
        {isLoading ? "Сохраняем..." : "Запланировать"}
      </Button>
      {isSubmitSuccessful ? <p className="text-xs text-success">Follow-up успешно создан.</p> : null}
    </form>
  );
}
