import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

interface ProgressBarProps {
  badge: string;
  step: number;
  total: number;
  icon?: string;
}

/** Wizard progress row: step badge + percent + fill bar. */
export function ProgressBar({ badge, step, total, icon = "straighten" }: ProgressBarProps) {
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{ padding: "8px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            color: "var(--color-primary-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <MaterialIcon name={icon} size={14} style={{ flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{badge}</span>
        </span>
        <span
          style={{ color: "var(--color-on-surface-variant)", fontWeight: 800, flexShrink: 0, marginLeft: 6 }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 6,
          borderRadius: 999,
          background: "var(--color-surface-high)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: "var(--color-primary)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
