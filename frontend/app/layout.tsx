import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { ThemeProvider } from "@/shared/lib/theme";
import { ToastContextProvider } from "@/shared/lib/toast-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Capybara Marketplace",
  description: "Маркетплейс заказа мебели: заявки, мебельщики и этапы выполнения",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastContextProvider>{children}</ToastContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
