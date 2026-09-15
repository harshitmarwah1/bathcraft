"use client";

import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

/**
 * The step's action bar, sticky at the bottom of the content. Phones: Back and
 * Continue side by side with the "Next: …" hint beneath. Laptops: Back on the
 * left, the hint beside Continue on the right. Layout lives in planner.css.
 */
export function StepFooterCta({
  label,
  subLabel,
  icon = "arrow_forward",
  onClick,
  onBack,
  backLabel,
  disabled,
}: {
  label: string;
  subLabel: string;
  icon?: string;
  onClick: () => void;
  onBack?: () => void;
  backLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="pl-footer no-print">
      <div className="pl-footer-inner" data-back={onBack ? "true" : "false"}>
        {onBack && (
          <button type="button" onClick={onBack} className="pl-btn pl-btn-secondary">
            <MaterialIcon name="arrow_back" size={18} />
            {backLabel}
          </button>
        )}
        <p className="pl-footer-sub">
          <span className="pl-dot" aria-hidden="true" />
          {subLabel}
        </p>
        <button type="button" onClick={onClick} disabled={disabled} className="pl-btn pl-btn-primary">
          <span>{label}</span>
          <MaterialIcon name={icon} size={18} />
        </button>
      </div>
    </div>
  );
}
