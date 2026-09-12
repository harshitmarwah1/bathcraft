import { handlers } from "@/auth";

/**
 * The Auth.js endpoint. Every OAuth URL Google needs is derived from this path:
 * the redirect URI is /api/auth/callback/google and nothing else.
 */
export const { GET, POST } = handlers;
