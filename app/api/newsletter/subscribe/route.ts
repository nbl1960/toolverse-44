import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(5);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeResponse {
  success: boolean;
  /**
   * True only if actually forwarded to a real subscriber-list provider
   * (a configured webhook — set NEWSLETTER_WEBHOOK_URL to a Mailchimp/
   * ConvertKit/Resend Audiences endpoint or equivalent). False means the
   * email was validated and logged server-side, but nothing subscribed
   * them anywhere yet. Same honest pattern as /api/contact/submit —
   * this never claims "you're subscribed" unless something real
   * actually happened.
   */
  delivered: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Too many attempts. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, delivered: false, error: "Malformed request body." }, { status: 400 });
    }

    const { email } = body as { email?: unknown };
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json({ success: false, delivered: false, error: "Enter a valid email address." }, { status: 400 });
    }

    const submission = { email: email.trim(), subscribedAt: new Date().toISOString() };
    console.log("[/api/newsletter/subscribe] New signup:", submission);

    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    let delivered = false;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
        delivered = webhookResponse.ok;
      } catch (webhookError) {
        console.error("[/api/newsletter/subscribe] Webhook delivery failed:", webhookError);
        delivered = false;
      }
    }

    return NextResponse.json({ success: true, delivered }, { status: 200 });
  } catch (error) {
    console.error("[/api/newsletter/subscribe] Failed:", error);
    return NextResponse.json({ success: false, delivered: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
