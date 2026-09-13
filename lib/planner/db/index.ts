/**
 * Provider-agnostic data seam for projects.
 *
 * Consumers depend only on `ProjectStore`. Ships with `LocalProjectStore`
 * (localStorage) today; a Supabase-backed store implementing the same
 * interface is added in M6 and selected via env. Row-level security and
 * membership rules live behind the Supabase implementation, so the interface
 * stays identical.
 */
import type { Project } from "@/lib/planner/types";

export interface NewProjectInput {
  ownerId: string;
  name: string;
}

export interface ProjectStore {
  list(userId: string): Promise<Project[]>;
  get(id: string): Promise<Project | null>;
  create(input: NewProjectInput): Promise<Project>;
  update(id: string, patch: Partial<Project>): Promise<Project>;
  remove(id: string): Promise<void>;
}

import { LocalProjectStore } from "./local-store";

let store: ProjectStore | null = null;

export function getProjectStore(): ProjectStore {
  if (store) return store;
  // M6 selection point: return a SupabaseProjectStore when configured.
  store = new LocalProjectStore();
  return store;
}
