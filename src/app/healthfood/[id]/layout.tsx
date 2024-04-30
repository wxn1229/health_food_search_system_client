import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function HealthFoodIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full  bg-green-100 dark:bg-zinc-800">
      {children}
    </div>
  );
}
