"use client";

import * as React from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validateToolDraft, generateToolEntryCode } from "@/lib/admin/validate-tool-draft";
import { CATEGORIES } from "@/lib/categories";
import { ICON_MAP, resolveIcon } from "@/lib/icon-map";
import { getAllTools } from "@/lib/tools-registry";
import type { ToolDraft } from "@/lib/admin/validate-tool-draft";
import type { IconName } from "@/lib/icon-map";

const ICON_NAMES = Object.keys(ICON_MAP) as IconName[];

const EMPTY_DRAFT: ToolDraft = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  category: "",
  iconName: "",
  keywords: "",
  status: "live",
  addedAt: new Date().toISOString().slice(0, 10),
};

/**
 * Internal metadata composer, not a live database editor. Cloudflare
 * Workers has no writable filesystem at runtime, and this registry is
 * compiled into the deployed bundle at build time — nothing running in
 * production can write to it. What this genuinely does: validates a new
 * tool's metadata against the exact same rules the real registry
 * enforces (unique slug checked live against getAllTools(), valid
 * category, valid icon, description length) and generates correctly-
 * formatted, ready-to-paste TypeScript. Pasting the result into
 * lib/tools-registry.ts and deploying is still a real, required step —
 * this makes that step fast and typo-free, not unnecessary.
 */
export default function AdminToolComposerPage() {
  const [draft, setDraft] = React.useState<ToolDraft>(EMPTY_DRAFT);
  const [copied, setCopied] = React.useState(false);
  const totalTools = React.useMemo(() => getAllTools().length, []);

  const issues = React.useMemo(() => validateToolDraft(draft), [draft]);
  const isValid = issues.length === 0;
  const generatedCode = React.useMemo(() => (isValid ? generateToolEntryCode(draft) : ""), [draft, isValid]);

  function setField<K extends keyof ToolDraft>(key: K, value: ToolDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function issueFor(field: keyof ToolDraft): string | undefined {
    return issues.find((i) => i.field === field)?.message;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can fail — the code is still visible and selectable on screen.
    }
  }

  return (
    <div className="container py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Tool Composer
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compose and validate a new registry entry&apos;s metadata — {totalTools} tools currently
          live. This generates ready-to-paste code; it does not write to the live site. See the
          note at the bottom for why.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e) => setField("slug", e.target.value.toLowerCase())}
                placeholder="my-new-tool"
                className="mt-2 font-mono text-sm"
              />
              {issueFor("slug") && <p className="mt-1 text-xs text-destructive">{issueFor("slug")}</p>}
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="My New Tool"
                className="mt-2"
              />
              {issueFor("name") && <p className="mt-1 text-xs text-destructive">{issueFor("name")}</p>}
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={draft.tagline}
                onChange={(e) => setField("tagline", e.target.value)}
                placeholder="A short one-line pitch."
                className="mt-2"
              />
              <div className="mt-1 flex items-center justify-between">
                {issueFor("tagline") ? (
                  <p className="text-xs text-destructive">{issueFor("tagline")}</p>
                ) : (
                  <span />
                )}
                <span className="font-mono text-[11px] text-muted-foreground">{draft.tagline.length}/80</span>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (SEO meta description)</Label>
              <Textarea
                id="description"
                value={draft.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="One or two sentences, under 155 characters."
                rows={3}
                className="mt-2"
              />
              <div className="mt-1 flex items-center justify-between">
                {issueFor("description") ? (
                  <p className="text-xs text-destructive">{issueFor("description")}</p>
                ) : (
                  <span />
                )}
                <span className="font-mono text-[11px] text-muted-foreground">{draft.description.length}/155</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={draft.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <option value="">Choose…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {issueFor("category") && <p className="mt-1 text-xs text-destructive">{issueFor("category")}</p>}
              </div>

              <div>
                <Label htmlFor="iconName">Icon</Label>
                <select
                  id="iconName"
                  value={draft.iconName}
                  onChange={(e) => setField("iconName", e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <option value="">Choose…</option>
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {issueFor("iconName") && <p className="mt-1 text-xs text-destructive">{issueFor("iconName")}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={draft.keywords}
                onChange={(e) => setField("keywords", e.target.value)}
                placeholder="keyword one, keyword two"
                className="mt-2"
              />
              {issueFor("keywords") && <p className="mt-1 text-xs text-destructive">{issueFor("keywords")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={draft.status}
                  onChange={(e) => setField("status", e.target.value as ToolDraft["status"])}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <option value="live">Live</option>
                  <option value="coming-soon">Coming soon</option>
                </select>
              </div>
              <div>
                <Label htmlFor="addedAt">Added date</Label>
                <Input
                  id="addedAt"
                  type="date"
                  value={draft.addedAt}
                  onChange={(e) => setField("addedAt", e.target.value)}
                  className="mt-2"
                />
                {issueFor("addedAt") && <p className="mt-1 text-xs text-destructive">{issueFor("addedAt")}</p>}
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Live preview</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass/50 bg-primary text-primary-foreground">
                  {draft.iconName && (ICON_MAP as Record<string, unknown>)[draft.iconName]
                    ? React.createElement(resolveIcon(draft.iconName as IconName), { className: "h-4 w-4" })
                    : null}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{draft.name || "Tool name"}</p>
                  <p className="text-xs text-muted-foreground">{draft.tagline || "Tagline preview"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {isValid ? "Ready to paste into lib/tools-registry.ts" : `${issues.length} issue${issues.length === 1 ? "" : "s"} to fix`}
                </p>
                {isValid && (
                  <Button size="sm" variant="outline" onClick={() => void handleCopy()}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>
              {isValid ? (
                <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground">
                  {generatedCode}
                </pre>
              ) : (
                <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/40 p-3">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p className="text-xs text-muted-foreground">
                    Fill in every field on the left — the generated code appears here once every
                    validation check passes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-dashed border-border bg-card px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Why this doesn&apos;t deploy directly</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Cloudflare Workers has no writable filesystem at runtime, and this registry is a
            TypeScript source file compiled into the deployed bundle at build time — nothing
            running in production can edit it live. This tool validates your entry against the
            exact same rules the real registry enforces (unique slug, valid category and icon,
            description length) and generates correctly-formatted code, so the actual paste-and-
            deploy step is the only manual part left, and it takes well under 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
