import type { Mail } from "./mailer";

/**
 * The password-reset email. Returned as both HTML and plain text: every serious
 * client reads one or the other, and a text part keeps the message out of spam
 * folders that distrust HTML-only mail.
 *
 * Inline styles only, a table layout, and no external assets — that is simply
 * what mail clients render reliably. The palette matches the app's brand blue.
 */
export function resetEmail(opts: { to: string; resetUrl: string; firstName?: string }): Mail {
  const { to, resetUrl } = opts;
  const hi = opts.firstName?.trim() ? `Hi ${opts.firstName.trim()},` : "Hi there,";

  const text = [
    hi,
    "",
    "We received a request to reset the password for your Milagro Universe account.",
    "Open this link to choose a new password:",
    "",
    resetUrl,
    "",
    "This link expires in 1 hour and can be used once.",
    "If you didn't request this, you can safely ignore this email — your password stays the same.",
    "",
    "— The Milagro Universe team",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f6f9;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="font-size:18px;font-weight:700;color:#0b1a2c;letter-spacing:-0.01em;">Milagro Universe</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:700;color:#0b1a2c;letter-spacing:-0.02em;">Reset your password</h1>
                <p style="margin:0 0 8px;font-size:14.5px;line-height:1.6;color:#41505f;">${hi}</p>
                <p style="margin:0 0 24px;font-size:14.5px;line-height:1.6;color:#41505f;">
                  We received a request to reset the password for your account. Choose a new one with the button below.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:12px;background:#078cc8;">
                      <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">Choose a new password</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 8px;font-size:12.5px;line-height:1.6;color:#7b8794;">
                  This link expires in <strong style="color:#41505f;">1 hour</strong> and can be used once.
                </p>
                <p style="margin:0 0 4px;font-size:12.5px;line-height:1.6;color:#7b8794;">
                  If the button doesn't work, paste this address into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;">
                  <a href="${resetUrl}" style="color:#078cc8;text-decoration:underline;">${resetUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;border-top:1px solid #eef1f4;">
                <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#9aa4b0;">
                  If you didn't request this, you can safely ignore this email — your password won't change.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { to, subject: "Reset your Milagro Universe password", html, text };
}
