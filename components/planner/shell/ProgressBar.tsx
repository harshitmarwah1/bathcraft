import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { splitBadge } from "./StepRail";

interface ProgressBarProps {
  badge: string;
  step: number;
  total: number;
  icon?: string;
}

/**
 * Step heading: "Step n of 6" + the step's title as the page's h1, then the
 * progress track. The fill animates with transform, not width, so it never
 * triggers layout.
 */
export function ProgressBar({ badge, step, total, icon = "straighten" }: ProgressBarProps) {
  const [meta, title] = splitBadge(badge);
  const ratio = step / total;
  return (
    <div className="pl-progress">
      <div className="pl-progress-row">
        <div className="pl-progress-text">
          <p className="pl-progress-meta">
            <MaterialIcon name={icon} size={15} />
            {meta}
          </p>
          <h1 className="pl-progress-title">{title}</h1>
        </div>
        <span className="pl-progress-pct">{Math.round(ratio * 100)}%</span>
      </div>
      <div
        className="pl-progress-track"
        role="progressbar"
        aria-label={meta}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
      >
        <div className="pl-progress-fill" style={{ transform: `scaleX(${ratio})` }} />
      </div>
    </div>
  );
}
