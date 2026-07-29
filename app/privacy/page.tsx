import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your data — including analytics, AI-tool inputs, and your rights under GDPR.`,
  path: "/privacy",
});

const LAST_UPDATED = "January 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        This policy explains what data {SITE_NAME} collects, why, and what choices and rights you
        have over it. We&apos;ve written it to reflect exactly what this site actually does — no
        boilerplate about things we don&apos;t do.
      </p>
      <p>
        <strong>A note on scope:</strong> this is a good-faith, plain-language policy that
        accurately describes our current data practices. It is not a substitute for review by a
        qualified privacy lawyer in your jurisdiction, and we recommend exactly that review before
        treating this page as a legal certification of compliance rather than a genuine, working
        description of how we handle data.
      </p>

      <h2>What we collect</h2>
      <p>{SITE_NAME} does not require an account to use any tool, and we do not collect names, email addresses, or payment information for using the site itself. What we do collect:</p>
      <ul>
        <li><strong>Standard analytics data</strong> (via Google Analytics): pages visited, general location (country/city level, not precise), device and browser type, and how you arrived at the site. This is aggregated and used to understand what's working, not to identify you individually.</li>
        <li><strong>Text you submit to an AI-powered tool</strong> (for example, a topic for the Email Writer or a query to the AI Guide) is sent to Google's Gemini API to generate a response. We don't store this text ourselves after the response is returned, and we don't use it to build a profile of you.</li>
        <li><strong>Your IP address, briefly, for rate limiting</strong> on AI-powered tools — this prevents abuse of a shared resource. It's used in-memory for a short rolling window and is not logged or stored long-term.</li>
        <li><strong>Contact form submissions</strong> (name, email, and message) if you choose to contact us — used solely to respond to you.</li>
      </ul>
      <p>
        Most tools on this site — image compression, resizing, format conversion, JSON/CSV
        processing, password and hash generation, and more — run entirely in your browser. Files
        and text you use with these tools are never uploaded to any server.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies for analytics (Google Analytics) and for essential site functionality
        (like remembering your light/dark theme preference). See our{" "}
        <a href="/cookies">Cookie Policy</a> for the full breakdown of what each cookie does and
        how to control them.
      </p>

      <h2>Third parties we share data with</h2>
      <ul>
        <li><strong>Google (Gemini API)</strong> — processes text you submit to AI-powered tools, per Google's own API data usage terms.</li>
        <li><strong>Google Analytics</strong> — processes anonymized usage analytics as described above.</li>
        <li><strong>Cloudflare</strong> — our hosting provider; processes standard request data (IP, headers) as part of serving the site, per Cloudflare's own privacy policy.</li>
        <li><strong>A public QR code generation service</strong> — the QR Code Generator tool sends the text you enter to a third-party API to generate the image; nothing else on the site does this.</li>
      </ul>
      <p>We do not sell your data. We do not run advertising networks that track you across other sites.</p>

      <h2>Your rights (GDPR and general)</h2>
      <p>If you're in the EU/EEA, UK, or a jurisdiction with similar protections, you have the right to:</p>
      <ul>
        <li>Request a copy of any personal data we hold about you (for most visitors, this is limited to contact form submissions, since we don't create accounts).</li>
        <li>Request correction or deletion of that data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent for analytics cookies at any time via your browser's cookie settings.</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href={`mailto:${SITE_SUPPORT_EMAIL}`}>{SITE_SUPPORT_EMAIL}</a>.</p>

      <h2>Children's privacy</h2>
      <p>{SITE_NAME} is not directed at children under 13 (or the relevant minimum age in your jurisdiction), and we do not knowingly collect personal data from children.</p>

      <h2>Changes to this policy</h2>
      <p>If we materially change how we handle data, we'll update the date at the top of this page. Continued use of the site after a change means you accept the updated policy.</p>

      <h2>Contact</h2>
      <p>Questions about this policy or your data: <a href={`mailto:${SITE_SUPPORT_EMAIL}`}>{SITE_SUPPORT_EMAIL}</a>, or use our <a href="/contact">Contact page</a>.</p>
    </LegalPageShell>
  );
}
