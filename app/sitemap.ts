import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { getAllTools } from "@/lib/tools-registry";
import { CATEGORIES } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/copilot`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/prompt-studio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/prompt-studio/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/roadmap`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/dashboard`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: tool.status === "live" ? 0.8 : 0.4,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes];
}
