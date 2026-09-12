import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Account, AuthProviderId, Database, OnboardingAnswers, User } from "./types";

/**
 * The BathCraft user store.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS THE SEAM. Read before deploying.
 *
 * BathCraft had no database when Google sign-in was added, and inventing one
 * would have meant provisioning infrastructure nobody asked for. So the store
 * is defined as a narrow interface (`UserStore`) with a JSON-file implementation
 * good enough for local development and nothing more.
 *
 * A file store DOES NOT WORK on Vercel or any serverless host: the filesystem is
 * read-only, and each instance would hold its own copy anyway. Before production,
 * implement `UserStore` against a real database (Postgres, Neon, Supabase…) and
 * export that instead. Every caller goes through this interface, so that is the
 * only file that has to change.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface UserStore {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByAccount(provider: AuthProviderId, providerAccountId: string): Promise<User | null>;
  listAccounts(userId: string): Promise<Account[]>;
  createUser(input: NewUser, account: NewAccount): Promise<User>;
  linkAccount(userId: string, account: NewAccount): Promise<void>;
  updateProfile(userId: string, patch: ProfilePatch): Promise<User | null>;
  setOnboarding(userId: string, answers: OnboardingAnswers): Promise<User | null>;
}

export type NewUser = {
  email: string;
  firstName: string;
  lastName: string;
  image?: string | null;
};

export type NewAccount = {
  provider: AuthProviderId;
  providerAccountId: string;
  passwordHash?: string;
};

export type ProfilePatch = Partial<Pick<User, "firstName" | "lastName" | "image">>;

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/* ── file-backed implementation ─────────────────────────────────────────── */

const FILE = process.env.BATHCRAFT_DATA_FILE ?? join(process.cwd(), ".data", "bathcraft.json");
const EMPTY: Database = { users: [], accounts: [] };

/**
 * Every mutation runs through one promise chain. Node is single-threaded but
 * `await` is not atomic: two concurrent sign-ins could both read the file, both
 * decide the user does not exist, and both write — creating the duplicate user
 * this whole module exists to prevent.
 */
let queue: Promise<unknown> = Promise.resolve();

function serialise<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => {});
  return run;
}

async function read(): Promise<Database> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Database>;
    return { users: parsed.users ?? [], accounts: parsed.accounts ?? [] };
  } catch {
    // Missing or corrupt: an empty database is the correct starting point.
    return { ...EMPTY };
  }
}

/** Write to a sibling temp file and rename, so a crash mid-write cannot truncate. */
async function write(db: Database): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await rename(tmp, FILE);
}

const fileStore: UserStore = {
  async findUserById(id) {
    const db = await read();
    return db.users.find((u) => u.id === id) ?? null;
  },

  async findUserByEmail(email) {
    const db = await read();
    const key = normaliseEmail(email);
    return db.users.find((u) => u.email === key) ?? null;
  },

  async findUserByAccount(provider, providerAccountId) {
    const db = await read();
    const account = db.accounts.find(
      (a) => a.provider === provider && a.providerAccountId === providerAccountId,
    );
    if (!account) return null;
    return db.users.find((u) => u.id === account.userId) ?? null;
  },

  async listAccounts(userId) {
    const db = await read();
    return db.accounts.filter((a) => a.userId === userId);
  },

  createUser(input, account) {
    return serialise(async () => {
      const db = await read();
      const email = normaliseEmail(input.email);

      // Re-check inside the lock. The caller's check happened before the queue.
      const existing = db.users.find((u) => u.email === email);
      if (existing) {
        const linked = db.accounts.some(
          (a) => a.provider === account.provider && a.providerAccountId === account.providerAccountId,
        );
        if (!linked) {
          db.accounts.push({ ...account, userId: existing.id, createdAt: new Date().toISOString() });
          await write(db);
        }
        return existing;
      }

      const user: User = {
        id: randomUUID(),
        email,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        image: input.image ?? null,
        createdAt: new Date().toISOString(),
        onboarding: null,
      };
      db.users.push(user);
      db.accounts.push({ ...account, userId: user.id, createdAt: new Date().toISOString() });
      await write(db);
      return user;
    });
  },

  linkAccount(userId, account) {
    return serialise(async () => {
      const db = await read();
      const already = db.accounts.some(
        (a) => a.provider === account.provider && a.providerAccountId === account.providerAccountId,
      );
      if (already) return;
      db.accounts.push({ ...account, userId, createdAt: new Date().toISOString() });
      await write(db);
    });
  },

  updateProfile(userId, patch) {
    return serialise(async () => {
      const db = await read();
      const user = db.users.find((u) => u.id === userId);
      if (!user) return null;
      Object.assign(user, patch);
      await write(db);
      return user;
    });
  },

  setOnboarding(userId, answers) {
    return serialise(async () => {
      const db = await read();
      const user = db.users.find((u) => u.id === userId);
      if (!user) return null;
      user.onboarding = answers;
      await write(db);
      return user;
    });
  },
};

export const store: UserStore = fileStore;
