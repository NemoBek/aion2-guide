import type { Metadata } from "next";
import "./globals.css";
const favicon = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg`;
export const metadata: Metadata = { title: "Aion 2 — путь новичка", description: "Понятный интерактивный гайд по Aion 2: прокачка 1–45, первые цели, фарм, механики и билды классов.", icons: { icon: favicon, shortcut: favicon } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body className="antialiased">{children}</body></html>; }
