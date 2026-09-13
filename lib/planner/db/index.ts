/**
 * Planner data access (client side).
 *
 * Persistence now lives server-side: these are thin re-exports of the Auth.js-
 * scoped server actions in app/planner/actions.ts, which write to Supabase in
 * production and a JSON file in local dev. The old localStorage store is gone —
 * projects now persist per user and load on any device.
 */
export {
  listProjectsAction as listProjects,
  loadOrCreateProjectAction as loadOrCreateProject,
  getProjectAction as getProject,
  createProjectAction as createProject,
  saveProjectAction as saveProject,
  deleteProjectAction as deleteProject,
} from "@/app/planner/actions";
