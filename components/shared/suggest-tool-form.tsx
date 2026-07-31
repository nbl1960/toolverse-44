"use client";

import * as React from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSuggestTool } from "@/hooks/use-suggest-tool";

const MAX_DESCRIPTION_LENGTH = 1000;

export function SuggestToolForm() {
  const { values, setField, isSubmitting, submit } = useSuggestTool();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7" noValidate>
      <div>
        <Label htmlFor="toolName">Tool name or idea</Label>
        <Input
          id="toolName"
          value={values.toolName}
          onChange={(e) => setField("toolName", e.target.value)}
          placeholder="e.g. PDF Compressor"
          className="mt-2"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="description">What would it do?</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{values.description.length}/{MAX_DESCRIPTION_LENGTH}</span>
        </div>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Describe the task it would help with, and who'd use it."
          rows={4}
          maxLength={MAX_DESCRIPTION_LENGTH}
          className="mt-2"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Your email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="Only if you'd like to hear when it ships"
          className="mt-2"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
        {isSubmitting ? "Sending…" : "Suggest this tool"}
      </Button>
    </form>
  );
}
