import "@/app/globals.css";

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
