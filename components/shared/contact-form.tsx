"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_TYPE_OPTIONS, MAX_MESSAGE_LENGTH } from "@/lib/contact";
import { cn } from "@/lib/utils";
import type { ContactFormValues, ContactType } from "@/lib/contact";

interface ContactFormProps {
  /** Pre-selects the request type — used by "Report a Bug" / "Request a Feature" links elsewhere on the site. */
  initialType?: ContactType;
}

export function ContactForm({ initialType = "general" }: ContactFormProps) {
  const { values, setField, isSubmitting, errorMessage, submit } = useContactForm(initialType);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  function handleChange(key: keyof ContactFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7" noValidate>
      <div>
        <Label>What's this about?</Label>
        <div role="radiogroup" aria-label="Request type" className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/40 p-1 sm:grid-cols-4">
          {CONTACT_TYPE_OPTIONS.map((option) => {
            const isSelected = values.type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setField("type", option.value)}
                className={cn(
                  "rounded px-2 py-1.5 text-xs font-medium transition-all duration-150",
                  isSelected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" value={values.name} onChange={handleChange("name")} placeholder="Ada Lovelace" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="email">Your email</Label>
          <Input id="email" type="email" value={values.email} onChange={handleChange("email")} placeholder="ada@example.com" required className="mt-2" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="message">Message</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{values.message.length}/{MAX_MESSAGE_LENGTH}</span>
        </div>
        <Textarea
          id="message"
          value={values.message}
          onChange={handleChange("message")}
          placeholder={
            values.type === "bug"
              ? "Which tool, and what happened? The more detail, the faster we can fix it."
              : values.type === "feature"
                ? "What would you like to see, and what problem would it solve for you?"
                : "How can we help?"
          }
          rows={6}
          maxLength={MAX_MESSAGE_LENGTH}
          required
          className="mt-2"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
