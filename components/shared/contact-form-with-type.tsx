"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/shared/contact-form";
import type { ContactType } from "@/lib/contact";

const VALID_TYPES: ContactType[] = ["general", "feedback", "bug", "feature"];

function isContactType(value: string | null): value is ContactType {
  return value !== null && (VALID_TYPES as string[]).includes(value);
}

/**
 * Reads an optional `?type=bug` / `?type=feature` query param (used by
 * "Report a Bug" / "Request a Feature" links elsewhere on the site) to
 * pre-select the contact form's request type. Needs `useSearchParams()`,
 * which is why this is a separate client component wrapped in Suspense
 * by the page rather than making the whole Contact page a client
 * component.
 */
export function ContactFormWithType() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType = isContactType(typeParam) ? typeParam : "general";

  return <ContactForm initialType={initialType} />;
}
