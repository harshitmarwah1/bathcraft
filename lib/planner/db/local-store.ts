import type { Project } from "@/lib/planner/types";
import { defaultRoom, defaultStyle, defaultFixtures, defaultAddOns } from "@/lib/planner/defaults";
import type { NewProjectInput, ProjectStore } from "./index";

const STORAGE_KEY = "bathcraft.projects";

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  // crypto.randomUUID is available in modern browsers and Node 22.
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** localStorage-backed store. Same interface a Supabase store will implement. */
export class LocalProjectStore implements ProjectStore {
  private readAll(): Project[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Project[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(projects: Project[]) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      /* storage unavailable — best effort */
    }
  }

  async list(userId: string): Promise<Project[]> {
    return this.readAll().filter(
      (p) => p.ownerId === userId || p.members.some((m) => m.userId === userId),
    );
  }

  async get(id: string): Promise<Project | null> {
    return this.readAll().find((p) => p.id === id) ?? null;
  }

  async create(input: NewProjectInput): Promise<Project> {
    const project: Project = {
      id: genId(),
      ownerId: input.ownerId,
      members: [{ userId: input.ownerId, role: "owner" }],
      status: "draft",
      room: { ...defaultRoom(), name: input.name },
      style: defaultStyle(),
      fixtures: defaultFixtures(),
      addOns: defaultAddOns(),
      plan: null,
      estimate: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const all = this.readAll();
    all.push(project);
    this.writeAll(all);
    return project;
  }

  async update(id: string, patch: Partial<Project>): Promise<Project> {
    const all = this.readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Project ${id} not found`);
    const updated: Project = { ...all[idx], ...patch, id, updatedAt: nowIso() };
    all[idx] = updated;
    this.writeAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((p) => p.id !== id));
  }
}
