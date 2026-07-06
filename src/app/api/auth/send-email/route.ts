import { NextResponse, type NextRequest } from "next/server";
import { Webhook } from "standardwebhooks";
import { Resend } from "resend";

// Supabase "Send Email" auth hook'u.
// Supabase OTP/magic-link token'ını üretir → bu route'a POST eder →
// biz de maili Resend üzerinden kendi şablonumuzla göndeririz.
// Kurulum: Supabase Dashboard → Authentication → Hooks → "Send Email" → bu route'un public URL'i.
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);
// Dashboard'daki secret "v1,whsec_..." formatında; standardwebhooks "v1," önekini istemiyor.
const hookSecret = (process.env.SEND_EMAIL_HOOK_SECRET ?? "").replace(/^v1,/, "");

type EmailActionType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email_change"
  | "email";

interface HookPayload {
  user: { email: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: EmailActionType;
    site_url: string;
  };
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const headers = Object.fromEntries(request.headers);

  let data: HookPayload;
  try {
    const wh = new Webhook(hookSecret);
    data = wh.verify(payload, headers) as HookPayload;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const { user, email_data } = data;
  const { token, token_hash, redirect_to, email_action_type } = email_data;

  // Magic-link doğrulama URL'i — tıklanınca Supabase /verify → redirect_to?code=... → /auth/callback
  const confirmUrl =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify` +
    `?token=${encodeURIComponent(token_hash)}` +
    `&type=${encodeURIComponent(email_action_type)}` +
    `&redirect_to=${encodeURIComponent(redirect_to)}`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Bridge <bridge@ytublockchain.com>",
    to: [user.email],
    subject: "Bridge — Giriş linkin",
    html: renderEmail(confirmUrl, token),
    text:
      `Bridge'e giriş yapmak için linke tıkla:\n${confirmUrl}\n\n` +
      `Alternatif olarak bu kodu girebilirsin: ${token}\n` +
      `Link ve kod 1 saat geçerlidir. Bu isteği sen yapmadıysan yok say.`,
  });

  if (error) {
    return NextResponse.json(
      { error: { http_code: 500, message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({});
}

function renderEmail(confirmUrl: string, token: string): string {
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e8eb;">
            <tr>
              <td style="padding:32px 32px 24px 32px;">
                <div style="font-size:18px;font-weight:600;color:#1e3a5f;">Bridge</div>
                <div style="font-size:12px;color:#8a94a6;margin-top:2px;">YTÜ Blockchain</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <h1 style="font-size:20px;font-weight:600;color:#1a1a1a;margin:0 0 8px 0;">Giriş yap</h1>
                <p style="font-size:14px;line-height:1.6;color:#5a6472;margin:0 0 24px 0;">
                  Aşağıdaki butona tıklayarak giriş yapabilirsin. Şifre yok — link tek kullanımlık ve 1 saat geçerli.
                </p>
                <a href="${confirmUrl}" style="display:inline-block;background:#1e3a5f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;">
                  Giriş yap →
                </a>
                <p style="font-size:13px;line-height:1.6;color:#8a94a6;margin:24px 0 0 0;">
                  Buton çalışmazsa bu kodu giriş ekranında kullanabilirsin:
                  <span style="display:inline-block;font-family:monospace;font-size:16px;font-weight:600;color:#1e3a5f;letter-spacing:2px;margin-top:4px;">${token}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <hr style="border:none;border-top:1px solid #eef0f2;margin:0 0 16px 0;" />
                <p style="font-size:12px;line-height:1.6;color:#a0a8b4;margin:0;">
                  Bu isteği sen yapmadıysan bu maili yok sayabilirsin.
                </p>
              </td>
            </tr>
          </table>
          <p style="font-size:11px;color:#b4bcc8;margin:16px 0 0 0;">YTÜ Blockchain · Bridge</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
