export type TwitterCardType = "summary" | "summary_large_image";

export interface TwitterCardFormValues {
  cardType: TwitterCardType;
  title: string;
  description: string;
  imageUrl: string;
  site: string;
}
