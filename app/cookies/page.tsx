import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: `What cookies ${SITE_NAME} uses — analytics and functional — and how to control them.`,
  path: "/cookies",
});

const LAST_UPDATED = "January 2026";

export default function CookiePolicyPage() {
  return (
    <LegalPageShell title="Cookie Policy" lastUpdated={LAST_UPDATED}>
      <p>
        {SITE_NAME} uses a small number of cookies — no advertising trackers, no cross-site
        profiling. Here&apos;s exactly what each category does.
      </p>

      <h2>Functional cookies (always on)</h2>
      <p>
        These are required for the site to work the way you&apos;d expect and aren&apos;t used for tracking:
      </p>
      <ul>
        <li><strong>Theme preference</strong> — remembers whether you've chosen light or dark mode, so it doesn't reset every visit.</li>
      </ul>
      <p>Because these are essential to basic site functionality, they don't require separate consent under most cookie regulations.</p>

      <h2>Analytics cookies</h2>
      <p>
        We use <strong>Google Analytics</strong> to understand aggregate usage — which tools are
        popular, how people navigate the site, and where to focus improvement. This uses cookies to
        distinguish (anonymously) one visit session from another. Google Analytics data is
        aggregated and used for product decisions, not to build an individual profile of you or to
        sell to advertisers.
      </p>
      <p>
        You can opt out of Google Analytics tracking site-wide using{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google&apos;s official browser opt-out extension
        </a>
        , or block analytics cookies through your browser&apos;s own privacy settings — the site will
        continue to work identically either way.
      </p>

      <h2>What we don't use</h2>
      <ul>
        <li>No advertising or retargeting cookies.</li>
        <li>No cross-site tracking pixels.</li>
        <li>No third-party marketing cookies of any kind.</li>
      </ul>

      <h2>Controlling cookies in your browser</h2>
      <p>
        Every modern browser lets you view, block, or delete cookies through its settings. Blocking
        analytics cookies will not prevent you from using any tool on this site — every tool works
        identically with or without analytics enabled.
      </p>

      <h2>Changes to this policy</h2>
      <p>If our cookie usage changes — for example, if we add a new analytics or functional cookie — we'll update the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>Questions about cookies: <a href={`mailto:${SITE_SUPPORT_EMAIL}`}>{SITE_SUPPORT_EMAIL}</a>.</p>
    </LegalPageShell>
  );
}
