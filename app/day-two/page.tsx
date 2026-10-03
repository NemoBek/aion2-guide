import type { Metadata } from "next";
import DayTwoGuide from "@/components/day-two-guide";
import "../day-two.css";

export const metadata: Metadata = {
  title: "После 45: маршрут до 2200 GS, крафт и энергия | Aion 2",
  description: "Подробный разбор видео TitanTheF: пороги подземелий, крафт лука, арканы, энергия и пример лучника. Реальные скриншоты с пояснениями.",
};

export default function DayTwoPage() { return <DayTwoGuide />; }
