import type { ParsedFaqPair } from "./types";

/**
 * Parses "Q: ...\nA: ...\n\nQ: ...\nA: ..." formatted text into Q&A
 * pairs. Blocks are separated by a blank line; within a block, lines
 * starting with "Q:" or "A:" (case-insensitive) are collected — this is
 * lenient about extra whitespace and blank lines within a block.
 */
export function parseFaqPairs(raw: string): ParsedFaqPair[] {
  const blocks = raw.split(/\n\s*\n/);
  const pairs: ParsedFaqPair[] = [];

  for (const block of blocks) {
    const qMatch = block.match(/^\s*Q:\s*(.+)$/im);
    const aMatch = block.match(/^\s*A:\s*(.+)$/im);
    const question = qMatch?.[1]?.trim();
    const answer = aMatch?.[1]?.trim();
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }

  return pairs;
}

/** Builds a valid FAQPage JSON-LD object from parsed Q&A pairs. */
export function buildFaqSchemaJsonLd(pairs: ParsedFaqPair[]): string | null {
  if (pairs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: pair.answer,
      },
    })),
  };

  return JSON.stringify(schema, null, 2);
}
