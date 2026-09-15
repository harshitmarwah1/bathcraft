-- BathCraft: password reset tokens.
--
-- Run this once in the Supabase SQL editor, or via `npm run db:migrate`.
-- It is idempotent, so re-running it is safe.
--
-- Backs the "forgot password" flow. A row is a single, time-limited permission
-- to set a new password for one user. Only the SHA-256 *hash* of the token is
-- stored: the raw token lives only in the email link, so a leak of this table
-- does not hand anyone a working reset link.

create table if not exists public.password_reset_tokens (
  -- SHA-256 of the raw token, hex. The raw token is never stored anywhere.
  token_hash  text        primary key,
  user_id     uuid        not null references public.users (id) on delete cascade,
  -- After this instant the token is dead. Enforced in the application; the
  -- column is what makes that check possible and lets a sweeper delete stragglers.
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

-- Reset requests replace any earlier ones for the same user, and the cascade
-- above cleans up when a user is deleted, so lookups by user must be cheap.
create index if not exists password_reset_tokens_user_id_idx
  on public.password_reset_tokens (user_id);

-- Same posture as users/accounts: RLS on, no policies. Every access is through
-- the server's service-role key, which bypasses RLS. If an anon/authenticated
-- key ever leaked, it would find this table empty and unwritable.
alter table public.password_reset_tokens enable row level security;
