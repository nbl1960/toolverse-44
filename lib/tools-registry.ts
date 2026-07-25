import type { ToolDefinition } from "./types";
import { EMI_FAQ_ITEMS, EMI_FORMULA, EMI_EXAMPLE } from "./tools/emi-calculator/constants";
import { SIP_FAQ_ITEMS, SIP_FORMULA, SIP_EXAMPLE } from "./tools/sip-calculator/constants";
import { LOAN_FAQ_ITEMS, LOAN_FORMULA, LOAN_EXAMPLE } from "./tools/loan-calculator/constants";
import { FD_FAQ_ITEMS, FD_FORMULA, FD_EXAMPLE } from "./tools/fd-calculator/constants";
import { RD_FAQ_ITEMS, RD_FORMULA, RD_EXAMPLE } from "./tools/rd-calculator/constants";
import { SWP_FAQ_ITEMS, SWP_FORMULA, SWP_EXAMPLE } from "./tools/swp-calculator/constants";
import {
  COMPOUND_INTEREST_FAQ_ITEMS,
  COMPOUND_INTEREST_FORMULA,
  COMPOUND_INTEREST_EXAMPLE,
} from "./tools/compound-interest-calculator/constants";
import {
  RETIREMENT_FAQ_ITEMS,
  RETIREMENT_FORMULA,
  RETIREMENT_EXAMPLE,
} from "./tools/retirement-calculator/constants";
import { CAGR_FAQ_ITEMS, CAGR_FORMULA, CAGR_EXAMPLE } from "./tools/cagr-calculator/constants";
import { YOUTUBE_GENERATOR_CONTENT } from "./tools/youtube-generator/tool-content";
import { TIMESTAMP_FAQ_ITEMS, TIMESTAMP_EXAMPLE } from "./tools/youtube-timestamp-generator/constants";
import { THUMBNAIL_FAQ_ITEMS, THUMBNAIL_EXAMPLE } from "./tools/youtube-thumbnail-downloader/constants";
import { INSTAGRAM_GENERATOR_CONTENT } from "./tools/instagram-generator/tool-content";
import {
  ENGAGEMENT_FAQ_ITEMS,
  ENGAGEMENT_EXAMPLE,
} from "./tools/instagram-engagement-calculator/constants";
import {
  CHARACTER_COUNTER_FAQ_ITEMS,
  CHARACTER_COUNTER_EXAMPLE,
} from "./tools/instagram-character-counter/constants";

/**
 * The tool catalog. To add tool #101, add one object here and drop its
 * component under `components/tools/<slug>/` (registering its loader in
 * `lib/tool-components.ts`). Nothing else — routing, the homepage grid,
 * category pages, search, breadcrumbs, and related tools — needs to
 * change.
 *
 * Every field here is plain, serializable data (strings, numbers,
 * booleans, arrays, and plain objects) — no component references, no
 * functions — so this array is safe to read from Client Components
 * (search, the tools browser) as well as Server Components.
 */
export const TOOLS: ToolDefinition[] = [
  {
    slug: "email-writer",
    name: "AI Email Writer",
    tagline: "Write the email. We'll find the words.",
    description:
      "Describe what you need to say, choose a tone and a length, and get a ready-to-send subject line and body in seconds.",
    category: "writing",
    iconName: "Mail",
    keywords: ["email", "writer", "generator", "ai", "professional email", "cover letter"],
    status: "live",
    addedAt: "2026-06-01",
  },
  {
    slug: "resume-builder",
    name: "AI Resume Builder",
    tagline: "A sharper resume in one pass.",
    description:
      "Turn a rough work history into a clean, recruiter-ready resume, tailored to the role you're applying for.",
    category: "writing",
    iconName: "FileText",
    keywords: ["resume", "cv", "job application", "career"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "meeting-notes-summarizer",
    name: "Meeting Notes Summarizer",
    tagline: "Raw notes in, clear action items out.",
    description:
      "Paste messy meeting notes or a transcript and get a structured summary with decisions and action items.",
    category: "productivity",
    iconName: "ListChecks",
    keywords: ["meetings", "notes", "summary", "action items", "productivity"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "regex-generator",
    name: "Regex Generator",
    tagline: "Describe the pattern, get the regex.",
    description:
      "Explain what you're trying to match in plain English and get a tested, explained regular expression.",
    category: "developer",
    iconName: "Braces",
    keywords: ["regex", "regular expression", "developer", "pattern matching"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    tagline: "A palette that actually goes together.",
    description:
      "Generate accessible, harmonious color palettes from a mood, a brand word, or a base color.",
    category: "design",
    iconName: "Palette",
    keywords: ["colors", "palette", "design", "branding", "ui"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "seo-meta-generator",
    name: "SEO Meta Tag Generator",
    tagline: "Titles and descriptions that earn the click.",
    description:
      "Generate optimized title tags, meta descriptions, and Open Graph copy for any page.",
    category: "marketing",
    iconName: "Tags",
    keywords: ["seo", "meta tags", "marketing", "open graph"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON Converter",
    tagline: "Clean tabular data, structured instantly.",
    description:
      "Paste or upload a CSV and get well-formed, typed JSON out — no spreadsheet software required.",
    category: "data",
    iconName: "FileJson",
    keywords: ["csv", "json", "convert", "data", "file conversion"],
    status: "coming-soon",
    addedAt: "2026-06-01",
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    tagline: "Know your monthly payment before you sign.",
    description:
      "Calculate your monthly loan installment (EMI), total interest, and full amortization schedule from your loan amount, interest rate, and tenure.",
    category: "finance",
    iconName: "Calculator",
    keywords: [
      "emi",
      "emi calculator",
      "loan calculator",
      "amortization",
      "monthly installment",
      "interest calculator",
      "mortgage calculator",
    ],
    status: "live",
    addedAt: "2026-07-23",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: EMI_FAQ_ITEMS,
    formula: EMI_FORMULA,
    example: EMI_EXAMPLE,
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    tagline: "See what consistent investing actually adds up to.",
    description:
      "Project your SIP's final corpus, total returns, and CAGR from a monthly investment, expected return rate, and investment period — with optional annual step-up and inflation adjustment.",
    category: "finance",
    iconName: "TrendingUp",
    keywords: [
      "sip",
      "sip calculator",
      "systematic investment plan",
      "mutual fund calculator",
      "investment calculator",
      "compound interest",
      "wealth calculator",
      "step-up sip",
    ],
    status: "live",
    addedAt: "2026-07-24",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: SIP_FAQ_ITEMS,
    formula: SIP_FORMULA,
    example: SIP_EXAMPLE,
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    tagline: "Find your EMI, or find what you can borrow.",
    description:
      "Calculate your monthly payment for a given loan amount, or flip it around and find the loan amount a target monthly payment can support.",
    category: "finance",
    iconName: "Banknote",
    keywords: ["loan calculator", "borrowing calculator", "affordability calculator", "loan amount", "monthly payment"],
    status: "live",
    addedAt: "2026-07-25",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: LOAN_FAQ_ITEMS,
    formula: LOAN_FORMULA,
    example: LOAN_EXAMPLE,
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    tagline: "See exactly what your fixed deposit will be worth.",
    description:
      "Calculate the maturity value and total interest on a fixed deposit from your deposit amount, interest rate, tenure, and compounding frequency.",
    category: "finance",
    iconName: "Lock",
    keywords: ["fd calculator", "fixed deposit calculator", "maturity value", "deposit calculator", "bank deposit"],
    status: "live",
    addedAt: "2026-07-26",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: FD_FAQ_ITEMS,
    formula: FD_FORMULA,
    example: FD_EXAMPLE,
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    tagline: "Small monthly deposits, projected to maturity.",
    description:
      "Calculate your recurring deposit's maturity value and total interest from a monthly deposit amount, interest rate, and tenure.",
    category: "finance",
    iconName: "RefreshCw",
    keywords: ["rd calculator", "recurring deposit calculator", "maturity value", "monthly deposit"],
    status: "live",
    addedAt: "2026-07-27",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: RD_FAQ_ITEMS,
    formula: RD_FORMULA,
    example: RD_EXAMPLE,
  },
  {
    slug: "swp-calculator",
    name: "SWP Calculator",
    tagline: "Turn a lump sum into a monthly income.",
    description:
      "Project how long a lump-sum investment lasts under a systematic withdrawal plan — see your final balance, total withdrawn, and interest earned.",
    category: "finance",
    iconName: "TrendingDown",
    keywords: ["swp calculator", "systematic withdrawal plan", "withdrawal calculator", "retirement income"],
    status: "live",
    addedAt: "2026-07-28",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: SWP_FAQ_ITEMS,
    formula: SWP_FORMULA,
    example: SWP_EXAMPLE,
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    tagline: "See how your money grows on itself.",
    description:
      "Calculate compound growth on a lump sum from a principal, annual rate, time period, and compounding frequency.",
    category: "finance",
    iconName: "Percent",
    keywords: ["compound interest calculator", "interest calculator", "growth calculator", "compounding"],
    status: "live",
    addedAt: "2026-07-29",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: COMPOUND_INTEREST_FAQ_ITEMS,
    formula: COMPOUND_INTEREST_FORMULA,
    example: COMPOUND_INTEREST_EXAMPLE,
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    tagline: "See what your savings could grow into by retirement.",
    description:
      "Project your retirement corpus from your current age, retirement age, current savings, monthly contribution, and expected return.",
    category: "finance",
    iconName: "PiggyBank",
    keywords: ["retirement calculator", "retirement corpus", "retirement planning", "nest egg calculator"],
    status: "live",
    addedAt: "2026-07-30",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: RETIREMENT_FAQ_ITEMS,
    formula: RETIREMENT_FORMULA,
    example: RETIREMENT_EXAMPLE,
  },
  {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    tagline: "The one smoothed growth rate behind any two numbers.",
    description:
      "Calculate the Compound Annual Growth Rate between an initial and final value over a given time period.",
    category: "finance",
    iconName: "ArrowUpRight",
    keywords: ["cagr calculator", "compound annual growth rate", "growth rate calculator", "investment returns"],
    status: "live",
    addedAt: "2026-07-31",
    applicationCategory: "FinanceApplication",
    isCalculator: true,
    faq: CAGR_FAQ_ITEMS,
    formula: CAGR_FORMULA,
    example: CAGR_EXAMPLE,
  },
  {
    slug: "youtube-tag-generator",
    name: "YouTube Tag Generator",
    tagline: "Tags that actually help people find your video.",
    description:
      "Generate three ready-to-use sets of YouTube tags from your video's topic, mixing broad and long-tail keywords for better discoverability.",
    category: "creator-studio",
    iconName: "Tags",
    keywords: ["youtube tag generator", "youtube tags", "video seo", "youtube keywords"],
    status: "live",
    addedAt: "2026-08-01",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["tag-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["tag-generator"].example,
  },
  {
    slug: "youtube-title-generator",
    name: "YouTube Title Generator",
    tagline: "Titles that earn the click without the clickbait.",
    description:
      "Generate three compelling YouTube video title options from your topic — attention-grabbing, search-friendly, and true to your content.",
    category: "creator-studio",
    iconName: "Type",
    keywords: ["youtube title generator", "video title ideas", "youtube seo", "clickable titles"],
    status: "live",
    addedAt: "2026-08-02",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["title-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["title-generator"].example,
  },
  {
    slug: "youtube-description-generator",
    name: "YouTube Description Generator",
    tagline: "A full description draft, not just a blank box.",
    description:
      "Generate three complete, SEO-friendly YouTube video descriptions from your topic and key points — hook, context, and call to action included.",
    category: "creator-studio",
    iconName: "AlignLeft",
    keywords: ["youtube description generator", "video description", "youtube seo description"],
    status: "live",
    addedAt: "2026-08-03",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["description-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["description-generator"].example,
  },
  {
    slug: "youtube-hashtag-generator",
    name: "YouTube Hashtag Generator",
    tagline: "The right mix of broad and niche hashtags.",
    description:
      "Generate three sets of relevant YouTube hashtags for your video's topic, ready to paste into your description.",
    category: "creator-studio",
    iconName: "Hash",
    keywords: ["youtube hashtag generator", "youtube hashtags", "video hashtags"],
    status: "live",
    addedAt: "2026-08-04",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["hashtag-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["hashtag-generator"].example,
  },
  {
    slug: "youtube-channel-name-generator",
    name: "YouTube Channel Name Generator",
    tagline: "A name worth building a brand around.",
    description:
      "Generate three catchy, memorable YouTube channel name ideas from your niche or theme.",
    category: "creator-studio",
    iconName: "AtSign",
    keywords: ["youtube channel name generator", "channel name ideas", "youtube branding"],
    status: "live",
    addedAt: "2026-08-05",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["channel-name-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["channel-name-generator"].example,
  },
  {
    slug: "youtube-video-idea-generator",
    name: "YouTube Video Idea Generator",
    tagline: "Never stare at a blank content calendar again.",
    description:
      "Generate three specific, ready-to-film YouTube video ideas from your channel's niche or topic area.",
    category: "creator-studio",
    iconName: "Lightbulb",
    keywords: ["youtube video ideas", "content ideas generator", "youtube video topics"],
    status: "live",
    addedAt: "2026-08-06",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["video-idea-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["video-idea-generator"].example,
  },
  {
    slug: "youtube-script-generator",
    name: "YouTube Script Generator",
    tagline: "A hook, a body, and an outro — drafted for you.",
    description:
      "Generate three complete YouTube video script drafts from your topic, each with a hook, organized main content, and outro.",
    category: "creator-studio",
    iconName: "ScrollText",
    keywords: ["youtube script generator", "video script writer", "youtube script template"],
    status: "live",
    addedAt: "2026-08-07",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["script-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["script-generator"].example,
  },
  {
    slug: "youtube-keyword-generator",
    name: "YouTube Keyword Generator",
    tagline: "Search phrases real viewers actually type.",
    description:
      "Generate three sets of SEO keyword phrases for your video or channel topic, for use in titles, descriptions, and scripts.",
    category: "creator-studio",
    iconName: "KeyRound",
    keywords: ["youtube keyword generator", "youtube keyword research", "video seo keywords"],
    status: "live",
    addedAt: "2026-08-08",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: YOUTUBE_GENERATOR_CONTENT["keyword-generator"].faq,
    example: YOUTUBE_GENERATOR_CONTENT["keyword-generator"].example,
  },
  {
    slug: "youtube-timestamp-generator",
    name: "YouTube Timestamp Generator",
    tagline: "Chapter markers, calculated instantly.",
    description:
      "Turn a list of chapter titles and their lengths into ready-to-paste YouTube timestamps, calculated automatically.",
    category: "creator-studio",
    iconName: "Timer",
    keywords: ["youtube timestamp generator", "video chapters", "youtube chapter markers"],
    status: "live",
    addedAt: "2026-08-09",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: TIMESTAMP_FAQ_ITEMS,
    example: TIMESTAMP_EXAMPLE,
  },
  {
    slug: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnail Downloader",
    tagline: "Every resolution, one paste away.",
    description:
      "Paste any YouTube video URL to preview and download its thumbnail in every available resolution.",
    category: "creator-studio",
    iconName: "Youtube",
    keywords: ["youtube thumbnail downloader", "download youtube thumbnail", "youtube thumbnail grabber"],
    status: "live",
    addedAt: "2026-08-10",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "youtube",
    faq: THUMBNAIL_FAQ_ITEMS,
    example: THUMBNAIL_EXAMPLE,
  },
  {
    slug: "instagram-caption-generator",
    name: "Instagram Caption Generator",
    tagline: "Captions that sound like you, not an ad.",
    description:
      "Generate three engaging Instagram caption options from your post's topic — authentic, conversational, and ready to post.",
    category: "creator-studio",
    iconName: "MessageCircle",
    keywords: ["instagram caption generator", "instagram captions", "caption ideas"],
    status: "live",
    addedAt: "2026-08-11",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["caption-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["caption-generator"].example,
  },
  {
    slug: "instagram-hashtag-generator",
    name: "Instagram Hashtag Generator",
    tagline: "The right mix, from broad reach to niche discovery.",
    description:
      "Generate three sets of relevant Instagram hashtags for your post, mixing broad and niche-specific tags for better reach.",
    category: "creator-studio",
    iconName: "Hash",
    keywords: ["instagram hashtag generator", "instagram hashtags", "hashtags for instagram"],
    status: "live",
    addedAt: "2026-08-12",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["hashtag-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["hashtag-generator"].example,
  },
  {
    slug: "instagram-bio-generator",
    name: "Instagram Bio Generator",
    tagline: "150 characters, made to count.",
    description:
      "Generate three Instagram bio options from a short description of your account — clear, on-brand, and within the 150-character limit.",
    category: "creator-studio",
    iconName: "UserCircle",
    keywords: ["instagram bio generator", "instagram bio ideas", "bio for instagram"],
    status: "live",
    addedAt: "2026-08-13",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["bio-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["bio-generator"].example,
  },
  {
    slug: "instagram-username-generator",
    name: "Instagram Username Generator",
    tagline: "A handle worth building a brand around.",
    description:
      "Generate three catchy, memorable Instagram username ideas from your name or niche.",
    category: "creator-studio",
    iconName: "AtSign",
    keywords: ["instagram username generator", "instagram handle ideas", "username ideas"],
    status: "live",
    addedAt: "2026-08-14",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["username-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["username-generator"].example,
  },
  {
    slug: "instagram-reel-caption-generator",
    name: "Instagram Reel Caption Generator",
    tagline: "A hook fast enough for a fast format.",
    description:
      "Generate three short, punchy Instagram Reel captions from your video's topic, built for the quick pace of short-form video.",
    category: "creator-studio",
    iconName: "Film",
    keywords: ["instagram reel caption generator", "reel captions", "reels caption ideas"],
    status: "live",
    addedAt: "2026-08-15",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["reel-caption-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["reel-caption-generator"].example,
  },
  {
    slug: "instagram-post-idea-generator",
    name: "Instagram Post Idea Generator",
    tagline: "Never stare at a blank content calendar again.",
    description:
      "Generate three specific, ready-to-shoot Instagram post ideas from your account's niche.",
    category: "creator-studio",
    iconName: "Lightbulb",
    keywords: ["instagram post ideas", "content ideas generator", "instagram content calendar"],
    status: "live",
    addedAt: "2026-08-16",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["post-idea-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["post-idea-generator"].example,
  },
  {
    slug: "instagram-story-caption-generator",
    name: "Instagram Story Caption Generator",
    tagline: "Quick, casual, and gone in 24 hours.",
    description:
      "Generate three short, casual Instagram Story captions from what's happening in the moment.",
    category: "creator-studio",
    iconName: "Aperture",
    keywords: ["instagram story caption generator", "story captions", "instagram stories ideas"],
    status: "live",
    addedAt: "2026-08-17",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["story-caption-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["story-caption-generator"].example,
  },
  {
    slug: "instagram-quote-generator",
    name: "Instagram Quote Generator",
    tagline: "Original, shareable, ready for a quote graphic.",
    description:
      "Generate three original, shareable quotes on any theme, ready to use on an Instagram quote graphic or caption.",
    category: "creator-studio",
    iconName: "Quote",
    keywords: ["instagram quote generator", "quote graphics", "shareable quotes"],
    status: "live",
    addedAt: "2026-08-18",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: INSTAGRAM_GENERATOR_CONTENT["quote-generator"].faq,
    example: INSTAGRAM_GENERATOR_CONTENT["quote-generator"].example,
  },
  {
    slug: "instagram-engagement-calculator",
    name: "Instagram Engagement Calculator",
    tagline: "Know your rate before you compare it to anyone else's.",
    description:
      "Calculate your Instagram engagement rate from followers, likes, comments, shares, and saves — with a plain-language rating.",
    category: "creator-studio",
    iconName: "TrendingUp",
    keywords: ["instagram engagement calculator", "engagement rate calculator", "instagram engagement rate"],
    status: "live",
    addedAt: "2026-08-19",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: ENGAGEMENT_FAQ_ITEMS,
    example: ENGAGEMENT_EXAMPLE,
  },
  {
    slug: "instagram-character-counter",
    name: "Instagram Character Counter",
    tagline: "Know exactly how much room you have left.",
    description:
      "Count characters, words, hashtags, and mentions for an Instagram caption, bio, or comment — with a heads-up before you hit the limit.",
    category: "creator-studio",
    iconName: "Ruler",
    keywords: ["instagram character counter", "caption character count", "instagram bio character limit"],
    status: "live",
    addedAt: "2026-08-20",
    applicationCategory: "MultimediaApplication",
    relatedToolsLimit: 9,
    relatedGroup: "instagram",
    faq: CHARACTER_COUNTER_FAQ_ITEMS,
    example: CHARACTER_COUNTER_EXAMPLE,
  },
];

/** All tools, live or upcoming. */
export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}

/** Only tools that are actually usable right now. */
export function getLiveTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.status === "live");
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categorySlug: string): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === categorySlug);
}

/** Tools sorted newest-first by `addedAt`, for the homepage's "Recently added" rail. */
export function getRecentlyAddedTools(limit = 6): ToolDefinition[] {
  return [...TOOLS]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, limit);
}

/**
 * Tools related to the given one: same group first, excluding itself,
 * capped at `limit`. "Group" is `relatedGroup` if the tool sets one
 * (letting two toolsets share a category but stay recommendation-scoped
 * to their own siblings), otherwise it falls back to `category`. Falls
 * back further to other live tools if the group is thin.
 */
export function getRelatedTools(tool: ToolDefinition, limit = 3): ToolDefinition[] {
  const group = tool.relatedGroup ?? tool.category;
  const sameGroup = TOOLS.filter(
    (candidate) => (candidate.relatedGroup ?? candidate.category) === group && candidate.slug !== tool.slug
  );

  if (sameGroup.length >= limit) {
    return sameGroup.slice(0, limit);
  }

  const fillers = TOOLS.filter(
    (candidate) => candidate.slug !== tool.slug && !sameGroup.includes(candidate)
  );

  return [...sameGroup, ...fillers].slice(0, limit);
}

/** Simple case-insensitive search across name, tagline, description, and keywords. */
export function searchTools(query: string): ToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return TOOLS;

  return TOOLS.filter((tool) => {
    const haystack = [tool.name, tool.tagline, tool.description, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
