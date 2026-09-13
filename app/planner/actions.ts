"use server";

import { auth } from "@/auth";
import { projectStore } from "@/lib/db/projects";
import type { Project } from "@/lib/planner/types";

/**
 * Server actions for planner projects.
 *
 * The only bridge between the client planner and the database. Each resolves the
 * user id from the Auth.js session and scopes every store call to it, so a
 * client can only ever read or write its own projects. The service-role Supabase
 * key lives behind these functions and never reaches the browser.
 */
async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Not authenticated");
  return id;
}

export async function listProjectsAction(): Promise<Project[]> {
  return projectStore.list(await requireUserId());
}

/** The planner's entry: resume the latest project, or start a fresh one
 *  (named from the user's onboarding answer when they have one). */
export async function loadOrCreateProjectAction(): Promise<Project> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const existing = await projectStore.list(userId);
  if (existing[0]) return existing[0];
  const seededName = session.user.onboarding?.bathroomName?.trim() || "My Bathroom";
  return projectStore.create(userId, seededName);
}

export async function getProjectAction(projectId: string): Promise<Project | null> {
  return projectStore.get(await requireUserId(), projectId);
}

export async function createProjectAction(name: string): Promise<Project> {
  return projectStore.create(await requireUserId(), name);
}

export async function saveProjectAction(project: Project): Promise<Project> {
  return projectStore.update(await requireUserId(), project.id, project);
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  return projectStore.remove(await requireUserId(), projectId);
}
