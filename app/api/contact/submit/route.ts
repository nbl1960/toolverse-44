import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";
import { CONTACT_TYPE_SUBJECT, MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "@/lib/contact";
import type { ContactFormValues, ContactType } from "@/lib/contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(5);
const VALID_TYPES: ContactType[] = ["general", "feedback", "bug", "feature"];

interface SubmitResponse {
  success: boolean;
  /**
   * True only if this request was actually forwarded somewhere real
   * (a configured webhook). False means the submission was validated
   * and logged server-side, but NOT delivered anywhere yet — the client
   * is expected to fall back to a mailto: link in that case rather than
   * claim a delivery that didn't happen. See CONTACT_WEBHOOK_URL below.
   */
  delivered: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SubmitResponse>> {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, delivered: false, error: "Too many submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, delivered: false, error: "Malformed request body." }, { status: 400 });
    }

    const { type, name, email, message } = body as Partial<ContactFormValues>;

    if (typeof type !== "string" || !VALID_TYPES.includes(type as ContactType)) {
      return NextResponse.json({ success: false, delivered: false, error: "Invalid request type." }, { status: 400 });
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, delivered: false, error: "Name is required." }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, delivered: false, error: "A valid email is required." }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, delivered: false, error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, delivered: false, error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const submission = {
      type: type as ContactType,
      subject: CONTACT_TYPE_SUBJECT[type as ContactType],
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Always logged server-side, so a submission is never silently
    // lost even before a real delivery integration is configured.
    console.log("[/api/contact/submit] New submission:", submission);

    // Optional, pluggable delivery: set CONTACT_WEBHOOK_URL to any
    // endpoint that accepts a JSON POST (a Resend/SendGrid function, a
    // Slack incoming webhook, a Zapier catch hook, etc.) to actually
    // deliver submissions somewhere. Until that's configured, this
    // honestly reports delivered: false rather than claim success.
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
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
        console.error("[/api/contact/submit] Webhook delivery failed:", webhookError);
        delivered = false;
      }
    }

    return NextResponse.json({ success: true, delivered }, { status: 200 });
  } catch (error) {
    console.error("[/api/contact/submit] Submission failed:", error);
    return NextResponse.json(
      { success: false, delivered: false, error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }
}
