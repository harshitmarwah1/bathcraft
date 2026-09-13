"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/planner/session";
import { useProjectStore } from "./project-store";

/** Ensures a session + a loaded project. Returns the current project (or null
 *  while loading). Used by every wizard step page. */
export function useEnsureProject() {
  const { user, ready } = useSession();
  const project = useProjectStore((s) => s.project);
  const loadOrCreate = useProjectStore((s) => s.loadOrCreate);

  useEffect(() => {
    if (ready && user && !project) void loadOrCreate();
  }, [ready, user, project, loadOrCreate]);

  return { project, ready: ready && !!project };
}
