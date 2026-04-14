"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useAppToast } from "@/shared/lib/toast-provider";

const leadSchema = z.object({
  company: z.string().min(2, "Введите название компании"),
  contactName: z.string().min(2, "Введите контактное лицо"),
  contactPhone: z.string().min(8, "Введите телефон"),
  budget: z
    .string()
    .min(1, "Укажите бюджет")
    .refine((value) => Number(value) > 0, "Бюджет должен быть больше 0"),
  source: z.string().min(2, "Укажите источник"),
  note: z.string().min(10, "Добавьте контекст минимум 10 символов"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadFormModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useAppToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onChange",
    defaultValues: {
      company: "",
      contactName: "",
      contactPhone: "",
      budget: "",
      source: "Сайт",
      note: "",
    },
  });

  const source = watch("source");

  const submit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsLoading(false);
    setOpen(false);
    reset();
    pushToast({
      title: "Заявка добавлена",
      description: "Новая заявка создана и отправлена в этап первичной обработки",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить заявку</Button>
      </DialogTrigger>
      <DialogContent>
        <div>
          <h2 className="text-lg font-semibold">Новая заявка</h2>
          <p className="text-sm text-muted-foreground">Заполните минимум полей, чтобы быстро передать заказ в обработку.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company">Компания</Label>
              <Input id="company" {...register("company")} aria-invalid={Boolean(errors.company)} />
              {errors.company ? <p className="text-xs text-danger">{errors.company.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Контакт</Label>
              <Input id="contactName" {...register("contactName")} aria-invalid={Boolean(errors.contactName)} />
              {errors.contactName ? <p className="text-xs text-danger">{errors.contactName.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Телефон</Label>
              <Input id="contactPhone" placeholder="+7 7XX XXX XX XX" {...register("contactPhone")} aria-invalid={Boolean(errors.contactPhone)} />
              {errors.contactPhone ? <p className="text-xs text-danger">{errors.contactPhone.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget">Бюджет, KZT</Label>
              <Input id="budget" type="number" {...register("budget")} aria-invalid={Boolean(errors.budget)} />
              {errors.budget ? <p className="text-xs text-danger">{errors.budget.message}</p> : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="source">Источник</Label>
            <Select value={source} onValueChange={(value) => setValue("source", value, { shouldValidate: true })}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Выберите источник" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Сайт">Сайт</SelectItem>
                <SelectItem value="Реферал">Реферал</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Холодный звонок">Холодный звонок</SelectItem>
              </SelectContent>
            </Select>
            {errors.source ? <p className="text-xs text-danger">{errors.source.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Комментарий</Label>
            <Textarea id="note" {...register("note")} aria-invalid={Boolean(errors.note)} />
            {errors.note ? (
              <p className="text-xs text-danger">{errors.note.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Укажите контекст, чтобы менеджер быстрее провел квалификацию.</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={!isValid || isLoading} aria-busy={isLoading}>
              {isLoading ? "Создаем..." : "Создать заявку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
