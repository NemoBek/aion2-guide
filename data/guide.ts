import { Crown, Gem, Hammer, Sparkles, Target } from "lucide-react";
import snapshot from "./guide.snapshot.json";

export type GuideStep = { id: string; range: string; title: string; short: string; details: string[]; image?: string };
export type GuideTask = { id: string; title: string; text: string };
export type GuideClass = { name: string; role: string; summary: string; startBuild: string; skillBuild: string; stones: string; files: string[] };
export type FarmTier = { tier: "S" | "A" | "B"; color: string; items: string[] };
export type Mechanic = { icon: keyof typeof mechanicIcons; title: string; text: string; image: string };
export type GuideSnapshot = {
  schemaVersion: 1;
  sourceUrl: string;
  lastSyncedAt: string | null;
  routeSteps: GuideStep[];
  after45: GuideTask[];
  classData: Record<"ranger" | "assassin" | "chanter", GuideClass>;
  farmTiers: FarmTier[];
  mechanics: Mechanic[];
  galleries: { progression: string[] };
};

const mechanicIcons = { Hammer, Target, Crown, Gem, Sparkles };
const content = snapshot as GuideSnapshot;

export const guide = {
  ...content,
  mechanics: content.mechanics.map((item) => ({ ...item, icon: mechanicIcons[item.icon] })),
};

export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
