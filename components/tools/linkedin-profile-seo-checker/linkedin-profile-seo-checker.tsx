"use client";

import type * as React from "react";
import { Check, Eraser, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShareActions } from "@/components/shared/share-actions";
import { AdSlot } from "@/components/shared/adsense-placeholder";
import { useLinkedinProfileSeoChecker } from "@/hooks/tools/linkedin-profile-seo-checker/use-linkedin-profile-seo-checker";
import type { ProfileSeoFormValues } from "@/lib/tools/linkedin-profile-seo-checker/types";

export function LinkedinProfileSeoChecker() {
  const { values, setField, result, reset } = useLinkedinProfileSeoChecker();

  function handleChange(key: keyof ProfileSeoFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(key, e.target.value);
  }

  const shareText = result
    ? `LinkedIn Profile SEO score: ${result.score}/100\n${result.keywordCoverage.map((k) => `${k.keyword}: ${k.inHeadline || k.inAbout || k.inSkills ? "found" : "missing"}`).join("\n")}`
    : "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-7">
          <div>
            <Label htmlFor="targetKeywords">Target keywords (comma-separated)</Label>
            <Input
              id="targetKeywords"
              value={values.targetKeywords}
              onChange={handleChange("targetKeywords")}
              placeholder="e.g. product manager, B2B, fintech"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="headline">Your headline</Label>
            <Input
              id="headline"
              value={values.headline}
              onChange={handleChange("headline")}
              placeholder="Paste your current LinkedIn headline"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="about">Your About section</Label>
            <Textarea
              id="about"
              value={values.about}
              onChange={handleChange("about")}
              placeholder="Paste your current About section"
              rows={5}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="skills">Your skills (comma-separated)</Label>
            <Input
              id="skills"
              value={values.skills}
              onChange={handleChange("skills")}
              placeholder="e.g. SQL, Python, Data Visualization"
              className="mt-2"
            />
          </div>
          <Button type="button" variant="outline" onClick={reset}>
            <Eraser className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
              <p className="font-display text-4xl font-semibold text-foreground">
                {result.score}
                <span className="text-lg text-muted-foreground">/100</span>
              </p>
            </div>

            {result.keywordCoverage.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h3 className="font-display text-base font-semibold text-foreground">Keyword coverage</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Keyword</th>
                        <th className="py-2 pr-4 font-medium">Headline</th>
                        <th className="py-2 pr-4 font-medium">About</th>
                        <th className="py-2 font-medium">Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.keywordCoverage.map((k) => (
                        <tr key={k.keyword} className="border-b border-border/60 last:border-0">
                          <td className="py-2 pr-4 font-medium text-foreground">{k.keyword}</td>
                          <td className="py-2 pr-4">
                            {k.inHeadline ? (
                              <Check className="h-4 w-4 text-success" aria-label="Found" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" aria-label="Not found" />
                            )}
                          </td>
                          <td className="py-2 pr-4">
                            {k.inAbout ? (
                              <Check className="h-4 w-4 text-success" aria-label="Found" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" aria-label="Not found" />
                            )}
                          </td>
                          <td className="py-2">
                            {k.inSkills ? (
                              <Check className="h-4 w-4 text-success" aria-label="Found" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" aria-label="Not found" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="font-display text-base font-semibold text-foreground">Findings</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {result.findings.map((finding) => (
                  <li key={finding.label} className="flex items-start gap-2.5">
                    {finding.passed ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{finding.label}</p>
                      <p className="text-xs text-muted-foreground">{finding.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <ShareActions title="LinkedIn Profile SEO Checker results" text={shareText} />

            <AdSlot label="Advertisement" />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Fill in your profile details on the left to see your SEO check.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
