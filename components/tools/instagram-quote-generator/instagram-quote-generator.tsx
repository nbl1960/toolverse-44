import { InstagramGeneratorTemplate } from "@/components/tools/instagram-generator/instagram-generator-template";

/** Thin wrapper around the shared generator template — see instagram-generator-template.tsx for the actual UI. */
export function InstagramQuoteGenerator() {
  return <InstagramGeneratorTemplate type="quote-generator" />;
}
