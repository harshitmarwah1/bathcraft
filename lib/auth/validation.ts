/** Field validation for the auth forms. Pure functions, no React, no DOM. */

export const PASSWORD_RULES = [
  { id: "length", label: "8+ characters", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
] as const;

/**
 * Deliberately permissive: this gate exists to catch typos, not to police which
 * addresses are real. Anything stricter rejects valid mail.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Email is required.";
  if (!EMAIL.test(v)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Password is required.";
  return null;
}

/** Sign-up is stricter than sign-in: here the password is being chosen. */
export function validateNewPassword(value: string): string | null {
  if (!value) return "Password is required.";
  if (!PASSWORD_RULES.every((r) => r.test(value))) {
    return "Use at least 8 characters with a mix of letters and numbers.";
  }
  return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required.`;
}
