"use client";

import * as React from "react";
import { toast } from "sonner";

interface UseNewsletterSignupResult {
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
  submit: () => Promise<void>;
}

/** Honest by design: only claims "subscribed" if a real webhook actually accepted the email — otherwise tells the user plainly that signup isn't fully wired up yet, rather than a false confirmation. */
export function useNewsletterSignup(): UseNewsletterSignupResult {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submit = React.useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter an email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await response.json()) as { success: boolean; delivered: boolean; error?: string };

      if (!data.success) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.delivered) {
        toast.success("You're subscribed — thanks for joining!");
        setEmail("");
      } else {
        toast.error("Signups aren't fully connected yet — please check back soon.");
      }
    } catch {
      toast.error("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  return { email, setEmail, isSubmitting, submit };
}
