/**
 * Applies every file in supabase/migrations, in filename order.
 *
 *   npm run db:migrate
 *
 * Uses POSTGRES_URL_NON_POOLING, not POSTGRES_URL: DDL through a transaction
 * pooler is a good way to get "prepared statement already exists" or a silently
 * half-applied schema. The direct connection is the right one for migrations.
 *
 * The migrations themselves are idempotent (create ... if not exists), so this
 * is safe to re-run. It is deliberately not a migration *framework* — there is
 * no version table and no down-migrations, because one schema file does not
 * justify either.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // Absent is fine — the value may come from the real environment.
  }
}

const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
if (!url) {
  console.error("\n  ✗ POSTGRES_URL_NON_POOLING is not set. Run `vercel env pull` first.\n");
  process.exit(1);
}

const dir = join("supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
if (files.length === 0) {
  console.error("  ✗ no .sql files in " + dir);
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

console.log("\nApplying migrations\n");
try {
  for (const file of files) {
    process.stdout.write("  " + file + " ... ");
    await sql.unsafe(readFileSync(join(dir, file), "utf8"));
    console.log("ok");
  }
  console.log("\nSchema is up to date.\n");
} catch (err) {
  console.error("failed\n");
  console.error("  " + (err instanceof Error ? err.message : String(err)) + "\n");
  process.exitCode = 1;
} finally {
  await sql.end();
}
