import { SignInForm } from "@/features/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur md:grid md:grid-cols-2 md:gap-6 md:p-8">
        <section className="mb-6 md:mb-0">
          <p className="mb-2 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Furniture Marketplace Workspace</p>
          <h1 className="text-3xl font-semibold leading-tight">Управляйте заявкой на мебель от запроса до передачи в производство</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Интерфейс построен вокруг ключевого сценария: быстро добавить заявку, подобрать мебельщика и сразу запланировать follow-up.
          </p>
        </section>
        <div className="flex items-center justify-center">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
