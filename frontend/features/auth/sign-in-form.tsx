"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useAppToast } from "@/shared/lib/toast-provider";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const { pushToast } = useAppToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    pushToast({ title: "Вход выполнен", description: "Перенаправляем в рабочий кабинет маркетплейса" });
    router.push("/dashboard");
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход в Capybara Marketplace</CardTitle>
        <CardDescription>Быстрый доступ к заявкам, мебельщикам и задачам</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Форма входа">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="orders@company.kz" aria-invalid={Boolean(errors.email)} {...register("email")} />
            <p className="text-xs text-muted-foreground">Используйте рабочий email для доступа к заказам компании.</p>
            {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" placeholder="********" aria-invalid={Boolean(errors.password)} {...register("password")} />
            {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isLoading} aria-busy={isLoading}>
            {isLoading ? "Входим..." : "Войти"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Нет аккаунта? <Link href="#" className="underline">Запросить доступ</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
