"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";

/** The six wizard steps, in order. Each badge reads "Step n of 6 • Title". */
export const PLANNER_STEPS: { href: string; badge: keyof Dictionary }[] = [
  { href: "/planner/space", badge: "stepBadge" },
  { href: "/planner/style", badge: "step2Badge" },
  { href: "/planner/fixtures", badge: "step3Badge" },
  { href: "/planner/plan", badge: "step4Badge" },
  { href: "/planner/estimate", badge: "step5Badge" },
  { href: "/planner/brief", badge: "step6Badge" },
];

/** "Step 1 of 6 • Dimensions" → ["Step 1 of 6", "Dimensions"]. */
export function splitBadge(badge: string): [string, string] {
  const [meta, title] = badge.split("•").map((s) => s.trim());
  return [meta, title ?? meta];
}

/**
 * Laptop-only step rail. On phones the step heading carries progress instead;
 * CSS hides this below 1024px.
 */
export function StepRail() {
  const { t } = useI18n();
  const pathname = usePathname();
  const projectName = useProjectStore((s) => s.project?.room.name);
  const current = PLANNER_STEPS.findIndex((s) => pathname.startsWith(s.href));

  return (
    <nav className="pl-rail" aria-label={t.navPlanner}>
      {projectName && <p className="pl-rail-project">{projectName}</p>}
      <ol className="pl-rail-list">
        {PLANNER_STEPS.map((step, i) => {
          const [, title] = splitBadge(String(t[step.badge]));
          const state = i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li key={step.href}>
              <Link
                href={step.href}
                className="pl-rail-link"
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span className="pl-rail-num" aria-hidden="true">
                  {state === "done" ? <MaterialIcon name="check" size={16} /> : i + 1}
                </span>
                <span>{title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
