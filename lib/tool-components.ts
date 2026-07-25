import type { ComponentType } from "react";

type ComponentLoader = () => Promise<{ default: ComponentType }>;

/**
 * Maps each live tool's slug to a loader for its client component.
 *
 * This lives entirely separately from `TOOLS` in `tools-registry.ts` on
 * purpose: `ToolDefinition` must stay plain, serializable data (it gets
 * read by Client Components like the search palette and the tools
 * browser), and a function value in that data would violate that. Only
 * `app/tools/[slug]/page.tsx` — a Server Component that never forwards
 * this map anywhere — needs the actual loader, so it's kept here instead.
 *
 * "Coming soon" tools simply have no entry; `getToolComponentLoader`
 * returns `undefined` for them, same as before.
 */
const TOOL_COMPONENT_LOADERS: Record<string, ComponentLoader> = {
  "email-writer": () =>
    import("@/components/tools/email-writer/email-writer").then((m) => ({
      default: m.EmailWriter,
    })),
  "emi-calculator": () =>
    import("@/components/tools/emi-calculator/emi-calculator").then((m) => ({
      default: m.EmiCalculator,
    })),
  "sip-calculator": () =>
    import("@/components/tools/sip-calculator/sip-calculator").then((m) => ({
      default: m.SipCalculator,
    })),
  "loan-calculator": () =>
    import("@/components/tools/loan-calculator/loan-calculator").then((m) => ({
      default: m.LoanCalculator,
    })),
  "fd-calculator": () =>
    import("@/components/tools/fd-calculator/fd-calculator").then((m) => ({
      default: m.FdCalculator,
    })),
  "rd-calculator": () =>
    import("@/components/tools/rd-calculator/rd-calculator").then((m) => ({
      default: m.RdCalculator,
    })),
  "swp-calculator": () =>
    import("@/components/tools/swp-calculator/swp-calculator").then((m) => ({
      default: m.SwpCalculator,
    })),
  "compound-interest-calculator": () =>
    import("@/components/tools/compound-interest-calculator/compound-interest-calculator").then(
      (m) => ({ default: m.CompoundInterestCalculator })
    ),
  "retirement-calculator": () =>
    import("@/components/tools/retirement-calculator/retirement-calculator").then((m) => ({
      default: m.RetirementCalculator,
    })),
  "cagr-calculator": () =>
    import("@/components/tools/cagr-calculator/cagr-calculator").then((m) => ({
      default: m.CagrCalculator,
    })),
  "youtube-tag-generator": () =>
    import("@/components/tools/youtube-tag-generator/youtube-tag-generator").then((m) => ({
      default: m.YoutubeTagGenerator,
    })),
  "youtube-title-generator": () =>
    import("@/components/tools/youtube-title-generator/youtube-title-generator").then((m) => ({
      default: m.YoutubeTitleGenerator,
    })),
  "youtube-description-generator": () =>
    import("@/components/tools/youtube-description-generator/youtube-description-generator").then(
      (m) => ({ default: m.YoutubeDescriptionGenerator })
    ),
  "youtube-hashtag-generator": () =>
    import("@/components/tools/youtube-hashtag-generator/youtube-hashtag-generator").then((m) => ({
      default: m.YoutubeHashtagGenerator,
    })),
  "youtube-channel-name-generator": () =>
    import("@/components/tools/youtube-channel-name-generator/youtube-channel-name-generator").then(
      (m) => ({ default: m.YoutubeChannelNameGenerator })
    ),
  "youtube-video-idea-generator": () =>
    import("@/components/tools/youtube-video-idea-generator/youtube-video-idea-generator").then(
      (m) => ({ default: m.YoutubeVideoIdeaGenerator })
    ),
  "youtube-script-generator": () =>
    import("@/components/tools/youtube-script-generator/youtube-script-generator").then((m) => ({
      default: m.YoutubeScriptGenerator,
    })),
  "youtube-keyword-generator": () =>
    import("@/components/tools/youtube-keyword-generator/youtube-keyword-generator").then((m) => ({
      default: m.YoutubeKeywordGenerator,
    })),
  "youtube-timestamp-generator": () =>
    import("@/components/tools/youtube-timestamp-generator/youtube-timestamp-generator").then(
      (m) => ({ default: m.YoutubeTimestampGenerator })
    ),
  "youtube-thumbnail-downloader": () =>
    import("@/components/tools/youtube-thumbnail-downloader/youtube-thumbnail-downloader").then(
      (m) => ({ default: m.YoutubeThumbnailDownloader })
    ),
};

/** Returns the component loader for a tool's slug, or undefined if it has none yet. */
export function getToolComponentLoader(slug: string): ComponentLoader | undefined {
  return TOOL_COMPONENT_LOADERS[slug];
}
