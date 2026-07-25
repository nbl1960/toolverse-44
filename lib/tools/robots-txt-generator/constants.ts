import type { FaqItem, ToolExample } from "@/lib/types";

export const ROBOTS_FAQ_ITEMS: FaqItem[] = [
  { question: "Where do I put the robots.txt file?", answer: "At the root of your domain — e.g. https://yoursite.com/robots.txt. It must be at exactly that path for search engines to find it." },
  { question: "What does Disallow actually do?", answer: "It asks well-behaved crawlers not to access matching paths. It's a request, not a security measure — anyone can still view a disallowed path directly, so never rely on it to hide sensitive content." },
  { question: "Do I need to list a sitemap here?", answer: "It's optional but commonly done — including it helps search engines discover your sitemap without needing to submit it separately in each search console." },
  { question: "What does User-agent: * mean?", answer: "It applies the rules to all crawlers. Use a specific bot name (like Googlebot) instead if you want rules that only apply to one crawler." },
];

export const ROBOTS_EXAMPLE: ToolExample = {
  title: "Example: blocking an admin path",
  summary: "Entering disallow paths and a sitemap URL:",
  inputs: [
    { label: "Disallow", value: "/admin/\n/api/" },
    { label: "Sitemap", value: "https://example.com/sitemap.xml" },
  ],
  outputs: [{ label: "Output", value: "User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://example.com/sitemap.xml" }],
};
