import type { Metadata } from "next";
import { LegalPageShell } from "@/components/layout/legal-page-shell";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: `The terms governing your use of ${SITE_NAME}'s free tools and AI Guide.`,
  path: "/terms",
});

const LAST_UPDATED = "January 2026";

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms & Conditions" lastUpdated={LAST_UPDATED}>
      <p>
        These terms govern your use of {SITE_NAME}. By using the site, you agree to them. If you
        don&apos;t agree, please don&apos;t use the site.
      </p>
      <p>
        <strong>A note on scope:</strong> this is a genuine, complete draft of standard SaaS terms
        tailored to how {SITE_NAME} actually works. We recommend a qualified lawyer review it
        against your specific business structure and jurisdiction before treating it as a final,
        binding legal document — the governing-law section below in particular needs to be filled
        in with your actual jurisdiction.
      </p>

      <h2>The service</h2>
      <p>
        {SITE_NAME} provides free, browser-based tools and an AI-powered recommendation guide. No
        account, subscription, or payment is required to use any tool currently on the site. We
        may introduce paid tiers or features in the future; if we do, these terms will be updated
        and any new paid feature will be clearly labeled before you&apos;re asked to pay for it.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site's AI features to generate content that is illegal, harassing, or infringes someone else's rights.</li>
        <li>Attempt to circumvent rate limits, scrape the site at a volume that degrades service for other users, or reverse-engineer the AI Guide's grounding logic to extract non-public information.</li>
        <li>Use any tool to process content you don't have the legal right to process (for example, copyrighted material you don't own or have permission to use).</li>
        <li>Use the site in any way that violates applicable law in your jurisdiction.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        You retain full ownership of anything you input into a tool and anything a tool generates
        for you (subject to the underlying AI provider&apos;s own terms, since AI-generated text isn&apos;t
        always eligible for copyright protection in every jurisdiction — worth checking if that
        matters for your use case). We don&apos;t claim any ownership over your inputs or outputs.
      </p>

      <h2>AI-generated content</h2>
      <p>
        Tools on this site use AI to generate suggestions, drafts, and recommendations. AI output
        can be inaccurate, incomplete, or inappropriate for your specific situation. You are
        responsible for reviewing and verifying anything generated before relying on it. See our{" "}
        <a href="/disclaimer">Disclaimer</a> for the full explanation.
      </p>

      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is,&quot; without warranties of any kind, express or implied,
        including — without limitation — warranties of merchantability, fitness for a particular
        purpose, and non-infringement. We don&apos;t guarantee the site will be available, uninterrupted,
        or error-free at all times.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE_NAME} and its operators are not liable for
        any indirect, incidental, special, consequential, or punitive damages arising from your use
        of the site or its tools — including, but not limited to, damages resulting from reliance
        on AI-generated content, financial calculations, or any tool&apos;s output.
      </p>

      <h2>Third-party services</h2>
      <p>
        Some tools rely on third-party services (Google&apos;s Gemini API, a public QR code generation
        service, Google Analytics, Cloudflare). We&apos;re not responsible for the availability,
        accuracy, or practices of these third parties beyond our own integration with them.
      </p>

      <h2>Changes to the service</h2>
      <p>
        We may add, modify, or discontinue individual tools or features at any time. We&apos;ll aim to
        avoid removing a tool without notice where reasonably possible, but we don&apos;t guarantee any
        specific tool will remain available indefinitely.
      </p>

      <h2>Termination</h2>
      <p>
        We may restrict or block access for anyone who violates these terms, particularly the
        acceptable use section above, without prior notice.
      </p>

      <h2>Governing law</h2>
      <p>
        <em>[This section should specify the jurisdiction whose laws govern these terms and where
        disputes would be resolved — fill in based on where the business is legally established.]</em>
      </p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. Material changes will be reflected in the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${SITE_SUPPORT_EMAIL}`}>{SITE_SUPPORT_EMAIL}</a>.</p>
    </LegalPageShell>
  );
}
