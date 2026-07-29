"use client";

import * as React from "react";
import { toast } from "sonner";
import { buildMailtoUrl } from "@/lib/contact";
import { SITE_SUPPORT_EMAIL } from "@/lib/site-config";
import type { ContactFormValues, ContactType } from "@/lib/contact";

const DEFAULT_VALUES: ContactFormValues = { type: "general", name: "", email: "", message: "" };

interface UseContactFormResult {
  values: ContactFormValues;
  setField: <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  submit: () => Promise<void>;
}

/**
 * Drives the contact form. On a real, configured delivery (see
 * app/api/contact/submit/route.ts's CONTACT_WEBHOOK_URL), shows a
 * genuine "sent" confirmation. Without one configured — the honest
 * current default — it opens a pre-filled mailto: link instead of
 * claiming a delivery that didn't happen, with a toast that says
 * exactly that.
 */
export function useContactForm(initialType: ContactType = "general"): UseContactFormResult {
  const [values, setValues] = React.useState<ContactFormValues>({ ...DEFAULT_VALUES, type: initialType });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const setField = React.useCallback(
    <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const submit = React.useCallback(async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { success: boolean; delivered: boolean; error?: string };

      if (!data.success) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.delivered) {
        toast.success("Message sent — we'll get back to you soon.");
      } else {
        // Honest fallback: the submission was validated, but there's no
        // real delivery destination configured yet, so open the user's
        // own email client instead of claiming a delivery that didn't
        // happen.
        window.location.href = buildMailtoUrl(SITE_SUPPORT_EMAIL, values);
        toast.success("Opening your email client to send this — thanks for reaching out!");
      }

      setValues({ ...DEFAULT_VALUES, type: values.type });
    } catch {
      const message = "Couldn't reach the server. Check your connection and try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return { values, setField, isSubmitting, errorMessage, submit };
}
