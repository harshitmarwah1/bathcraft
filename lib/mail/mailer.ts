import nodemailer, { type Transporter } from "nodemailer";

/**
 * The one place Milagro Universe sends email from.
 *
 * Transport is SMTP, configured entirely from the environment so no host or
 * credential is ever hard-coded. For Gmail that means an *app password*, not
 * the account password — see .env.example.
 *
 *   SMTP_HOST     smtp.gmail.com
 *   SMTP_PORT     465 (implicit TLS) or 587 (STARTTLS)
 *   SMTP_SECURE   true for 465, false for 587 — defaults from the port
 *   SMTP_USER     the sending Gmail address
 *   SMTP_PASS     the 16-character Gmail app password
 *   MAIL_FROM     the From header, e.g. "Milagro Universe <you@gmail.com>"
 *
 * When SMTP_HOST is unset there is nothing to send through. Rather than fake
 * success (which would hide a broken production config) the transport logs the
 * whole message to the server console, so local development still shows the
 * reset link. `mailConfigured()` lets callers tell the two apart.
 */

let cached: Transporter | null = null;

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

function resolveTransport(): Transporter {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  if (!host) {
    // Dev fallback: serialise the message to JSON instead of dialing SMTP.
    cached = nodemailer.createTransport({ jsonTransport: true });
    return cached;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465; // implicit TLS is the norm on 465, STARTTLS on 587
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
  });
  return cached;
}

export type Mail = { to: string; subject: string; html: string; text: string };

export async function sendMail(mail: Mail): Promise<void> {
  const from =
    process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "Milagro Universe <no-reply@milagro-universe.app>";

  const info = await resolveTransport().sendMail({ from, ...mail });

  if (!mailConfigured()) {
    // The link is inside `message`; surface it so a developer can follow it.
    console.warn(
      "\n[bathcraft] SMTP is not configured — no email was sent.\n" +
        "Set SMTP_HOST/SMTP_USER/SMTP_PASS to send for real. Message follows:\n" +
        String((info as { message?: Buffer | string }).message ?? "") +
        "\n",
    );
  }
}
