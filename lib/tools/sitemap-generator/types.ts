export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapFormValues {
  urls: string;
  changeFreq: ChangeFrequency;
  priority: string;
}
