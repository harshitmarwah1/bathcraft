"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";

const BASE_INPUT =
  "h-[54px] w-full rounded-[12px] border bg-surface-raised px-4 text-[16px] text-ink " +
  "placeholder:text-body-soft/70 transition-[border-color,box-shadow] duration-200 " +
  "focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/12";

/** Text input with label, error and the aria wiring that ties them together. */
export function TextField({
  label,
  error,
  hint,
  className = "",
  ...rest
}: {
  label: string;
  error?: string | null;
  hint?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`${BASE_INPUT} ${error ? "border-danger" : "border-field"}`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[13.5px] text-body-soft">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** Password input with an accessible show/hide toggle. */
export function PasswordField({
  label,
  error,
  hint,
  className = "",
  ...rest
}: {
  label: string;
  error?: string | null;
  hint?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const t = useT();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={shown ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`${BASE_INPUT} pr-12 ${error ? "border-danger" : "border-field"}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? t("Hide password") : t("Show password")}
          aria-pressed={shown}
          className="absolute top-1/2 right-1.5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[9px] text-body-soft transition-colors hover:bg-wash hover:text-brand"
        >
          <Icon name={shown ? "eyeOff" : "eye"} size={18} />
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[13.5px] text-body-soft">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[14px] text-danger">
      <Icon name="warning" size={14} className="mt-px shrink-0" />
      {children}
    </p>
  );
}

/** Square checkbox with a real <input>, so it is keyboard- and label-operable. */
export function Checkbox({
  label,
  error,
  className = "",
  ...rest
}: { label: ReactNode; error?: string | null; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            "mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border bg-surface-raised",
            "transition-[background-color,border-color] duration-150",
            "checked:border-brand checked:bg-brand",
            "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M3.5 8.5l3 3 6-6.5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] checked:bg-center checked:bg-no-repeat",
            error ? "border-danger" : "border-field",
          ].join(" ")}
          {...rest}
        />
        <label htmlFor={id} className="cursor-pointer text-[14.5px] leading-snug text-body">
          {label}
        </label>
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** The subtle alert that sits above a form when the whole submission failed. */
export function AuthAlert({ title, body }: { title: string; body?: string }) {
  return (
    <div
      role="alert"
      className="mb-5 flex gap-2.5 rounded-[12px] border border-danger/25 bg-danger/[0.06] px-4 py-3"
    >
      <span className="mt-px text-danger">
        <Icon name="warning" size={16} />
      </span>
      <div>
        <p className="text-[15px] font-semibold text-danger-dark">{title}</p>
        {body && <p className="mt-0.5 text-[14px] text-danger-dark/80">{body}</p>}
      </div>
    </div>
  );
}

/** Full-width submit that swaps to a spinner without changing height. */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-action text-[16px] font-semibold text-on-action shadow-[0_6px_18px_rgb(138_90_43/0.28)] transition-[transform,background-color,opacity] duration-200 hover:-translate-y-px hover:bg-action-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white",
        className,
      ].join(" ")}
    />
  );
}

/** The "──── OR ────" rule between primary and social sign-in. */
export function OrRule() {
  return (
    <div className="my-5 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-field" />
      <span className="text-[13px] font-medium tracking-[0.08em] text-body-soft">OR</span>
      <span className="h-px flex-1 bg-field" />
    </div>
  );
}

/** Social provider button. Wired to the mock like every other path here. */
export function SocialButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[14px] border border-field bg-surface-raised text-[16px] font-semibold text-ink transition-[background-color,transform,border-color] duration-200 hover:-translate-y-px hover:bg-wash disabled:opacity-60 motion-reduce:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
