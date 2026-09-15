import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { StepRail } from "./StepRail";

interface WizardShellProps {
  /** Kept for callers; the step heading (ProgressBar) now shows the step name. */
  subtitle?: string;
  /** Step heading + progress bar, spanning the full content width. */
  progress?: ReactNode;
  /** Secondary panel: sticky beside the content on laptops, stacked below it on phones. */
  aside?: ReactNode;
  /** The step's action bar (Back / Continue), sticky at the bottom of the content. */
  footer?: ReactNode;
  /** Wizard steps show the step rail; standalone pages (docs, guides) do not. */
  showSteps?: boolean;
  children: ReactNode;
}

/**
 * The planner frame. Laptop-first: at 1024px and up it is a full-width app —
 * header, step rail, content with an optional side panel, sticky action bar.
 * Below that it keeps the original phone layout (header, scrolling content,
 * bottom nav). All layout lives in app/planner/planner.css so the breakpoints
 * can actually apply; inline styles cannot carry a media query.
 */
export function WizardShell({
  progress,
  aside,
  footer,
  showSteps = true,
  children,
}: WizardShellProps) {
  return (
    <div className="pl-root">
      <div className="app-frame">
        <AppHeader />
        <div className="pl-body" data-steps={showSteps ? "true" : "false"}>
          {showSteps && <StepRail />}
          <main className="pl-main nsb">
            {progress}
            <div className="pl-content" data-aside={aside ? "true" : "false"}>
              <div className="pl-primary">{children}</div>
              {aside && <aside className="pl-aside">{aside}</aside>}
            </div>
            {footer}
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
