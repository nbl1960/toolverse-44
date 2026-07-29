import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getLiveTools } from "@/lib/tools-registry";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `The story behind ${SITE_NAME} — why we built an AI-guided catalog of free tools instead of another single-purpose app.`,
  path: "/about",
});

export default function AboutPage() {
  const liveTools = getLiveTools();

  return (
    <div className="container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="mx-auto mt-6 max-w-2xl">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-brass">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          About {SITE_NAME}
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {SITE_TAGLINE}
        </h1>

        <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Why we built this</h2>
            <p className="mt-3">
              Most online tools are single-purpose and scattered — one site to resize an image,
              another to calculate a loan, a third to write a tag list for a YouTube video. Finding
              the right one means guessing a search term and hoping it lands on something that
              actually works, isn&apos;t buried under ads, and doesn&apos;t ask for an account before it lets
              you finish a thirty-second task.
            </p>
            <p className="mt-3">
              {SITE_NAME} started as a single tool — an AI email writer — and grew, one focused tool
              at a time, into a catalog of {liveTools.length}. What ties it together isn&apos;t a theme;
              it&apos;s a standard: every tool has to actually work, do one thing well, and never pretend
              to a capability it doesn&apos;t have.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Our mission</h2>
            <p className="mt-3">
              Make the tool you need easier to find than the search term you&apos;d have to guess for it
              — and make the tool itself fast, free, and trustworthy once you&apos;re there.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Our vision</h2>
            <p className="mt-3">
              A future where &quot;which tool do I need&quot; is a question you can just ask, in plain
              language, and get pointed at something real — not a list of ten search results you
              have to evaluate yourself, and not an AI chat that approximates an answer instead of
              actually doing the task precisely. That&apos;s what the AI Guide on our homepage is: describe
              what you&apos;re trying to do, and it recommends real tools from our actual catalog —
              nothing invented, nothing that doesn&apos;t exist.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Why AI tools save real time</h2>
            <p className="mt-3">
              A blank page — an empty email, an untitled resume, a YouTube upload with no
              description — costs more time than most people expect, not because the task is hard,
              but because starting is. Our AI-powered tools exist to remove that specific friction:
              give a rough idea, get a genuine first draft back in seconds, and spend your actual
              time refining instead of staring at nothing. The tools that don&apos;t need AI — a
              calculator, a password generator, an image compressor — skip it entirely and just do
              the deterministic thing correctly and instantly, because not every problem needs a
              language model to solve it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Where we're headed</h2>
            <p className="mt-3">
              We&apos;re expanding into a few areas that keep coming up: document tools, deeper
              category-specific suites, and continuing to make the AI Guide better at understanding
              exactly what you mean, not just what you typed. See our full{" "}
              <Link href="/roadmap" className="font-medium text-brass hover:text-brass-dark">
                roadmap
              </Link>{" "}
              for what&apos;s next.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tools">
              Explore all {liveTools.length} tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
