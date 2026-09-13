import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/planner/types";
import {
  defaultRoom,
  defaultStyle,
  defaultFixtures,
  defaultAddOns,
} from "@/lib/planner/defaults";

/**
 * The planner project store — where saved bathroom plans live.
 *
 * Same posture as lib/db/store.ts: Supabase Postgres in production (service role
 * key, server-only), a JSON file for local development. Selected by env in
 * `resolveProjectStore()`. Every method takes an explicit `ownerId` so access is
 * always scoped to the signed-in user; the callers (app/planner/actions.ts)
 * resolve that from the Auth.js session.
 */
export interface ProjectStore {
  list(ownerId: string): Promise<Project[]>;
  get(ownerId: string, id: string): Promise<Project | null>;
  create(ownerId: string, name: string): Promise<Project>;
  update(ownerId: string, id: string, patch: Partial<Project>): Promise<Project>;
  remove(ownerId: string, id: string): Promise<void>;
}

function nowIso() {
  return new Date().toISOString();
}

/** A fresh default project (mirrors the planner's own defaults). */
function newProject(ownerId: string, name: string): Project {
  return {
    id: randomUUID(),
    ownerId,
    members: [{ userId: ownerId, role: "owner" }],
    status: "draft",
    room: { ...defaultRoom(), name: name || defaultRoom().name },
    style: defaultStyle(),
    fixtures: defaultFixtures(),
    addOns: defaultAddOns(),
    plan: null,
    estimate: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

// ── Supabase implementation ──────────────────────────────────────────────────

type ProjectRow = {
  id: string;
  owner_id: string;
  name: string;
  status: Project["status"];
  data: Project;
  created_at: string;
  updated_at: string;
};

/** Reconstruct the Project, letting the columns be authoritative over the blob. */
function toProject(r: ProjectRow): Project {
  return {
    ...r.data,
    id: r.id,
    ownerId: r.owner_id,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

const COLS = "id, owner_id, name, status, data, created_at, updated_at";

const supabaseProjectStore: ProjectStore = {
  async list(ownerId) {
    const { data, error } = await db()
      .from("projects")
      .select(COLS)
      .eq("owner_id", ownerId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map(toProject);
  },

  async get(ownerId, id) {
    const { data, error } = await db()
      .from("projects")
      .select(COLS)
      .eq("owner_id", ownerId)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? toProject(data as ProjectRow) : null;
  },

  async create(ownerId, name) {
    const project = newProject(ownerId, name);
    const { error } = await db().from("projects").insert({
      id: project.id,
      owner_id: ownerId,
      name: project.room.name,
      status: project.status,
      data: project,
    });
    if (error) throw error;
    return project;
  },

  async update(ownerId, id, patch) {
    const current = await this.get(ownerId, id);
    if (!current) throw new Error(`Project ${id} not found`);
    const next: Project = { ...current, ...patch, id, ownerId, updatedAt: nowIso() };
    const { error } = await db()
      .from("projects")
      .update({ name: next.room.name, status: next.status, data: next, updated_at: next.updatedAt })
      .eq("owner_id", ownerId)
      .eq("id", id);
    if (error) throw error;
    return next;
  },

  async remove(ownerId, id) {
    const { error } = await db().from("projects").delete().eq("owner_id", ownerId).eq("id", id);
    if (error) throw error;
  },
};

// ── JSON-file implementation (local development) ─────────────────────────────

const FILE = process.env.BATHCRAFT_PROJECTS_FILE ?? join(process.cwd(), ".data", "projects.json");

async function readAll(): Promise<Project[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Project[];
  } catch {
    return [];
  }
}

async function writeAll(projects: Project[]) {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(projects, null, 2), "utf8");
  await rename(tmp, FILE); // atomic replace
}

const fileProjectStore: ProjectStore = {
  async list(ownerId) {
    return (await readAll())
      .filter((p) => p.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async get(ownerId, id) {
    return (await readAll()).find((p) => p.id === id && p.ownerId === ownerId) ?? null;
  },
  async create(ownerId, name) {
    const project = newProject(ownerId, name);
    const all = await readAll();
    all.push(project);
    await writeAll(all);
    return project;
  },
  async update(ownerId, id, patch) {
    const all = await readAll();
    const idx = all.findIndex((p) => p.id === id && p.ownerId === ownerId);
    if (idx === -1) throw new Error(`Project ${id} not found`);
    const next: Project = { ...all[idx], ...patch, id, ownerId, updatedAt: nowIso() };
    all[idx] = next;
    await writeAll(all);
    return next;
  },
  async remove(ownerId, id) {
    await writeAll((await readAll()).filter((p) => !(p.id === id && p.ownerId === ownerId)));
  },
};

const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const projectStore: ProjectStore = hasSupabase ? supabaseProjectStore : fileProjectStore;
export const projectStoreKind: "supabase" | "file" = hasSupabase ? "supabase" : "file";
