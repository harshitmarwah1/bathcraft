import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normaliseEmail } from "./types";
import type {
  Account,
  AuthProviderId,
  NewAccount,
  NewPasswordReset,
  NewUser,
  OnboardingAnswers,
  PasswordReset,
  ProfilePatch,
  User,
  UserStore,
} from "./types";

/**
 * The production user store: Supabase Postgres.
 *
 * Uses the SERVICE ROLE key, which bypasses Row Level Security. That is correct
 * here — every call is server-side, behind Auth.js — and it is also why the key
 * must never be exposed to the browser. It is read from a non-public env var and
 * this module is never imported by a client component.
 *
 * supabase-js talks HTTP rather than holding a Postgres connection, which is
 * what makes it safe on serverless: a hundred concurrent functions cost a
 * hundred requests, not a hundred pooled connections.
 */

/** snake_case in the database, camelCase in the app. Converted in one place. */
type UserRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  onboarding: OnboardingAnswers | null;
  created_at: string;
};

type AccountRow = {
  user_id: string;
  provider: AuthProviderId;
  provider_account_id: string;
  password_hash: string | null;
  created_at: string;
};

type PasswordResetRow = {
  token_hash: string;
  user_id: string;
  expires_at: string;
  created_at: string;
};

const toUser = (r: UserRow): User => ({
  id: r.id,
  email: r.email,
  firstName: r.first_name,
  lastName: r.last_name,
  image: r.image,
  onboarding: r.onboarding,
  createdAt: r.created_at,
});

const toAccount = (r: AccountRow): Account => ({
  userId: r.user_id,
  provider: r.provider,
  providerAccountId: r.provider_account_id,
  ...(r.password_hash ? { passwordHash: r.password_hash } : {}),
  createdAt: r.created_at,
});

const toPasswordReset = (r: PasswordResetRow): PasswordReset => ({
  tokenHash: r.token_hash,
  userId: r.user_id,
  expiresAt: r.expires_at,
  createdAt: r.created_at,
});

const USER_COLS = "id, email, first_name, last_name, image, onboarding, created_at";
const ACCOUNT_COLS = "user_id, provider, provider_account_id, password_hash, created_at";
const RESET_COLS = "token_hash, user_id, expires_at, created_at";

/** Postgres unique-violation. The one error here that is a normal outcome. */
const UNIQUE_VIOLATION = "23505";

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  client = createClient(url, key, {
    // There is no Supabase session to keep — Auth.js owns the session, and this
    // client is a database driver. Persisting one would be a second auth system.
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const supabaseStore: UserStore = {
  async findUserById(id) {
    const { data, error } = await db().from("users").select(USER_COLS).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? toUser(data as UserRow) : null;
  },

  async findUserByEmail(email) {
    const { data, error } = await db()
      .from("users")
      .select(USER_COLS)
      .eq("email", normaliseEmail(email))
      .maybeSingle();
    if (error) throw error;
    return data ? toUser(data as UserRow) : null;
  },

  async findUserByAccount(provider, providerAccountId) {
    const { data, error } = await db()
      .from("accounts")
      .select(`users (${USER_COLS})`)
      .eq("provider", provider)
      .eq("provider_account_id", providerAccountId)
      .maybeSingle();
    if (error) throw error;
    const joined = (data as { users: UserRow | null } | null)?.users;
    return joined ? toUser(joined) : null;
  },

  async listAccounts(userId) {
    const { data, error } = await db().from("accounts").select(ACCOUNT_COLS).eq("user_id", userId);
    if (error) throw error;
    return (data as AccountRow[]).map(toAccount);
  },

  /**
   * Create a user and link the first provider.
   *
   * The uniqueness rules are enforced by indexes, not by a lock in this process:
   * two functions racing the same first sign-in cannot both win. The loser sees
   * 23505 and reads back the row the winner wrote, which is why a duplicate
   * user is impossible here in a way it never was with the file store.
   */
  async createUser(input: NewUser, account: NewAccount) {
    const email = normaliseEmail(input.email);
    const supabase = db();

    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        image: input.image ?? null,
      })
      .select(USER_COLS)
      .single();

    let user: User;
    if (error) {
      if (error.code !== UNIQUE_VIOLATION) throw error;
      const existing = await this.findUserByEmail(email);
      if (!existing) throw error;
      user = existing;
    } else {
      user = toUser(data as UserRow);
    }

    await this.linkAccount(user.id, account);
    return user;
  },

  async linkAccount(userId, account) {
    const { error } = await db().from("accounts").insert({
      user_id: userId,
      provider: account.provider,
      provider_account_id: account.providerAccountId,
      password_hash: account.passwordHash ?? null,
    });
    // Already linked is success, not failure — signing in twice must be a no-op.
    if (error && error.code !== UNIQUE_VIOLATION) throw error;
  },

  async updateProfile(userId, patch: ProfilePatch) {
    const row: Record<string, unknown> = {};
    if (patch.firstName !== undefined) row.first_name = patch.firstName;
    if (patch.lastName !== undefined) row.last_name = patch.lastName;
    if (patch.image !== undefined) row.image = patch.image;
    if (Object.keys(row).length === 0) return this.findUserById(userId);

    const { data, error } = await db()
      .from("users")
      .update(row)
      .eq("id", userId)
      .select(USER_COLS)
      .maybeSingle();
    if (error) throw error;
    return data ? toUser(data as UserRow) : null;
  },

  async setOnboarding(userId, answers) {
    const { data, error } = await db()
      .from("users")
      .update({ onboarding: answers })
      .eq("id", userId)
      .select(USER_COLS)
      .maybeSingle();
    if (error) throw error;
    return data ? toUser(data as UserRow) : null;
  },

  async createPasswordReset(reset: NewPasswordReset) {
    const supabase = db();
    // One live link per user: drop any earlier ones before issuing a new one, so
    // requesting a second reset silently retires the first.
    const cleared = await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("user_id", reset.userId);
    if (cleared.error) throw cleared.error;

    const { error } = await supabase.from("password_reset_tokens").insert({
      token_hash: reset.tokenHash,
      user_id: reset.userId,
      expires_at: reset.expiresAt,
    });
    if (error) throw error;
  },

  async findPasswordReset(tokenHash) {
    const { data, error } = await db()
      .from("password_reset_tokens")
      .select(RESET_COLS)
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (error) throw error;
    return data ? toPasswordReset(data as PasswordResetRow) : null;
  },

  async deletePasswordReset(tokenHash) {
    const { error } = await db()
      .from("password_reset_tokens")
      .delete()
      .eq("token_hash", tokenHash);
    if (error) throw error;
  },

  async setCredentialsPassword(userId, passwordHash) {
    const { data, error } = await db()
      .from("accounts")
      .update({ password_hash: passwordHash })
      .eq("user_id", userId)
      .eq("provider", "credentials")
      .select("user_id");
    if (error) throw error;
    // No credentials row to update (e.g. a Google-only account) → nothing changed.
    return (data?.length ?? 0) > 0;
  },
};
