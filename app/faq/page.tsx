import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Faq } from "@/components/shared/faq";
import { JsonLd } from "@/components/shared/json-ld";
import { buildFaqJsonLd } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";
import { getLiveTools } from "@/lib/tools-registry";
import { SITE_NAME } from "@/lib/site-config";
import type { FaqItem } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description: `Answers to common questions about ${SITE_NAME} — pricing, privacy, the AI Guide, and how the tool catalog works.`,
  path: "/faq",
});

export default function FaqPage() {
  const liveTools = getLiveTools();

  const faqItems: FaqItem[] = [
    {
      question: `Is ${SITE_NAME} actually free?`,
      answer: "Yes — every one of the tools currently in the catalog is free to use, with no account required and no paywalled features. If that ever changes for a specific new feature, it will be clearly labeled before you're asked to pay for it.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No. There's no login anywhere on the site today — open a tool and use it.",
    },
    {
      question: "Is my data safe?",
      answer: "Most tools (image processing, JSON/CSV tools, password and hash generation, and more) run entirely in your browser — nothing is uploaded anywhere. AI-powered tools send your input to Google's Gemini API to generate a response; see our Privacy Policy for the full breakdown of what's sent where.",
    },
    {
      question: "How does the AI Guide work?",
      answer: `The AI Guide reads what you describe and matches it against ${SITE_NAME}'s real tool catalog — it only ever recommends tools that actually exist and are live today. It never invents a tool to fit your request; if nothing in the catalog is a good match, it says so.`,
    },
    {
      question: "How many tools are there?",
      answer: `${liveTools.length} live tools today, spanning writing, finance, developer utilities, SEO, images, and social media — growing regularly. See the full list on the Tools page.`,
    },
    {
      question: "How often are new tools added?",
      answer: "Regularly — check the homepage's \"Recently added\" section or the Roadmap page for what's shipped lately and what's coming next.",
    },
    {
      question: "Can I request a tool that doesn't exist yet?",
      answer: "Yes — that's exactly what the Contact page's \"Request a Feature\" option is for, and it directly shapes what gets built next.",
    },
    {
      question: "Is the AI-generated content accurate?",
      answer: "AI-generated drafts (emails, social captions, resumes, and similar) are a strong starting point, not a verified final product — always review before relying on one for something that matters. See our Disclaimer for the full explanation, including how deterministic tools like calculators differ from AI-generated content.",
    },
  ];

  return (
    <div className="container py-8 sm:py-10">
      <JsonLd data={buildFaqJsonLd(faqItems)} />
      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Common questions about how {SITE_NAME} works. For a specific tool&apos;s own FAQ, check that
          tool&apos;s page directly.
        </p>

        <div className="mt-8">
          <Faq items={faqItems} />
        </div>
      </div>
    </div>
  );
}
