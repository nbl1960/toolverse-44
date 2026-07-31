import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/generator-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isRateLimited = createRateLimiter(5);
const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubmitResponse {
  success: boolean;
  /** Same honest pattern as /api/contact/submit and /api/newsletter/subscribe — true only if a real webhook (TOOL_SUGGESTIONS_WEBHOOK_URL) actually accepted it. */
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

    const { toolName, description, email } = body as { toolName?: unknown; description?: unknown; email?: unknown };

    if (typeof toolName !== "string" || toolName.trim().length === 0) {
      return NextResponse.json({ success: false, delivered: false, error: "Tool name is required." }, { status: 400 });
    }
    if (typeof description !== "string" || description.trim().length < MIN_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { success: false, delivered: false, error: `Describe what it would do — at least ${MIN_DESCRIPTION_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { success: false, delivered: false, error: `Keep it under ${MAX_DESCRIPTION_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (email !== undefined && email !== "" && (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim()))) {
      return NextResponse.json({ success: false, delivered: false, error: "That email doesn't look valid." }, { status: 400 });
    }

    const submission = {
      toolName: toolName.trim(),
      description: description.trim(),
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      submittedAt: new Date().toISOString(),
    };
    console.log("[/api/tool-suggestions/submit] New suggestion:", submission);

    const webhookUrl = process.env.TOOL_SUGGESTIONS_WEBHOOK_URL;
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
        console.error("[/api/tool-suggestions/submit] Webhook delivery failed:", webhookError);
        delivered = false;
      }
    }

    return NextResponse.json({ success: true, delivered }, { status: 200 });
  } catch (error) {
    console.error("[/api/tool-suggestions/submit] Failed:", error);
    return NextResponse.json({ success: false, delivered: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
