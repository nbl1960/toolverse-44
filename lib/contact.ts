export type ContactType = "general" | "feedback" | "bug" | "feature";

export interface ContactFormValues {
  type: ContactType;
  name: string;
  email: string;
  message: string;
}

export const CONTACT_TYPE_OPTIONS: { value: ContactType; label: string }[] = [
  { value: "general", label: "General / Support" },
  { value: "feedback", label: "Feedback" },
  { value: "bug", label: "Report a Bug" },
  { value: "feature", label: "Request a Feature" },
];

export const CONTACT_TYPE_SUBJECT: Record<ContactType, string> = {
  general: "ToolVerse support request",
  feedback: "ToolVerse feedback",
  bug: "ToolVerse bug report",
  feature: "ToolVerse feature request",
};

export const MIN_MESSAGE_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 2000;

/** Builds a mailto: URL pre-filled from the form — the real, zero-configuration delivery mechanism (see contact-form.tsx for why). */
export function buildMailtoUrl(supportEmail: string, values: ContactFormValues): string {
  const subject = CONTACT_TYPE_SUBJECT[values.type];
  const body = [`From: ${values.name} <${values.email}>`, "", values.message].join("\n");
  const params = new URLSearchParams({ subject, body });
  return `mailto:${supportEmail}?${params.toString()}`;
}
