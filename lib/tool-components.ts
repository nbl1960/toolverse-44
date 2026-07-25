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
  "instagram-caption-generator": () =>
    import("@/components/tools/instagram-caption-generator/instagram-caption-generator").then((m) => ({
      default: m.InstagramCaptionGenerator,
    })),
  "instagram-hashtag-generator": () =>
    import("@/components/tools/instagram-hashtag-generator/instagram-hashtag-generator").then((m) => ({
      default: m.InstagramHashtagGenerator,
    })),
  "instagram-bio-generator": () =>
    import("@/components/tools/instagram-bio-generator/instagram-bio-generator").then((m) => ({
      default: m.InstagramBioGenerator,
    })),
  "instagram-username-generator": () =>
    import("@/components/tools/instagram-username-generator/instagram-username-generator").then(
      (m) => ({ default: m.InstagramUsernameGenerator })
    ),
  "instagram-reel-caption-generator": () =>
    import("@/components/tools/instagram-reel-caption-generator/instagram-reel-caption-generator").then(
      (m) => ({ default: m.InstagramReelCaptionGenerator })
    ),
  "instagram-post-idea-generator": () =>
    import("@/components/tools/instagram-post-idea-generator/instagram-post-idea-generator").then(
      (m) => ({ default: m.InstagramPostIdeaGenerator })
    ),
  "instagram-story-caption-generator": () =>
    import(
      "@/components/tools/instagram-story-caption-generator/instagram-story-caption-generator"
    ).then((m) => ({ default: m.InstagramStoryCaptionGenerator })),
  "instagram-quote-generator": () =>
    import("@/components/tools/instagram-quote-generator/instagram-quote-generator").then((m) => ({
      default: m.InstagramQuoteGenerator,
    })),
  "instagram-engagement-calculator": () =>
    import("@/components/tools/instagram-engagement-calculator/instagram-engagement-calculator").then(
      (m) => ({ default: m.InstagramEngagementCalculator })
    ),
  "instagram-character-counter": () =>
    import("@/components/tools/instagram-character-counter/instagram-character-counter").then(
      (m) => ({ default: m.InstagramCharacterCounter })
    ),
  "linkedin-headline-generator": () =>
    import("@/components/tools/linkedin-headline-generator/linkedin-headline-generator").then(
      (m) => ({ default: m.LinkedinHeadlineGenerator })
    ),
  "linkedin-about-generator": () =>
    import("@/components/tools/linkedin-about-generator/linkedin-about-generator").then((m) => ({
      default: m.LinkedinAboutGenerator,
    })),
  "linkedin-summary-generator": () =>
    import("@/components/tools/linkedin-summary-generator/linkedin-summary-generator").then((m) => ({
      default: m.LinkedinSummaryGenerator,
    })),
  "linkedin-post-generator": () =>
    import("@/components/tools/linkedin-post-generator/linkedin-post-generator").then((m) => ({
      default: m.LinkedinPostGenerator,
    })),
  "linkedin-experience-generator": () =>
    import("@/components/tools/linkedin-experience-generator/linkedin-experience-generator").then(
      (m) => ({ default: m.LinkedinExperienceGenerator })
    ),
  "linkedin-skills-generator": () =>
    import("@/components/tools/linkedin-skills-generator/linkedin-skills-generator").then((m) => ({
      default: m.LinkedinSkillsGenerator,
    })),
  "linkedin-recommendation-generator": () =>
    import(
      "@/components/tools/linkedin-recommendation-generator/linkedin-recommendation-generator"
    ).then((m) => ({ default: m.LinkedinRecommendationGenerator })),
  "linkedin-connection-request-generator": () =>
    import(
      "@/components/tools/linkedin-connection-request-generator/linkedin-connection-request-generator"
    ).then((m) => ({ default: m.LinkedinConnectionRequestGenerator })),
  "linkedin-company-description-generator": () =>
    import(
      "@/components/tools/linkedin-company-description-generator/linkedin-company-description-generator"
    ).then((m) => ({ default: m.LinkedinCompanyDescriptionGenerator })),
  "linkedin-job-description-generator": () =>
    import(
      "@/components/tools/linkedin-job-description-generator/linkedin-job-description-generator"
    ).then((m) => ({ default: m.LinkedinJobDescriptionGenerator })),
  "linkedin-profile-optimizer": () =>
    import("@/components/tools/linkedin-profile-optimizer/linkedin-profile-optimizer").then(
      (m) => ({ default: m.LinkedinProfileOptimizer })
    ),
  "linkedin-headline-analyzer": () =>
    import("@/components/tools/linkedin-headline-analyzer/linkedin-headline-analyzer").then(
      (m) => ({ default: m.LinkedinHeadlineAnalyzer })
    ),
  "linkedin-profile-seo-checker": () =>
    import("@/components/tools/linkedin-profile-seo-checker/linkedin-profile-seo-checker").then(
      (m) => ({ default: m.LinkedinProfileSeoChecker })
    ),
  "twitter-tweet-generator": () =>
    import("@/components/tools/twitter-tweet-generator/twitter-tweet-generator").then((m) => ({
      default: m.TwitterTweetGenerator,
    })),
  "twitter-viral-tweet-generator": () =>
    import("@/components/tools/twitter-viral-tweet-generator/twitter-viral-tweet-generator").then(
      (m) => ({ default: m.TwitterViralTweetGenerator })
    ),
  "twitter-thread-generator": () =>
    import("@/components/tools/twitter-thread-generator/twitter-thread-generator").then((m) => ({
      default: m.TwitterThreadGenerator,
    })),
  "twitter-bio-generator": () =>
    import("@/components/tools/twitter-bio-generator/twitter-bio-generator").then((m) => ({
      default: m.TwitterBioGenerator,
    })),
  "twitter-username-generator": () =>
    import("@/components/tools/twitter-username-generator/twitter-username-generator").then(
      (m) => ({ default: m.TwitterUsernameGenerator })
    ),
  "twitter-hashtag-generator": () =>
    import("@/components/tools/twitter-hashtag-generator/twitter-hashtag-generator").then((m) => ({
      default: m.TwitterHashtagGenerator,
    })),
  "twitter-hook-generator": () =>
    import("@/components/tools/twitter-hook-generator/twitter-hook-generator").then((m) => ({
      default: m.TwitterHookGenerator,
    })),
  "twitter-poll-generator": () =>
    import("@/components/tools/twitter-poll-generator/twitter-poll-generator").then((m) => ({
      default: m.TwitterPollGenerator,
    })),
  "twitter-reply-generator": () =>
    import("@/components/tools/twitter-reply-generator/twitter-reply-generator").then((m) => ({
      default: m.TwitterReplyGenerator,
    })),
  "twitter-content-calendar": () =>
    import("@/components/tools/twitter-content-calendar/twitter-content-calendar").then((m) => ({
      default: m.TwitterContentCalendar,
    })),
  "facebook-caption-generator": () =>
    import("@/components/tools/facebook-caption-generator/facebook-caption-generator").then(
      (m) => ({ default: m.FacebookCaptionGenerator })
    ),
  "facebook-post-generator": () =>
    import("@/components/tools/facebook-post-generator/facebook-post-generator").then((m) => ({
      default: m.FacebookPostGenerator,
    })),
  "facebook-bio-generator": () =>
    import("@/components/tools/facebook-bio-generator/facebook-bio-generator").then((m) => ({
      default: m.FacebookBioGenerator,
    })),
  "facebook-ad-copy-generator": () =>
    import("@/components/tools/facebook-ad-copy-generator/facebook-ad-copy-generator").then(
      (m) => ({ default: m.FacebookAdCopyGenerator })
    ),
  "facebook-headline-generator": () =>
    import("@/components/tools/facebook-headline-generator/facebook-headline-generator").then(
      (m) => ({ default: m.FacebookHeadlineGenerator })
    ),
  "facebook-cta-generator": () =>
    import("@/components/tools/facebook-cta-generator/facebook-cta-generator").then((m) => ({
      default: m.FacebookCtaGenerator,
    })),
  "facebook-comment-generator": () =>
    import("@/components/tools/facebook-comment-generator/facebook-comment-generator").then(
      (m) => ({ default: m.FacebookCommentGenerator })
    ),
  "facebook-event-description-generator": () =>
    import(
      "@/components/tools/facebook-event-description-generator/facebook-event-description-generator"
    ).then((m) => ({ default: m.FacebookEventDescriptionGenerator })),
  "facebook-group-description-generator": () =>
    import(
      "@/components/tools/facebook-group-description-generator/facebook-group-description-generator"
    ).then((m) => ({ default: m.FacebookGroupDescriptionGenerator })),
  "facebook-hashtag-generator": () =>
    import("@/components/tools/facebook-hashtag-generator/facebook-hashtag-generator").then(
      (m) => ({ default: m.FacebookHashtagGenerator })
    ),
  "seo-meta-title-generator": () =>
    import("@/components/tools/seo-meta-title-generator/seo-meta-title-generator").then((m) => ({
      default: m.SeoMetaTitleGenerator,
    })),
  "seo-meta-description-generator": () =>
    import("@/components/tools/seo-meta-description-generator/seo-meta-description-generator").then(
      (m) => ({ default: m.SeoMetaDescriptionGenerator })
    ),
  "seo-robots-txt-generator": () =>
    import("@/components/tools/seo-robots-txt-generator/seo-robots-txt-generator").then((m) => ({
      default: m.SeoRobotsTxtGenerator,
    })),
  "seo-sitemap-generator": () =>
    import("@/components/tools/seo-sitemap-generator/seo-sitemap-generator").then((m) => ({
      default: m.SeoSitemapGenerator,
    })),
  "seo-canonical-url-generator": () =>
    import("@/components/tools/seo-canonical-url-generator/seo-canonical-url-generator").then(
      (m) => ({ default: m.SeoCanonicalUrlGenerator })
    ),
  "seo-open-graph-generator": () =>
    import("@/components/tools/seo-open-graph-generator/seo-open-graph-generator").then((m) => ({
      default: m.SeoOpenGraphGenerator,
    })),
  "seo-twitter-card-generator": () =>
    import("@/components/tools/seo-twitter-card-generator/seo-twitter-card-generator").then(
      (m) => ({ default: m.SeoTwitterCardGenerator })
    ),
  "seo-schema-generator": () =>
    import("@/components/tools/seo-schema-generator/seo-schema-generator").then((m) => ({
      default: m.SeoSchemaGenerator,
    })),
  "seo-faq-schema-generator": () =>
    import("@/components/tools/seo-faq-schema-generator/seo-faq-schema-generator").then((m) => ({
      default: m.SeoFaqSchemaGenerator,
    })),
  "seo-keyword-density-checker": () =>
    import("@/components/tools/seo-keyword-density-checker/seo-keyword-density-checker").then(
      (m) => ({ default: m.SeoKeywordDensityChecker })
    ),
  "dev-json-formatter": () =>
    import("@/components/tools/dev-json-formatter/dev-json-formatter").then((m) => ({
      default: m.DevJsonFormatter,
    })),
  "dev-json-validator": () =>
    import("@/components/tools/dev-json-validator/dev-json-validator").then((m) => ({
      default: m.DevJsonValidator,
    })),
  "dev-base64-encoder": () =>
    import("@/components/tools/dev-base64-encoder/dev-base64-encoder").then((m) => ({
      default: m.DevBase64Encoder,
    })),
  "dev-base64-decoder": () =>
    import("@/components/tools/dev-base64-decoder/dev-base64-decoder").then((m) => ({
      default: m.DevBase64Decoder,
    })),
  "dev-uuid-generator": () =>
    import("@/components/tools/dev-uuid-generator/dev-uuid-generator").then((m) => ({
      default: m.DevUuidGenerator,
    })),
  "dev-password-generator": () =>
    import("@/components/tools/dev-password-generator/dev-password-generator").then((m) => ({
      default: m.DevPasswordGenerator,
    })),
  "dev-hash-generator": () =>
    import("@/components/tools/dev-hash-generator/dev-hash-generator").then((m) => ({
      default: m.DevHashGenerator,
    })),
  "dev-html-minifier": () =>
    import("@/components/tools/dev-html-minifier/dev-html-minifier").then((m) => ({
      default: m.DevHtmlMinifier,
    })),
  "dev-css-minifier": () =>
    import("@/components/tools/dev-css-minifier/dev-css-minifier").then((m) => ({
      default: m.DevCssMinifier,
    })),
  "dev-javascript-minifier": () =>
    import("@/components/tools/dev-javascript-minifier/dev-javascript-minifier").then((m) => ({
      default: m.DevJavascriptMinifier,
    })),
};

/** Returns the component loader for a tool's slug, or undefined if it has none yet. */
export function getToolComponentLoader(slug: string): ComponentLoader | undefined {
  return TOOL_COMPONENT_LOADERS[slug];
}
